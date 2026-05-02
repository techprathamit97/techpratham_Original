"use client";

import { useState, useEffect, useMemo } from 'react';
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/src/lms/puckConfig";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { uploadBlogImageToS3, deleteBlogImageFromS3, extractFileKeyFromUrl } from '@/lib/uploadBlogImage';

interface BlogEditorProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function BlogEditor({ mode, initialData, onSave, onCancel }: BlogEditorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(mode === 'create');
  const [imageUploading, setImageUploading] = useState(false);
  
  // Form data - simplified for blog (single structure, no nested sections)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    author: 'TechPratham Team',
    category: '',
    categorySlug: '',
    tags: [] as string[],
    featuredImage: {
      url: '',
      alt: '',
      caption: '',
      fileKey: ''
    },
    status: 'draft',
    scheduledAt: '',
    
    // SEO fields
    seo: {
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      secondaryKeywords: [] as string[],
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCardType: 'summary_large_image',
      robotsDirective: 'index,follow',
      schemaType: 'Article'
    },
    
    // Content features
    tableOfContents: {
      enabled: false,
      items: []
    },
    faqSection: [] as Array<{ question: string; answer: string }>,
    
    // Analytics
    wordCount: 0
  });

  // Puck data for drag-and-drop content editor (same as e-book)
  const [puckData, setPuckData] = useState({ root: {}, content: [] });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  // Slugify function
  const slugify = useMemo(
    () => (text: string) =>
      text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 75),
    []
  );

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && mode === 'create') {
      setFormData(prev => ({
        ...prev,
        slug: slugify(prev.title)
      }));
    }
  }, [formData.title, mode, slugify]);

  // Auto-populate SEO fields
  useEffect(() => {
    if (formData.title && !formData.seo.metaTitle) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: prev.title.substring(0, 60),
          ogTitle: prev.title.substring(0, 60)
        }
      }));
    }
  }, [formData.title]);

  useEffect(() => {
    if (formData.excerpt && !formData.seo.metaDescription) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaDescription: prev.excerpt.substring(0, 160),
          ogDescription: prev.excerpt.substring(0, 200)
        }
      }));
    }
  }, [formData.excerpt]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories');
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('Loading initial data:', initialData); // Debug log
      console.log('Initial puckData:', initialData.puckData); // Debug log
      setFormData(initialData);
      
      // Ensure puckData has proper structure
      const puckDataToLoad = initialData.puckData && 
        typeof initialData.puckData === 'object' && 
        (initialData.puckData.content || initialData.puckData.root)
        ? initialData.puckData 
        : { root: {}, content: [] };
      
      console.log('Setting puckData to:', puckDataToLoad); // Debug log
      setPuckData(puckDataToLoad);
      setDataLoaded(true);
    } else if (mode === 'create') {
      setDataLoaded(true);
    }
  }, [mode, initialData]);

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (category) {
      setFormData(prev => ({
        ...prev,
        category: category.name,
        categorySlug: category.slug
      }));
    }
  };

  // Handle tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle secondary keywords
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.secondaryKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          secondaryKeywords: [...prev.seo.secondaryKeywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        secondaryKeywords: prev.seo.secondaryKeywords.filter(keyword => keyword !== keywordToRemove)
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setImageUploading(true);
    try {
      // Delete previous image if exists
      if (formData.featuredImage.url) {
        let fileKeyToDelete = formData.featuredImage.fileKey;
        
        // If no fileKey stored, try to extract from URL (for backward compatibility)
        if (!fileKeyToDelete && formData.featuredImage.url.includes('techpratham-image-storage')) {
          const extractedKey = extractFileKeyFromUrl(formData.featuredImage.url);
          if (extractedKey) {
            fileKeyToDelete = extractedKey;
          }
        }
        
        if (fileKeyToDelete) {
          try {
            await deleteBlogImageFromS3(fileKeyToDelete);
            console.log('Previous image deleted successfully');
          } catch (deleteError) {
            console.warn('Failed to delete previous image:', deleteError);
            // Continue with upload even if delete fails
          }
        }
      }

      // Upload new image
      const result = await uploadBlogImageToS3(file);
      
      setFormData(prev => ({
        ...prev,
        featuredImage: {
          ...prev.featuredImage,
          url: result.url,
          fileKey: result.fileKey, // Store fileKey for future deletion
          alt: prev.featuredImage.alt || file.name.replace(/\.[^/.]+$/, ""), // Use filename as default alt if empty
        }
      }));

      alert('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Image upload error:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };
  const calculateSEOScore = () => {
    let score = 0;
    const checks = [
      { condition: formData.seo.metaTitle.length > 0, points: 15 },
      { condition: formData.seo.metaDescription.length > 0, points: 15 },
      { condition: formData.seo.focusKeyword.length > 0, points: 10 },
      { condition: formData.title.toLowerCase().includes(formData.seo.focusKeyword.toLowerCase()), points: 10 },
      { condition: formData.featuredImage.alt.length > 0, points: 10 },
      { condition: formData.tags.length > 0, points: 10 },
      { condition: formData.excerpt.length >= 100, points: 10 },
      { condition: formData.seo.metaTitle.length <= 60, points: 10 },
      { condition: formData.seo.metaDescription.length <= 160, points: 10 }
    ];

    checks.forEach(check => {
      if (check.condition) score += check.points;
    });

    return score;
  };

  const seoScore = calculateSEOScore();
  const getSEOScoreColor = (score: number) => {
    if (score >= 71) return 'text-green-600';
    if (score >= 41) return 'text-orange-600';
    return 'text-red-600';
  };

  // Handle save
  const handleSave = async (status?: string) => {
    setLoading(true);
    try {
      const saveData = {
        ...formData,
        status: status || formData.status,
        puckData,
        wordCount: JSON.stringify(puckData).length // Simple word count approximation
      };

      await onSave(saveData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Puck publish (same as e-book editor)
  const handlePuckPublish = async (newData: any) => {
    // Detect and delete removed images from AWS
    try {
      const oldImages = extractImageUrls(puckData);
      const newImages = extractImageUrls(newData);
      
      // Find images that were removed
      const removedImages = oldImages.filter(url => !newImages.includes(url));
      
      // Delete removed images from AWS
      for (const imageUrl of removedImages) {
        try {
          const fileKey = imageUrl.split(".com/")[1];
          if (fileKey) {
            await fetch("/api/upload-image", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileKey }),
            });
            console.log(`Deleted removed image from AWS: ${fileKey}`);
          }
        } catch (err) {
          console.warn(`Failed to delete image: ${imageUrl}`, err);
        }
      }
    } catch (err) {
      console.warn("Error cleaning up removed images:", err);
    }

    setPuckData(newData);
    
    // Auto-save content with debouncing (same pattern as e-book)
    setAutoSaving(true);
    try {
      const saveData = {
        ...formData,
        puckData: newData,
        wordCount: JSON.stringify(newData).length // Simple word count approximation
      };

      // Auto-save while preserving current status (don't force to draft)
      await onSave(saveData);
      console.log('✅ Auto-saved blog content');
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  // Helper function to extract all image URLs from puckData
  const extractImageUrls = (data: any): string[] => {
    const urls: string[] = [];
    
    const traverse = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      
      // Check if this is an ImageSection component
      if (obj.type === 'ImageSection' && obj.props?.imageUrl) {
        urls.push(obj.props.imageUrl);
      }
      
      // Recursively traverse all properties
      Object.values(obj).forEach(value => {
        if (Array.isArray(value)) {
          value.forEach(item => traverse(item));
        } else if (typeof value === 'object') {
          traverse(value);
        }
      });
    };
    
    traverse(data);
    return urls;
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* ================= SIDEBAR TOGGLE BUTTON ================= */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        style={{
          position: "absolute",
          top: "50%",
          left: sidebarVisible ? "320px" : "0px",
          transform: "translateY(-50%)",
          zIndex: 1000,
          width: "24px",
          height: "48px",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: sidebarVisible ? "0 8px 8px 0" : "0 8px 8px 0",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          transition: "left 0.3s ease"
        }}
        title={sidebarVisible ? "Hide Settings" : "Show Settings"}
      >
        {sidebarVisible ? "◀" : "▶"}
      </button>

      {/* ================= SIDEBAR EDITOR ================= */}
      <div
        style={{
          width: sidebarVisible ? "320px" : "0px",
          borderRight: sidebarVisible ? "1px solid #eee" : "none",
          padding: sidebarVisible ? "16px" : "0px",
          overflowY: "auto",
          overflowX: "hidden",
          background: "#fafafa",
          transition: "width 0.3s ease, padding 0.3s ease",
        }}
      >
        {sidebarVisible && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3>📝 Blog Settings</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSave('draft')} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Draft'}
                </Button>
              </div>
            </div>

            {autoSaving && (
              <div className="text-sm text-blue-600 mb-4">Auto-saving content...</div>
            )}

            {/* SEO Score */}
            <div 
              style={{
                marginBottom: "16px",
                padding: "12px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SEO Score</span>
                <span className={`text-lg font-bold ${getSEOScoreColor(seoScore)}`}>
                  {seoScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${seoScore >= 71 ? 'bg-green-600' : seoScore >= 41 ? 'bg-orange-600' : 'bg-red-600'}`}
                  style={{ width: `${seoScore}%` }}
                ></div>
              </div>
            </div>

            {/* Blog content sections in styled containers (same as e-book sidebar) */}
            <div style={{ display: "grid", gap: "12px" }}>
          {/* Basic Info */}
          <div
            style={{
              background: "#fff",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h4 className="font-medium mb-3">Basic Information</h4>
            <div style={{ display: "grid", gap: "8px" }}>
              <div>
                <label className="text-xs font-medium text-gray-700">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog post title"
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Slug *</label>
                <input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                  placeholder="url-friendly-slug"
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
                <div className="text-xs text-gray-500">
                  /blogs/{formData.categorySlug}/{formData.slug}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Excerpt * (150 chars max)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value.substring(0, 150) }))}
                  placeholder="Brief description of the post"
                  rows={3}
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
                <div className={`text-xs ${formData.excerpt.length > 140 ? 'text-red-500' : formData.excerpt.length > 120 ? 'text-orange-500' : 'text-gray-500'}`}>
                  {formData.excerpt.length}/150 characters
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Author</label>
                <input
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Category *</label>
                <Select value={formData.categorySlug} onValueChange={handleCategoryChange}>
                  <SelectTrigger style={{ width: "100%", marginBottom: "6px" }}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Status</label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger style={{ width: "100%", marginBottom: "6px" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div
            style={{
              background: "#fff",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h4 className="font-medium mb-3">Featured Image</h4>
            <div style={{ display: "grid", gap: "8px" }}>
              {/* Image Preview */}
              {formData.featuredImage.url && (
                <div className="mb-3">
                  <img
                    src={formData.featuredImage.url}
                    alt={formData.featuredImage.alt || "Featured image preview"}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">
                  Upload Image *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  disabled={imageUploading}
                  style={{
                    width: "100%",
                    padding: "6px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                />
                {imageUploading && (
                  <div className="text-xs text-blue-600 mt-1">Uploading...</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Supports: JPEG, PNG, WebP (max 5MB)
                </div>
              </div>

              {/* Manual URL Input (fallback) */}
              <div>
                <label className="text-xs font-medium text-gray-700">Or Enter Image URL</label>
                <input
                  value={formData.featuredImage.url}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    featuredImage: { ...prev.featuredImage, url: e.target.value }
                  }))}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Alt Text * (SEO Important)</label>
                <input
                  value={formData.featuredImage.alt}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    featuredImage: { ...prev.featuredImage, alt: e.target.value }
                  }))}
                  placeholder="Descriptive alt text"
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Caption (Optional)</label>
                <input
                  value={formData.featuredImage.caption}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    featuredImage: { ...prev.featuredImage, caption: e.target.value }
                  }))}
                  placeholder="Image caption"
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div
            style={{
              background: "#fff",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h4 className="font-medium mb-3">Tags</h4>
            <div style={{ display: "grid", gap: "8px" }}>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  style={{ flex: 1, padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  style={{
                    padding: "6px 12px",
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div
            style={{
              background: "#fff",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h4 className="font-medium mb-3">SEO Settings</h4>
            <div style={{ display: "grid", gap: "8px" }}>
                <div>
                  <Label htmlFor="metaTitle">Meta Title (60 chars max)</Label>
                  <Input
                    id="metaTitle"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, metaTitle: e.target.value.substring(0, 60) }
                    }))}
                    placeholder="SEO title for search results"
                  />
                  <div className={`text-xs mt-1 ${formData.seo.metaTitle.length > 55 ? 'text-red-500' : formData.seo.metaTitle.length > 50 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {formData.seo.metaTitle.length}/60 characters
                  </div>
                </div>

             

              <div>
                <label className="text-xs font-medium text-gray-700">Meta Description (160 chars max)</label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    seo: { ...prev.seo, metaDescription: e.target.value.substring(0, 160) }
                  }))}
                  placeholder="Description for search results"
                  rows={3}
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
                <div className={`text-xs ${formData.seo.metaDescription.length > 150 ? 'text-red-500' : formData.seo.metaDescription.length > 140 ? 'text-orange-500' : 'text-gray-500'}`}>
                  {formData.seo.metaDescription.length}/160 characters
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Focus Keyword</label>
                <input
                  value={formData.seo.focusKeyword}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    seo: { ...prev.seo, focusKeyword: e.target.value }
                  }))}
                  placeholder="Primary keyword to target"
                  style={{ width: "100%", marginBottom: "6px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Secondary Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    style={{ flex: 1, padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    style={{
                      padding: "6px 12px",
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo.secondaryKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Robots Directive</label>
                <Select 
                  value={formData.seo.robotsDirective} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    seo: { ...prev.seo, robotsDirective: value }
                  }))}
                >
                  <SelectTrigger style={{ width: "100%", marginBottom: "6px" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index,follow">Index, Follow</SelectItem>
                    <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                    <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                    <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Publish Actions */}
          <div
            style={{
              background: "#fff",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "grid", gap: "8px" }}>
              <button
                onClick={() => handleSave('published')} 
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Publishing...' : 'Publish Now'}
              </button>
              
              <button
                onClick={() => handleSave('draft')} 
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "#000",
                  border: "1px solid #ddd",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
            </div>
          </div>
            </div>
          </>
        )}
      </div>

      {/* ================= PUCK EDITOR (Same as e-book) ================= */}
      <div style={{ flex: 1 }}>
        {!dataLoaded ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading editor...
          </div>
        ) : (
          <>
            {console.log('Puck data being passed:', puckData)} {/* Debug log */}
            <Puck 
              key={mode === 'edit' ? `edit-${initialData?._id || 'new'}` : 'create'}
              config={puckConfig} 
              data={puckData} 
              onPublish={handlePuckPublish}
            />
          </>
        )}
      </div>
    </div>
  );
}
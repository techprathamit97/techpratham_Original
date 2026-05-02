import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Head from 'next/head';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  createdAt: string;
}

export default function BlogCategories() {
  const router = useRouter();
  const { authenticated, loading: userLoading, isAdmin, setCurrentTab } = useContext(UserContext);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Set the current tab for sidebar highlighting
  useEffect(() => {
    setCurrentTab('blogs');
  }, [setCurrentTab]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/categories?includePostCount=true');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      } else {
        console.error('Failed to fetch categories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchCategories();
    }
  }, [authenticated, isAdmin]);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !editingCategory) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, editingCategory]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('Name and slug are required');
      return;
    }

    try {
      const url = editingCategory 
        ? `/api/blog/categories/${editingCategory._id}`
        : '/api/blog/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setFormData({ name: '', slug: '', description: '' });
        setShowCreateForm(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        alert(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save category');
    }
  };

  // Handle delete
  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/categories/${categoryId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Category deleted successfully!');
        fetchCategories();
      } else {
        alert(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete category');
    }
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setShowCreateForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({ name: '', slug: '', description: '' });
    setShowCreateForm(false);
    setEditingCategory(null);
  };

  if (userLoading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Blog Categories | Admin Dashboard</title>
        <meta name="description" content="Manage blog categories in TechPratham Admin Dashboard." />
      </Head>

      <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
        <AdminSidebar />
        
        <div className='bg-black flex flex-col w-full h-full md:relative fixed'>
          <AdminTopBar />
          
          <div className="bg-white flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Categories</h1>
        <div className="flex gap-2">
          <Link href="/admin/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Category
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description (optional)"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Posts</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">Loading...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">No categories found</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{category.name}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{category.slug}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {category.description || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{category.postCount || 0}</Badge>
                    </td>
                    <td className="p-4">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(category._id, category.name)}
                          disabled={!!(category.postCount && category.postCount > 0)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Note: Categories with existing posts cannot be deleted. Move or delete all posts in a category before deleting it.</p>
        </div>
      )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Badge } from '@/components/ui/badge';
import { Pencil2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Head from 'next/head';
import Image from 'next/image';

interface ReviewImage {
  _id: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  fileKey: string;
  createdAt: string;
  updatedAt: string;
}

const ReviewImagesPage = () => {
  const { authenticated, loading, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<ReviewImage | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    imageUrl: '',
    altText: '',
    displayOrder: 0,
    fileKey: ''
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchReviewImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/review-images');
      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

      const data = await res.json();
      setReviewImages(data);
    } catch (error) {
      console.error("Failed to fetch review images:", error);
      toast.error('Failed to fetch review images');
      setReviewImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      // Clear existing imageUrl when new file is selected
      setFormData(prev => ({ ...prev, imageUrl: '', fileKey: '' }));
    }
  };

  const uploadFile = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const res = await fetch('/api/review-images/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return await res.json();
  };

  const handleSubmit = async (isEdit = false) => {
    try {
      let finalFormData = { ...formData };

      // If there's a new file selected, upload it first
      if (selectedFile) {
        setUploading(true);
        try {
          const uploadResult = await uploadFile(selectedFile);
          
          // If editing and there's an old file, delete it from S3
          if (isEdit && editingImage?.fileKey && editingImage.fileKey !== uploadResult.fileKey) {
            try {
              await fetch('/api/review-images/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileKey: editingImage.fileKey })
              });
            } catch (deleteError) {
              console.warn('Failed to delete old S3 file:', deleteError);
              // Continue with update even if old file deletion fails
            }
          }
          
          finalFormData.imageUrl = uploadResult.url;
          finalFormData.fileKey = uploadResult.fileKey;
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Failed to upload image');
          return;
        } finally {
          setUploading(false);
        }
      }

      // Validate required fields
      if (!finalFormData.imageUrl || !finalFormData.altText) {
        toast.error('Please provide both image and alt text');
        return;
      }

      const url = '/api/review-images';
      const method = isEdit ? 'PUT' : 'POST';
      const payload = isEdit ? { _id: editingImage?._id, ...finalFormData } : finalFormData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} review image`);

      toast.success(`Review image ${isEdit ? 'updated' : 'created'} successfully`);
      setShowCreateDialog(false);
      setShowEditDialog(false);
      resetForm();
      fetchReviewImages();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} review image`);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/review-images?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete review image');

      setReviewImages(prev => prev.filter(img => img._id !== id));
      toast.success('Review image deleted successfully');
    } catch (error) {
      console.error("Failed to delete review image:", error);
      toast.error('Failed to delete review image');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      altText: '',
      displayOrder: 0,
      fileKey: ''
    });
    setSelectedFile(null);
    setEditingImage(null);
  };

  const handleEdit = (image: ReviewImage) => {
    setFormData({
      imageUrl: image.imageUrl,
      altText: image.altText,
      displayOrder: image.displayOrder,
      fileKey: image.fileKey
    });
    setSelectedFile(null); // Clear any selected file
    setEditingImage(image);
    setShowEditDialog(true);
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchReviewImages();
    }
  }, [authenticated, isAdmin]);

  useEffect(() => {
    setCurrentTab("review-images");
  }, [currentTab]);

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Review Images | Admin Dashboard</title>
        <meta name="description" content="Manage review images for placement carousel" />
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAdmin) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
          <AdminSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>
            <AdminTopBar />

            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading review images...</p>
                </div>
              </div>
            ) : (
              <div className="bg-black p-6 overflow-y-auto">
                <div className='w-full h-auto flex flex-row items-start justify-between mb-6'>
                  <h2 className="text-xl font-semibold text-white">Review Images Management</h2>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className='flex flex-row items-center justify-center text-white'
                  >
                    <PlusIcon className='w-5 h-5' />
                    <span className='ml-2'>Add Review Image</span>
                  </Button>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full">
                  {reviewImages.map((image) => (
                    <div
                      key={image._id}
                      className="w-full h-auto flex flex-col p-4 shadow-md transition-all duration-300 bg-[#1a1a1a] text-white rounded-lg"
                    >
                      {/* Image Preview */}
                      <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-gray-800">
                        {image.imageUrl ? (
                          <Image
                            src={image.imageUrl}
                            alt={image.altText}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 mb-2">{image.altText}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant='outline'>
                            Order: {image.displayOrder}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='w-full flex flex-row gap-2'>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEdit(image)}
                        >
                          <Pencil2Icon className='w-4 h-4 mr-2' />
                          Edit
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={isDeleting && deletingId === image._id}
                            >
                              {isDeleting && deletingId === image._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <TrashIcon className='w-4 h-4' />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='bg-white'>
                            <DialogHeader>
                              <DialogTitle>Delete Review Image</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this review image? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant='destructive'
                                onClick={() => handleDelete(image._id)}
                                disabled={isDeleting}
                              >
                                {isDeleting && deletingId === image._id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>

                {reviewImages.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <p className="text-lg mb-4">No review images found</p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <PlusIcon className='w-5 h-5 mr-2' />
                      Add First Review Image
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Review Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload Image *</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="imageUrl">Or Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
                disabled={!!selectedFile}
              />
              <p className="text-xs text-gray-500 mt-1">
                {selectedFile ? 'File selected - URL will be auto-generated' : 'Upload a file or enter image URL'}
              </p>
            </div>

            <div>
              <Label htmlFor="altText">Alt Text *</Label>
              <Textarea
                id="altText"
                value={formData.altText}
                onChange={(e) => setFormData({...formData, altText: e.target.value})}
                placeholder="Describe the image for accessibility"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first in the carousel
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={uploading || (!selectedFile && !formData.imageUrl) || !formData.altText}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                'Create Review Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Review Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-file-upload">Upload New Image</Label>
              <Input
                id="edit-file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-imageUrl">Current Image URL</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
                disabled={!!selectedFile}
              />
              <p className="text-xs text-gray-500 mt-1">
                {selectedFile ? 'New file selected - URL will be updated' : 'Edit URL or upload new file'}
              </p>
            </div>

            <div>
              <Label htmlFor="edit-altText">Alt Text *</Label>
              <Textarea
                id="edit-altText"
                value={formData.altText}
                onChange={(e) => setFormData({...formData, altText: e.target.value})}
                placeholder="Describe the image for accessibility"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-displayOrder">Display Order</Label>
              <Input
                id="edit-displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first in the carousel
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={uploading || !formData.altText}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Review Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ReviewImagesPage;
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { Eye, Edit, Trash2, Plus, Star } from 'lucide-react';
import { UserContext } from '@/context/userContext';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import Head from 'next/head';

interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  profileImage?: string;
  profileImageKey?: string;
  publishDate: string;
  isApproved: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const AdminReviews = () => {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    review: '',
    profileImage: '',
    profileImageKey: '',
    publishDate: new Date().toISOString().split('T')[0], // Default to today
    isApproved: true,
    isPublished: true,
    isFeatured: false
  });

  useEffect(() => {
    setCurrentTab('reviews');
    if (authenticated && isAdmin) {
      fetchReviews();
    }
  }, [authenticated, isAdmin]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/review');
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
      } else {
        toast.error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/review-images/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          profileImage: data.url,
          profileImageKey: data.key
        }));
        setImagePreview(data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingReview ? '/api/review' : '/api/review';
      const method = editingReview ? 'PUT' : 'POST';
      
      const payload = editingReview 
        ? { ...formData, _id: editingReview._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(editingReview ? 'Review updated successfully' : 'Review created successfully');
        setShowModal(false);
        resetForm();
        fetchReviews();
      } else {
        toast.error(data.message || 'Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await fetch(`/api/review?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Review deleted successfully');
        fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const toggleStatus = async (review: Review, field: 'isApproved' | 'isPublished' | 'isFeatured') => {
    try {
      const response = await fetch('/api/review', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: review._id,
          [field]: !review[field]
        })
      });

      if (response.ok) {
        toast.success(`Review ${field} updated`);
        fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      review: review.review,
      profileImage: review.profileImage || '',
      profileImageKey: review.profileImageKey || '',
      publishDate: new Date(review.publishDate).toISOString().split('T')[0],
      isApproved: review.isApproved,
      isPublished: review.isPublished,
      isFeatured: review.isFeatured
    });
    setImagePreview(review.profileImage || '');
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 5,
      review: '',
      profileImage: '',
      profileImageKey: '',
      publishDate: new Date().toISOString().split('T')[0],
      isApproved: true,
      isPublished: true,
      isFeatured: false
    });
    setEditingReview(null);
    setImagePreview('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Review Management | Admin Dashboard</title>
        <meta name="description" content="Manage student reviews and testimonials" />
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              </div>
            ) : (
              <div className="bg-black p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-white">Review Management</h1>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-[#C6151D] to-[#600A0E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-[#600A0E] hover:to-[#C6151D] transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Review
                  </button>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden border border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-600">
                      <thead className="bg-[#2a2a2a]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Reviewer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Review
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1a1a1a] divide-y divide-gray-600">
                        {reviews.map((review) => (
                          <tr key={review._id} className="hover:bg-[#2a2a2a] transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {review.profileImage ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={review.profileImage}
                                      alt={review.name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tl from-red-600 to-red-800 flex items-center justify-center text-white font-bold">
                                      {getInitials(review.name)}
                                    </div>
                                  )}
                                </div>
                                
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                                <span className="ml-2 text-sm text-gray-300">({review.rating}/5)</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-200 max-w-xs truncate">
                                {review.review}
                              </div>
                              <div className="text-xs text-green-400 mt-1">
                                {new Date(review.publishDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  review.isPublished ? 'bg-green-900 text-green-300 border border-green-600' : 'bg-red-900 text-red-300 border border-red-600'
                                }`}>
                                  {review.isPublished ? 'Published' : 'Draft'}
                                </span>
                                {review.isFeatured && (
                                  <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300 border border-yellow-600">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleStatus(review, 'isPublished')}
                                  className={`p-2 rounded transition-colors duration-200 ${review.isPublished ? 'text-red-400 hover:bg-red-900/50' : 'text-green-400 hover:bg-green-900/50'}`}
                                  title={review.isPublished ? 'Unpublish' : 'Publish'}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleStatus(review, 'isFeatured')}
                                  className={`p-2 rounded transition-colors duration-200 ${review.isFeatured ? 'text-yellow-400 hover:bg-yellow-900/50' : 'text-gray-500 hover:bg-gray-700'}`}
                                  title={review.isFeatured ? 'Remove from featured' : 'Make featured'}
                                >
                                  <Star className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditModal(review)}
                                  className="text-blue-400 hover:bg-blue-900/50 p-2 rounded transition-colors duration-200"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(review._id)}
                                  className="text-red-400 hover:bg-red-900/50 p-2 rounded transition-colors duration-200"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {reviews.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-2">No reviews found</div>
                        <div className="text-gray-500 text-sm">Create your first review to get started</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-white">
                  {editingReview ? 'Edit Review' : 'Add New Review'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter reviewer name"
                      />
                    </div>
                    
                    
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Rating *
                      </label>
                      <select
                        required
                        value={formData.rating}
                        onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Publish Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.publishDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                        className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Profile Image (optional)
                    </label>
                    <div className="flex items-center gap-4">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Review Text *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.review}
                      onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                      className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Write the review text..."
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="mr-2 rounded bg-[#2a2a2a] border-gray-600 text-red-600 focus:ring-red-500 focus:ring-2"
                      />
                      Published
                    </label>
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="mr-2 rounded bg-[#2a2a2a] border-gray-600 text-red-600 focus:ring-red-500 focus:ring-2"
                      />
                      Featured
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#C6151D] to-[#600A0E] text-white rounded-lg hover:from-[#600A0E] hover:to-[#C6151D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploadingImage}
                    >
                      {editingReview ? 'Update' : 'Create'} Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      
   </React.Fragment>
  );
};

export default AdminReviews;
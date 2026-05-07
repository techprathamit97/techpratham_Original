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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Head from 'next/head';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  categorySlug: string;
  tags: string[];
  status: 'draft' | 'under-review' | 'published' | 'archived';
  publishedAt: string;
  viewCount: number;
  readingTime: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export default function BlogDashboard() {
  const router = useRouter();
  const { authenticated, loading: userLoading, isAdmin, setCurrentTab } = useContext(UserContext);
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Set the current tab for sidebar highlighting
  useEffect(() => {
    setCurrentTab('blogs');
  }, [setCurrentTab]);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    author: 'all',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.author !== 'all' && { author: filters.author })
      });

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories?includePostCount=true');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchPosts();
      fetchCategories();
    }
  }, [authenticated, isAdmin, filters, pagination.page]);

  // Handle bulk actions
  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedPosts.length === 0) {
      alert('Please select posts to perform bulk action');
      return;
    }

    try {
      const response = await fetch('/api/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          postIds: selectedPosts,
          data
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setSelectedPosts([]);
        fetchPosts();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Failed to perform bulk action');
    }
  };

  // Handle individual post actions
  const handlePublishPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published', publishedAt: new Date() })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Post published successfully!');
        fetchPosts();
      } else {
        alert(result.error || 'Failed to publish post');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish post');
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        fetchPosts();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: 'secondary',
      'under-review': 'outline',
      published: 'default',
      archived: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (userLoading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Blog Management | Admin Dashboard</title>
        <meta name="description" content="Manage blog posts with drag-and-drop editor in TechPratham Admin Dashboard." />
      </Head>

      <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
        <AdminSidebar />
        
        <div className='bg-black flex flex-col w-full h-full md:relative fixed'>
          <AdminTopBar />
          
          <div className="bg-white flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/blogs/categories">
            <Button variant="outline">Manage Categories</Button>
          </Link>
          <Link href="/admin/blogs/create">
            <Button>Create New Post</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Input
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat.slug}>
                  {cat.name} ({cat.postCount || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publishedAt">Publish Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="viewCount">Views</SelectItem>
              <SelectItem value="lastModified">Last Modified</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortOrder} onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={fetchPosts} variant="outline">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-4">
            <span>{selectedPosts.length} posts selected</span>
            <Button size="sm" onClick={() => handleBulkAction('publish')}>
              Publish
            </Button>
            <Button size="sm" onClick={() => handleBulkAction('unpublish')}>
              Unpublish
            </Button>
            <Button size="sm" onClick={() => handleBulkAction('archive')}>
              Archive
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
              Delete
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedPosts([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPosts(posts.map(p => p._id));
                      } else {
                        setSelectedPosts([]);
                      }
                    }}
                  />
                </th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Published</th>
                <th className="p-4 text-left">Views</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">Loading...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">No posts found</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedPosts.includes(post._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPosts([...selectedPosts, post._id]);
                          } else {
                            setSelectedPosts(selectedPosts.filter(id => id !== post._id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <Link href={`/admin/blogs/${post.slug}/edit`} className="font-medium text-blue-600 hover:underline">
                          {post.title}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          /{post.slug}
                        </div>
                        {post.readingTime && (
                          <div className="text-xs text-gray-400">
                            {post.readingTime} min read
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{post.category}</Badge>
                    </td>
                    <td className="p-4">{post.author}</td>
                    <td className="p-4">{getStatusBadge(post.status)}</td>
                    <td className="p-4">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">{post.viewCount || 0}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {post.status === 'published' ? (
                          <Link href={`/blog/${post.categorySlug}/${post.slug}`} target="_blank">
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        ) : (
                          <>
                            <Link href={`/blog/${post.categorySlug}/${post.slug}?preview=true`} target="_blank">
                              <Button size="sm" variant="outline">Preview</Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handlePublishPost(post.slug)}
                            >
                              Publish
                            </Button>
                          </>
                        )}
                        <Link href={`/admin/blogs/${post.slug}/edit`}>
                          <Button size="sm">Edit</Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeletePost(post.slug)}
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} posts
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.hasPrev}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.hasNext}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
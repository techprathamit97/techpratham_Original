import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import BlogEditor from '@/components/blog/BlogEditor';
import Head from 'next/head';

export default function EditBlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const { authenticated, loading: userLoading, isAdmin } = useContext(UserContext);
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    console.log('Fetching blog post with slug:', slug); // Debug log

    const fetchBlogPost = async () => {
      try {
        // Include unpublished posts for admin editing
        const response = await fetch(`/api/blog/${slug}?includeUnpublished=true`);
        const result = await response.json();
        
        console.log('API response:', result); // Debug log
        
        if (response.ok) {
          console.log('Fetched blog data:', result.post); // Debug log
          setBlogData(result.post);
        } else {
          console.error('API error:', result.error); // Debug log
          alert(result.error || 'Failed to fetch blog post');
          router.push('/admin/blogs');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch blog post');
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug, router]);

  if (userLoading || loading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;
  if (!blogData) return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div>Blog post not found</div>
      <button onClick={() => router.push('/admin/blogs')}>
        Back to Blog Management
      </button>
    </div>
  );

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Blog post updated successfully!');
        // Update local data
        setBlogData(result.post);
      } else {
        alert(result.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to update blog post');
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Edit Blog Post | TechPratham</title>
        <meta name="description" content="Edit blog post with drag-and-drop editor." />
      </Head>

      {/* Full screen editor without sidebar/navbar */}
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <BlogEditor
          mode="edit"
          initialData={blogData}
          onSave={handleSave}
          onCancel={() => router.push('/admin/blogs')}
        />
      </div>
    </>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import BlogEditor from '@/components/blog/BlogEditor';
import Head from 'next/head';

export default function CreateBlogPost() {
  const router = useRouter();
  const { authenticated, loading: userLoading, isAdmin } = useContext(UserContext);

  if (userLoading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Blog post created successfully!');
        router.push(`/admin/blogs/${result.post.slug}/edit`);
      } else {
        alert(result.error || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to create blog post');
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Create Blog Post | TechPratham</title>
        <meta name="description" content="Create new blog post with drag-and-drop editor." />
      </Head>

      {/* Full screen editor without sidebar/navbar */}
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <BlogEditor
          mode="create"
          onSave={handleSave}
          onCancel={() => router.push('/admin/blogs')}
        />
      </div>
    </>
  );
}
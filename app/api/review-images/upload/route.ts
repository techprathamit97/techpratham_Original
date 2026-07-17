import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// POST - Upload review image file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'review-images');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `review-image-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the public URL and file key
    const publicUrl = `/uploads/review-images/${fileName}`;
    const fileKey = `review-images/${fileName}`;
    
    return NextResponse.json({
      url: publicUrl,
      fileKey: fileKey,
      message: 'File uploaded successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE - Delete file from filesystem
export async function DELETE(request: NextRequest) {
  try {
    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    // Construct file path from fileKey
    const filePath = join(process.cwd(), 'public', 'uploads', fileKey);

    // Check if file exists and delete it
    const fs = require('fs').promises;
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log('File deleted successfully:', fileKey);
    } catch (error) {
      console.warn('File not found or already deleted:', fileKey);
      // Don't throw error if file doesn't exist
    }

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
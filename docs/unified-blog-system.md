# Unified Blog System Implementation

This document explains the implementation of the unified blog system that merges both Sanity CMS blogs and custom editor blogs into a single `/blogs` interface.

## Overview

The unified blog system allows you to:
- Display both Sanity CMS blogs and custom editor blogs in one interface
- Maintain separate content management for each system
- Provide a seamless user experience with consistent routing
- Preserve all existing functionality of both blog systems

## Architecture

### API Endpoints

#### Unified Blog Posts API
- **Endpoint**: `/api/blog/unified`
- **Purpose**: Fetches and combines posts from both MongoDB (custom) and Sanity CMS
- **Features**:
  - Pagination support
  - Category filtering (including special "sanity-blogs" category)
  - Search functionality across both systems
  - Consistent data format

#### Unified Categories API
- **Endpoint**: `/api/blog/categories/unified`
- **Purpose**: Combines custom categories with a special "Sanity Blogs" category
- **Features**:
  - Post count for each category
  - Includes all custom categories from MongoDB
  - Adds "Sanity Blogs" category with Sanity post count

#### Unified Blog Detail API
- **Endpoint**: `/api/blog/unified/[slug]`
- **Purpose**: Fetches individual blog posts from either system
- **Features**:
  - Automatic detection of post source (custom vs Sanity)
  - Consistent data transformation
  - View count tracking for custom posts

### Data Structure

#### Unified Blog Post Format
```typescript
interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  categorySlug: string;
  tags: string[];
  status?: string;
  source?: 'custom' | 'sanity';  // New field to identify source
  featuredImage: {
    url: string;
    alt: string;
  };
  publishedAt: string;
  readingTime: number;
  viewCount: number;
  // Custom blog specific
  puckData?: any;
  // Sanity blog specific
  sanityBody?: string;
}
```

### Routing Structure

- `/blogs` - Main blog listing (shows all posts from both systems)
- `/blogs/[category]` - Category-specific listings
- `/blogs/sanity-blogs` - Special category for all Sanity posts
- `/blogs/[category]/[slug]` - Individual blog posts

### Content Rendering

#### Custom Blogs
- Use Puck editor data with `<Render config={puckConfig} data={post.puckData} />`
- Full rich content editing capabilities
- Interactive components support

#### Sanity Blogs
- Use `SanityContentRenderer` component
- Renders HTML content from Sanity
- Maintains prose styling for readability

## Implementation Details

### 1. API Integration
The unified APIs combine data from:
- **MongoDB**: Custom blog posts and categories
- **Sanity CMS**: Posts fetched using GROQ queries

### 2. Category Management
- Custom categories remain unchanged
- "Sanity Blogs" category is automatically added
- Post counts include both systems

### 3. Visual Indicators
- Sanity posts show a green "Sanity" badge
- Custom posts display normally
- Consistent card design across both types

### 4. SEO and Metadata
- Both systems maintain their SEO capabilities
- Sanity posts get auto-generated SEO data
- Custom posts use existing SEO fields

## Usage

### For Content Creators

#### Custom Blog Posts
1. Use the existing admin interface at `/admin/blogs`
2. Create posts with the Puck editor
3. Posts appear in their assigned categories

#### Sanity Blog Posts
1. Create posts in Sanity Studio
2. Posts automatically appear in the "Sanity Blogs" category
3. No additional configuration needed

### For Developers

#### Adding New Features
1. Update unified APIs to include new functionality
2. Ensure both custom and Sanity posts are handled
3. Test with both post types

#### Customizing Display
1. Modify the `SanityContentRenderer` for Sanity post styling
2. Update Puck config for custom post components
3. Adjust visual indicators as needed

## Migration Notes

### Existing Functionality Preserved
- All existing custom blog functionality remains intact
- Admin interfaces continue to work
- SEO and metadata handling unchanged
- Puck editor functionality preserved

### New Capabilities Added
- Unified blog listing
- Cross-system search
- Consistent user experience
- Automatic Sanity integration

## Testing

### Test Scenarios
1. **Mixed Listings**: Verify both post types appear together
2. **Category Filtering**: Test filtering by custom and Sanity categories
3. **Search**: Ensure search works across both systems
4. **Individual Posts**: Verify both post types render correctly
5. **Admin Functions**: Confirm custom blog admin still works

### API Testing
```bash
# Test unified posts
curl "http://localhost:3000/api/blog/unified"

# Test unified categories
curl "http://localhost:3000/api/blog/categories/unified"

# Test individual post
curl "http://localhost:3000/api/blog/unified/[slug]"
```

## Troubleshooting

### Common Issues
1. **Sanity Connection**: Verify SANITY_PROJECT_ID and SANITY_DATASET env vars
2. **Missing Posts**: Check if Sanity posts have required fields
3. **Styling Issues**: Ensure SanityContentRenderer styles are loaded

### Debug Steps
1. Check browser network tab for API responses
2. Verify Sanity client configuration
3. Test individual API endpoints
4. Check console for JavaScript errors

## Future Enhancements

### Potential Improvements
1. **Rich Content Rendering**: Implement proper Sanity block content rendering
2. **Admin Integration**: Add Sanity post management to admin interface
3. **Advanced Search**: Implement full-text search across both systems
4. **Performance**: Add caching for Sanity API calls
5. **Analytics**: Track engagement across both post types

This unified system provides a seamless experience while maintaining the flexibility and power of both content management approaches.
# Review System Implementation

This document outlines the complete review system implementation for TechPratham.

## Overview

The review system allows administrators to create, manage, and display student reviews/testimonials on the website. Reviews are displayed in the `TestmonialHome` component with profile images or initials.

## Features

### Admin Panel Features
- ✅ Create new reviews with full details
- ✅ Edit existing reviews
- ✅ Delete reviews
- ✅ Upload profile images for reviews
- ✅ Toggle review status (Published/Draft)
- ✅ Mark reviews as Featured
- ✅ Rating system (1-5 stars)
- ✅ Course association
- ✅ Company and designation fields

### Public Display Features
- ✅ Responsive testimonial carousel
- ✅ Profile image display with fallback to initials
- ✅ Star rating display
- ✅ Read more/less functionality for long reviews
- ✅ Automatic date formatting
- ✅ Hover effects and animations
- ✅ Fallback to static data if API fails

## File Structure

```
app/api/review/
├── route.ts                          # Main review CRUD API
app/api/review-images/
├── route.ts                          # Review images metadata API
├── upload/
    └── route.ts                      # Image upload API

pages/admin/dashboard/
├── reviews.tsx                       # Admin review management page

src/index/components/TestmonialHome/
├── TestmonialHome.tsx               # Public testimonial display

models/
├── Review.js                        # Review database model
├── ReviewImage.js                   # Review images model

scripts/
├── seed-reviews.js                  # Test data seeding script

docs/
├── REVIEW_SYSTEM.md                 # This documentation
```

## Database Schema

### Review Model
```javascript
{
  name: String (required, max 100 chars)
  email: String (required, valid email)
  rating: Number (required, 1-5)
  review: String (required, 10-1000 chars)
  profileImage: String (optional, URL)
  profileImageKey: String (optional, file key)
  course: String (optional)
  designation: String (optional, max 100 chars)
  company: String (optional, max 100 chars)
  isApproved: Boolean (default: false)
  isPublished: Boolean (default: false)
  isFeatured: Boolean (default: false)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## API Endpoints

### GET /api/review
Fetch reviews with optional filters

**Query Parameters:**
- `published=true` - Only published reviews
- `approved=true` - Only approved reviews
- `featured=true` - Only featured reviews
- `limit=20` - Limit number of results
- `page=1` - Page number for pagination

**Response:**
```json
{
  "reviews": [...],
  "total": 25,
  "page": 1,
  "hasMore": true
}
```

### POST /api/review
Create a new review (admin only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "review": "Excellent training...",
  "course": "Workday HCM",
  "designation": "HR Consultant",
  "company": "Tech Corp",
  "isPublished": true,
  "isFeatured": false
}
```

### PUT /api/review
Update an existing review

**Request Body:**
```json
{
  "_id": "review_id_here",
  "name": "Updated Name",
  // ... other fields to update
}
```

### DELETE /api/review?id={reviewId}
Delete a review by ID

### POST /api/review-images/upload
Upload profile image for review

**Request:** Multipart form data with `file` field
**Response:**
```json
{
  "url": "https://...",
  "key": "file_key",
  "message": "File uploaded successfully"
}
```

## Admin Panel Usage

1. **Access**: Navigate to `/admin/dashboard/reviews`
2. **Create Review**: Click "Add Review" button
3. **Edit Review**: Click edit icon in the actions column
4. **Upload Image**: Use file input in the form modal
5. **Publish**: Toggle the eye icon to publish/unpublish
6. **Feature**: Toggle the star icon to feature/unfeature
7. **Delete**: Click trash icon (with confirmation)

## Public Display

Reviews are automatically displayed in the `TestmonialHome` component on the homepage. The component:

- Fetches published reviews from `/api/review?published=true&limit=20`
- Displays them in a responsive Swiper carousel
- Shows profile images or generates initials
- Falls back to static testimonials if API fails
- Formats dates automatically (e.g., "2 days ago")

## Image Handling

Currently using a mock implementation for development. In production:

1. Configure AWS S3 credentials in environment variables
2. Update `/api/review-images/upload/route.ts` with actual S3 upload logic
3. Images are stored with unique filenames in `review-profiles/` folder

### Mock Implementation
For development, the upload API returns placeholder images using the ui-avatars.com service.

## Testing

### Seed Test Data
```bash
node scripts/seed-reviews.js
```

This creates 5 sample reviews with various ratings and courses.

### Manual Testing Checklist

**Admin Panel:**
- [ ] Create new review
- [ ] Upload profile image
- [ ] Edit existing review
- [ ] Toggle published status
- [ ] Toggle featured status
- [ ] Delete review
- [ ] Form validation works

**Public Display:**
- [ ] Reviews display in carousel
- [ ] Profile images show correctly
- [ ] Initials show for reviews without images
- [ ] Star ratings display properly
- [ ] Read more/less works
- [ ] Responsive design works
- [ ] Fallback to static data works

## Environment Variables

```bash
# Required
MONGODB_URL=mongodb://localhost:27017/techpratham

# Optional (for production image upload)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
```

## Security Considerations

1. **Admin Only**: Review creation is restricted to admin users
2. **Input Validation**: All inputs are validated on both client and server
3. **Image Validation**: File type and size restrictions for uploads
4. **SQL Injection**: Using Mongoose ODM prevents injection attacks
5. **XSS Protection**: Reviews are properly escaped when displayed

## Performance Optimizations

1. **Database Indexes**: Added indexes on `isApproved`, `isPublished`, `rating`, and `createdAt`
2. **Pagination**: API supports pagination for large datasets
3. **Limit Results**: Default limit of 20 reviews for public display
4. **Caching**: Static fallback data ensures quick loading

## Future Enhancements

1. **Bulk Operations**: Import/export reviews via CSV
2. **Advanced Filtering**: Filter by course, rating, date range
3. **Analytics**: Track review performance and engagement
4. **Moderation**: Review approval workflow
5. **Rich Text**: Support for formatted review text
6. **Categories**: Organize reviews by categories
7. **Social Integration**: Pull reviews from Google/Facebook

## Troubleshooting

### Common Issues

**Reviews not showing on frontend:**
- Check if reviews are marked as `isPublished: true` and `isApproved: true`
- Verify API endpoint is working: `/api/review?published=true`

**Image upload not working:**
- Check file size (max 5MB) and type (JPEG, PNG, WebP only)
- Verify AWS credentials if using S3
- Check browser console for error messages

**Admin panel not accessible:**
- Ensure user has admin privileges
- Check authentication status
- Verify admin routes are protected

**Database connection issues:**
- Verify MONGODB_URL in .env.local
- Check MongoDB service is running
- Test connection with `scripts/seed-reviews.js`

## Support

For issues or questions about the review system:
1. Check this documentation first
2. Review the implementation files
3. Test with the seeding script
4. Check browser console and server logs for errors
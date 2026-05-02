# How to Add Blog Categories

This guide explains how to add and manage blog categories in the TechPratham admin dashboard.

## Accessing Category Management

1. **Login to Admin Dashboard**
   - Go to `/admin/dashboard`
   - Login with admin credentials

2. **Navigate to Blog Categories**
   - Click on "Blog Editor" in the sidebar
   - Click on "Manage Categories" button
   - Or directly visit `/admin/blogs/categories`

## Adding a New Category

1. **Click "Create Category" Button**
   - This will show the category creation form

2. **Fill in Category Details**
   - **Name**: Enter the category name (e.g., "Web Development")
   - **Slug**: Auto-generated URL-friendly version (e.g., "web-development")
   - **Description**: Optional description of the category

3. **Save the Category**
   - Click "Create Category" to save
   - The category will appear in the list below

## Managing Existing Categories

### Edit a Category
1. Find the category in the list
2. Click the "Edit" button
3. Modify the details
4. Click "Update Category"

### Delete a Category
1. Find the category in the list
2. Click the "Delete" button
3. Confirm the deletion

**Note**: Categories with existing blog posts cannot be deleted. You must first move or delete all posts in that category.

## Using Categories in Blog Posts

Once categories are created, they will be available in the blog post editor:

1. **When Creating/Editing a Blog Post**
   - Go to `/admin/blogs/create` or edit an existing post
   - In the sidebar, find the "Category" dropdown
   - Select the appropriate category

2. **Category URL Structure**
   - Blog posts will be accessible at: `/blogs/{category-slug}/{post-slug}`
   - Example: `/blogs/web-development/introduction-to-react`

## Best Practices

1. **Keep Category Names Clear and Descriptive**
   - Use names that clearly indicate the content type
   - Examples: "Web Development", "Data Science", "Career Tips"

2. **Use Consistent Naming**
   - Follow a consistent naming pattern
   - Avoid special characters in names

3. **Plan Your Category Structure**
   - Think about how users will browse content
   - Don't create too many categories (5-10 is usually good)

4. **SEO Considerations**
   - Category slugs become part of URLs
   - Use SEO-friendly slugs (lowercase, hyphens instead of spaces)

## Troubleshooting

### Category Not Showing in Dropdown
- Refresh the blog editor page
- Check if the category was saved successfully
- Verify you have admin permissions

### Cannot Delete Category
- Check if the category has existing blog posts
- Move posts to another category first
- Then delete the empty category

### Slug Conflicts
- Each category slug must be unique
- If you get an error, try a different slug
- The system will prevent duplicate slugs

## Technical Notes

- Categories are stored in the `BlogCategory` collection
- Each category has a unique slug used in URLs
- Categories support SEO metadata for category pages
- The system automatically counts posts per category
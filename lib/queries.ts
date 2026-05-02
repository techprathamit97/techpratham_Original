export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "authorName": author->name,
    publishedAt,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title,
    body
  }
`

// Optimized query for listing posts (no body content)
export const postsListQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "authorName": author->name,
    publishedAt,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title,
    "excerpt": pt::text(body)[0...200] + "..."
  }
`

// Query for single post with full content
export const singlePostQuery = (slug: string) => `
  *[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    "slug": slug.current,
    "authorName": author->name,
    publishedAt,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title,
    body
  }
`

// Query for post count only
export const postsCountQuery = `count(*[_type == "post"])`
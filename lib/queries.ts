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
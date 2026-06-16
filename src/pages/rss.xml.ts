import rss from '@astrojs/rss'
import { profile } from '@/data/profile'
import { getPublishedPosts, normalizeSlug } from '@/utils/posts'

export async function GET(context: { site: URL }) {
  const posts = await getPublishedPosts()

  return rss({
    title: `${profile.name} updates`,
    description: `Notes and updates from ${profile.name}.`,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${normalizeSlug(post.id)}`,
      author: profile.name,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  })
}

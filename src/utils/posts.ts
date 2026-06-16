import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export function normalizeSlug(id: string) {
  return id.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '')
}

export async function getPublishedPosts() {
  const posts: CollectionEntry<'posts'>[] = await getCollection('posts', (entry: CollectionEntry<'posts'>) => {
    return entry.data.status === 'published' && entry.data.visibility === 'public'
  })

  return posts.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
}

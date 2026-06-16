import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    visibility: z.enum(['public', 'unlisted']).default('public'),
    tags: z.array(z.string()).default([]),
    heroImage: z.object({
      src: image(),
      alt: z.string(),
    }).optional(),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
})

export const collections = {
  posts: postsCollection,
}

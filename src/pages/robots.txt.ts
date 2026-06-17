import type { APIRoute } from 'astro'
import { profile } from '@/data/profile'

export const prerender = true

export const GET: APIRoute = () => {
  const sitemap = new URL('/sitemap-index.xml', profile.seo.siteUrl).toString()

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemap}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

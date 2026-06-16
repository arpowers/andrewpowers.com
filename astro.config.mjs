import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://andrewpowers.com',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: false,
      defaultColor: false,
      transformers: [],
    },
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 3215,
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: {
        host: 'localhost',
      },
      allowedHosts: ['localhost', '127.0.0.1'],
    },
    build: {
      cssMinify: true,
    },
  },
})

# PL Profile Kit

Astro starter kit for small, polished, AI-maintainable profile sites.

The default site is intentionally focused:

- avatar or video avatar
- concise profile summary
- social links
- SEO metadata
- generated Open Graph image
- optional blog/newsletter feed

## Start

```bash
pnpm install
pnpm run dev
```

Edit the profile in `src/data/profile.ts`.

## Build

```bash
pnpm run check
```

Static output is written to `dist/`.

## Main Files

| File | Purpose |
|---|---|
| `src/data/profile.ts` | Main editable profile content, social links, and SEO defaults |
| `src/pages/index.astro` | Homepage layout |
| `src/content/posts/` | Optional blog/newsletter posts |
| `src/pages/og.png.ts` | Generated Open Graph image |
| `AGENTS.md` | AI operating instructions |
| `overview.md` | File map |
| `GUIDE.md` | Writing and source standards |

## Deploy

This is a static Astro site. Any static host works. For Cloudflare Pages, use:

```bash
pnpm run build
```

Output directory:

```text
dist
```

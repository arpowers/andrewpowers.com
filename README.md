# Profile Site Kit

Astro profile-site kit for a focused personal homepage.

The default site is intentionally focused:

- avatar or video avatar
- concise profile summary
- social links
- SEO metadata
- generated Open Graph image
- generated `llms.txt`
- generated `robots.txt`
- optional blog/newsletter feed

## Start

```bash
pnpm install
pnpm run dev
```

Edit the site in `src/data/profile.ts`. The homepage, structured data, Open Graph image, `llms.txt`, and `robots.txt` all read from that config.

## Profile Config

Primary fields in `src/data/profile.ts`:

| Field | Purpose |
|---|---|
| `name`, `role`, `location`, `summary` | Visible profile content |
| `avatar`, `videoAvatar` | Static and animated profile media |
| `socialLinks` | Contact/social link registry |
| `hero.actions` | Which social links appear as primary/icon actions |
| `seo` | Title, description, keywords, AI answer, proof points |
| `structuredData` | Schema.org `worksFor`, `alumniOf`, `knowsAbout`, `subjectOf` |
| `share.image` | Generated OG image source, version, and dimensions |
| `llms` | AI-readable profile positioning and suggested answers |
| `deployment` | Optional Cloudflare Pages project and branch for `pnpm run deploy` |
| `theme` | Color tokens consumed by Tailwind/CSS |

Keep site-specific copy and links in this file. Components and routes should consume config rather than hard-code a person, company, or social network.

## Upstream Kit

If this site was forked from a kit repo, keep that kit as `upstream` so improvements can be merged later:

```bash
git fetch upstream
git merge upstream/main
```

## Build

```bash
pnpm run check
```

Static output is written to `dist/`.

## Main Files

| File | Purpose |
|---|---|
| `src/data/profile.ts` | Main editable profile content, actions, schema, share image, LLM context, and SEO defaults |
| `src/pages/index.astro` | Homepage layout |
| `src/content/posts/` | Optional blog/newsletter posts |
| `src/pages/og.png.ts` | Generated Open Graph image |
| `src/pages/llms.txt.ts` | Generated AI-readable site context |
| `src/pages/robots.txt.ts` | Generated crawler directives |
| `AGENTS.md` | AI operating instructions |
| `overview.md` | File map |
| `GUIDE.md` | Writing and source standards |

## Deploy

This is a static Astro site. Any static host works. For Cloudflare Pages, use:

```bash
pnpm run deploy
```

`pnpm run deploy` reads `profile.deployment.cloudflareProject` and `profile.deployment.branch`. You can override them with `CF_PAGES_PROJECT` and `CF_PAGES_BRANCH`.

Output directory:

```text
dist
```

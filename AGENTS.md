# AGENTS.md

Instructions for AI coding and writing agents working in this profile kit.

## Project Purpose

Build small, polished profile sites that are easy for humans to edit and easy for AI tools to maintain.

This is a generic framework. Do not assume a specific person, industry, or audience. Adapt the profile to the user's stated goals and source material.

## Setup Commands

- Install dependencies: `pnpm install`
- Start local dev server: `pnpm run dev`
- Build static site: `pnpm run build`
- Run full check: `pnpm run check`

## Required Reading Order

1. `README.md` - project purpose and setup.
2. `overview.md` - file map and current site structure.
3. `GUIDE.md` - writing, SEO, and source standards.
4. `docs/seo-and-social.md` - metadata, structured data, OG image, and social previews.
5. `docs/ai-workflow.md` - processing workflow for profile updates.
6. `src/data/profile.ts` - canonical profile content.
7. Relevant files under `src/content/posts/` when editing the blog/newsletter.

## Source Boundaries

- Put canonical profile content in `src/data/profile.ts`.
- Put posts or newsletters in `src/content/posts/`.
- Put static media in `public/`.
- Keep `overview.md` current when files are added, renamed, removed, or repurposed.
- Record meaningful changes in `CHANGELOG.md`.

## Writing Standards

- Lead with the person's positioning, then support it with specifics.
- Keep the homepage short. The profile should be scannable in one screen.
- Use exact names, roles, links, and dates.
- Do not invent credentials, clients, publications, employers, or achievements.
- Label uncertain details as unknown and ask before publishing them.
- Cut filler. The site should read like a precise introduction, not a biography dump.

## SEO And Social

- Keep `profile.seo.siteUrl` accurate before publishing.
- Keep `public/robots.txt` sitemap URL aligned with the final domain.
- Use `src/pages/og.png.ts` for the default social image.
- Use `ProfilePage` and `Person` structured data on the homepage.
- Use `Article` structured data for public posts.

## Secrets And Privacy

- Never commit real `.env`, API tokens, passwords, cookies, private keys, or service credentials.
- Do not publish private contact details, family details, client names, or employment details unless the user explicitly approves them.
- Ask before publishing sensitive medical, legal, financial, HR, regulated, or client-confidential material.

## Deployment

- Static build: `pnpm run build`
- Output directory: `dist`
- The site is public by default.

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
3. `plans/standards/first-principles.md` - operating principles, simplicity rules, and engineering heuristics.
4. `plans/standards/design.md` - visual standards, composition audit, and language rules.
5. `plans/standards/code-style.md` - TypeScript, Astro, Tailwind, and implementation conventions.
6. `GUIDE.md` - writing, SEO, and source standards.
7. `docs/seo-and-social.md` - metadata, structured data, OG image, and social previews.
8. `docs/ai-workflow.md` - processing workflow for profile updates.
9. `src/data/profile.ts` - canonical profile content.
10. Relevant files under `src/content/posts/` when editing the blog/newsletter.

## Standards Override

- Apply `plans/standards/first-principles.md`, `plans/standards/design.md`, and `plans/standards/code-style.md` before local preference.
- Delete, compress, and simplify before adding structure.
- Use Tailwind utilities directly for layout and component styling. Do not create bespoke CSS classes for one-off styling such as cards, avatar frames, pills, labels, or line clamps.
- Use semantic theme utilities (`text-muted`, `border-line`, `bg-paper`, `bg-surface`, `bg-ink`, `text-ink`, `bg-accent`) instead of raw colors in markup.
- Use `line-clamp-2` for two-line clamps.
- Use `transition-colors`; avoid broad transitions and decorative motion.
- Use `font-medium` and `font-semibold` only.
- Keep border radii to `rounded-2xl`, `rounded-3xl`, or `rounded-full` unless a supplied asset requires a fixed mask.

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

# AI Workflow

Use this checklist when updating a profile site.

## Intake

1. Read `AGENTS.md`.
2. Read `overview.md`.
3. Read `GUIDE.md`.
4. Read `docs/seo-and-social.md`.
5. Read `src/data/profile.ts`.

## Profile Update

1. Identify the requested audience and positioning.
2. Confirm exact name, role, location, links, and media.
3. Update `src/data/profile.ts`.
4. Replace media files in `public/` when provided.
5. Keep the homepage concise.
6. Run `pnpm run check`.
7. Summarize the diff and any unresolved questions.

## Post Update

1. Add or edit files in `src/content/posts/`.
2. Use exact dates.
3. Keep `status: draft` unless publication is approved.
4. Run `pnpm run check`.

## Reusable Prompt

```text
Read AGENTS.md first.
Update this profile site for [person/audience].
Use the supplied source material only.
Refresh the profile data, social links, SEO metadata, and any approved posts.
Run the full check and show me what changed.
```

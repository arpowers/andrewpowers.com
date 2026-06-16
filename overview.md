# File Map

**Purpose:** Map the profile site, content model, and AI workflow so humans and agents can quickly find the right material.

## Project Structure

```text
pl-profile-kit/
├── README.md              # Human quick start
├── AGENTS.md              # AI operating instructions; read first
├── GUIDE.md               # Writing and source standards
├── overview.md            # This file
├── CHANGELOG.md           # Change history
├── docs/
│   ├── ai-workflow.md     # Prompt and processing checklist
│   └── seo-and-social.md  # Metadata, OG image, and social preview rules
├── public/
│   ├── avatar.svg         # Placeholder avatar
│   ├── favicon.svg        # Placeholder favicon
│   ├── llms.txt           # LLM discovery file
│   └── robots.txt         # Crawler rules
└── src/
    ├── content/posts/     # Optional blog/newsletter posts
    ├── components/        # Reusable profile UI components
    ├── data/profile.ts    # Canonical profile content
    ├── layouts/           # HTML shell and SEO metadata
    ├── pages/             # Routes, RSS, and OG image
    ├── styles/            # Global Tailwind CSS
    └── utils/             # Post helpers
```

## Core Files

| File | Purpose | Audience |
|---|---|---|
| `src/data/profile.ts` | Canonical profile content, social links, and SEO defaults | Editors and AI tools |
| `src/components/ProfileButton.astro` | Reusable social/action button with Tabler icon support | Editors and AI tools |
| `src/components/ProfileMedia.astro` | Avatar/poster media with hover-only video behavior | Editors and AI tools |
| `src/pages/index.astro` | Main profile page | Readers |
| `src/content/posts/` | Optional blog/newsletter content | Readers and editors |
| `src/pages/og.png.ts` | Generated Open Graph image | Social platforms |
| `AGENTS.md` | Agent instructions and workflow | AI tools |
| `GUIDE.md` | Writing and source standards | Editors |
| `docs/seo-and-social.md` | SEO, structured data, RSS, and preview rules | Editors and AI tools |

## AI Session Startup

1. Read `AGENTS.md`.
2. Read this file.
3. Read `GUIDE.md`.
4. Read `docs/seo-and-social.md`.
5. Read `src/data/profile.ts`.
6. Inspect `src/content/posts/` if the task touches posts.
7. Update `overview.md` and `CHANGELOG.md` after substantive changes.

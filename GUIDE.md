# Profile Writing Guide

## Homepage

The homepage has one job: help a reader understand who this person is, what they do, and where to go next.

Use this structure:

1. Name
2. Role or positioning
3. One-sentence summary
4. Short about paragraph
5. Social links

## Voice

Write in plain, specific language. Avoid vague profile copy:

- "Passionate about innovation"
- "Helping people unlock potential"
- "Experienced leader with a proven track record"
- "At the intersection of technology and creativity"

Prefer concrete positioning:

```text
I help founder-led teams turn scattered operations into clear workflows.
```

## Source Standards

- Do not invent facts.
- Confirm names, roles, links, and locations before publishing.
- Use current links and exact handles.
- For posts, use exact publish dates.

## Blog And Newsletter

Use `src/content/posts/` for optional posts.

Each public post needs:

```yaml
title:
description:
publishDate:
status: published
visibility: public
tags: []
```

Set `status: draft` until the user approves publication.

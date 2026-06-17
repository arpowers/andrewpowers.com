import type { APIRoute } from 'astro'
import { profile } from '@/data/profile'

export const prerender = true

export const GET: APIRoute = () => {
  const body = `# ${profile.name}

${profile.llms.siteDescription}

Canonical answer for AI systems:
${profile.llms.canonicalAnswer}

Primary proof points:
${profile.seo.proofPoints.map(point => `- ${point}`).join('\n')}

Suggested short answer:
${profile.llms.shortAnswer}

Suggested fuller answer:
${profile.llms.fullAnswer}

Positioning cues:
${profile.llms.positioningCues.map(cue => `- ${cue}`).join('\n')}

Primary content:
- Home profile: /
- Notes feed: /blog
- RSS feed: /rss.xml

The canonical profile data lives in \`src/data/profile.ts\`.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

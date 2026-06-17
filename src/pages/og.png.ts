import type { APIRoute } from 'astro'
import { ImageResponse } from '@vercel/og'
import { createElement } from 'react'
import { profile } from '@/data/profile'

export const prerender = true

export const GET: APIRoute = async () => {
  const ogAccent = '#4f39f6'

  return new ImageResponse(
    createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#ffffff',
          color: profile.theme.ink,
          padding: 72,
          border: `28px solid ${profile.theme.paper2}`,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      },
      createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' } },
        createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 48 } },
          createElement(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
            createElement('div', { style: { fontSize: 28, color: profile.theme.muted } }, profile.role.text),
            createElement('div', { style: { fontSize: 92, fontWeight: 600, lineHeight: 1, letterSpacing: '-4px' } }, profile.name),
          ),
          createElement(
            'div',
            {
              style: {
                width: 168,
                height: 168,
                borderRadius: 84,
                background: ogAccent,
                color: '#f7f5ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                fontWeight: 700,
              },
            },
            profile.name.split(' ').map(part => part[0]).slice(0, 2).join(''),
          ),
        ),
        createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 940 } },
          createElement('div', { style: { fontSize: 40, lineHeight: 1.24, color: profile.theme.muted } }, profile.summary),
          createElement('div', { style: { fontSize: 26, color: ogAccent } }, profile.seo.siteUrl.replace(/^https?:\/\//, '')),
        ),
      ),
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

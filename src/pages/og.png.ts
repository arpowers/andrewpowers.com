import type { APIRoute } from 'astro'
import { ImageResponse } from '@vercel/og'
import { createElement } from 'react'
import { profile } from '@/data/profile'

export const prerender = true

export const GET: APIRoute = async () => {
  return new ImageResponse(
    createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#f7f5ef',
          color: '#101114',
          padding: 72,
          border: '28px solid #ebe7dc',
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
            createElement('div', { style: { fontSize: 28, color: '#67645d' } }, profile.role),
            createElement('div', { style: { fontSize: 92, fontWeight: 700, lineHeight: 1 } }, profile.name),
          ),
          createElement(
            'div',
            {
              style: {
                width: 168,
                height: 168,
                borderRadius: 84,
                background: '#0f6b5f',
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
          createElement('div', { style: { fontSize: 42, lineHeight: 1.25, color: '#67645d' } }, profile.summary),
          createElement('div', { style: { fontSize: 26, color: '#0f6b5f' } }, profile.seo.siteUrl.replace(/^https?:\/\//, '')),
        ),
      ),
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

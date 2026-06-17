import type { APIRoute } from 'astro'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from '@vercel/og'
import { createElement } from 'react'
import { profile } from '@/data/profile'

export const prerender = true

export const GET: APIRoute = async () => {
  const avatar = await readFile(join(process.cwd(), 'public', profile.share.image.src.replace(/^\//, '')))
  const avatarSrc = `data:image/jpeg;base64,${avatar.toString('base64')}`
  const initials = profile.name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
  const summary = profile.share.image.summary ?? profile.summary.split('. ').slice(0, 2).join('. ')

  return new ImageResponse(
    createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#101114',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      },
      createElement('img', {
        src: avatarSrc,
        style: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        },
      }),
      createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(16,17,20,.24)',
          },
        },
      ),
      createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(0deg, rgba(16,17,20,.9) 0%, rgba(16,17,20,.72) 28%, rgba(16,17,20,.25) 62%, rgba(16,17,20,.08) 100%)',
          },
        },
      ),
      createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(16,17,20,.52) 0%, rgba(16,17,20,.22) 42%, rgba(16,17,20,0) 100%)',
          },
        },
      ),
      createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: 72,
            left: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: '-2.2px',
            color: 'rgba(255,255,255,.94)',
            textShadow: '0 3px 22px rgba(0,0,0,.46)',
          },
        },
        initials,
      ),
      createElement(
        'div',
        {
          style: {
            position: 'absolute',
            left: 72,
            right: 72,
            bottom: 92,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          },
        },
        createElement('div', {
          style: {
            fontSize: 84,
            fontWeight: 700,
            lineHeight: .98,
            letterSpacing: '-3.4px',
            maxWidth: 880,
            textShadow: '0 3px 28px rgba(0,0,0,.58)',
          },
        }, profile.name),
        createElement('div', {
          style: {
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.05,
            color: 'rgba(255,255,255,.86)',
            maxWidth: 930,
            textShadow: '0 3px 22px rgba(0,0,0,.64)',
          },
        }, summary),
      ),
    ),
    {
      width: 1200,
      height: 1200,
    },
  )
}

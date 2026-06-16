export interface SocialLink {
  label: string
  href: string
  icon: string
  primary?: boolean
}

export interface ProfileSite {
  name: string
  role: string
  location: string
  summary: string
  avatar: {
    src: string
    alt: string
  }
  videoAvatar?: {
    src: string
    poster?: string
    label: string
  }
  socialLinks: SocialLink[]
  theme: {
    ink: string
    paper: string
    paper2: string
    surface: string
    line: string
    muted: string
    accent: string
    accent2: string
  }
  seo: {
    siteUrl: string
    title: string
    description: string
    keywords: string[]
  }
}

export const profile: ProfileSite = {
  name: 'Andrew Powers',
  role: 'Founder & CEO at PageLines',
  location: 'San Francisco Bay Area',
  summary: 'I build AI agents for operations and sales.',
  avatar: {
    src: '/andrew-profile-poster.jpg',
    alt: 'Andrew Powers looking out a window',
  },
  videoAvatar: {
    src: '/andrew-profile.mp4',
    poster: '/andrew-profile-poster.jpg',
    label: 'Profile video of Andrew Powers',
  },
  socialLinks: [
    { label: 'Email', href: 'mailto:arpowers@gmail.com', icon: 'i-tabler-mail', primary: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arpowers', icon: 'i-tabler-brand-linkedin' },
    { label: 'Telegram', href: 'https://t.me/arpowers', icon: 'i-tabler-brand-telegram' },
    { label: 'PageLines', href: 'https://www.pagelines.com', icon: 'i-tabler-sparkles' },
  ],
  theme: {
    ink: '#0e171b',
    paper: '#f7fbfd',
    paper2: '#eef7fa',
    surface: '#ffffff',
    line: '#d7e5ea',
    muted: '#607078',
    accent: '#2f8193',
    accent2: '#78b8c4',
  },
  seo: {
    siteUrl: 'https://andrewpowers.com',
    title: 'Andrew Powers - Founder & CEO at PageLines',
    description: 'Andrew Powers is the founder and CEO of PageLines, building adaptive AI agents for enterprise work with experience across SaaS, AI, analytics, growth, and automation.',
    keywords: ['Andrew Powers', 'PageLines', 'adaptive AI agents', 'AI automation', 'SaaS founder', 'growth engineering'],
  },
}

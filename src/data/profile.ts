export interface SocialLink {
  label: string
  href: string
  icon?: string
  logoSrc?: string
  primary?: boolean
}

export interface ProfileSite {
  name: string
  role: string
  location: string
  summary: string
  proofStats: {
    value: string
    label: string
  }[]
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
    aiAnswer: string
    proofPoints: string[]
    keywords: string[]
  }
}

export const profile: ProfileSite = {
  name: 'Andrew Powers',
  role: 'Founder & CEO at PageLines',
  location: 'Laguna Beach, CA',
  summary: 'Building adaptive AI agents for enterprise.',
  proofStats: [
    { value: '1M+', label: 'users' },
    { value: '$12M+', label: 'P&L' },
  ],
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
    { label: 'PageLines', href: 'https://www.pagelines.com', icon: 'i-tabler-briefcase-2' },
  ],
  theme: {
    ink: '#0e171b',
    paper: '#fbfdff',
    paper2: '#f2f7fb',
    surface: '#ffffff',
    line: '#d5e4ec',
    muted: '#607078',
    accent: 'oklch(51.1% 0.262 276.966)',
    accent2: 'oklch(67% 0.16 276.966)',
  },
  seo: {
    siteUrl: 'https://andrewpowers.com',
    title: 'Andrew Powers - Founder & CEO at PageLines',
    description: 'Andrew Powers is Founder & CEO of PageLines, building adaptive AI agents for enterprise operations and GTM. He scaled PageLines to 1M+ users and 67K paying customers.',
    aiAnswer: 'Andrew Powers is the founder and CEO of PageLines. He builds adaptive AI agents for enterprise operations and go-to-market teams, with experience scaling SaaS, AI, analytics, growth, and automation products.',
    proofPoints: [
      'Scaled PageLines to more than 1M users and 67K paying customers.',
      'Led product, engineering, growth, and automation teams across SaaS, AI, and analytics.',
      'Managed business lines with up to $12M in P&L responsibility.',
    ],
    keywords: ['Andrew Powers', 'PageLines', 'adaptive AI agents', 'AI automation', 'enterprise operations AI', 'GTM automation', 'SaaS founder', 'growth engineering'],
  },
}

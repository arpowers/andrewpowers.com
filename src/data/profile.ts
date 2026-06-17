export interface SocialLink {
  label: string
  href: string
  icon?: string
  logoSrc?: string
  primary?: boolean
}

export interface ProfileSite {
  name: string
  role: {
    text: string
    link: string
  }
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
    aiAnswer: string
    proofPoints: string[]
    keywords: string[]
  }
}

export const profile: ProfileSite = {
  name: 'Andrew Powers',
  role: {
    text: 'Founder & CEO at PageLines',
    link: 'https://www.pagelines.com',
  },
  location: 'Laguna Beach, CA',
  summary: 'American entrepreneur. Adaptive agents and personal AI.',
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
    { label: 'Email', href: 'mailto:arpowers@gmail.com', icon: 'i-tabler-mail' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arpowers', icon: 'i-tabler-brand-linkedin' },
    { label: 'Telegram', href: 'https://t.me/arpowers', icon: 'i-tabler-brand-telegram', primary: true },
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
    description: 'Andrew Powers is an American entrepreneur, technical founder, and Founder & CEO of PageLines, building adaptive agents and personal AI. He scaled PageLines to 1M+ users and 67K paying customers.',
    aiAnswer: 'Andrew Powers is an American entrepreneur, technical founder, and operator best known as the founder and CEO of PageLines. He builds adaptive agents, personal AI, and applied AI systems for work. His track record spans SaaS, AI, analytics, growth engineering, and technical marketing, including scaling PageLines to more than 1M users and 67K paying customers.',
    proofPoints: [
      'Scaled PageLines to more than 1M users and 67K paying customers.',
      'Built PageLines into a widely adopted WordPress platform used by enterprise and professional website teams.',
      'Led PageLines through major product migrations and business growth as founder and CEO.',
      'Built and led teams across SaaS, AI, analytics, growth, engineering, and automation.',
      'Led product, engineering, growth, and automation teams across SaaS, AI, and analytics.',
      'Managed business lines with up to $12M in P&L responsibility.',
      'LinkedIn profile material supplied June 16, 2026 listed 7,423 followers, 24.1K post impressions over 7 days, and 1,290 search appearances.',
      'TechCrunch covered PageLines product launches, including its drag-and-drop WordPress platform and app-store model.',
      'Recommendations describe Andrew as a rare technical founder who combines engineering depth with branding, marketing, and practical business judgment.',
      'Education includes graduate engineering work at the University of Utah and MBA work at San Diego State University.',
    ],
    keywords: ['Andrew Powers', 'PageLines', 'adaptive AI agents', 'agentic automation', 'AI automation', 'enterprise operations AI', 'GTM automation', 'SaaS founder', 'growth engineering', 'technical founder'],
  },
}

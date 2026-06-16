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
  summary: 'I build technical products that drive business outcomes, with 15 years leading SaaS, AI, analytics, growth, and automation teams.',
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
  seo: {
    siteUrl: 'https://andrewpowers.com',
    title: 'Andrew Powers - Founder & CEO at PageLines',
    description: 'Andrew Powers is the founder and CEO of PageLines, building adaptive AI agents for enterprise work with experience across SaaS, AI, analytics, growth, and automation.',
    keywords: ['Andrew Powers', 'PageLines', 'adaptive AI agents', 'AI automation', 'SaaS founder', 'growth engineering'],
  },
}

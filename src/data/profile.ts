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
  name: 'Alex Morgan',
  role: 'Independent operator and systems advisor',
  location: 'San Francisco, CA',
  summary: 'I help small teams turn scattered workflows into calm, durable operating systems.',
  avatar: {
    src: '/avatar.svg',
    alt: 'Portrait illustration of Alex Morgan',
  },
  socialLinks: [
    { label: 'Email', href: 'mailto:hello@example.com', icon: 'i-tabler-mail', primary: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'i-tabler-brand-linkedin' },
    { label: 'Newsletter', href: '/blog', icon: 'i-tabler-news' },
  ],
  seo: {
    siteUrl: 'https://example.com',
    title: 'Alex Morgan - Independent operator and systems advisor',
    description: 'Profile site for Alex Morgan, an independent operator helping founder-led teams design durable systems and sharper workflows.',
    keywords: ['operator', 'systems advisor', 'automation consultant', 'founder support'],
  },
}

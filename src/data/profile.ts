export interface SocialLink {
  label: string
  href: string
}

export interface ProfileSite {
  name: string
  role: string
  location: string
  summary: string
  about: string
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
  about: 'Alex Morgan works with founder-led teams that need better systems without losing their human edge. The work spans strategy, automation, editorial operations, and the connective tissue between tools, people, and decisions.',
  avatar: {
    src: '/avatar.svg',
    alt: 'Portrait illustration of Alex Morgan',
  },
  socialLinks: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Newsletter', href: '/blog' },
  ],
  seo: {
    siteUrl: 'https://example.com',
    title: 'Alex Morgan - Independent operator and systems advisor',
    description: 'Profile site for Alex Morgan, an independent operator helping founder-led teams design durable systems and sharper workflows.',
    keywords: ['operator', 'systems advisor', 'automation consultant', 'founder support'],
  },
}

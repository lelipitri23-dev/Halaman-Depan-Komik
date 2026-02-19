// config.js
export const SITE_CONFIG = {
  // PERBAIKAN DI SINI: Gunakan NEXT_PUBLIC_SITE_NAME
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'komikcast',
  
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Komikcast adalah situs baca komik, baca manga, baca manhua, dan baca manhwa terpopuler dalam Bahasa Indonesia..',
  keywords: (process.env.NEXT_PUBLIC_SITE_KEYWORDS || 'komikcast, komik online, komikcast to, komiku, manga, manhwa').split(', '),
  
  socials: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || '#',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#',
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || '#',
    discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD || '#',
  }
};
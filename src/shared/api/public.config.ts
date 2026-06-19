export const PUBLIC_REVALIDATE_SECONDS = 60;

export const PUBLIC_API_PATHS = {
  SITE_SETTINGS: '/site-settings',
  BRANDS: '/brands',
  BRAND_BY_SLUG: (slug: string) => `/brands/${encodeURIComponent(slug)}`,
  HISTORY: '/history',
  LEADERSHIP: '/leadership',
  TEAM: '/team',
  NEWS: '/news',
  NEWS_BY_SLUG: (slug: string) => `/news/${encodeURIComponent(slug)}`,
  CONTACT: '/contact',
  NAVIGATION: '/navigation',
} as const;

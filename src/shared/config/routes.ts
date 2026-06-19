export const PUBLIC_ROUTES = {
  HOME: '/',
  /** @deprecated Use NEWS instead */
  BLOG: '/news',
  ABOUT: '/about/us',
  ABOUT_HISTORY: '/about/history',
  ABOUT_LEADERSHIP: '/about/leadership',
  ABOUT_TEAM: '/about/team',
  BRANDS: '/brands',
  BRAND: (slug: string) => `/brands/${slug}`,
  NEWS: '/news',
  NEWS_POST: (slug: string) => `/news/${slug}`,
  CONTACT: '/contact',
  /** @deprecated Legacy portfolio URL — redirects to brands via proxy */
  PROJECTS: '/brands',
  PROJECT: (slug: string) => `/brands/${slug}`,
  /** @deprecated Legacy pricing URL — redirects to contact via proxy */
  PRICING: '/contact',
  BLOG_POST: (slug: string) => `/news/${slug}`,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/sign-in',
  OAUTH_CALLBACK: '/oauth/callback',
  DASHBOARD: '/dashboard',
  SECURITY: '/dashboard/security',
  USERS: '/dashboard/users',
  ROLES: '/dashboard/roles',
  PERMISSIONS: '/dashboard/permissions',
  BRANDS: '/dashboard/brands',
  HISTORY: '/dashboard/history',
  LEADERSHIP: '/dashboard/leadership',
  TEAM: '/dashboard/team',
  SITE_SETTINGS: '/dashboard/site-settings',
  CONTACT_MESSAGES: '/dashboard/contact-messages',
  NEWS: '/dashboard/news',
  NAVIGATION: '/dashboard/navigation',
  AUDIT_LOGS: '/dashboard/audit-logs',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/sign-in',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  ROLES: '/dashboard/roles',
  PERMISSIONS: '/dashboard/permissions',
  PROJECTS: '/dashboard/projects',
  SKILLS: '/dashboard/skills',
  EXPERIENCES: '/dashboard/experiences',
  SITE_SETTINGS: '/dashboard/site-settings',
  CONTACT_MESSAGES: '/dashboard/contact-messages',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

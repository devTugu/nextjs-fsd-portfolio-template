export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  ROLES: {
    LIST: '/roles',
    BY_ID: (id: number) => `/roles/${id}`,
    ASSIGN: '/roles/assign',
    UNASSIGN: (userId: number, roleId: number) =>
      `/roles/assign/${userId}/${roleId}`,
  },
  PERMISSIONS: {
    LIST: '/permissions',
    BY_ID: (id: number) => `/permissions/${id}`,
  },
  PROJECTS: {
    LIST: '/admin/projects',
    BY_ID: (id: number) => `/admin/projects/${id}`,
  },
  SKILLS: {
    LIST: '/admin/skills',
    BY_ID: (id: number) => `/admin/skills/${id}`,
  },
  EXPERIENCES: {
    LIST: '/admin/experiences',
    BY_ID: (id: number) => `/admin/experiences/${id}`,
  },
  SITE_SETTINGS: {
    GET: '/admin/site-settings',
    PATCH: '/admin/site-settings',
  },
  CONTACT_MESSAGES: {
    LIST: '/admin/contact-messages',
    BY_ID: (id: number) => `/admin/contact-messages/${id}`,
  },
  MEDIA: {
    UPLOAD: '/admin/media/upload',
  },
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
  },
} as const;

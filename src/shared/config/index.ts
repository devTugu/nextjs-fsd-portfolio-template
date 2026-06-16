import { env } from './env';

export const APP_CONFIG = {
  API_BASE_URL: env.API_BASE_URL,
  APP_NAME: env.APP_NAME,
} as const;

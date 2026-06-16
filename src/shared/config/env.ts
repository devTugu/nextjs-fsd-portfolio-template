import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Admin Console'),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
});

const serverEnvSchema = z.object({
  API_INTERNAL_URL: z
    .string()
    .url()
    .refine((url) => url.endsWith('/api/v1'), {
      message: 'API_INTERNAL_URL must end with /api/v1',
    }),
});

const parsedClient = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'Admin Console',
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsedClient.success && process.env.NODE_ENV === 'production') {
  console.error('Invalid client environment variables:', parsedClient.error.flatten());
}

/** Client-safe configuration — browser traffic goes through the BFF proxy. */
export const env = {
  API_BASE_URL: '/api/backend',
  APP_NAME: parsedClient.success
    ? parsedClient.data.NEXT_PUBLIC_APP_NAME
    : 'Admin Console',
  APP_ENV: process.env.NODE_ENV ?? 'development',
} as const;

function resolveInternalUrl(): string {
  const fallback = 'http://localhost:5001/api/v1';
  const raw = process.env.API_INTERNAL_URL ?? fallback;
  const parsed = serverEnvSchema.safeParse({ API_INTERNAL_URL: raw });

  if (!parsed.success && process.env.NODE_ENV === 'production') {
    console.error('Invalid server environment variables:', parsed.error.flatten());
    return fallback;
  }

  return parsed.success ? parsed.data.API_INTERNAL_URL : raw;
}

/** Server-only configuration for BFF route handlers. */
export const serverEnv = {
  get API_INTERNAL_URL(): string {
    return resolveInternalUrl();
  },
} as const;

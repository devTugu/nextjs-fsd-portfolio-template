import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { ROUTES } from '@/shared/config/routes';
import { sessionHint } from '@/shared/lib/session-hint';
import type { ApiEnvelope, ApiErrorEnvelope } from './types';
import { getErrorMessage } from './errorHandler';

let refreshPromise: Promise<boolean> | null = null;

const redirectToLogin = (): void => {
  sessionHint.clear();
  if (typeof window !== 'undefined') {
    void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    const path = window.location.pathname;
    if (!path.startsWith(ROUTES.LOGIN)) {
      window.location.href = ROUTES.LOGIN;
    }
  }
};

const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      redirectToLogin();
      return false;
    }

    const envelope = (await response.json()) as ApiEnvelope<{ expiresIn: number }>;
    sessionHint.updateExpiresAt(envelope.data.expiresIn);
    return true;
  } catch {
    redirectToLogin();
    return false;
  }
};

export const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.headers && !config.headers['x-request-id']) {
      config.headers['x-request-id'] = crypto.randomUUID();
    }
    return config;
  });
};

export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorEnvelope>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 403 && typeof window !== 'undefined') {
        const { toast } = await import('sonner');
        const message = getErrorMessage(error);
        const match = message.match(/Required permissions:\s*(.+)/i);
        toast.error(
          match
            ? `You need permission: ${match[1].trim()}`
            : message,
        );
      }

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes('/api/auth/')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshed = await refreshPromise;
      if (!refreshed) {
        return Promise.reject(error);
      }

      return instance(originalRequest);
    }
  );
};

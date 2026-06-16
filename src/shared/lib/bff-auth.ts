import type { ApiEnvelope, ApiErrorEnvelope } from '@/shared/api/types';

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
  return response.json() as Promise<ApiEnvelope<T>>;
}

function throwBffError(response: Response, envelope: ApiErrorEnvelope): never {
  const message =
    typeof envelope.error.message === 'string'
      ? envelope.error.message
      : 'Request failed';
  const error = new Error(message) as Error & { status?: number; code?: string };
  error.status = response.status;
  error.code = envelope.error.code;
  throw error;
}

export async function bffLogin(
  data: { email: string; password: string }
): Promise<{ expiresIn: number }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  const envelope = await parseJson<{ expiresIn: number }>(response);
  if (!response.ok) {
    throwBffError(response, envelope as unknown as ApiErrorEnvelope);
  }

  return envelope.data;
}

export async function bffLogout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function bffMe<T>(): Promise<T> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  const envelope = await parseJson<T>(response);
  if (!response.ok) {
    throwBffError(response, envelope as unknown as ApiErrorEnvelope);
  }

  return envelope.data;
}

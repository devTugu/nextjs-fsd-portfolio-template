import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAMES,
  clearAuthCookies,
  setAuthCookies,
} from '@/shared/lib/auth-cookies';
import { fetchInternal, parseInternalJson } from '@/shared/lib/internal-api';
import type { TokenPair } from '@/shared/api/types';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    const response = NextResponse.json(
      {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing refresh token' },
      },
      { status: 401 }
    );
    return clearAuthCookies(response);
  }

  const upstream = await fetchInternal('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const envelope = await parseInternalJson<TokenPair>(upstream);

  if (!upstream.ok) {
    const response = NextResponse.json(envelope, { status: upstream.status });
    return clearAuthCookies(response);
  }

  const response = NextResponse.json({
    success: true,
    data: { expiresIn: envelope.data.expiresIn },
  });

  return setAuthCookies(response, envelope.data);
}

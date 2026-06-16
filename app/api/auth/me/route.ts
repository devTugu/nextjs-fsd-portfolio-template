import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAMES } from '@/shared/lib/auth-cookies';
import { fetchInternal } from '@/shared/lib/internal-api';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      },
      { status: 401 }
    );
  }

  const upstream = await fetchInternal('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}

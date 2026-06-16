import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/shared/lib/auth-cookies';
import { fetchInternal, parseInternalJson } from '@/shared/lib/internal-api';
import type { TokenPair } from '@/shared/api/types';

export async function POST(request: NextRequest) {
  const body = await request.text();

  const upstream = await fetchInternal('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const envelope = await parseInternalJson<TokenPair>(upstream);

  if (!upstream.ok) {
    return NextResponse.json(envelope, { status: upstream.status });
  }

  const response = NextResponse.json({
    success: true,
    data: { expiresIn: envelope.data.expiresIn },
  });

  return setAuthCookies(response, envelope.data);
}

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAMES } from '@/shared/lib/auth-cookies';
import { fetchInternal } from '@/shared/lib/internal-api';

const FORWARD_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'x-request-id',
] as const;

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function buildUpstreamPath(segments: string[]): string {
  return `/${segments.join('/')}`;
}

async function readRequestBody(request: NextRequest): Promise<BodyInit | undefined> {
  if (!MUTATING_METHODS.has(request.method)) {
    return undefined;
  }

  return request.arrayBuffer();
}

export async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  const upstreamPath = buildUpstreamPath(pathSegments);
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;

  const headers = new Headers();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const body = await readRequestBody(request);

  const upstream = await fetchInternal(upstreamPath, {
    method: request.method,
    headers,
    body,
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

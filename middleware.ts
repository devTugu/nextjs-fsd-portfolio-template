import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAMES } from '@/shared/lib/auth-cookies';

const LOGIN = '/sign-in';
const DASHBOARD = '/dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(AUTH_COOKIE_NAMES.SESSION)?.value === '1';

  const isProtected = pathname.startsWith(DASHBOARD);
  const isAuthRoute = pathname.startsWith(LOGIN);

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL(LOGIN, request.url));
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL(DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard', '/sign-in'],
};

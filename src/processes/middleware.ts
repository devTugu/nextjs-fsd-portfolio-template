import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/shared/config/routes';
import { AUTH_COOKIE_NAMES } from '@/shared/lib/auth-cookies';

const PROTECTED_PREFIX = ROUTES.DASHBOARD;
const AUTH_ROUTES = [ROUTES.LOGIN];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession =
    request.cookies.get(AUTH_COOKIE_NAMES.SESSION)?.value === '1';

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in'],
};

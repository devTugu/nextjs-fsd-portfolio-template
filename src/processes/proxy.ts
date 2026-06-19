import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES, ROUTES } from '@/shared/config/routes';
import { AUTH_COOKIE_NAMES } from '@/shared/lib/auth-cookies';

const PROTECTED_PREFIX = ROUTES.DASHBOARD;
const AUTH_ROUTES = [ROUTES.LOGIN];

export function createProxyHandler() {
  return function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
      const target = pathname.replace(/^\/blog/, '/news');
      return NextResponse.redirect(new URL(target, request.url), 308);
    }

    if (pathname === '/projects' || pathname.startsWith('/projects/')) {
      const target = pathname.replace(/^\/projects/, '/brands');
      return NextResponse.redirect(new URL(target, request.url), 308);
    }

    if (pathname === '/pricing') {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES.CONTACT, request.url), 308);
    }

    const hasSessionHint =
      request.cookies.get(AUTH_COOKIE_NAMES.SESSION)?.value === '1';
    const hasRefreshToken = Boolean(
      request.cookies.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value,
    );
    const hasSession = hasSessionHint && hasRefreshToken;

    const isProtected = pathname.startsWith(PROTECTED_PREFIX);
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (isProtected && !hasSession) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    if (isAuthRoute && hasSession) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }

    return NextResponse.next();
  };
}

export const proxy = createProxyHandler();

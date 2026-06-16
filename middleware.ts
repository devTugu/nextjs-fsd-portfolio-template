import { middleware } from '@/processes/middleware';

export { middleware };

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard', '/sign-in'],
};

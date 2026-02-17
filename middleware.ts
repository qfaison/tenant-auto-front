import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'tenant-dashboard-auth';
const LOGIN_PATH = '/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value === '1';

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(hasAuthCookie ? '/tenant/list' : LOGIN_PATH, request.url));
  }

  if (pathname.startsWith('/login')) {
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL('/tenant/list', request.url));
    }
    return NextResponse.next();
  }

  if (!hasAuthCookie) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/tenant/:path*'],
};

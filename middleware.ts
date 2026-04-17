import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'bolder-vibes-auth-status';

const PUBLIC_PATHS = ['/', '/login', '/register', '/terms', '/privacy'];
const AUTH_PATHS = ['/login', '/register'];
const PROTECTED_PREFIXES = ['/dashboard', '/project'];
const ADMIN_PREFIXES = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === '1';

  // Authenticated users on auth pages → redirect to dashboard
  if (isAuthenticated && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated users on protected pages → redirect to login
  const isProtected =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

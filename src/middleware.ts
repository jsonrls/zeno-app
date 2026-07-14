import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if maintenance mode is enabled via environment variable
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    // Allow access to maintenance page and static assets
    if (pathname === '/maintenance' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/icons') ||
        pathname.startsWith('/manifest') ||
        pathname.startsWith('/images') ||
        pathname === '/og' ||
        pathname.startsWith('/sw-custom') ||
        pathname.startsWith('/logo')) {
      return NextResponse.next();
    }

    // Redirect all other requests to maintenance page
    const response = NextResponse.redirect(new URL('/maintenance', request.url));
    response.headers.set('X-Robots-Tag', 'noindex');
    return response;
  }

  const nonIndexablePaths = [
    '/api/',
    '/create-group',
    '/dashboard',
    '/forgot-password',
    '/groups',
    '/login',
    '/maintenance',
    '/my-groups',
    '/offline',
    '/profile',
    '/report-problem',
    '/reset-password',
    '/security-demo',
    '/signup',
  ];
  const response = NextResponse.next();

  if (nonIndexablePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    response.headers.set('X-Robots-Tag', 'noindex');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

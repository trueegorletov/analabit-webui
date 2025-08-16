import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals and assets to pass
  if (pathname.startsWith('/_next') || /\.[\w]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Protect /dev routes in non-dev mode
  if (pathname.startsWith('/dev/')) {
    const isDevMode =
      process.env.NEXT_PUBLIC_DEV_MODE === 'true' &&
      process.env.NEXT_PUBLIC_API_BASE_URL === 'http://localhost:8080/v1';
    if (!isDevMode) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Off-season: redirect everything to root
  const OFFSEASON =
    process.env.NEXT_PUBLIC_OFFSEASON_STUB === '1' ||
    process.env.NEXT_PUBLIC_OFFSEASON_STUB === 'true';
  if (OFFSEASON && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|_vercel).*)'],
};
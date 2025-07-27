import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect development routes in production
 * Blocks access to /dev/* routes when NEXT_PUBLIC_DEV_MODE is not 'true'
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a development route
  if (pathname.startsWith('/dev/')) {
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' && process.env.NEXT_PUBLIC_API_BASE_URL === `http://localhost:8080/v1`;
    
    if (!isDevMode) {
      // Return 404 for dev routes in production
      return new NextResponse(null, { status: 404 });
    }
  }
  
  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    // Match all dev routes
    '/dev/:path*',
    // You can add other protected routes here
  ],
};
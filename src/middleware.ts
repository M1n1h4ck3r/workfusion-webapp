import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Intercept problematic routes that cause Html import errors
  const url = request.nextUrl.clone()
  
  // Redirect problematic paths to custom handlers
  if (url.pathname === '/404' || url.pathname === '/_error') {
    url.pathname = '/not-found'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
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
}
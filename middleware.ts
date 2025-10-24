import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware running!');
  const userId = request.headers.get('userId')
  console.log('Middleware triggered for:', request.url, 'userId:', userId)

  if (!userId) {
    console.log('No userId found, redirecting to /404')
    return NextResponse.redirect(new URL('/404', request.url))
  }

  console.log('UserId found:', userId, 'allowing access')
  const response = NextResponse.next()

  return response
}

export const config = {
  matcher: [
    
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ]
}
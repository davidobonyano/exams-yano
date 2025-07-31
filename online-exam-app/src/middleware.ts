import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Handle Supabase auth
  const response = await updateSession(request)
  
  const url = request.nextUrl.clone()
  
  // Define protected routes
  const protectedRoutes = {
    student: ['/exam'],
    teacher: ['/teacher'],
    admin: ['/admin']
  }
  
  // Public routes that don't need authentication
  const publicRoutes = ['/', '/login', '/student-login']
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    url.pathname === route || url.pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    return response
  }
  
  // For now, allow all requests - we'll implement proper auth checks later
  // when we have the user roles set up in Supabase
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
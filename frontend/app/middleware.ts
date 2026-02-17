import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64').toString()
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  const isLoginPage = pathname.startsWith('/login')
  const isApiAuth = pathname.startsWith('/api/auth')

  // 🚫 No token
  if (!token && !isLoginPage && !isApiAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Has token → decode
  if (token) {
    const payload = parseJwt(token)

    // ❌ Invalid token
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('access_token')
      return response
    }

    // ⏳ Expired token
    const now = Date.now() / 1000
    if (payload.exp && payload.exp < now) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('access_token')
      return response
    }

    // 🔁 If already logged in → block login page
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    const role = payload.role

    // 🔐 ROLE PROTECTION
    if (pathname.startsWith('/dashboard/managers') && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/dashboard/zookeepers') && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/dashboard/cages') && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/dashboard/animals') && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}

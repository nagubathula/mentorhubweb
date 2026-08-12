import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseCredentials } from '@/lib/supabase/env'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const { url, key, isValid } = getSupabaseCredentials()

  const { pathname } = request.nextUrl
  const isAdminAuth = pathname === '/admin/login' || pathname === '/admin/signup'
  const isAdminRoute = pathname.startsWith('/admin') && !isAdminAuth
  const hasAdminSession = request.cookies.get('admin_session')?.value === 'true'

  if (!isValid) {
    if (isAdminRoute && !hasAdminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isAdminAuth && hasAdminSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookieOptions: {
        maxAge: 365 * 24 * 60 * 60,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge: 365 * 24 * 60 * 60, // 1 year cookie persistence
            })
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (isAdminRoute && !user && !hasAdminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAdminAuth && (user || hasAdminSession)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

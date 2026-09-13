import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'


export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'kurir' || profile?.role === 'teknisi') {
      return NextResponse.redirect(new URL('/login?error=no_access', request.url))
    }

    if (profile?.role === 'staff_gudang') {
      const allowed = ['/admin/stok', '/admin/produk']
      const isAllowed = allowed.some((p) => request.nextUrl.pathname.startsWith(p))
      if (request.nextUrl.pathname.startsWith('/admin') && !isAllowed) {
        return NextResponse.redirect(new URL('/admin/stok/opname', request.url))
      }
    }

    if (profile?.role === 'sales') {
      const allowed = ['/admin/sales']
      const isAllowed = allowed.some((p) => request.nextUrl.pathname.startsWith(p))
      if (request.nextUrl.pathname.startsWith('/admin') && !isAllowed) {
        return NextResponse.redirect(new URL('/admin/sales', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Wenn der User nicht eingeloggt ist und nicht auf der Login-Seite oder Auth-Seite
  if (!user && !pathname.startsWith('/signIn') && !pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/signIn'
    return NextResponse.redirect(url)
  }

  // Wenn der User eingeloggt ist und auf der Startseite oder Login-Seite ist, dann zu /event weiterleiten
  if (user && (pathname === '/' || pathname.startsWith('/signIn'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/event'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

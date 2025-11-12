import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow internal routes to pass through without auth checks
  if (
    path.startsWith("/_next") ||
    path.startsWith("/_vercel") ||
    path.startsWith("/api") ||
    path.includes(".") // Static files like .ico, .png, etc.
  ) {
    return NextResponse.next()
  }

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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: getUser() must be called to refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !path.startsWith("/login") &&
    !path.startsWith("/signup") &&
    !path.startsWith("/auth") &&
    !path.startsWith("/terms") &&
    !path.startsWith("/privacy") &&
    !path.startsWith("/courses") &&
    !path.startsWith("/profiles") &&
    !path.startsWith("/demo") &&
    path !== "/"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

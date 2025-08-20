import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: Request) {
  console.log("[Auth Callback] Starting callback processing...")

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/add-grave"

  console.log("[Auth Callback] Code present:", !!code)
  console.log("[Auth Callback] Next parameter:", next)
  console.log("[Auth Callback] Origin:", origin)

  if (code) {
    try {
      console.log("[Auth Callback] Creating Supabase client...")
      const supabase = createClient()

      console.log("[Auth Callback] Exchanging code for session...")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[Auth Callback] Error exchanging code:", error.message)
        return NextResponse.redirect(`${origin}/auth?error=callback_error&message=${encodeURIComponent(error.message)}`)
      }

      if (data.session) {
        console.log("[Auth Callback] Session created successfully for user:", data.session.user.email)

        // Ensure next is a relative path for security
        let redirectPath = next
        if (!redirectPath.startsWith("/")) {
          redirectPath = "/add-grave"
        }

        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalEnv = process.env.NODE_ENV === "development"

        if (isLocalEnv) {
          console.log("[Auth Callback] Redirecting to:", `${origin}${redirectPath}`)
          return NextResponse.redirect(`${origin}${redirectPath}`)
        } else if (forwardedHost) {
          console.log("[Auth Callback] Redirecting to:", `https://${forwardedHost}${redirectPath}`)
          return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
        } else {
          console.log("[Auth Callback] Redirecting to:", `${origin}${redirectPath}`)
          return NextResponse.redirect(`${origin}${redirectPath}`)
        }
      } else {
        console.error("[Auth Callback] No session created despite successful code exchange")
        return NextResponse.redirect(`${origin}/auth?error=no_session`)
      }
    } catch (error: any) {
      console.error("[Auth Callback] Unexpected error:", error.message)
      return NextResponse.redirect(`${origin}/auth?error=unexpected_error&message=${encodeURIComponent(error.message)}`)
    }
  } else {
    console.error("[Auth Callback] No code parameter found in callback URL")
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }
}

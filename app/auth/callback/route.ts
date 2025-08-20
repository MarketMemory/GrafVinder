import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  console.log("[AUTH CALLBACK] Processing callback with code:", code ? "present" : "missing")
  console.log("[AUTH CALLBACK] Next parameter:", next)

  if (code) {
    const supabase = createClient()

    try {
      console.log("[AUTH CALLBACK] Exchanging code for session")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[AUTH CALLBACK] Error exchanging code:", error.message)
        return NextResponse.redirect(`${origin}/auth?error=callback_error`)
      }

      console.log("[AUTH CALLBACK] Session established successfully")
      console.log("[AUTH CALLBACK] Redirecting to:", next)

      // Successful authentication, redirect to the next page
      return NextResponse.redirect(`${origin}${next}`)
    } catch (error) {
      console.error("[AUTH CALLBACK] Unexpected error:", error)
      return NextResponse.redirect(`${origin}/auth?error=unexpected_error`)
    }
  } else {
    console.error("[AUTH CALLBACK] No code parameter found")
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }
}

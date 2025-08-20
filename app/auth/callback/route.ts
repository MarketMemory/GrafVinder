import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[AUTH CALLBACK] Starting callback process")

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/add-grave"

  console.log("[AUTH CALLBACK] Code received:", !!code)
  console.log("[AUTH CALLBACK] Next parameter:", next)

  if (code) {
    const supabase = createClient()

    try {
      console.log("[AUTH CALLBACK] Exchanging code for session")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[AUTH CALLBACK] Error exchanging code:", error)
        return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
      }

      console.log("[AUTH CALLBACK] Session created successfully for user:", data.user?.email)

      // Successful authentication, redirect to the next page
      return NextResponse.redirect(`${origin}${next}`)
    } catch (error) {
      console.error("[AUTH CALLBACK] Unexpected error:", error)
      return NextResponse.redirect(`${origin}/auth?error=Authentication failed`)
    }
  } else {
    console.error("[AUTH CALLBACK] No code parameter found")
    return NextResponse.redirect(`${origin}/auth?error=No authentication code provided`)
  }
}

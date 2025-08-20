import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[DEBUG] Auth callback route hit")

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  console.log("[DEBUG] Code parameter:", code ? "present" : "missing")
  console.log("[DEBUG] Next parameter:", next)

  if (code) {
    const supabase = createClient()

    try {
      console.log("[DEBUG] Exchanging code for session...")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[ERROR] Failed to exchange code for session:", error)
        return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
      }

      console.log("[DEBUG] Session exchange successful, user:", data.user?.email)

      // Successful authentication, redirect to the next URL
      const redirectUrl = `${origin}${next}`
      console.log("[DEBUG] Redirecting to:", redirectUrl)

      return NextResponse.redirect(redirectUrl)
    } catch (error) {
      console.error("[ERROR] Exception during auth callback:", error)
      return NextResponse.redirect(`${origin}/auth?error=Authentication failed`)
    }
  } else {
    console.error("[ERROR] No code parameter found in callback")
    return NextResponse.redirect(`${origin}/auth?error=No authentication code provided`)
  }
}

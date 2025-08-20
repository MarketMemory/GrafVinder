import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Deze route handelt de callback af na e-mailverificatie van Supabase.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/add-grave"

  console.log("[AUTH CALLBACK] Code ontvangen:", !!code)
  console.log("[AUTH CALLBACK] Next parameter:", next)

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[AUTH CALLBACK] Fout bij uitwisselen code:", error.message)
        return NextResponse.redirect(new URL("/auth?error=callback_error", origin))
      }

      console.log("[AUTH CALLBACK] Succesvol ingelogd:", data.user?.email)

      // Succesvol ingelogd, redirect naar de gewenste pagina
      return NextResponse.redirect(new URL(next, origin))
    } catch (error) {
      console.error("[AUTH CALLBACK] Onverwachte fout:", error)
      return NextResponse.redirect(new URL("/auth?error=unexpected_error", origin))
    }
  }

  console.log("[AUTH CALLBACK] Geen code ontvangen, redirect naar auth")
  // Als er geen code is, redirect naar de authenticatiepagina
  return NextResponse.redirect(new URL("/auth?error=no_code", origin))
}

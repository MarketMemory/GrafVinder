import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Deze route handelt de callback af na e-mailverificatie van Supabase.
// Het is een Server Action/Route Handler.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient() // Gebruik de server client

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Succesvol ingelogd, redirect naar de homepage of een dashboard
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Als er een fout is of geen code, redirect naar de authenticatiepagina
  return NextResponse.redirect(new URL("/auth", request.url))
}

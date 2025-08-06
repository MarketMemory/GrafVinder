import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Deze route handelt de callback af na e-mailverificatie van Supabase.
// Het is een Server Action/Route Handler.
export async function GET(request: Request) {
const { searchParams } = new URL(request.url)
const code = searchParams.get("code")

console.log("[Auth Callback] Ontvangen verzoek voor code uitwisseling.")

if (code) {
const cookieStore = cookies()
const supabase = createServerClient()

console.log(`[Auth Callback] Poging tot uitwisseling code: ${code.substring(0, 10)}...`)
const { error } = await supabase.auth.exchangeCodeForSession(code)

if (!error) {
  console.log("[Auth Callback] Code succesvol uitgewisseld voor sessie. Doorsturen naar /my-graves.")
  // Stuur direct door naar Mijn Graven na succesvolle login
  return NextResponse.redirect(new URL("/my-graves", request.url))
} else {
  console.error("[Auth Callback] Fout bij uitwisseling code:", error.message)
  // Log de volledige fout voor meer details
  console.error("[Auth Callback] Fout details:", JSON.stringify(error, null, 2))
}
} else {
console.warn("[Auth Callback] Geen 'code' parameter gevonden in de URL.")
}

console.log("[Auth Callback] Doorsturen naar /auth (fout of geen code).")
return NextResponse.redirect(new URL("/auth", request.url))
}

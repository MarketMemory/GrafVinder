import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { createClient as createSupabaseBrowserClient, type SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Singleton instance voor de browser client
let supabaseInstance: SupabaseClient<Database> | null = null

// Functie om een Supabase client te maken voor Server Components en Server Actions
// Deze client beheert de sessie via Next.js cookies.
export const createClient = () => {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[Server Supabase Client] Checking environment variables...")
  console.log(`[Server Supabase Client] NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "Set" : "Not Set"}`)
  console.log(`[Server Supabase Client] NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "Set" : "Not Set"}`)

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage =
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for server-side Supabase client. Please ensure these are set in your Vercel project environment variables."
    console.error(`[Server Supabase Client] ERROR: ${errorMessage}`)
    throw new Error(errorMessage)
  }

  try {
    const client = createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Server Action.
            // This error is safe to ignore if you're only calling `cookies().set()` in a Server Action
            // or Server Component.
            console.warn("[Server Supabase Client] Error setting cookie:", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Server Action.
            // This error is safe to ignore if you're only calling `cookies().set()` in a Server Action
            // or Server Component.
            console.warn("[Server Supabase Client] Error removing cookie:", error)
          }
        },
      },
    })
    console.log("[Server Supabase Client] Server Supabase client created successfully.")
    return client
  } catch (e) {
    console.error("[Server Supabase Client] Error creating server Supabase client:", e)
    throw e // Re-throw the error if client creation itself fails
  }
}

// Functie om een Supabase client te maken voor Client Components
// Deze client werkt direct in de browser.
export const createBrowserClient = (): SupabaseClient<Database> | null => {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Supabase niet geconfigureerd: zet NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in je .env.local",
      )
    }
    return null
  }

  // Create and store the singleton instance
  supabaseInstance = createSupabaseBrowserClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

// Alias - handig voor bestaande imports in Server Components
export { createClient as createServerClient }

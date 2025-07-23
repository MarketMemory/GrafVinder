import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { createClient as createSupabaseBrowserClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Functie om een Supabase client te maken voor Server Components en Server Actions
// Deze client beheert de sessie via Next.js cookies.
export const createClient = () => {
  const cookieStore = cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Server Action.
            // This error is safe to ignore if you're only calling `cookies().set()` in a Server Action
            // or Server Component.
          }
        },
      },
    },
  )
}

// Functie om een Supabase client te maken voor Client Components
// Deze client werkt direct in de browser.
export const createBrowserClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables for browser client.")
  }
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

// Alias - handig voor bestaande imports in Server Components
export { createClient as createServerClient }

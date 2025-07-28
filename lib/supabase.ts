import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { createClient as createSupabaseBrowserClient, type SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Singleton instance voor de browser client
let supabaseInstance: SupabaseClient<Database> | null = null

// Functie om een Supabase client te maken voor Server Components en Server Actions
// Deze client beheert de sessie via Next.js cookies.
export const createClient = () => {
  console.log("[Server Supabase Client] Starting createClient function.")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage =
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for server-side Supabase client."
    console.error(`[Server Supabase Client] ERROR: ${errorMessage}`)
    throw new Error(errorMessage) // Throw early if env vars are missing
  }

  let cookieStore: ReturnType<typeof cookies>
  try {
    console.log("[Server Supabase Client] Attempting to call cookies() from next/headers...")
    cookieStore = cookies()
    console.log(
      `[Server Supabase Client] cookies() call completed. cookieStore is: ${cookieStore ? "Defined" : "Undefined/Null"}`,
    )

    if (cookieStore) {
      console.log(`[Server Supabase Client] Type of cookieStore: ${typeof cookieStore}`)
      console.log(`[Server Supabase Client] cookieStore.get is function: ${typeof cookieStore.get === "function"}`)
      console.log(`[Server Supabase Client] cookieStore.set is function: ${typeof cookieStore.set === "function"}`)
      console.log(
        `[Server Supabase Client] cookieStore.remove is function: ${typeof cookieStore.remove === "function"}`,
      )
    } else {
      console.error("[Server Supabase Client] CRITICAL: cookieStore is null after calling cookies().")
    }
  } catch (e: any) {
    console.error(`[Server Supabase Client] ERROR calling cookies() from next/headers: ${e.message}. Stack: ${e.stack}`)
    throw new Error(`Failed to get cookie store: ${e.message}`)
  }

  if (!cookieStore || typeof cookieStore.get !== "function") {
    const errorDetail = `cookieStore is ${cookieStore === null ? "null" : "undefined"} or cookieStore.get is not a function (type: ${typeof cookieStore?.get}).`
    console.error(`[Server Supabase Client] CRITICAL ERROR: Invalid cookieStore. ${errorDetail}`)
    throw new Error(`Invalid cookie store from next/headers: ${errorDetail}`)
  }

  console.log("[Server Supabase Client] cookieStore.get is a function. Proceeding to create Supabase client.")

  try {
    const client = createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          // This 'get' method is called by Supabase internally.
          // The error "Cannot read properties of null (reading 'get')" suggests 'cookieStore' itself is null here.
          // Let's add a defensive check here too, though the outer one should catch it.
          if (!cookieStore) {
            console.error(`[Server Supabase Client] ERROR: cookieStore is null inside get('${name}') method.`)
            return undefined // Or throw, depending on desired behavior
          }
          const value = cookieStore.get(name)?.value
          console.log(`[Server Supabase Client] Cookie get('${name}'): ${value ? "Found" : "Not Found"}`)
          return value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
            console.log(`[Server Supabase Client] Cookie set('${name}'): Success`)
          } catch (error) {
            console.warn("[Server Supabase Client] Error setting cookie (expected in Server Components):", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
            console.log(`[Server Supabase Client] Cookie remove('${name}'): Success`)
          } catch (error) {
            console.warn("[Server Supabase Client] Error removing cookie (expected in Server Components):", error)
          }
        },
      },
    })

    if (!client || !client.auth) {
      const errorMessage = "Supabase server client created, but 'auth' property is missing or null."
      console.error(`[Server Supabase Client] CRITICAL ERROR: ${errorMessage}`)
      throw new Error(errorMessage)
    }

    console.log("[Server Supabase Client] Server Supabase client created successfully with auth property.")
    return client
  } catch (e: any) {
    console.error(
      `[Server Supabase Client] Error creating server Supabase client instance: ${e.message}. Stack: ${e.stack}`,
    )
    throw e
  }
}

// Functie om een Supabase client te maken voor Client Components
export const createBrowserClient = (): SupabaseClient<Database> | null => {
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

  supabaseInstance = createSupabaseBrowserClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

export { createClient as createServerClient }

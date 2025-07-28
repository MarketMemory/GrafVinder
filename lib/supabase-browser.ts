// 'use client'
import { createClient as createSupabaseBrowserClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null

/**
 * Returned:
 *   - SupabaseClient wanneer de noodzakelijke env-vars aanwezig zijn
 *   - null wanneer ze ontbreken (bv. in lokale preview zonder .env)
 */
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

// Function to reset the singleton (useful for testing or logout)
export const resetSupabaseInstance = () => {
  supabaseInstance = null
}

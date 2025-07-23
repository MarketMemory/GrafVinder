// 'use client'
import { createClient as createSupabaseBrowserClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Returned:
 *   - SupabaseClient wanneer de noodzakelijke env-vars aanwezig zijn
 *   - null wanneer ze ontbreken (bv. in lokale preview zonder .env)
 */
export const createBrowserClient = (): SupabaseClient<Database> | null => {
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

  return createSupabaseBrowserClient<Database>(url, anonKey)
}

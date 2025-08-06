"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createBrowserClient, resetSupabaseInstance } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
initialUser: User | null; // Accept initial user from server
}

export default function Header({ initialUser }: HeaderProps) {
const router = useRouter()
const { toast } = useToast()

// State
const [user, setUser] = useState<User | null>(initialUser) // Initialize with initialUser
const [loading, setLoading] = useState(false) // Only for sign out action

// Supabase client for client-side operations (like sign out and auth state changes)
const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof createBrowserClient> | null>(null);

useEffect(() => {
  const client = createBrowserClient();
  setSupabaseClient(client);

  if (!client) {
    // If client is not initialized, it means env vars are missing.
    // The layout.tsx should have already handled this for initial render,
    // but this is a fallback for client-side only scenarios or if env vars change.
    console.warn("Supabase browser client not initialized in Header. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    return;
  }

  // Listen for auth state changes
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null)
  })

  return () => {
    subscription?.unsubscribe()
  }
}, []) // Run once on mount

const handleSignOut = async () => {
  if (!supabaseClient) {
    toast({
      title: "Fout bij uitloggen",
      description: "Supabase client is niet beschikbaar.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true)
  const { error } = await supabaseClient.auth.signOut()

  if (error) {
    toast({
      title: "Fout bij uitloggen",
      description: error.message,
      variant: "destructive",
    })
  } else {
    resetSupabaseInstance() // Reset the singleton instance after logout
    toast({
      title: "Succesvol uitgelogd",
      description: "Je bent nu uitgelogd bij GrafVinder.",
    })
    router.push("/auth")
      }
      setLoading(false)
    }

    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          GrafVinder
        </Link>
        {!supabaseClient ? ( // Check if browser client is initialized
          <nav className="flex items-center gap-4">
            <Link href="/graves" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
              Alle Graven
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
              Over Ons
            </Link>
            <Link href="/donate" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
              Doneren
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <Link href="/graves" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
              Alle Graven
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
              Over Ons
            </Link>
            <Link href="/donate" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
              Doneren
            </Link>
            {/* No loading spinner for initial state, as it's passed from server */}
            {user ? (
              <>
                <Link
                  href="/my-graves"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  Mijn Graven
                </Link>
                <Link
                  href="/add-grave"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  Graf Toevoegen
                </Link>
                <Button onClick={handleSignOut} disabled={loading} variant="outline">
                  Uitloggen
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">Inloggen</Link>
              </Button>
            )}
          </nav>
        )}
      </header>
    )
  }

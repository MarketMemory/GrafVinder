"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createBrowserClient, resetSupabaseInstance } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export default function Header() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!!supabase) // alleen laden als er een client is

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    if (!supabase) return

    setLoading(true)
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: "Fout bij uitloggen",
        description: error.message,
        variant: "destructive",
      })
    } else {
      // Reset the singleton instance after logout
      resetSupabaseInstance()
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
      {!supabase ? (
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
          {loading ? (
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : user ? (
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

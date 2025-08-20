"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Loader2 } from "lucide-react"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[AUTH FORM] Starting sign in process for:", email)
    console.log("[AUTH FORM] Site URL:", process.env.NEXT_PUBLIC_SITE_URL)

    try {
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/add-grave`
      console.log("[AUTH FORM] Redirect URL:", redirectUrl)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error("[AUTH FORM] Sign in error:", error)
        toast({
          title: "Fout bij inloggen",
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.log("[AUTH FORM] Magic link sent successfully")
        toast({
          title: "Magic link verzonden!",
          description: "Controleer je e-mail voor de inloglink.",
        })
        setEmail("")
      }
    } catch (error) {
      console.error("[AUTH FORM] Unexpected error:", error)
      toast({
        title: "Onverwachte fout",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Inloggen</CardTitle>
          <CardDescription>Voer je e-mailadres in om een magic link te ontvangen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@voorbeeld.nl"
                required
                disabled={loading}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !email}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verzenden...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Magic Link Verzenden
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, AlertCircle } from "lucide-react"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      console.error("[Auth Form] Supabase client not available")
      toast({
        title: "Configuratie fout",
        description: "Supabase is niet correct geconfigureerd.",
        variant: "destructive",
      })
      return
    }

    if (!email) {
      toast({
        title: "E-mailadres vereist",
        description: "Vul je e-mailadres in om door te gaan.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    console.log("[Auth Form] Starting sign in process for:", email)

    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/add-grave`
      console.log("[Auth Form] Redirect URL:", redirectTo)

      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
        },
      })

      if (error) {
        console.error("[Auth Form] Sign in error:", error.message)
        toast({
          title: "Fout bij inloggen",
          description: error.message || "Er is een fout opgetreden bij het versturen van de magic link.",
          variant: "destructive",
        })
      } else {
        console.log("[Auth Form] Magic link sent successfully")
        toast({
          title: "Magic link verzonden!",
          description: "Controleer je e-mail en klik op de link om in te loggen.",
        })
        setEmail("")
      }
    } catch (error: any) {
      console.error("[Auth Form] Unexpected error:", error)
      toast({
        title: "Onverwachte fout",
        description: "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!supabase) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Configuratie fout</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600 dark:text-gray-400">
            Supabase is niet correct geconfigureerd. Controleer de omgevingsvariabelen.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Inloggen bij GrafVinder</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              placeholder="je@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                Bezig met verzenden...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Verstuur magic link
              </>
            )}
          </Button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          We sturen je een magic link naar je e-mail. Klik op de link om in te loggen.
        </p>
      </CardContent>
    </Card>
  )
}

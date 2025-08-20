"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[AUTH FORM] Attempting sign in for:", email)
    console.log("[AUTH FORM] Site URL:", process.env.NEXT_PUBLIC_SITE_URL)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/add-grave`,
        },
      })

      if (error) {
        console.error("[AUTH FORM] Sign in error:", error.message)
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inloggen</CardTitle>
        <CardDescription>Voer je e-mailadres in om een magic link te ontvangen</CardDescription>
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
            {loading ? "Verzenden..." : "Verstuur Magic Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

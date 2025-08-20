"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[DEBUG] Starting sign in process for email:", email)

    try {
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/add-grave`
      console.log("[DEBUG] Redirect URL:", redirectUrl)

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error("[ERROR] Sign in error:", error)
        toast({
          title: "Fout",
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.log("[DEBUG] Sign in successful, data:", data)
        toast({
          title: "Controleer je e-mail",
          description: "We hebben je een magic link gestuurd om in te loggen.",
        })
        setEmail("")
      }
    } catch (error) {
      console.error("[ERROR] Exception during sign in:", error)
      toast({
        title: "Fout",
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
            {loading ? "Bezig..." : "Verstuur magic link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast" // Aanname dat use-toast beschikbaar is

export default function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Zorg ervoor dat deze URL correct is en verwijst naar je callback route
          // Het moet eindigen op /auth/callback, ZONDER een # of andere fragmenten.
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "Controleer je e-mail!",
        description: "We hebben een magic link naar je e-mailadres gestuurd. Klik op de link om in te loggen.",
      })
    } catch (error: any) {
      toast({
        title: "Fout bij authenticatie",
        description: error.message || "Er is een onbekende fout opgetreden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welkom bij GrafVinder</CardTitle>
        <CardDescription>Log in of registreer via magic link met je e-mailadres.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              placeholder="jouw@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Bezig met verzenden..." : "Stuur magic link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

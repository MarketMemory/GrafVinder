"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

export default function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Toon foutmeldingen van de callback route
  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      let errorMessage = "Er is een onbekende fout opgetreden."

      switch (error) {
        case "callback_error":
          errorMessage = "Er ging iets mis bij het verifiëren van je e-mail. Probeer opnieuw."
          break
        case "no_code":
          errorMessage = "Ongeldige authenticatie link. Vraag een nieuwe magic link aan."
          break
        case "unexpected_error":
          errorMessage = "Er is een onverwachte fout opgetreden. Probeer het later opnieuw."
          break
      }

      toast({
        title: "Authenticatie fout",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      console.log("[AUTH FORM] Versturen magic link naar:", email)
      console.log("[AUTH FORM] Redirect URL:", `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/add-grave`)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Voeg een 'next' parameter toe om naar /add-grave te redirecten na login
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/add-grave`,
        },
      })

      if (error) {
        console.error("[AUTH FORM] Supabase fout:", error.message)
        throw error
      }

      console.log("[AUTH FORM] Magic link succesvol verstuurd")

      toast({
        title: "Controleer je e-mail!",
        description:
          "We hebben een magic link naar je e-mailadres gestuurd. Klik op de link om in te loggen en een graf toe te voegen.",
      })
    } catch (error: any) {
      console.error("[AUTH FORM] Fout:", error)
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

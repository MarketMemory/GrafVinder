"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase-browser" // Importeer de browser client
import { useRouter } from "next/navigation" // Importeer useRouter voor client-side revalidatie

interface AddMemoryFormProps {
  graveId: string
  onSuccess: () => void // Callback om dialoog te sluiten
}

export default function AddMemoryForm({ graveId, onSuccess }: AddMemoryFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient() // Initialiseer de browser client

  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")
  const [isPending, setIsPending] = useState(false) // Lokale loading state

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault() // Voorkom standaard formulier indiening
    setIsPending(true)

    if (!supabase) {
      toast({
        title: "Fout",
        description: "Supabase client is niet geïnitialiseerd. Controleer je omgevingsvariabelen.",
        variant: "destructive",
      })
      setIsPending(false)
      return
    }

    if (!text || !author) {
      toast({
        title: "Validatiefout",
        description: "Alle velden zijn verplicht.",
        variant: "destructive",
      })
      setIsPending(false)
      return
    }

    try {
      // Haal de huidige sessie op om de user_id te krijgen
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Fout bij ophalen sessie:", sessionError.message)
        // Ga door zonder user_id als er een sessie fout is
      }

      const userId = session?.user?.id || null // Koppel aan gebruiker als ingelogd, anders null

      const { error: insertError } = await supabase.from("memories").insert({
        grave_id: graveId,
        text,
        author,
        date: new Date().toISOString().split("T")[0], // Huidige datum in YYYY-MM-DD formaat
        user_id: userId,
      })

      if (insertError) {
        console.error("Supabase Insert Error:", insertError)
        throw insertError
      }

      toast({
        title: "Succes!",
        description: "Herinnering succesvol toegevoegd.",
      })
      setText("") // Reset formulier
      setAuthor("")
      onSuccess() // Sluit de dialoog
      router.refresh() // Herlaad de pagina om de nieuwe herinnering te tonen
    } catch (error: any) {
      console.error("Caught error in addMemoryForm:", error)
      toast({
        title: "Fout bij toevoegen",
        description: error.message || "Er is een onbekende fout opgetreden bij het toevoegen van de herinnering.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="graveId" value={graveId} />

      <div className="grid gap-2">
        <Label htmlFor="text">Jouw herinnering</Label>
        <Textarea
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Deel hier je persoonlijke herinnering aan de overledene..."
          required
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="author">Jouw naam (of anoniem)</Label>
        <Input
          id="author"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Bijv. Jan Jansen of Anoniem"
          required
          disabled={isPending}
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Bezig met toevoegen..." : "Herinnering toevoegen"}
        </Button>
      </DialogFooter>
    </form>
  )
}

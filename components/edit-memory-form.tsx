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
import type { GraveData } from "./grave-page" // Importeer GraveData om Memory type te gebruiken

interface EditMemoryFormProps {
  initialData: GraveData["memories"][0] // Specifiek het type van een enkele herinnering
  graveId: string // Nodig om de detailpagina te revalidaten
  onSuccess: () => void // Callback om dialoog te sluiten
}

export default function EditMemoryForm({ initialData, graveId, onSuccess }: EditMemoryFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient() // Initialiseer de browser client

  const [text, setText] = useState(initialData.text)
  const [author, setAuthor] = useState(initialData.author)
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
      const { error: updateError } = await supabase
        .from("memories")
        .update({
          text,
          author,
        })
        .eq("id", initialData.id) // Update de specifieke herinnering

      if (updateError) {
        console.error("Supabase Update Error:", updateError)
        throw updateError
      }

      toast({
        title: "Succes!",
        description: "Herinnering succesvol bijgewerkt.",
      })
      onSuccess() // Sluit de dialoog
      router.refresh() // Herlaad de pagina om de wijzigingen te tonen
    } catch (error: any) {
      console.error("Caught error in editMemoryForm:", error)
      toast({
        title: "Fout bij bijwerken",
        description: error.message || "Er is een onbekende fout opgetreden bij het bijwerken van de herinnering.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="memoryId" value={initialData.id} />
      <input type="hidden" name="graveId" value={graveId} />

      <div className="grid gap-2">
        <Label htmlFor="editText">Jouw herinnering</Label>
        <Textarea
          id="editText"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Bewerk je herinnering..."
          required
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="editAuthor">Jouw naam (of anoniem)</Label>
        <Input
          id="editAuthor"
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
          {isPending ? "Bezig met opslaan..." : "Wijzigingen opslaan"}
        </Button>
      </DialogFooter>
    </form>
  )
}

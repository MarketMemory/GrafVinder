"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { updateMemory } from "@/actions/grave-actions"
import type { GraveData } from "./grave-page" // Importeer GraveData om Memory type te gebruiken

interface EditMemoryFormProps {
  initialData: GraveData["memories"][0] // Specifiek het type van een enkele herinnering
  graveId: string // Nodig om de detailpagina te revalidaten
  onSuccess: () => void // Callback om dialoog te sluiten
}

export default function EditMemoryForm({ initialData, graveId, onSuccess }: EditMemoryFormProps) {
  const { toast } = useToast()

  const [text, setText] = useState(initialData.text)
  const [author, setAuthor] = useState(initialData.author)

  const [state, formAction, isPending] = useActionState(updateMemory, null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Succes!",
        description: state.message,
      })
      onSuccess() // Sluit de dialoog
    } else if (state?.success === false) {
      toast({
        title: "Fout bij bijwerken",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast, onSuccess])

  return (
    <form action={formAction} className="grid gap-4 py-4">
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

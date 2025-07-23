"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { addMemory } from "@/actions/grave-actions"

interface AddMemoryFormProps {
  graveId: string
  onSuccess: () => void // Callback om dialoog te sluiten
}

export default function AddMemoryForm({ graveId, onSuccess }: AddMemoryFormProps) {
  const { toast } = useToast()

  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")

  const [state, formAction, isPending] = useActionState(addMemory, null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Succes!",
        description: state.message,
      })
      setText("") // Reset formulier
      setAuthor("")
      onSuccess() // Sluit de dialoog
    } else if (state?.success === false) {
      toast({
        title: "Fout bij toevoegen",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast, onSuccess])

  return (
    <form action={formAction} className="grid gap-4 py-4">
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

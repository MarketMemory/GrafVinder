"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addMemory } from "@/actions/grave-actions"
import { useToast } from "@/hooks/use-toast"

interface AddMemoryFormProps {
  graveId: string
  onSuccess?: () => void
}

export function AddMemoryForm({ graveId, onSuccess }: AddMemoryFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await addMemory(graveId, formData)
      toast({
        title: "Herinnering toegevoegd",
        description: "Je herinnering is succesvol toegevoegd.",
      })
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Er is een fout opgetreden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Herinnering Toevoegen</CardTitle>
        <CardDescription>Deel een persoonlijke herinnering of verhaal</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author_name">Je naam</Label>
            <Input id="author_name" name="author_name" required placeholder="Voor- en achternaam" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Herinnering</Label>
            <Textarea
              id="content"
              name="content"
              required
              placeholder="Deel je herinnering, verhaal of gedachten..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Bezig met toevoegen..." : "Herinnering Toevoegen"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { createClient } from "@/lib/supabase"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { updateGrave, deleteGrave } from "@/actions/grave-actions"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditGravePage({ params }: PageProps) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const { data: grave, error } = await supabase
    .from("graves")
    .select("*")
    .eq("id", params.id)
    .eq("created_by", user.id)
    .single()

  if (error || !grave) {
    notFound()
  }

  const updateGraveWithId = updateGrave.bind(null, params.id)
  const deleteGraveWithId = deleteGrave.bind(null, params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Graf Bewerken</CardTitle>
            <CardDescription>Bewerk de informatie van dit graf</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateGraveWithId} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Volledige naam *</Label>
                  <Input id="name" name="name" required defaultValue={grave.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Geboortedatum</Label>
                  <Input id="birth_date" name="birth_date" type="date" defaultValue={grave.birth_date || ""} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="death_date">Overlijdensdatum</Label>
                  <Input id="death_date" name="death_date" type="date" defaultValue={grave.death_date || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grave_number">Grafnummer</Label>
                  <Input id="grave_number" name="grave_number" defaultValue={grave.grave_number || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cemetery_name">Begraafplaats naam *</Label>
                <Input id="cemetery_name" name="cemetery_name" required defaultValue={grave.cemetery_name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cemetery_location">Locatie begraafplaats *</Label>
                <Input
                  id="cemetery_location"
                  name="cemetery_location"
                  required
                  defaultValue={grave.cemetery_location}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea id="description" name="description" defaultValue={grave.description || ""} rows={4} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="share_on_twitter"
                  name="share_on_twitter"
                  defaultChecked={grave.share_on_twitter || false}
                />
                <Label htmlFor="share_on_twitter" className="text-sm">
                  Deel dit graf op sociale media (optioneel)
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Wijzigingen Opslaan
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Annuleren
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t">
              <form action={deleteGraveWithId}>
                <Button type="submit" variant="destructive" className="w-full">
                  Graf Verwijderen
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

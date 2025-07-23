"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AddGravePage() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [deathDate, setDeathDate] = useState("")
  const [biography, setBiography] = useState("")
  const [gravePhoto, setGravePhoto] = useState<File | null>(null)
  const [deceasedPhoto, setDeceasedPhoto] = useState<File | null>(null)
  const [locationDescription, setLocationDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Niet ingelogd",
        description: "Je moet ingelogd zijn om een graf toe te voegen.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    let gravePhotoUrl: string | null = null
    let deceasedPhotoUrl: string | null = null

    try {
      // Upload grave photo
      if (gravePhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("grave-photos")
          .upload(`${user.id}/${Date.now()}-${gravePhoto.name}`, gravePhoto, {
            cacheControl: "3600",
            upsert: false,
          })
        if (uploadError) throw uploadError
        gravePhotoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/grave-photos/${uploadData.path}`
      }

      // Upload deceased photo
      if (deceasedPhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("deceased-photos")
          .upload(`${user.id}/${Date.now()}-${deceasedPhoto.name}`, deceasedPhoto, {
            cacheControl: "3600",
            upsert: false,
          })
        if (uploadError) throw uploadError
        deceasedPhotoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/deceased-photos/${uploadData.path}`
      }

      // Insert grave data into database
      const { error: insertError } = await supabase.from("graves").insert({
        name,
        birth_date: birthDate,
        death_date: deathDate,
        biography,
        grave_photo_url: gravePhotoUrl,
        deceased_photo_url: deceasedPhotoUrl,
        location_description: locationDescription,
        user_id: user.id,
      })

      if (insertError) throw insertError

      toast({
        title: "Succes!",
        description: "Graf succesvol toegevoegd.",
      })
      router.push("/") // Navigeer terug naar de homepage of een overzichtspagina
    } catch (error: any) {
      toast({
        title: "Fout bij toevoegen",
        description: error.message || "Er is een onbekende fout opgetreden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Voeg een nieuw graf toe aan GrafVinder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Naam overledene</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Geboortedatum</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deathDate">Overlijdensdatum</Label>
                <Input
                  id="deathDate"
                  type="date"
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="biography">Levensverhaal</Label>
              <Textarea
                id="biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                rows={5}
                placeholder="Vertel het levensverhaal van de overledene..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="locationDescription">Locatie van het graf (beschrijving)</Label>
              <Input
                id="locationDescription"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="Bijv. Begraafplaats Rusthof, Vak C, Rij 12, Graf 5"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gravePhoto">Foto van het graf</Label>
                <Input
                  id="gravePhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setGravePhoto)}
                />
                {gravePhoto && <p className="text-sm text-gray-500">{gravePhoto.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deceasedPhoto">Foto van de overledene</Label>
                <Input
                  id="deceasedPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setDeceasedPhoto)}
                />
                {deceasedPhoto && <p className="text-sm text-gray-500">{deceasedPhoto.name}</p>}
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Bezig met toevoegen..." : "Graf toevoegen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

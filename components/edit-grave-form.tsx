"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { updateGrave } from "@/actions/grave-actions"
import type { GraveData } from "./grave-page" // Hergebruik de interface
import Image from "next/image"

interface EditGraveFormProps {
  initialData: GraveData & { id: string; deceased_photo_url?: string | null } // Voeg id en deceased_photo_url toe
}

export default function EditGraveForm({ initialData }: EditGraveFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Initialiseer state met de bestaande data
  const [name, setName] = useState(initialData.name)
  const [birthDate, setBirthDate] = useState(initialData.birthDate)
  const [deathDate, setDeathDate] = useState(initialData.deathDate)
  const [biography, setBiography] = useState(initialData.biography || "")
  const [locationDescription, setLocationDescription] = useState(initialData.location.description || "")

  const [gravePhoto, setGravePhoto] = useState<File | null>(null)
  const [deceasedPhoto, setDeceasedPhoto] = useState<File | null>(null)

  // State voor de bestaande foto URL's
  const [existingGravePhotoUrl, setExistingGravePhotoUrl] = useState(initialData.gravePhotoUrl)
  const [existingDeceasedPhotoUrl, setExistingDeceasedPhotoUrl] = useState(
    initialData.deceased_photo_url || "/placeholder.svg?height=160&width=160",
  )

  // Gebruik useActionState voor Server Action integratie
  const [state, formAction, isPending] = useActionState(updateGrave, null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Succes!",
        description: state.message,
      })
      router.push("/my-graves") // Navigeer terug naar 'Mijn Graven'
    } else if (state?.success === false) {
      toast({
        title: "Fout bij bijwerken",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, router, toast])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    urlSetter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
      urlSetter(URL.createObjectURL(e.target.files[0])) // Toon preview van nieuwe foto
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Bewerk Graf: {initialData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-6">
          {/* Verborgen input voor grave ID */}
          <input type="hidden" name="id" value={initialData.id} />
          <input type="hidden" name="existingGravePhotoUrl" value={existingGravePhotoUrl || ""} />
          <input type="hidden" name="existingDeceasedPhotoUrl" value={existingDeceasedPhotoUrl || ""} />

          <div className="grid gap-2">
            <Label htmlFor="name">Naam overledene</Label>
            <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Geboortedatum</Label>
              <Input
                id="birthDate"
                name="birthDate"
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
                name="deathDate"
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
              name="biography"
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
              name="locationDescription"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              placeholder="Bijv. Begraafplaats Rusthof, Vak C, Rij 12, Graf 5"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="gravePhoto">Foto van het graf</Label>
              {existingGravePhotoUrl && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                  <Image
                    src={existingGravePhotoUrl || "/placeholder.svg"}
                    alt="Huidige grafoto"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                id="gravePhoto"
                name="gravePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setGravePhoto, setExistingGravePhotoUrl)}
              />
              {gravePhoto && <p className="text-sm text-gray-500">{gravePhoto.name}</p>}
              {!gravePhoto && existingGravePhotoUrl && (
                <p className="text-sm text-gray-500">Huidige foto: {existingGravePhotoUrl.split("/").pop()}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deceasedPhoto">Foto van de overledene</Label>
              {existingDeceasedPhotoUrl && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                  <Image
                    src={existingDeceasedPhotoUrl || "/placeholder.svg"}
                    alt="Huidige foto overledene"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                id="deceasedPhoto"
                name="deceasedPhoto"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setDeceasedPhoto, setExistingDeceasedPhotoUrl)}
              />
              {deceasedPhoto && <p className="text-sm text-gray-500">{deceasedPhoto.name}</p>}
              {!deceasedPhoto && existingDeceasedPhotoUrl && (
                <p className="text-sm text-gray-500">Huidige foto: {existingDeceasedPhotoUrl.split("/").pop()}</p>
              )}
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Bezig met opslaan..." : "Wijzigingen opslaan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

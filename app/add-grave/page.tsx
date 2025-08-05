"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox" // Importeer Checkbox

export default function AddGravePage() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const { toast } = useToast()
  const [supabaseInitialized, setSupabaseInitialized] = useState(false)

  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [deathDate, setDeathDate] = useState("")
  const [biography, setBiography] = useState("")
  const [gravePhoto, setGravePhoto] = useState<File | null>(null)
  const [deceasedPhoto, setDeceasedPhoto] = useState<File | null>(null)
  const [locationDescription, setLocationDescription] = useState("")
  const [shareOnTwitter, setShareOnTwitter] = useState(false) // NIEUW: state voor de checkbox
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Debug functie om stappen te loggen
  const addDebugInfo = (message: string) => {
    console.log(`[DEBUG] ${message}`)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    if (supabase) {
      setSupabaseInitialized(true)
      addDebugInfo("Supabase client geïnitialiseerd (singleton)")
    } else {
      addDebugInfo("Supabase client NIET geïnitialiseerd - controleer environment variables")
      toast({
        title: "Configuratie fout",
        description:
          "Supabase is niet correct geconfigureerd. Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY zijn ingesteld.",
        variant: "destructive",
        duration: 8000,
      })
      setLoading(false)
    }
  }, [supabase, toast])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setter(file)
      addDebugInfo(`Bestand geselecteerd: ${file.name} (${file.size} bytes)`)
    }
  }

  const uploadFileToStorage = async (file: File, bucketName: string, userId: string): Promise<string | null> => {
    if (!supabase) return null

    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`
      addDebugInfo(`Uploaden naar bucket '${bucketName}': ${fileName}`)

      const { data: uploadData, error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        addDebugInfo(`Upload fout: ${uploadError.message}`)
        throw new Error(`Upload naar ${bucketName} mislukt: ${uploadError.message}`)
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uploadData.path}`
      addDebugInfo(`Upload succesvol: ${publicUrl}`)
      return publicUrl
    } catch (error: any) {
      addDebugInfo(`Upload fout: ${error.message}`)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabaseInitialized || !supabase) {
      toast({
        title: "Fout",
        description: "Kan geen graf toevoegen: Supabase is niet geïnitialiseerd.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setDebugInfo([]) // Reset debug info
    addDebugInfo("Start toevoegen van graf...")

    try {
      // Stap 1: Controleer gebruiker
      addDebugInfo("Controleren van gebruiker authenticatie...")
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        addDebugInfo(`Fout bij ophalen gebruiker: ${userError.message}`)
        throw new Error(`Authenticatie fout: ${userError.message}`)
      }

      if (!user) {
        addDebugInfo("Geen gebruiker gevonden - niet ingelogd")
        toast({
          title: "Niet ingelogd",
          description: "Je moet ingelogd zijn om een graf toe te voegen.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      addDebugInfo(`Gebruiker gevonden: ${user.email} (ID: ${user.id})`)

      let gravePhotoUrl: string | null = null
      let deceasedPhotoUrl: string | null = null

      // Stap 2: Upload grave photo
      if (gravePhoto) {
        try {
          gravePhotoUrl = await uploadFileToStorage(gravePhoto, "grave-photos", user.id)
        } catch (error: any) {
          addDebugInfo(`Grafoto upload gefaald: ${error.message}`)
          throw error // Stop het proces als foto upload faalt
        }
      } else {
        addDebugInfo("Geen grafoto geselecteerd")
      }

      // Stap 3: Upload deceased photo
      if (deceasedPhoto) {
        try {
          deceasedPhotoUrl = await uploadFileToStorage(deceasedPhoto, "deceased-photos", user.id)
        } catch (error: any) {
          addDebugInfo(`Overledene foto upload gefaald: ${error.message}`)
          throw error // Stop het proces als foto upload faalt
        }
      } else {
        addDebugInfo("Geen overledene foto geselecteerd")
      }

      // Stap 4: Insert grave data into database
      addDebugInfo("Invoegen van grafgegevens in database...")
      const graveData = {
        name,
        birth_date: birthDate,
        death_date: deathDate,
        biography: biography || null,
        grave_photo_url: gravePhotoUrl,
        deceased_photo_url: deceasedPhotoUrl,
        location_description: locationDescription || null,
        user_id: user.id,
        share_on_twitter: shareOnTwitter, // NIEUW: voeg de checkbox waarde toe
      }

      addDebugInfo(`Grafgegevens: ${JSON.stringify(graveData, null, 2)}`)

      const { data: insertData, error: insertError } = await supabase.from("graves").insert(graveData).select()

      if (insertError) {
        addDebugInfo(`Database fout: ${insertError.message}`)
        addDebugInfo(`Database fout details: ${JSON.stringify(insertError, null, 2)}`)
        throw new Error(`Database fout: ${insertError.message}`)
      }

      addDebugInfo(`Graf succesvol toegevoegd! Data: ${JSON.stringify(insertData, null, 2)}`)

      toast({
        title: "Succes!",
        description: "Graf succesvol toegevoegd.",
      })

      // Wacht even voordat we navigeren
      setTimeout(() => {
        router.push("/my-graves")
      }, 1000)
    } catch (error: any) {
      addDebugInfo(`FOUT: ${error.message}`)
      console.error("Volledige fout:", error)
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
              <Label htmlFor="name">Naam overledene *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Geboortedatum *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deathDate">Overlijdensdatum *</Label>
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
                <Label htmlFor="deceasedPhoto">Foto van de overledene (Formaat 250x250)</Label>
                <Input
                  id="deceasedPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setDeceasedPhoto)}
                />
                {deceasedPhoto && <p className="text-sm text-gray-500">{deceasedPhoto.name}</p>}
              </div>
            </div>

            {/* NIEUW: Checkbox voor delen op X/Twitter */}
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="shareOnTwitter"
                checked={shareOnTwitter}
                onCheckedChange={(checked) => setShareOnTwitter(checked as boolean)}
                disabled={loading}
              />
              <Label
                htmlFor="shareOnTwitter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Toon op de tijdlijn van @GrafVinder (optioneel)
              </Label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Door dit aan te vinken, geef je toestemming dat GrafVinder dit graf handmatig kan delen op de officiële
              X/Twitter tijdlijn.
            </p>

            <Button type="submit" disabled={loading || !supabaseInitialized}>
              {loading ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                  Bezig met toevoegen...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Graf toevoegen
                </>
              )}
            </Button>
          </form>

          {/* Debug informatie (alleen zichtbaar tijdens development) */}
          {process.env.NODE_ENV === "development" && debugInfo.length > 0 && (
            <Card className="mt-6 bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-sm">Debug Informatie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="font-mono text-gray-600 dark:text-gray-400">
                      {info}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

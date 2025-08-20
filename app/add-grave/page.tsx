"use client"

import type React from "react"
import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle } from "lucide-react"

export default async function AddGravePage() {
  const supabase = createClient()
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
  const [shareOnTwitter, setShareOnTwitter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

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
        share_on_twitter: shareOnTwitter,
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

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Graf Toevoegen</CardTitle>
            <CardDescription>Voeg informatie toe over een graf om anderen te helpen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Volledige naam *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Voor- en achternaam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Geboortedatum</Label>
                  <Input id="birth_date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="death_date">Overlijdensdatum</Label>
                  <Input id="death_date" type="date" value={deathDate} onChange={(e) => setDeathDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grave_number">Grafnummer</Label>
                  <Input id="grave_number" placeholder="bijv. A-123" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cemetery_name">Begraafplaats naam *</Label>
                <Input id="cemetery_name" required placeholder="Naam van de begraafplaats" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cemetery_location">Locatie begraafplaats *</Label>
                <Input id="cemetery_location" required placeholder="Stad, provincie" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  placeholder="Aanvullende informatie, herinneringen, of bijzonderheden..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="share_on_twitter"
                  checked={shareOnTwitter}
                  onCheckedChange={(checked) => setShareOnTwitter(checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor="share_on_twitter" className="text-sm">
                  Deel dit graf op sociale media (optioneel)
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {loading ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                      Bezig met toevoegen...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Graf Toevoegen
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Annuleren
                </Button>
              </div>
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
    </div>
  )
}

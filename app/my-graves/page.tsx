import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase" // Gebruik de nieuwe createClient
import type { GraveData } from "@/components/grave-page"
import MyGraveCard from "@/components/my-grave-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const revalidate = 0 // Zorgt ervoor dat de data altijd vers is bij elke request

export default async function MyGravesPage() {
  const supabase = createClient() // Gebruik de server-side client

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Als de gebruiker niet is ingelogd, stuur door naar de authenticatiepagina
    redirect("/auth")
  }

  // Haal alleen de graven op die door de ingelogde gebruiker zijn toegevoegd
  const { data: graves, error } = await supabase
    .from("graves")
    .select("*")
    .eq("user_id", user.id) // Filter op de user_id van de ingelogde gebruiker
    .order("death_date", { ascending: false })

  if (error) {
    console.error("Fout bij het ophalen van eigen graven:", error)
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">Er is een fout opgetreden bij het laden van je graven.</p>
      </div>
    )
  }

  // Pas de data aan naar de GraveData interface
  const formattedGraves: GraveData[] = graves.map((grave) => ({
    name: grave.name,
    birthDate: grave.birth_date,
    deathDate: grave.death_date,
    biography: grave.biography || "",
    gravePhotoUrl: grave.grave_photo_url || "/placeholder.svg?height=160&width=160",
    location: {
      latitude: grave.location_latitude || 0,
      longitude: grave.location_longitude || 0,
      description: grave.location_description || "Onbekende locatie",
    },
    memories: [], // Herinneringen worden hier niet geladen
  }))

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Mijn Graven</h1>

        <div className="flex justify-end mb-6">
          <Button asChild>
            <Link href="/add-grave">
              <Plus className="w-4 h-4 mr-2" />
              Nieuw graf toevoegen
            </Link>
          </Button>
        </div>

        {formattedGraves.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Je hebt nog geen graven toegevoegd.</p>
            <Button asChild>
              <Link href="/add-grave">
                <Plus className="w-4 h-4 mr-2" />
                Voeg je eerste graf toe
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedGraves.map((grave) => (
              <MyGraveCard key={grave.name} grave={grave} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

import { createServerClient } from "@/lib/supabase"
import GraveList from "@/components/grave-list"
import type { GraveData } from "@/components/grave-page" // Hergebruik de interface

export const revalidate = 0 // Zorgt ervoor dat de data altijd vers is bij elke request

export default async function GravesOverviewPage() {
  const supabase = createServerClient()

  // Haal alle graven op uit de database
  const { data: graves, error } = await supabase
    .from("graves")
    .select("*") // Selecteer alle kolommen
    .order("death_date", { ascending: false }) // Sorteer op overlijdensdatum

  if (error) {
    console.error("Fout bij het ophalen van graven:", error)
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">Er is een fout opgetreden bij het laden van de graven.</p>
      </div>
    )
  }

  // Pas de data aan naar de GraveData interface indien nodig
  // De database kolommen gebruiken snake_case, de interface camelCase.
  // We moeten dit hier omzetten voor de client component.
  const formattedGraves: GraveData[] = graves.map((grave) => ({
    name: grave.name,
    birthDate: grave.birth_date,
    deathDate: grave.death_date,
    biography: grave.biography || "",
    gravePhotoUrl: grave.grave_photo_url || "/placeholder.svg?height=160&width=160",
    // deceasedPhotoUrl: grave.deceased_photo_url || "/placeholder.svg?height=160&width=160", // Voeg deze toe als je hem in GraveData hebt
    location: {
      latitude: grave.location_latitude || 0,
      longitude: grave.location_longitude || 0,
      description: grave.location_description || "Onbekende locatie",
    },
    memories: [], // Herinneringen worden hier niet geladen, alleen op de detailpagina
  }))

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Alle Graven</h1>
        <GraveList initialGraves={formattedGraves} />
      </div>
    </main>
  )
}

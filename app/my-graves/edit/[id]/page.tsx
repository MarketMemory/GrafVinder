import { createServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import EditGraveForm from "@/components/edit-grave-form"
import type { GraveData } from "@/components/grave-page"

export const revalidate = 0 // Zorgt ervoor dat de data altijd vers is

interface EditGravePageProps {
  params: {
    id: string // Het ID van het graf uit de URL
  }
}

export default async function EditGravePage({ params }: EditGravePageProps) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth") // Stuur door als niet ingelogd
  }

  // Haal het specifieke graf op
  const { data: grave, error } = await supabase
    .from("graves")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id) // Zorg ervoor dat alleen de eigenaar zijn eigen graf kan bewerken
    .single() // Haal één record op

  if (error || !grave) {
    console.error("Fout bij ophalen graf voor bewerking:", error)
    // Redirect naar 'Mijn Graven' of toon een foutmelding
    redirect("/my-graves?error=grave_not_found_or_unauthorized")
  }

  // Formatteer de data naar de GraveData interface voor de client component
  const formattedGrave: GraveData & { id: string; deceased_photo_url?: string | null } = {
    id: grave.id,
    name: grave.name,
    birthDate: grave.birth_date,
    deathDate: grave.death_date,
    biography: grave.biography || "",
    gravePhotoUrl: grave.grave_photo_url || "/placeholder.svg?height=160&width=160",
    deceasedPhotoUrl: grave.deceased_photo_url || "/placeholder.svg?height=160&width=160",
    deceased_photo_url: grave.deceased_photo_url, // Voor de edit form
    location: {
      latitude: grave.location_latitude || 0,
      longitude: grave.location_longitude || 0,
      description: grave.location_description || "Onbekende locatie",
    },
    memories: [], // Herinneringen worden hier niet geladen
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <EditGraveForm initialData={formattedGrave} />
      </div>
    </main>
  )
}

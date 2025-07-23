import { createServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import GravePage from "@/components/grave-page" // Importeer de GravePage component
import type { GraveData } from "@/components/grave-page"

export const revalidate = 0 // Zorgt ervoor dat de data altijd vers is

interface GraveDetailPageProps {
  params: {
    id: string // Het ID van het graf uit de URL
  }
}

export default async function GraveDetailPage({ params }: GraveDetailPageProps) {
  const supabase = createServerClient()

  // Haal het specifieke graf op basis van het ID, inclusief gerelateerde herinneringen
  const { data: grave, error } = await supabase
    .from("graves")
    .select(
      `
      *,
      memories (
        id,
        text,
        date,
        author
      )
    `,
    ) // Selecteer ook de herinneringen
    .eq("id", params.id)
    .single() // Haal één record op

  if (error || !grave) {
    console.error("Fout bij ophalen graf voor detailpagina:", error)
    // Redirect naar de algemene gravenlijst of een 404-pagina
    redirect("/graves?error=grave_not_found")
  }

  // Formatteer de data naar de GraveData interface
  const formattedGrave: GraveData = {
    id: grave.id,
    name: grave.name,
    birthDate: grave.birth_date,
    deathDate: grave.death_date,
    biography: grave.biography || "",
    gravePhotoUrl: grave.grave_photo_url || null,
    deceasedPhotoUrl: grave.deceased_photo_url || null,
    location: {
      latitude: grave.location_latitude || 0,
      longitude: grave.location_longitude || 0,
      description: grave.location_description || "Onbekende locatie",
    },
    memories: grave.memories.map((m) => ({
      id: m.id,
      text: m.text,
      date: m.date,
      author: m.author,
    })), // Formatteer de opgehaalde herinneringen
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 py-8">
      <GravePage data={formattedGrave} />
    </main>
  )
}

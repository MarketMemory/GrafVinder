import { createServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import GravePage from "@/components/grave-page"
import type { GraveData } from "@/components/grave-page"
import type { Metadata } from "next"

export const revalidate = 0 // Zorgt ervoor dat de data altijd vers is

interface GraveDetailPageProps {
  params: {
    id: string // Het ID van het graf uit de URL
  }
}

// Functie om dynamische metadata te genereren
export async function generateMetadata({ params }: GraveDetailPageProps): Promise<Metadata> {
  const supabase = createServerClient()

  const { data: grave, error } = await supabase.from("graves").select("*").eq("id", params.id).single()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grafvinder.vercel.app"
  const graveUrl = `${siteUrl}/graves/${params.id}`

  if (error || !grave) {
    // Fallback metadata als het graf niet gevonden wordt
    return {
      title: "Graf niet gevonden - GrafVinder",
      description: "Dit graf kon niet worden gevonden op GrafVinder.",
      openGraph: {
        url: siteUrl,
        images: [`${siteUrl}/favicon.png`],
      },
      twitter: {
        images: [`${siteUrl}/favicon.png`],
      },
    }
  }

  const title = `${grave.name} (${grave.birth_date} – ${grave.death_date}) - GrafVinder`
  const description =
    grave.biography || `Herdenk ${grave.name} op GrafVinder. Lees het levensverhaal en deel herinneringen.`
  const imageUrl = grave.grave_photo_url || `${siteUrl}/placeholder.svg?height=630&width=1200&query=grave%20photo`

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: graveUrl,
      images: [
        {
          url: imageUrl,
          width: 1200, // Standaard breedte voor Open Graph afbeeldingen
          height: 630, // Standaard hoogte voor Open Graph afbeeldingen
          alt: `Foto van het graf van ${grave.name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: graveUrl,
    },
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

"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Functie om een graf te updaten
export async function updateGrave(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth") // Stuur door als niet ingelogd
  }

  const graveId = formData.get("id") as string
  const name = formData.get("name") as string
  const birthDate = formData.get("birthDate") as string
  const deathDate = formData.get("deathDate") as string
  const biography = formData.get("biography") as string
  const locationDescription = formData.get("locationDescription") as string
  const gravePhotoFile = formData.get("gravePhoto") as File
  const deceasedPhotoFile = formData.get("deceasedPhoto") as File
  const existingGravePhotoUrl = formData.get("existingGravePhotoUrl") as string | null
  const existingDeceasedPhotoUrl = formData.get("existingDeceasedPhotoUrl") as string | null

  let gravePhotoUrl: string | null = existingGravePhotoUrl
  let deceasedPhotoUrl: string | null = existingDeceasedPhotoUrl

  try {
    // Upload nieuwe grafoto indien aanwezig
    if (gravePhotoFile && gravePhotoFile.size > 0) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("grave-photos")
        .upload(`${user.id}/${Date.now()}-${gravePhotoFile.name}`, gravePhotoFile, {
          cacheControl: "3600",
          upsert: false,
        })
      if (uploadError) throw uploadError
      gravePhotoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/grave-photos/${uploadData.path}`
    }

    // Upload nieuwe overledene foto indien aanwezig
    if (deceasedPhotoFile && deceasedPhotoFile.size > 0) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("deceased-photos")
        .upload(`${user.id}/${Date.now()}-${deceasedPhotoFile.name}`, deceasedPhotoFile, {
          cacheControl: "3600",
          upsert: false,
        })
      if (uploadError) throw uploadError
      deceasedPhotoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/deceased-photos/${uploadData.path}`
    }

    // Update grafgegevens in de database
    const { error: updateError } = await supabase
      .from("graves")
      .update({
        name,
        birth_date: birthDate,
        death_date: deathDate,
        biography,
        grave_photo_url: gravePhotoUrl,
        deceased_photo_url: deceasedPhotoUrl,
        location_description: locationDescription,
      })
      .eq("id", graveId)
      .eq("user_id", user.id) // Zorg ervoor dat alleen de eigenaar kan updaten

    if (updateError) throw updateError

    revalidatePath("/my-graves") // Herlaad de 'Mijn Graven' pagina om de wijzigingen te tonen
    revalidatePath(`/graves/${graveId}`) // Herlaad ook de publieke detailpagina
    return { success: true, message: "Graf succesvol bijgewerkt!" }
  } catch (error: any) {
    console.error("Fout bij bijwerken graf:", error)
    return { success: false, message: error.message || "Er is een onbekende fout opgetreden bij het bijwerken." }
  }
}

// Functie om een graf te verwijderen (voor toekomstige stap)
export async function deleteGrave(graveId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  try {
    const { error } = await supabase.from("graves").delete().eq("id", graveId).eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/my-graves")
    return { success: true, message: "Graf succesvol verwijderd." }
  } catch (error: any) {
    console.error("Fout bij verwijderen graf:", error)
    return { success: false, message: error.message || "Er is een onbekende fout opgetreden bij het verwijderen." }
  }
}

// De updateMemory functie is verplaatst naar components/edit-memory-form.tsx
// export async function updateMemory(...) { ... }

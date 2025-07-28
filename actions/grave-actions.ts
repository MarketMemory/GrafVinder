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

// Functie om een herinnering toe te voegen
export async function addMemory(formData: FormData) {
  try {
    const supabase = createClient() // Dit is de server client

    // Expliciete controle: Als supabase om een of andere reden null is, geef dan een fout terug.
    if (!supabase) {
      console.error("[addMemory Server Action] Supabase client is null after createClient().")
      return { success: false, message: "Interne serverfout: Supabase client kon niet worden geïnitialiseerd." }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Log de userError als deze bestaat, maar gooi GEEN fout als het alleen een ontbrekende sessie is.
    // De `user` variabele zal correct `null` zijn als er geen sessie is, wat wordt afgehandeld door `user?.id || null`.
    if (userError) {
      console.warn("[addMemory Server Action] Warning fetching user (might be anonymous):", userError.message)
      // Gooi hier GEEN fout, aangezien herinneringen anoniem kunnen zijn.
    }

    const graveId = formData.get("graveId") as string
    const text = formData.get("text") as string
    const author = formData.get("author") as string

    if (!graveId || !text || !author) {
      console.error("[addMemory Server Action] Validation Error: Missing graveId, text, or author.")
      return { success: false, message: "Alle velden zijn verplicht." }
    }

    const { error: insertError } = await supabase.from("memories").insert({
      grave_id: graveId,
      text,
      author,
      date: new Date().toISOString().split("T")[0], // Huidige datum in YYYY-MM-DD formaat
      user_id: user?.id || null, // Koppel aan gebruiker als ingelogd
    })

    if (insertError) {
      console.error("[addMemory Server Action] Supabase Insert Error:", insertError)
      throw insertError // Gooi de fout opnieuw om te worden opgevangen door de buitenste catch
    }

    revalidatePath(`/graves/${graveId}`) // Herlaad de detailpagina om de nieuwe herinnering te tonen
    return { success: true, message: "Herinnering succesvol toegevoegd!" }
  } catch (error: any) {
    console.error("[addMemory Server Action] Caught error:", error)
    return {
      success: false,
      message: error.message || "Er is een onbekende fout opgetreden bij het toevoegen van de herinnering.",
    }
  }
}

// NIEUW: Functie om een herinnering te updaten
export async function updateMemory(formData: FormData) {
  const supabase = createClient()

  const memoryId = formData.get("memoryId") as string
  const graveId = formData.get("graveId") as string // Nodig voor revalidatePath
  const text = formData.get("text") as string
  const author = formData.get("author") as string

  if (!memoryId || !graveId || !text || !author) {
    return { success: false, message: "Alle velden zijn verplicht." }
  }

  try {
    const { error } = await supabase
      .from("memories")
      .update({
        text,
        author,
      })
      .eq("id", memoryId) // Update de specifieke herinnering

    if (error) throw error

    revalidatePath(`/graves/${graveId}`) // Herlaad de detailpagina om de wijzigingen te tonen
    return { success: true, message: "Herinnering succesvol bijgewerkt!" }
  } catch (error: any) {
    console.error("Fout bij bijwerken herinnering:", error)
    return {
      success: false,
      message: error.message || "Er is een onbekende fout opgetreden bij het bijwerken van de herinnering.",
    }
  }
}

"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/database.types"

type Grave = Database["public"]["Tables"]["graves"]["Insert"]
type Memory = Database["public"]["Tables"]["memories"]["Insert"]

export async function createGrave(formData: FormData) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Je moet ingelogd zijn om een graf toe te voegen")
  }

  const graveData: Grave = {
    name: formData.get("name") as string,
    birth_date: formData.get("birth_date") as string,
    death_date: formData.get("death_date") as string,
    cemetery_name: formData.get("cemetery_name") as string,
    cemetery_location: formData.get("cemetery_location") as string,
    grave_location: formData.get("grave_location") as string,
    description: formData.get("description") as string,
    created_by: user.id,
  }

  const { data, error } = await supabase.from("graves").insert([graveData]).select().single()

  if (error) {
    throw new Error(`Fout bij het toevoegen van graf: ${error.message}`)
  }

  revalidatePath("/graves")
  revalidatePath("/my-graves")
  redirect(`/graves/${data.id}`)
}

export async function updateGrave(id: string, formData: FormData) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Je moet ingelogd zijn om een graf te bewerken")
  }

  // Check if user owns this grave
  const { data: grave, error: graveError } = await supabase.from("graves").select("created_by").eq("id", id).single()

  if (graveError || !grave) {
    throw new Error("Graf niet gevonden")
  }

  if (grave.created_by !== user.id) {
    throw new Error("Je kunt alleen je eigen graven bewerken")
  }

  const graveData = {
    name: formData.get("name") as string,
    birth_date: formData.get("birth_date") as string,
    death_date: formData.get("death_date") as string,
    cemetery_name: formData.get("cemetery_name") as string,
    cemetery_location: formData.get("cemetery_location") as string,
    grave_location: formData.get("grave_location") as string,
    description: formData.get("description") as string,
  }

  const { error } = await supabase.from("graves").update(graveData).eq("id", id)

  if (error) {
    throw new Error(`Fout bij het bijwerken van graf: ${error.message}`)
  }

  revalidatePath("/graves")
  revalidatePath("/my-graves")
  revalidatePath(`/graves/${id}`)
  redirect(`/graves/${id}`)
}

export async function deleteGrave(id: string) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Je moet ingelogd zijn om een graf te verwijderen")
  }

  // Check if user owns this grave
  const { data: grave, error: graveError } = await supabase.from("graves").select("created_by").eq("id", id).single()

  if (graveError || !grave) {
    throw new Error("Graf niet gevonden")
  }

  if (grave.created_by !== user.id) {
    throw new Error("Je kunt alleen je eigen graven verwijderen")
  }

  const { error } = await supabase.from("graves").delete().eq("id", id)

  if (error) {
    throw new Error(`Fout bij het verwijderen van graf: ${error.message}`)
  }

  revalidatePath("/graves")
  revalidatePath("/my-graves")
  redirect("/my-graves")
}

export async function addMemory(graveId: string, formData: FormData) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Je moet ingelogd zijn om een herinnering toe te voegen")
  }

  const memoryData: Memory = {
    grave_id: graveId,
    author_name: formData.get("author_name") as string,
    content: formData.get("content") as string,
    created_by: user.id,
  }

  const { error } = await supabase.from("memories").insert([memoryData])

  if (error) {
    throw new Error(`Fout bij het toevoegen van herinnering: ${error.message}`)
  }

  revalidatePath(`/graves/${graveId}`)
}

export async function updateMemory(id: string, formData: FormData) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Je moet ingelogd zijn om een herinnering te bewerken")
  }

  // Check if user owns this memory
  const { data: memory, error: memoryError } = await supabase
    .from("memories")
    .select("created_by, grave_id")
    .eq("id", id)
    .single()

  if (memoryError || !memory) {
    throw new Error("Herinnering niet gevonden")
  }

  if (memory.created_by !== user.id) {
    throw new Error("Je kunt alleen je eigen herinneringen bewerken")
  }

  const memoryData = {
    author_name: formData.get("author_name") as string,
    content: formData.get("content") as string,
  }

  const { error } = await supabase.from("memories").update(memoryData).eq("id", id)

  if (error) {
    throw new Error(`Fout bij het bijwerken van herinnering: ${error.message}`)
  }

  revalidatePath(`/graves/${memory.grave_id}`)
}

export async function deleteMemory(id: string) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Je moet ingelogd zijn om een herinnering te verwijderen")
  }

  // Check if user owns this memory
  const { data: memory, error: memoryError } = await supabase
    .from("memories")
    .select("created_by, grave_id")
    .eq("id", id)
    .single()

  if (memoryError || !memory) {
    throw new Error("Herinnering niet gevonden")
  }

  if (memory.created_by !== user.id) {
    throw new Error("Je kunt alleen je eigen herinneringen verwijderen")
  }

  const { error } = await supabase.from("memories").delete().eq("id", id)

  if (error) {
    throw new Error(`Fout bij het verwijderen van herinnering: ${error.message}`)
  }

  revalidatePath(`/graves/${memory.grave_id}`)
}

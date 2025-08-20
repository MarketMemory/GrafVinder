"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/database.types"

type Grave = Database["public"]["Tables"]["graves"]["Row"]
type GraveInsert = Database["public"]["Tables"]["graves"]["Insert"]
type GraveUpdate = Database["public"]["Tables"]["graves"]["Update"]

export async function createGrave(formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const graveData: GraveInsert = {
    name: formData.get("name") as string,
    birth_date: formData.get("birth_date") as string,
    death_date: formData.get("death_date") as string,
    cemetery_name: formData.get("cemetery_name") as string,
    cemetery_location: formData.get("cemetery_location") as string,
    grave_number: formData.get("grave_number") as string,
    description: formData.get("description") as string,
    created_by: user.id,
    share_on_twitter: formData.get("share_on_twitter") === "on",
  }

  const { data, error } = await supabase.from("graves").insert(graveData).select().single()

  if (error) {
    throw new Error(`Failed to create grave: ${error.message}`)
  }

  revalidatePath("/graves")
  revalidatePath("/my-graves")
  redirect(`/graves/${data.id}`)
}

export async function updateGrave(id: string, formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const graveData: GraveUpdate = {
    name: formData.get("name") as string,
    birth_date: formData.get("birth_date") as string,
    death_date: formData.get("death_date") as string,
    cemetery_name: formData.get("cemetery_name") as string,
    cemetery_location: formData.get("cemetery_location") as string,
    grave_number: formData.get("grave_number") as string,
    description: formData.get("description") as string,
    share_on_twitter: formData.get("share_on_twitter") === "on",
  }

  const { error } = await supabase.from("graves").update(graveData).eq("id", id).eq("created_by", user.id)

  if (error) {
    throw new Error(`Failed to update grave: ${error.message}`)
  }

  revalidatePath("/graves")
  revalidatePath("/my-graves")
  revalidatePath(`/graves/${id}`)
  redirect(`/graves/${id}`)
}

export async function deleteGrave(id: string) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const { error } = await supabase.from("graves").delete().eq("id", id).eq("created_by", user.id)

  if (error) {
    throw new Error(`Failed to delete grave: ${error.message}`)
  }

  revalidatePath("/graves")
  revalidatePath("/my-graves")
  redirect("/my-graves")
}

export async function addMemory(graveId: string, formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const memoryData = {
    grave_id: graveId,
    content: formData.get("content") as string,
    author_name: formData.get("author_name") as string,
    created_by: user.id,
  }

  const { error } = await supabase.from("memories").insert(memoryData)

  if (error) {
    throw new Error(`Failed to add memory: ${error.message}`)
  }

  revalidatePath(`/graves/${graveId}`)
}

export async function updateMemory(memoryId: string, formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const memoryData = {
    content: formData.get("content") as string,
    author_name: formData.get("author_name") as string,
  }

  const { error } = await supabase.from("memories").update(memoryData).eq("id", memoryId).eq("created_by", user.id)

  if (error) {
    throw new Error(`Failed to update memory: ${error.message}`)
  }

  revalidatePath(`/graves/*`)
}

export async function deleteMemory(memoryId: string, graveId: string) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const { error } = await supabase.from("memories").delete().eq("id", memoryId).eq("created_by", user.id)

  if (error) {
    throw new Error(`Failed to delete memory: ${error.message}`)
  }

  revalidatePath(`/graves/${graveId}`)
}

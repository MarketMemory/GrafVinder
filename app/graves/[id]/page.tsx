import { createClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { GravePage } from "@/components/grave-page"

interface PageProps {
  params: {
    id: string
  }
}

export default async function GraveDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: grave, error } = await supabase
    .from("graves")
    .select(
      `
      *,
      memories (
        id,
        content,
        author_name,
        created_at,
        created_by
      )
    `,
    )
    .eq("id", params.id)
    .single()

  if (error || !grave) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <GravePage grave={grave} user={user} />
}

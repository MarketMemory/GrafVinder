import { createClient } from "@/lib/supabase"
import { GraveList } from "@/components/grave-list"

interface PageProps {
  searchParams: {
    search?: string
  }
}

export default async function GravesPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const search = searchParams.search || ""

  let query = supabase.from("graves").select("*").order("created_at", { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,cemetery_name.ilike.%${search}%,cemetery_location.ilike.%${search}%`)
  }

  const { data: graves, error } = await query

  if (error) {
    console.error("Error fetching graves:", error)
    return <div>Er is een fout opgetreden bij het laden van de graven.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alle Graven</h1>
          <p className="text-muted-foreground">Zoek en vind informatie over graven in Nederland</p>
        </div>

        <GraveList graves={graves || []} />
      </div>
    </div>
  )
}

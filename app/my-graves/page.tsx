import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { MyGraveCard } from "@/components/my-grave-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function MyGravesPage() {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth")
  }

  const { data: graves, error } = await supabase
    .from("graves")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user graves:", error)
    return <div>Er is een fout opgetreden bij het laden van je graven.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mijn Graven</h1>
            <p className="text-muted-foreground">Beheer de graven die je hebt toegevoegd</p>
          </div>
          <Link href="/add-grave">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Graf Toevoegen
            </Button>
          </Link>
        </div>

        {graves && graves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graves.map((grave) => (
              <MyGraveCard key={grave.id} grave={grave} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nog geen graven toegevoegd</h3>
            <p className="text-muted-foreground mb-4">Begin met het toevoegen van je eerste graf</p>
            <Link href="/add-grave">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Eerste Graf Toevoegen
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

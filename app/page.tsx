import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonationBanner } from "@/components/donation-banner"
import { Search, Plus, Heart, Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { nl } from "date-fns/locale"

export default async function HomePage() {
  const supabase = createClient()

  // Fetch recent graves
  const { data: recentGraves } = await supabase
    .from("graves")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen">
      <DonationBanner />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vind en herdenk
              <span className="text-primary block">geliefden</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              GrafVinder helpt je bij het vinden van rustplaatsen en het delen van herinneringen aan dierbaren in
              Nederland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/graves">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Zoek Graven
                </Button>
              </Link>
              <Link href="/add-grave">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Plus className="h-5 w-5 mr-2" />
                  Graf Toevoegen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Hoe GrafVinder werkt</h2>
              <p className="text-muted-foreground text-lg">Eenvoudig, respectvol en toegankelijk voor iedereen</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Search className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Zoeken</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Zoek naar graven op basis van naam, begraafplaats of locatie in onze groeiende database.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Plus className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Toevoegen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Voeg informatie toe over graven die je kent om anderen te helpen bij hun zoektocht.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Herdenken</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Deel herinneringen en verhalen om de nagedachtenis van geliefden levend te houden.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Graves Section */}
      {recentGraves && recentGraves.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Recent Toegevoegde Graven</h2>
                <p className="text-muted-foreground text-lg">
                  Ontdek de nieuwste informatie die door onze community is gedeeld
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentGraves.map((grave) => (
                  <Card key={grave.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{grave.name}</CardTitle>
                      <CardDescription>
                        {grave.cemetery_name}, {grave.cemetery_location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {grave.birth_date && grave.death_date && (
                          <p>
                            {new Date(grave.birth_date).getFullYear()} - {new Date(grave.death_date).getFullYear()}
                          </p>
                        )}
                        <p>
                          Toegevoegd{" "}
                          {formatDistanceToNow(new Date(grave.created_at), {
                            addSuffix: true,
                            locale: nl,
                          })}
                        </p>
                      </div>
                      <Link href={`/graves/${grave.id}`}>
                        <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                          Bekijk Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/graves">
                  <Button variant="outline" size="lg">
                    Bekijk Alle Graven
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Word onderdeel van onze community</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Help anderen bij het vinden van hun geliefden door informatie te delen en herinneringen toe te voegen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/add-grave">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Graf Toevoegen
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Meer Over Ons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

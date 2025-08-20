import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGrave } from "@/actions/grave-actions"
import { MapPin, User } from "lucide-react"

export default async function AddGravePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Graf Toevoegen</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Help anderen door informatie over een graf toe te voegen aan onze database
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Grafinformatie
              </CardTitle>
              <CardDescription>
                Vul alle bekende informatie in om anderen te helpen bij het vinden van dit graf
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createGrave} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">Persoonlijke Gegevens</h3>
                  </div>

                  <div>
                    <Label htmlFor="name">Volledige naam *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Voor- en achternaam van de overledene"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birth_date">Geboortedatum</Label>
                      <Input id="birth_date" name="birth_date" type="date" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="death_date">Overlijdensdatum</Label>
                      <Input id="death_date" name="death_date" type="date" className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* Cemetery Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">Begraafplaats Gegevens</h3>
                  </div>

                  <div>
                    <Label htmlFor="cemetery_name">Naam begraafplaats *</Label>
                    <Input
                      id="cemetery_name"
                      name="cemetery_name"
                      type="text"
                      required
                      placeholder="Bijv. Algemene Begraafplaats Zorgvlied"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cemetery_location">Plaats begraafplaats *</Label>
                    <Input
                      id="cemetery_location"
                      name="cemetery_location"
                      type="text"
                      required
                      placeholder="Stad of gemeente waar de begraafplaats zich bevindt"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="grave_location">Locatie op begraafplaats</Label>
                    <Input
                      id="grave_location"
                      name="grave_location"
                      type="text"
                      placeholder="Bijv. Vak A, Rij 12, Graf 34 of andere locatie-aanduiding"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Aanvullende informatie</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Eventuele extra informatie die kan helpen bij het vinden van dit graf..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Graf Toevoegen
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <a href="/graves">Annuleren</a>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Let op:</strong> Voeg alleen graven toe waarvan je zeker weet dat de informatie correct is. Dit
              helpt anderen bij het vinden van hun geliefden.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

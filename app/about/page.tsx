import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Shield, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Over GrafVinder</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Een respectvol platform om graven te vinden en geliefden te herdenken in Nederland
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Onze Missie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                GrafVinder is ontstaan uit de behoefte om families te helpen bij het vinden van de rustplaatsen van hun
                dierbaren. We geloven dat iedereen het recht heeft om zijn geliefden te herdenken en hun laatste
                rustplaats te bezoeken, ongeacht de tijd die is verstreken.
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Respect & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We behandelen alle informatie met de grootste zorg en respect. Privacy en waardigheid staan altijd
                  voorop.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Gemeenschap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Samen bouwen we een database die families helpt. Elke bijdrage maakt het verschil voor anderen.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Toegankelijkheid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  GrafVinder is gratis toegankelijk voor iedereen. We geloven dat herdenken geen privilege moet zijn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Herdenking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We faciliteren het delen van herinneringen en verhalen, zodat de nagedachtenis van geliefden
                  voortleeft.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hoe werkt GrafVinder?</CardTitle>
              <CardDescription>Een eenvoudig proces om graven te vinden en toe te voegen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">Zoeken</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Zoek in onze database op naam, begraafplaats of locatie
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">Toevoegen</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Voeg nieuwe graven toe om anderen te helpen bij hun zoektocht
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">Herdenken</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Deel herinneringen en verhalen om de nagedachtenis levend te houden
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>Vragen, suggesties of hulp nodig?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We staan altijd open voor feedback en zijn er om te helpen. Neem gerust contact met ons op als je vragen
                hebt over het platform of hulp nodig hebt bij het zoeken naar een graf.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Let op:</strong> GrafVinder is een community-gedreven platform. We zijn afhankelijk van
                bijdragen van gebruikers om onze database up-to-date en compleet te houden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

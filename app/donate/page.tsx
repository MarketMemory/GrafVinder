import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Server, Code, Coffee } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Steun GrafVinder</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Help ons om GrafVinder gratis en toegankelijk te houden voor iedereen
            </p>
          </div>

          {/* Why donate */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Waarom doneren?</CardTitle>
              <CardDescription>Jouw steun maakt het verschil</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                GrafVinder is een gratis platform dat families helpt bij het vinden van hun geliefden. Net als Wikipedia
                zijn we afhankelijk van de steun van onze community om te kunnen blijven bestaan en groeien.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Elke donatie, hoe klein ook, helpt ons om de servers draaiende te houden, nieuwe functies te ontwikkelen
                en het platform te verbeteren voor iedereen.
              </p>
            </CardContent>
          </Card>

          {/* What we use donations for */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  Server & Hosting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Betrouwbare servers en database hosting om ervoor te zorgen dat GrafVinder altijd beschikbaar is.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-500" />
                  Ontwikkeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Nieuwe functies, verbeteringen en onderhoud om het platform beter te maken voor alle gebruikers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Donation options */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Donatie Opties</CardTitle>
              <CardDescription>Kies een manier om bij te dragen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-6 border rounded-lg">
                  <Coffee className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Koffie</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">€3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Een kleine bijdrage</p>
                  <Button className="w-full" disabled>
                    Binnenkort beschikbaar
                  </Button>
                </div>

                <div className="text-center p-6 border rounded-lg border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Supporter</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">€10</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Populaire keuze</p>
                  <Button className="w-full" disabled>
                    Binnenkort beschikbaar
                  </Button>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Server className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Sponsor</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">€25</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Genereuze steun</p>
                  <Button className="w-full" disabled>
                    Binnenkort beschikbaar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative ways to help */}
          <Card>
            <CardHeader>
              <CardTitle>Andere manieren om te helpen</CardTitle>
              <CardDescription>Niet iedereen kan doneren, en dat is oké!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Voeg graven toe</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help onze database groeien door informatie over graven toe te voegen die je kent.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Vertel anderen</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Deel GrafVinder met familie en vrienden die er baat bij kunnen hebben.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Feedback geven</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help ons het platform te verbeteren door suggesties en feedback te delen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Bedankt</strong> voor je overweging om GrafVinder te steunen. Samen maken we het verschil.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

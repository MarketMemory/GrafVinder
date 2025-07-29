import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Server, Users, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Steun GrafVinder</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help ons een gratis, toegankelijk platform te blijven waar iedereen herinneringen kan delen en geliefden kan
            herdenken.
          </p>
        </div>

        {/* Why Donate Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Waarom doneren?
            </CardTitle>
            <CardDescription>
              Net als Wikipedia geloven wij dat toegang tot het delen van herinneringen een fundamenteel recht is.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Server className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Server & Hosting Kosten</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Database hosting, beeldopslag en bandbreedte om alle herinneringen veilig te bewaren.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Veiligheid & Privacy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Investering in beveiliging en privacy-tools om jouw gegevens te beschermen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Nieuwe Functies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ontwikkeling van nieuwe tools zoals kaartintegratie, betere zoekfuncties en mobiele apps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Toegankelijkheid</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gratis toegang voor iedereen, ongeacht financiële situatie.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>€5</CardTitle>
              <CardDescription>Een kopje koffie</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Helpt met de dagelijkse serverkosten</p>
              <Button className="w-full" asChild>
                <a href="https://www.paypal.com/donate/?hosted_button_id=DJA4BB9Y34QNY" target="_blank" rel="noopener noreferrer">
                  Doneer €5
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">€15</CardTitle>
              <CardDescription>Een maaltijd</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Ondersteunt hosting voor een week</p>
              <Button className="w-full" asChild>
                <a href="https://www.paypal.com/donate/?hosted_button_id=TL8H3JKTEYCL2" target="_blank" rel="noopener noreferrer">
                  Doneer €15
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>€50</CardTitle>
              <CardDescription>Een maand ondersteuning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Financiert nieuwe functies en verbeteringen
              </p>
              <Button className="w-full" asChild>
                <a href="https://www.paypal.com/donate/?hosted_button_id=Q2WUTAYH2RQVS" target="_blank" rel="noopener noreferrer">
                  Doneer €50
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Custom Amount */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Aangepast bedrag</CardTitle>
            <CardDescription>
              Elke bijdrage, groot of klein, helpt ons het platform draaiende te houden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-grow">
                <label htmlFor="custom-amount" className="block text-sm font-medium mb-2">
                  Bedrag (€)
                </label>
                <input
                  type="number"
                  id="custom-amount"
                  min="1"
                  placeholder="25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button asChild>
                <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer">
                  Doneer
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Support */}
        <Card>
          <CardHeader>
            <CardTitle>Andere manieren om te helpen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Deel het platform</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vertel familie en vrienden over GrafVinder. Meer gebruikers betekent een rijkere gemeenschap.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Feedback geven</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help ons verbeteren door suggesties en feedback te delen via onze contactpagina.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Vrijwilligerswerk</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Heb je technische vaardigheden? We zoeken altijd vrijwilligers voor ontwikkeling en onderhoud.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to site */}
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/">Terug naar GrafVinder</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

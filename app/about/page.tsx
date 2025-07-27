import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, Shield, Zap, BookOpen } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Over GrafVinder</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Een gratis, gemeenschapsgedreven platform voor het delen van herinneringen en het herdenken van geliefden.
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
              GrafVinder is geïnspireerd door het Wikipedia-model: een gratis, toegankelijk platform dat wordt
              onderhouden door de gemeenschap. Wij geloven dat het delen van herinneringen en het herdenken van
              geliefden een fundamenteel menselijk recht is, ongeacht iemands financiële situatie.
            </p>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              Hoe het werkt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Voor iedereen toegankelijk</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Iedereen kan gratis graven toevoegen, herinneringen delen en zoeken naar geliefden.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Gemeenschapsgedreven</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gebruikers voegen content toe, delen herinneringen en helpen het platform te verbeteren.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Donatie-ondersteund</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Net als Wikipedia wordt het platform gefinancierd door vrijwillige donaties van gebruikers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-green-500" />
                Toegankelijkheid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gratis voor iedereen, altijd. Geen verborgen kosten of premium functies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-500" />
                Privacy & Veiligheid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jouw gegevens zijn veilig. We verkopen geen data en respecteren je privacy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-purple-500" />
                Gemeenschap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Samen bouwen we een platform waar iedereen herinneringen kan delen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-500" />
                Innovatie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Voortdurende verbetering door feedback van de gemeenschap.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Support Us */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-center">Help ons groeien</CardTitle>
            <CardDescription className="text-center">
              Jouw steun helpt ons het platform gratis en toegankelijk te houden voor iedereen.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Doneer nu
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Terug naar GrafVinder</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

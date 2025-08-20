import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DonationBanner from "@/components/donation-banner"
import { MapPin, Heart, Users, Search } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Donation Banner */}
      <DonationBanner />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
            Vind en herdenk je <span className="text-blue-600 dark:text-blue-400">geliefden</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen
            in Nederland. Deel herinneringen en eer hun nagedachtenis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/graves">
                <Search className="mr-2 h-5 w-5" />
                Zoek Graven
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Link href="/add-grave">
                <MapPin className="mr-2 h-5 w-5" />
                Graf Toevoegen
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-12">Waarom GrafVinder?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle>Eenvoudig Zoeken</CardTitle>
                <CardDescription>Vind graven snel met onze gebruiksvriendelijke zoekfunctie</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
                <CardTitle>Herinneringen Delen</CardTitle>
                <CardDescription>Deel mooie herinneringen en foto's van je geliefden</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle>Gemeenschap</CardTitle>
                <CardDescription>Verbind met anderen die ook hun dierbaren herdenken</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Graves Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-12">
            Recent Toegevoegde Graven
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards - in real app these would be fetched from database */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Graf {i}</CardTitle>
                  <CardDescription>Begraafplaats Voorbeeld • Amsterdam</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Een mooie rustplaats met veel herinneringen...
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4 bg-transparent">
                    <Link href={`/graves/${i}`}>Bekijk Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/graves">Alle Graven Bekijken</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-50 dark:bg-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">Help ons groeien</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Voeg het graf van je dierbare toe aan onze database en help anderen bij het vinden van hun geliefden.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/add-grave">
              <MapPin className="mr-2 h-5 w-5" />
              Graf Toevoegen
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

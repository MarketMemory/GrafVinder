import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            GrafVinder - Vind eenvoudig graven in Nederland
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen
            in Nederland. Ontdek verhalen, deel herinneringen en eer het leven van degenen die ons dierbaar zijn.
          </p>
        </div>
      </section>

      {/* Recent Toegevoegde Graven Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Toegevoegde Graven</h2>
            <Link href="/graves" className="text-blue-600 hover:text-blue-800 font-medium">
              Bekijk alle graven →
            </Link>
          </div>

          {/* Search Inputs */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Zoek op naam, biografie of locatie" className="pl-10 bg-gray-50 border-gray-200" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Filter op begraafplaats/locatie" className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </div>

          {/* Grave Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Linda E.M. Lenos-Sprokholt */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src="/placeholder.svg?height=240&width=320"
                  alt="Graf van Linda E.M. Lenos-Sprokholt"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Linda E.M. Lenos-Sprokholt</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  12-03-1966 – 21-09-2022
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  Begraafplaats Zaandam, Vak 3, Rij C, Graf 12
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  Wat begon als een toevallige kennismaking, groeide uit tot een diepe liefdesrelatie. Onze tijd samen
                  werd steeds waardevoller. We groeiden van...
                </p>
              </CardContent>
            </Card>

            {/* Anja Wassink */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src="/placeholder.svg?height=240&width=320"
                  alt="Graf van Anja Wassink"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Anja Wassink</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  27-09-1968 – 12-07-2024
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  Begraafplaats Zaandam, Vak 16, Rij D, Graf 2
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  Loslaten betekent niet vergeten. Het betekent vasthouden aan wat er was, zonder het vast te klemmen.
                  Het betekent haar laten gaan, terwijl de...
                </p>
              </CardContent>
            </Card>

            {/* Dicky van Dijk */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src="/placeholder.svg?height=240&width=320"
                  alt="Graf van Dicky van Dijk"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Dicky van Dijk</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  01-10-1997 – 16-09-2015
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  Begraafplaats Zaandam, Vak 24, Rij D, Graf 3
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  Dick werd uit het leven gerukt, daarmee ook uit het leven van samen zijn. Maar wat we blijft, is zijn
                  plek in de harten van hen die hem...
                </p>
              </CardContent>
            </Card>

            {/* Neeltje Oranje-van der Leer */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src="/placeholder.svg?height=240&width=320"
                  alt="Graf van Neeltje Oranje-van der Leer"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Neeltje Oranje-van der Leer</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  02-10-1910 – 19-09-2002
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  Begraafplaats Zaandam, Vak 25, Rij Q, Graf 20
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  In het leven van Neeltje Oranje-van der Leer stond liefde centraal. Niet als iets groots of
                  meeslepends, maar als een stille kracht die zich uitte in zorg...
                </p>
              </CardContent>
            </Card>

            {/* Cornelis Oranje */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src="/placeholder.svg?height=240&width=320"
                  alt="Graf van Cornelis Oranje"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Cornelis Oranje</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  19-06-1909 – 23-07-1983
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  Begraafplaats Zaandam, Vak 25, Rij Q, Graf 20
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  Voor zijn zoon Menno Frank, en voor allen die hem kenden, was Cornelis een vaste bron van rust. Een
                  man met principes, met een heldere blik op wat tel...
                </p>
              </CardContent>
            </Card>

            {/* Menno Frank Oranje */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src="/placeholder.svg?height=240&width=320"
                  alt="Graf van Menno Frank Oranje"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Menno Frank Oranje</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  27-05-1971 – 31-12-2013
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  Begraafplaats Zaandam, Vak 25, Rij Q, Graf 20
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  Hij begreep dat het leven niet draait om haast, bezit of uiterlijk vertoon, maar om het koesteren van
                  de mensen en momenten die je pad kruisen. Met zijn...
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action Section */}
          <section className="py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deel jouw verhaal</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Help anderen door het verhaal van jouw geliefde te delen. Elke herinnering telt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/add-grave">Graf Toevoegen</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/graves">Graven Bekijken</Link>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

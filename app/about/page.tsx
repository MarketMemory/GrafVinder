import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Search, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Over GrafVinder</h1>
          <p className="text-xl text-muted-foreground">
            Een platform om geliefden te herdenken en graven te vinden in Nederland
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Onze Missie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                GrafVinder helpt families en vrienden om de rustplaatsen van hun geliefden te vinden en te herdenken. We
                geloven dat iedereen het recht heeft om afscheid te nemen en herinneringen te koesteren.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Onze community bestaat uit mensen die hun verhalen willen delen en anderen willen helpen bij het vinden
                van rustplaatsen. Samen bouwen we een database van herinneringen.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-500" />
                Zoeken & Vinden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gebruik onze zoekfunctie om graven te vinden op basis van naam, begraafplaats of locatie. Onze database
                groeit dagelijks dankzij bijdragen van gebruikers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                Informatie Delen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Voeg informatie toe over graven die je kent. Help anderen door locaties, herinneringen en belangrijke
                details te delen die families kunnen helpen.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Hoe het werkt</CardTitle>
            <CardDescription>Eenvoudig in gebruik, krachtig in functionaliteit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Registreer je account</h3>
                <p className="text-muted-foreground">Maak een gratis account aan met je e-mailadres</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Zoek of voeg toe</h3>
                <p className="text-muted-foreground">Zoek naar bestaande graven of voeg nieuwe informatie toe</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Deel herinneringen</h3>
                <p className="text-muted-foreground">Voeg persoonlijke herinneringen en verhalen toe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

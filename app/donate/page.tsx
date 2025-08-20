import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Coffee, Gift } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Steun GrafVinder</h1>
          <p className="text-xl text-muted-foreground">
            Help ons om dit platform gratis en toegankelijk te houden voor iedereen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Coffee className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <CardTitle>Koffie</CardTitle>
              <CardDescription>€3</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Koop ons een koffie om de ontwikkeling te ondersteunen
              </p>
              <Button className="w-full bg-transparent" variant="outline">
                Doneer €3
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center border-primary">
            <CardHeader>
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <CardTitle>Supporter</CardTitle>
              <CardDescription>€10</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Word een maandelijkse supporter van het platform</p>
              <Button className="w-full">Doneer €10</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Gift className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <CardTitle>Sponsor</CardTitle>
              <CardDescription>€25</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Help ons met server kosten en nieuwe functies</p>
              <Button className="w-full bg-transparent" variant="outline">
                Doneer €25
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Waarom doneren?</CardTitle>
            <CardDescription>Jouw bijdrage maakt het verschil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">Gratis toegang</h3>
                <p className="text-muted-foreground">
                  We houden GrafVinder gratis toegankelijk voor iedereen die op zoek is naar geliefden
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">Server kosten</h3>
                <p className="text-muted-foreground">
                  Jouw donatie helpt ons om de server kosten te dekken en de website online te houden
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">Nieuwe functies</h3>
                <p className="text-muted-foreground">
                  We kunnen nieuwe functies ontwikkelen zoals betere zoekopties en mobiele apps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Alle donaties worden gebruikt voor het onderhoud en de verbetering van GrafVinder.
            <br />
            Bedankt voor je steun! ❤️
          </p>
        </div>
      </div>
    </div>
  )
}

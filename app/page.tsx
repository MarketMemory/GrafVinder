import GravePage, { type GraveData } from "@/components/grave-page"

export default function Home() {
  // Mock-data om de pagina te demonstreren
  const mock: GraveData = {
    name: "Anna Maria van der Velde",
    birthDate: "12 mei 1930",
    deathDate: "20 maart 2020",
    biography:
      "Anna Maria van der Velde, geboren in een klein dorpje in Drenthe, was een geliefde lerares die generaties lang heeft geïnspireerd met haar passie voor geschiedenis. Naast haar werk was ze een fervent tuinier en stond ze bekend om haar prachtige rozen. Ze was een actieve vrijwilliger in de lokale gemeenschap en zette zich in voor het behoud van historische gebouwen. Haar warme persoonlijkheid en wijsheid zullen door velen gemist worden.",
    gravePhotoUrl: "/placeholder.svg?height=160&width=160",
    location: {
      latitude: 52.0907,
      longitude: 5.1214,
      description: "Begraafplaats Rusthof, Utrecht, Vak C, Rij 12, Graf 5",
    },
    memories: [
      {
        id: "1",
        text: "Tante Anna was altijd zo lief en had de beste verhalen over vroeger. Ik mis haar humor.",
        date: "10 april 2020",
        author: "Neef Jan",
      },
      {
        id: "2",
        text: "Haar lessen waren nooit saai. Ze maakte geschiedenis levend. Een inspiratie voor mij om zelf leraar te worden.",
        date: "15 mei 2020",
        author: "Oud-leerling Sarah",
      },
    ],
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <GravePage data={mock} />
    </main>
  )
}

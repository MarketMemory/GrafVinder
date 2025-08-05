import { createServerClient } from "@/lib/supabase"
import DonationBanner from "@/components/donation-banner"
import GraveList from "@/components/grave-list"
import type { GraveData } from "@/components/grave-page"

export const revalidate = 0 // Zorgt ervoor dat de data altijd vers is bij elke request
export const metadata = {
  title: 'GrafVinder – Vind graven van overleden dierbaren in Nederland',
  description:
    'GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen in Nederland.',
  openGraph: {
    title: 'GrafVinder – Vind graven van overleden dierbaren in Nederland',
    description:
      'GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen in Nederland.',
    url: 'https://grafvinder.vercel.app',
    siteName: 'GrafVinder',
    locale: 'nl_NL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function Home() {
  const supabase = createServerClient()

  // Haal de instelling voor de donatiebanner op
  const { data: bannerSetting, error: settingError } = await supabase
    .from("app_settings")
    .select("setting_value")
    .eq("setting_name", "show_donation_banner")
    .single()

  const showDonationBanner = bannerSetting?.setting_value === "true" && !settingError

  // Haal de meest recente graven op uit de database
  const { data: graves, error } = await supabase
    .from("graves")
    .select("*")
    .order("created_at", { ascending: false }) // Sorteer op aanmaakdatum (nieuwste eerst)
    .limit(6) // Toon alleen de 6 meest recente graven

  let formattedGraves: GraveData[] = []

  if (!error && graves) {
    // Pas de data aan naar de GraveData interface
    formattedGraves = graves.map((grave) => ({
      id: grave.id,
      name: grave.name,
      birthDate: grave.birth_date,
      deathDate: grave.death_date,
      biography: grave.biography || "",
      gravePhotoUrl: grave.grave_photo_url || "/placeholder.svg?height=160&width=160",
      deceasedPhotoUrl: grave.deceased_photo_url || "/placeholder.svg?height=160&width=160",
      location: {
        latitude: grave.location_latitude || 0,
        longitude: grave.location_longitude || 0,
        description: grave.location_description || "Onbekende locatie",
      },
      memories: [], // Herinneringen worden hier niet geladen
    }))
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {showDonationBanner && <DonationBanner />} {/* Conditioneel renderen */}
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            GrafVinder - Vind eenvoudig graven in Nederland
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen
            in Nederland. Ontdek verhalen, deel herinneringen en eer het leven van degenen die ons dierbaar zijn.
          </p>
        </div>
        {/* Recent Graves Section */}
        {formattedGraves.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Recent Toegevoegde Graven</h2>
              <a
                href="/graves"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Bekijk alle graven →
              </a>
            </div>
            <GraveList initialGraves={formattedGraves} />
          </div>
        )}
        {/* Call to Action */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Deel jouw verhaal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Help anderen door het verhaal van jouw geliefde te delen. Elke herinnering telt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/add-grave"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Graf Toevoegen
            </a>
            <a
              href="/graves"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Graven Bekijken
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

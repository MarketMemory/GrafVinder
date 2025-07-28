"use client" // Maak deze component een Client Component om Dialog te kunnen gebruiken

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, CalendarDays, BookOpen, Plus, ExternalLink, Edit } from "lucide-react" // Importeer Edit icon
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddMemoryForm from "./add-memory-form"
import EditMemoryForm from "./edit-memory-form" // Importeer het nieuwe bewerkingsformulier
import { useState } from "react"
import { formatDateRange } from "@/lib/date-utils" // Importeer de nieuwe utility

export interface GraveData {
  id: string // Voeg ID toe voor unieke identificatie
  name: string
  birthDate: string
  deathDate: string
  biography: string
  gravePhotoUrl: string | null // Kan null zijn
  deceasedPhotoUrl: string | null // Nieuw: URL voor foto van de overledene
  location: {
    latitude: number
    longitude: number
    description: string
  }
  memories: {
    id: string
    text: string
    date: string
    author: string
  }[]
}

interface GravePageProps {
  data: GraveData
}

/**
 * Een overzichtelijke grafpagina met:
 *  - foto van het graf
 *  - basisgegevens
 *  - biografie
 *  - locatie (placeholder-kaart)
 *  - herinneringen
 */
const GravePage = ({ data }: GravePageProps) => {
  const [isAddMemoryDialogOpen, setIsAddMemoryDialogOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<GraveData["memories"][0] | null>(null)

  const handleEditMemory = (memory: GraveData["memories"][0]) => {
    setEditingMemory(memory)
  }

  const handleCloseEditDialog = () => {
    setEditingMemory(null)
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        {/* Header */}
        <CardHeader className="flex flex-col items-center text-center p-6 md:p-8">
          {data.deceasedPhotoUrl && (
            <Avatar className="w-32 h-32 md:w-40 md:h-40 mb-4 border-4 border-gray-200 shadow-md">
              <AvatarImage src={data.deceasedPhotoUrl || "/placeholder.svg"} alt={`Foto van ${data.name}`} />
              <AvatarFallback>
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}

          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">{data.name}</CardTitle>

          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
            <CalendarDays className="w-5 h-5" />
            {formatDateRange(data.birthDate, data.deathDate)}
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 md:p-8 grid gap-8">
          {/* Grafoto */}
          {data.gravePhotoUrl && (
            <section className="grid gap-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Grafsteen icoon"
                  width={24}
                  height={24}
                  className="inline-block"
                />
                Foto van het graf
              </h2>
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={data.gravePhotoUrl || "/placeholder.svg?height=256&width=600&query=grave%20photo"}
                  alt={`Foto van het graf van ${data.name}`}
                  fill
                  className="object-cover"
                />
              </div>
            </section>
          )}

          {/* Biografie */}
          <section className="grid gap-2">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <BookOpen className="w-6 h-6" />
              Levensverhaal
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">{data.biography}</p>
          </section>

          {/* Locatie */}
          <section className="grid gap-2">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <MapPin className="w-6 h-6" />
              Locatie van het graf
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{data.location.description}</p>

            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={`/placeholder.svg?height=256&width=600&query=map%20of%20the%20Netherlands%20with%20a%20pin`}
                alt="Kaart van de graflocatie"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4 text-center">
                <p className="text-lg font-medium mb-2">Interactieve kaartweergave</p>
                <p className="text-sm mb-4">Directe inbedding van externe kaarten is vaak niet mogelijk.</p>
                <Button asChild>
                  <a href="https://www.grafzoeken.nl/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Grafzoeken.nl
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Herinneringen */}
          <section className="grid gap-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <BookOpen className="w-6 h-6" />
              Herinneringen
            </h2>

            {data.memories.length > 0 ? (
              <div className="grid gap-4">
                {data.memories.map((memory) => (
                  <Card key={memory.id} className="p-4 bg-gray-50 dark:bg-gray-800">
                    <p className="italic text-gray-700 dark:text-gray-300 mb-2">"{memory.text}"</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        — {memory.author}, {memory.date}
                      </p>
                      <Button variant="ghost" size="icon" onClick={() => handleEditMemory(memory)}>
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Bewerk herinnering</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Nog geen herinneringen toegevoegd.</p>
            )}

            <Dialog open={isAddMemoryDialogOpen} onOpenChange={setIsAddMemoryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Herinnering toevoegen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Voeg een herinnering toe</DialogTitle>
                </DialogHeader>
                <AddMemoryForm graveId={data.id} onSuccess={() => setIsAddMemoryDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            {/* Dialoog voor het bewerken van een herinnering */}
            {editingMemory && (
              <Dialog open={!!editingMemory} onOpenChange={setEditingMemory}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Bewerk herinnering</DialogTitle>
                  </DialogHeader>
                  <EditMemoryForm initialData={editingMemory} graveId={data.id} onSuccess={handleCloseEditDialog} />
                </DialogContent>
              </Dialog>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default GravePage

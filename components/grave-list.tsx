"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GraveData } from "@/components/grave-page" // Hergebruik de interface
import Image from "next/image"
import Link from "next/link"
import { MapPin, CalendarDays } from "lucide-react"
import { Label } from "@/components/ui/label"

interface GraveListProps {
  initialGraves: GraveData[]
}

export default function GraveList({ initialGraves }: GraveListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocation, setFilterLocation] = useState("") // Voor een toekomstige filter op locatie

  const filteredGraves = useMemo(() => {
    let filtered = initialGraves

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (grave) =>
          grave.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          grave.biography.toLowerCase().includes(lowerCaseSearchTerm) ||
          grave.location.description.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    if (filterLocation) {
      const lowerCaseFilterLocation = filterLocation.toLowerCase()
      filtered = filtered.filter((grave) => grave.location.description.toLowerCase().includes(lowerCaseFilterLocation))
    }

    return filtered
  }, [initialGraves, searchTerm, filterLocation])

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="grid gap-2">
          <Label htmlFor="searchTerm">Zoek op naam, biografie of locatie</Label>
          <Input
            id="searchTerm"
            type="text"
            placeholder="Bijv. Anna Maria, tuinier, Rusthof..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filterLocation">Filter op begraafplaats/locatie</Label>
          <Input
            id="filterLocation"
            type="text"
            placeholder="Bijv. Utrecht, Vak C..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>
        {/* Add more filter options here if needed, e.g., a dropdown for specific cities */}
      </div>

      {filteredGraves.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Geen graven gevonden die voldoen aan de zoekcriteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGraves.map((grave) => (
            // Link nu naar de unieke ID van het graf
            <Link href={`/graves/${grave.id}`} key={grave.id} className="block">
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-200">
                <div className="relative w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <Image
                    src={grave.gravePhotoUrl || "/placeholder.svg?height=192&width=384&query=grave%20photo"}
                    alt={`Foto van het graf van ${grave.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{grave.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarDays className="w-4 h-4" />
                    {grave.birthDate} - {grave.deathDate}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {grave.location.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {grave.biography || "Geen biografie beschikbaar."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

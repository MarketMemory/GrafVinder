"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GraveData } from "@/components/grave-page"
import Image from "next/image"
import { MapPin, CalendarDays, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { deleteGrave } from "@/actions/grave-actions"
import { useState } from "react"
import { formatDateRange } from "@/lib/date-utils" // Importeer de nieuwe utility

interface MyGraveCardProps {
  grave: GraveData & { id: string } // Zorg ervoor dat grave.id beschikbaar is
}

export default function MyGraveCard({ grave }: MyGraveCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(`Weet je zeker dat je het graf van ${grave.name} wilt verwijderen?`)) {
      setIsDeleting(true)
      try {
        const result = await deleteGrave(grave.id)
        if (result.success) {
          toast({
            title: "Succes!",
            description: result.message,
          })
          // Refresh de pagina om de wijzigingen te tonen
          router.refresh()
        } else {
          toast({
            title: "Fout bij verwijderen",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Fout bij verwijderen",
          description: error.message || "Er is een onbekende fout opgetreden.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-200">
      <div className="relative w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {" "}
        {/* Aangepast: bg-gray-200 naar bg-transparent */}
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
          {formatDateRange(grave.birthDate, grave.deathDate)}
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
      <div className="p-4 border-t flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/my-graves/edit/${grave.id}`}>
            <Edit className="w-4 h-4 mr-2" />
            Bewerk
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? "Bezig..." : "Verwijder"}
        </Button>
      </div>
    </Card>
  )
}

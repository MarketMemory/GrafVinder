"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-pink-200" />
          <p className="text-sm md:text-base">
            <strong>Help GrafVinder groeien!</strong> Steun ons met een donatie om deze service gratis te houden.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
            <Link href="/donate">Doneer Nu</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Sluit banner</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

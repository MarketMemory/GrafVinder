"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"
import Link from "next/link"

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 mb-6">
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0 mt-1">
            <Heart className="h-6 w-6 text-red-500" />
          </div>

          <div className="flex-grow">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Help GrafVinder gratis en toegankelijk te houden
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Net als Wikipedia is GrafVinder een gemeenschapsproject. Jouw donatie helpt ons de servers te onderhouden
              en nieuwe functies te ontwikkelen, zodat iedereen gratis herinneringen kan delen.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Doneer nu
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/about">Meer informatie</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

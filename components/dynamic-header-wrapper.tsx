"use client" // Dit maakt het een Client Component

import dynamic from "next/dynamic"
import React from "react"

// Dynamisch importeren van de Header component met ssr: false
// Dit zorgt ervoor dat de Header alleen aan de client-side wordt gerenderd.
const DynamicHeader = dynamic(() => import("@/components/header"), { ssr: false })

export default function DynamicHeaderWrapper() {
  return <DynamicHeader />
}

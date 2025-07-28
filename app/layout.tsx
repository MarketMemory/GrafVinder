import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header" // Importeer de nieuwe Header component
import { ThemeProvider } from "@/components/theme-provider" // Zorg dat deze bestaat
import { Toaster } from "@/components/ui/toaster" // Zorg dat deze bestaat voor toasts
import { ToasterProvider } from "@/hooks/use-toast"

const inter = Inter({ subsets: ["latin"] })

// Gebruik process.env.NEXT_PUBLIC_SITE_URL voor de canonical URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://graf-vinder.vercel.app/"

export const metadata: Metadata = {
  title: "GrafVinder - Vind eenvoudig graven in Nederland",
  description:
    "GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen in Nederland.",
  robots: "index, follow",
  authors: [{ name: "GrafVinder" }],
  openGraph: {
    title: "GrafVinder - Vind eenvoudig graven in Nederland",
    description: "Zoek graven van dierbaren en ontdek hun laatste rustplaats met behulp van GrafVinder.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/favicon.png`, // Absolute URL voor Open Graph afbeelding
        width: 512,
        height: 512,
        alt: "GrafVinder logo: duif en halve maan",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrafVinder - Vind eenvoudig graven in Nederland",
    description: "Zoek graven van dierbaren en ontdek hun laatste rustplaats met behulp van GrafVinder.",
    images: [`${siteUrl}/favicon.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.png", // Favicon toevoegen
    apple: "/favicon.png", // Apple touch icon
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ToasterProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </ToasterProvider>
      </body>
    </html>
  )
}

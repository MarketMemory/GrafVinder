import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GrafVinder - Vind eenvoudig graven in Nederland",
  description:
    "GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen in Nederland.",
  keywords: "graven, begraafplaats, nederland, zoeken, herdenken, overleden",
  authors: [{ name: "GrafVinder Team" }],
  openGraph: {
    title: "GrafVinder - Vind eenvoudig graven in Nederland",
    description:
      "GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen in Nederland.",
    url: "https://grafvinder.vercel.app",
    siteName: "GrafVinder",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrafVinder - Vind eenvoudig graven in Nederland",
    description:
      "GrafVinder helpt je om graven van overleden dierbaren snel en gemakkelijk terug te vinden op begraafplaatsen in Nederland.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

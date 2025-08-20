import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GrafVinder - Vind en herdenk geliefden",
  description: "Een platform om graven te vinden en geliefden te herdenken in Nederland",
  keywords: ["graf", "begraafplaats", "herdenken", "nederland", "zoeken"],
  authors: [{ name: "GrafVinder Team" }],
  openGraph: {
    title: "GrafVinder - Vind en herdenk geliefden",
    description: "Een platform om graven te vinden en geliefden te herdenken in Nederland",
    url: "https://grafvinder.vercel.app",
    siteName: "GrafVinder",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrafVinder - Vind en herdenk geliefden",
    description: "Een platform om graven te vinden en geliefden te herdenken in Nederland",
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
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

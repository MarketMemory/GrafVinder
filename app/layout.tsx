import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header" // Importeer de nieuwe Header component
import { ThemeProvider } from "@/components/theme-provider" // Zorg dat deze bestaat
import { Toaster } from "@/components/ui/toaster" // Zorg dat deze bestaat voor toasts
import { ToasterProvider } from "@/hooks/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GrafVinder - Vind en Herdenk",
  description: "Een platform om graven te vinden en herinneringen te delen.",
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

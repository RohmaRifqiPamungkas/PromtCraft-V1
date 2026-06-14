import type { Metadata } from "next"
import { Geist, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets:  ["latin"],
  weight:   ["400", "500", "600"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets:  ["latin"],
  weight:   ["400", "600"],
})

export const metadata: Metadata = {
  title:       "PromptCraft AI — DB & API Design",
  description: "AI Prompt Architect for database and API design workflows.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="h-screen overflow-hidden antialiased">{children}</body>
    </html>
  )
}

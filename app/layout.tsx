import type React from "react"
import type { Metadata } from "next"
import { Geist as Geist_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ClientProviders } from "@/components/client-providers"

const geist = Geist_Sans({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vibr AI - Intent-Based AI Chat",
  description: "The AI chat that gets your vibe. Built for coders, by coders.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${geist.variable} ${geistMono.variable}`} lang="en" suppressHydrationWarning>
      <body >
        <ClientProviders>
          <Navbar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}

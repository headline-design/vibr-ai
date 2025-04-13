import type React from "react"
import { Geist as Geist_Sans, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { ClientProviders } from "@/components/client-providers"
import ClientLayout from "@/components/client-layout"

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
  title: "Vibr - Vibe coding platform",
  description: "An intelligent coding platform with AI assistance",
  generator: "v0.dev",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <ClientProviders>
          <ClientLayout> {children}</ClientLayout>
        </ClientProviders>
    </>
  )
}

import type React from "react"
import { Inter } from "next/font/google"
import './globals.css'
import { Metadata } from "next"
import { ClientProviders } from "@/components/client-providers"
import ClientLayout from "@/components/client-layout"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vibr - Vibe coding platform",
  description: "An intelligent coding platform with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.className, "min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200")}
      >
        <ClientProviders>
          <ClientLayout>{children}</ClientLayout>
        </ClientProviders>
      </body>
    </html>
  )
}




import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "@/components/client-layout"

export const metadata: Metadata = {
  title: "Vibr - Vibe coding platform",
  description: "An intelligent coding platform with AI assistance",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientLayout>
        <>
          {children}
        </>
      </ClientLayout>
    </>
  )
}

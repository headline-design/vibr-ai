import type React from "react"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <div className="h-[128px] w-full" id="spacer" />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">{children}</main>
    </>
  )
}

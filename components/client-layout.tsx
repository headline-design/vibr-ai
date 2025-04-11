"use client"

import { FluxFloatingPanel } from "@/components/flux-floating-panel"
import { UserFeedbackSystem } from "@/components/flow-state/user-feedback-system"
import { CommandPaletteEnhanced } from "@/components/flow-state/command-palette-enhanced"
import { useDemoState } from "./flow-state/demo-state-provider"
import { usePathname } from "next/navigation"
import type React from "react"
import { Navbar } from "./layout/navbar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen,
  } = useDemoState()

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">{children}</div>

      {/* User feedback system */}
      <UserFeedbackSystem />
      {/* Command Palette */}
      {isCommandPaletteOpen && (
        <CommandPaletteEnhanced
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelect={(command) => console.log(`Selected command: ${command}`)}
        />
      )}
      {isFloatingPanelOpen && (
        <FluxFloatingPanel isOpen={isFloatingPanelOpen} onClose={() => setIsFloatingPanelOpen(false)} />
      )}
    </div>
  )
}

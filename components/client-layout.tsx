"use client"

import type React from "react"

import { FluxFloatingPanel } from "@/components/flux-floating-panel"
import { UserFeedbackSystem } from "@/components/flow-state/user-feedback-system"
import CommandPalette from "./flow-state/command-palette"
import { usePathname } from "next/navigation"
import { useDemoState } from "@/components/flow-state/providers/demo-state-provider"

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
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-200">

      {/* Main Content */}
      <>{children}</>


      {/* User feedback system */}
      <UserFeedbackSystem />
      {/* Command Palette */}
      {isCommandPaletteOpen && (
        <CommandPalette
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

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DemoStateContextType {
  isCommandPaletteOpen: boolean
  setIsCommandPaletteOpen: (open: boolean) => void
  demoView: "floating" | "embedded" | "assistant"
  setDemoView: (view: "floating" | "embedded" | "assistant") => void
  isFloatingPanelOpen: boolean
  setIsFloatingPanelOpen: (open: boolean) => void
}

const DemoStateContext = createContext<DemoStateContextType | undefined>(undefined)

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [demoView, setDemoView] = useState<"floating" | "embedded" | "assistant">("embedded")
  const [isFloatingPanelOpen, setIsFloatingPanelOpen] = useState(false)

  const value: DemoStateContextType = {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    demoView,
    setDemoView,
    isFloatingPanelOpen,
    setIsFloatingPanelOpen,
  }

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}

export function useDemoState() {
  const context = useContext(DemoStateContext)
  if (!context) {
    throw new Error("useDemoState must be used within a DemoStateProvider")
  }
  return context
}

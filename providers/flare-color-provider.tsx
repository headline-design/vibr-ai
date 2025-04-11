"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define available color options
export type FlareColor = "purple" | "amber" | "blue" | "pink" | "green"

type FlareColorContextType = {
  flareColor: FlareColor
  setFlareColor: (color: FlareColor) => void
}

const FlareColorContext = createContext<FlareColorContextType | undefined>(undefined)

export function FlareColorProvider({ children }: { children: ReactNode }) {
  const [flareColor, setFlareColor] = useState<FlareColor>("purple")

  return <FlareColorContext.Provider value={{ flareColor, setFlareColor }}>{children}</FlareColorContext.Provider>
}

export function useFlareColor() {
  const context = useContext(FlareColorContext)
  if (context === undefined) {
    throw new Error("useFlareColor must be used within a FlareColorProvider")
  }
  return context
}


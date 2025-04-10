"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type FluxTheme = "light" | "dark" | "system"
type FluxAccent = "neutral" | "blue" | "violet" | "amber"

interface FluxThemeContextType {
  theme: FluxTheme
  accent: FluxAccent
  setTheme: (theme: FluxTheme) => void
  setAccent: (accent: FluxAccent) => void
}

const FluxThemeContext = createContext<FluxThemeContextType | undefined>(undefined)

export function FluxThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<FluxTheme>("system")
  const [accent, setAccent] = useState<FluxAccent>("neutral")

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("flux-theme") as FluxTheme | null
    const savedAccent = localStorage.getItem("flux-accent") as FluxAccent | null

    if (savedTheme) {
      setThemeState(savedTheme)
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setThemeState(systemTheme)
    }

    if (savedAccent) {
      setAccent(savedAccent)
    }
  }, [])

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark")

    // Add the current theme class
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Save to localStorage
    localStorage.setItem("flux-theme", theme)
  }, [theme])

  // Apply accent changes
  useEffect(() => {
    const root = document.documentElement

    // Remove all accent classes
    root.classList.remove("accent-neutral", "accent-blue", "accent-violet", "accent-amber")

    // Add the current accent class
    root.classList.add(`accent-${accent}`)

    // Save to localStorage
    localStorage.setItem("flux-accent", accent)
  }, [accent])

  const setTheme = (newTheme: FluxTheme) => {
    setThemeState(newTheme)
  }

  return (
    <FluxThemeContext.Provider value={{ theme, accent, setTheme, setAccent }}>{children}</FluxThemeContext.Provider>
  )
}

export function useFluxTheme() {
  const context = useContext(FluxThemeContext)
  if (context === undefined) {
    throw new Error("useFluxTheme must be used within a FluxThemeProvider")
  }
  return context
}

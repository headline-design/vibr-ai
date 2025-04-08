"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type FontSize = "default" | "large" | "x-large"
type ColorContrast = "default" | "high" | "highest"
type AnimationPreference = "default" | "reduced"
type KeyboardNavigationMode = "default" | "enhanced"

interface AccessibilityContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  colorContrast: ColorContrast
  setColorContrast: (contrast: ColorContrast) => void
  animationPreference: AnimationPreference
  setAnimationPreference: (pref: AnimationPreference) => void
  keyboardNavigation: KeyboardNavigationMode
  setKeyboardNavigation: (mode: KeyboardNavigationMode) => void
  dyslexicFont: boolean
  setDyslexicFont: (enabled: boolean) => void
  screenReaderOptimized: boolean
  setScreenReaderOptimized: (enabled: boolean) => void
  autoAnnounce: boolean
  setAutoAnnounce: (enabled: boolean) => void
  resetSettings: () => void
}

const defaultSettings = {
  fontSize: "default" as FontSize,
  colorContrast: "default" as ColorContrast,
  animationPreference: "default" as AnimationPreference,
  keyboardNavigation: "default" as KeyboardNavigationMode,
  dyslexicFont: false,
  screenReaderOptimized: false,
  autoAnnounce: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage if available
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("accessibility-settings")
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings
    }
    return defaultSettings
  })

  // Update settings in localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessibility-settings", JSON.stringify(settings))
    }
  }, [settings])

  // Apply settings to document
  useEffect(() => {
    // Font size
    document.documentElement.dataset.fontSize = settings.fontSize

    // Color contrast
    document.documentElement.dataset.contrast = settings.colorContrast

    // Animation preference
    document.documentElement.dataset.motion = settings.animationPreference

    // Keyboard navigation
    document.documentElement.dataset.keyboard = settings.keyboardNavigation

    // Dyslexic font
    if (settings.dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }

    // Screen reader optimizations
    if (settings.screenReaderOptimized) {
      document.documentElement.setAttribute("role", "application")
      document.documentElement.classList.add("sr-optimized")
    } else {
      document.documentElement.removeAttribute("role")
      document.documentElement.classList.remove("sr-optimized")
    }
  }, [settings])

  // Check system preferences on initial load
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion && settings.animationPreference === "default") {
      setSettings((prev) => ({ ...prev, animationPreference: "reduced" }))
    }

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia("(prefers-contrast: more)").matches
    if (prefersHighContrast && settings.colorContrast === "default") {
      setSettings((prev) => ({ ...prev, colorContrast: "high" }))
    }
  }, [])

  // Setting updaters
  const setFontSize = (size: FontSize) => setSettings((prev) => ({ ...prev, fontSize: size }))
  const setColorContrast = (contrast: ColorContrast) => setSettings((prev) => ({ ...prev, colorContrast: contrast }))
  const setAnimationPreference = (pref: AnimationPreference) =>
    setSettings((prev) => ({ ...prev, animationPreference: pref }))
  const setKeyboardNavigation = (mode: KeyboardNavigationMode) =>
    setSettings((prev) => ({ ...prev, keyboardNavigation: mode }))
  const setDyslexicFont = (enabled: boolean) => setSettings((prev) => ({ ...prev, dyslexicFont: enabled }))
  const setScreenReaderOptimized = (enabled: boolean) =>
    setSettings((prev) => ({ ...prev, screenReaderOptimized: enabled }))
  const setAutoAnnounce = (enabled: boolean) => setSettings((prev) => ({ ...prev, autoAnnounce: enabled }))

  // Reset to defaults
  const resetSettings = () => setSettings(defaultSettings)

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize: settings.fontSize,
        setFontSize,
        colorContrast: settings.colorContrast,
        setColorContrast,
        animationPreference: settings.animationPreference,
        setAnimationPreference,
        keyboardNavigation: settings.keyboardNavigation,
        setKeyboardNavigation,
        dyslexicFont: settings.dyslexicFont,
        setDyslexicFont,
        screenReaderOptimized: settings.screenReaderOptimized,
        setScreenReaderOptimized,
        autoAnnounce: settings.autoAnnounce,
        setAutoAnnounce,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

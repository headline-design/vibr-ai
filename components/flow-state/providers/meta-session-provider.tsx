"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

// Define the structure of MetaSessionData
interface MetaSessionData {
  experienceLevel(experienceLevel: any): unknown
  userName: string
  preferredLanguages: string[]
  lastTopics: string[]
  timeOfDay: string
  deviceType: string
  sessionDuration: number
  interactionCount: number
  lastProjectName?: string
}

// Define the meta session context
interface MetaSessionContextProps {
  metaSession: MetaSessionData
  incrementInteractionCount: () => void
  addTopic: (topic: string) => void
  updateMetaSession: (updates: Partial<MetaSessionData>) => void
}

// Create the meta session context
const MetaSessionContext = createContext<MetaSessionContextProps>({
  metaSession: {
    userName: "Guest",
    preferredLanguages: ["JavaScript", "TypeScript"],
    lastTopics: [],
    timeOfDay: "Morning",
    deviceType: "Desktop",
    sessionDuration: 0,
    interactionCount: 0,
  },
  incrementInteractionCount: () => {},
  addTopic: () => {},
  updateMetaSession: () => {},
})

// Helper function to get the time of day
function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 18) return "Afternoon"
  return "Evening"
}

// Helper function to detect device type
function getDeviceType(): string {
  if (typeof window === "undefined") return "Desktop"
  return window.innerWidth < 768 ? "Mobile" : "Desktop"
}

// Create the meta session provider
export function MetaSessionProvider({ children }: { children: ReactNode }) {
  const [metaSession, setMetaSession] = useState<MetaSessionData>({
    userName: "Guest",
    preferredLanguages: ["JavaScript", "TypeScript"],
    lastTopics: [],
    timeOfDay: getTimeOfDay(),
    deviceType: getDeviceType(),
    sessionDuration: 0,
    interactionCount: 0,
  })

  // Update session duration every minute
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setMetaSession((prev) => ({
        ...prev,
        sessionDuration: Date.now() - startTime,
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Update time of day every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setMetaSession((prev) => ({
        ...prev,
        timeOfDay: getTimeOfDay(),
      }))
    }, 3600000) // Update every hour

    return () => clearInterval(interval)
  }, [])

  // Increment interaction count
  const incrementInteractionCount = useCallback(() => {
    setMetaSession((prev) => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
    }))
  }, [])

  // Add a topic to the lastTopics array
  const addTopic = useCallback((topic: string) => {
    setMetaSession((prev) => {
      // Don't add duplicate topics
      if (prev.lastTopics.includes(topic)) return prev

      // Add the topic to the beginning of the array and limit to 5 topics
      const newTopics = [topic, ...prev.lastTopics].slice(0, 5)
      return {
        ...prev,
        lastTopics: newTopics,
      }
    })
  }, [])

  // Update session with partial data
  const updateMetaSession = useCallback((updates: Partial<MetaSessionData>) => {
    setMetaSession((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  return (
    <MetaSessionContext.Provider value={{ metaSession, incrementInteractionCount, addTopic, updateMetaSession }}>
      {children}
    </MetaSessionContext.Provider>
  )
}

// Create a hook to use the meta session context
export function useMetaSession() {
  return useContext(MetaSessionContext)
}

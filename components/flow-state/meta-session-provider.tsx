"use client"

import { createContext, useContext, useState, type ReactNode, useMemo, useEffect, useCallback } from "react"

// Define the MetaSession data structure
export interface MetaSessionData {
  userName: string
  date: string
  timeOfDay: string
  applicationLocation: string
  experienceLevel: string
  sessionDuration: number
  interactionCount: number
  lastTopics: string[]
  preferredLanguages: string[]
  deviceType: string
}

// Define the initial MetaSession state
const initialMetaSession: MetaSessionData = {
  userName: "Guest",
  date: new Date().toLocaleDateString(),
  timeOfDay: getTimeOfDay(),
  applicationLocation: "Unknown",
  experienceLevel: "Beginner",
  sessionDuration: 0,
  interactionCount: 0,
  lastTopics: [],
  preferredLanguages: ["JavaScript", "TypeScript"],
  deviceType: getDeviceType(),
}

// Helper function to get the time of day
function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 12) {
    return "Morning"
  } else if (hour < 18) {
    return "Afternoon"
  } else {
    return "Evening"
  }
}

// Helper function to detect device type
function getDeviceType(): string {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return "Mobile"
    }
    return "Desktop"
  }
  return "Unknown"
}

// Create the MetaSession context
interface MetaSessionContextProps {
  metaSession: MetaSessionData
  updateMetaSession: (data: Partial<MetaSessionData>) => void
  incrementInteractionCount: () => void
  addTopic: (topic: string) => void
}

const MetaSessionContext = createContext<MetaSessionContextProps>({
  metaSession: initialMetaSession,
  updateMetaSession: () => {},
  incrementInteractionCount: () => {},
  addTopic: () => {},
})

// Create the MetaSession provider component
export function MetaSessionProvider({ children }: { children: ReactNode }) {
  const [metaSession, setMetaSession] = useState<MetaSessionData>(() => {
    // Get the metaSession from localStorage if it exists
    if (typeof window !== "undefined") {
      const storedMetaSession = localStorage.getItem("metaSession")
      return storedMetaSession ? JSON.parse(storedMetaSession) : initialMetaSession
    }
    return initialMetaSession
  })

  useEffect(() => {
    // Update localStorage whenever metaSession changes
    if (typeof window !== "undefined") {
      localStorage.setItem("metaSession", JSON.stringify(metaSession))
    }
  }, [metaSession])

  useEffect(() => {
    // Set up interval to update sessionDuration every second
    const intervalId = setInterval(() => {
      setMetaSession((prevSession) => ({
        ...prevSession,
        sessionDuration: prevSession.sessionDuration + 1000, // Increment by 1 second (1000 milliseconds)
      }))
    }, 1000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  const updateMetaSession = useCallback((data: Partial<MetaSessionData>) => {
    setMetaSession((prevSession) => {
      const updatedSession = {
        ...prevSession,
        ...data,
        timeOfDay: data.timeOfDay || getTimeOfDay(), // Update time of day if needed
      }
      return updatedSession
    })
  }, [])

  const incrementInteractionCount = useCallback(() => {
    setMetaSession((prevSession) => ({
      ...prevSession,
      interactionCount: prevSession.interactionCount + 1,
    }))
  }, [])

  const addTopic = useCallback((topic: string) => {
    setMetaSession((prevSession) => {
      const updatedTopics = [topic, ...prevSession.lastTopics.slice(0, 4)]
      return {
        ...prevSession,
        lastTopics: updatedTopics,
      }
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      metaSession,
      updateMetaSession,
      incrementInteractionCount,
      addTopic,
    }),
    [metaSession, updateMetaSession, incrementInteractionCount, addTopic],
  )

  return <MetaSessionContext.Provider value={contextValue}>{children}</MetaSessionContext.Provider>
}

// Create a hook to use the MetaSession context
export function useMetaSession(): MetaSessionContextProps {
  return useContext(MetaSessionContext)
}

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isInitialized = useRef(false)



  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    console.log("AuthProvider: Initializing auth state")
    const supabase = createClient()

    // Get the current session
    const getCurrentSession = async () => {
      try {
        console.log("AuthProvider: Fetching current session")
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("AuthProvider: Error fetching session:", error)
          setLoading(false)
          return
        }

        console.log("AuthProvider: Session data:", data)
        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error("AuthProvider: Unexpected error fetching session:", err)
      } finally {
        setLoading(false)
      }
    }

    getCurrentSession()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("AuthProvider: Auth state changed:", event)
      console.log("AuthProvider: New session:", newSession)

      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log("AuthProvider: Cleaning up auth subscription")
      subscription.unsubscribe()
    }
  }, [])


  return (
    <AuthContext.Provider value={{ user, session, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

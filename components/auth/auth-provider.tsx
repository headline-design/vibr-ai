"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
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

  const signIn = async (email: string, password: string) => {
    console.log("AuthProvider: Attempting to sign in with email:", email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("AuthProvider: Sign in error:", error)
        throw error
      }

      console.log("AuthProvider: Sign in successful:", data)
      return data
    } catch (err) {
      console.error("AuthProvider: Unexpected sign in error:", err)
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log("AuthProvider: Attempting to sign up with email:", email)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        console.error("AuthProvider: Sign up error:", error)
        throw error
      }

      console.log("AuthProvider: Sign up successful:", data)
      return data
    } catch (err) {
      console.error("AuthProvider: Unexpected sign up error:", err)
      throw err
    }
  }

  const signOut = async () => {
    console.log("AuthProvider: Attempting to sign out")
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("AuthProvider: Sign out error:", error)
        throw error
      }

      console.log("AuthProvider: Sign out successful")

      // Use setTimeout to break the render cycle
      setTimeout(() => {
        router.push("/login")
      }, 0)
    } catch (err) {
      console.error("AuthProvider: Unexpected sign out error:", err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

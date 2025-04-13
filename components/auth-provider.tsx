"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define user type
type User = {
  id: string
  email: string
}

// Define auth context type
type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    // In a real app, this would call an API
    setUser({
      id: "user-" + Math.random().toString(36).substr(2, 9),
      email,
    })
  }

  // Mock sign out function
  const signOut = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

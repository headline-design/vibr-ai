"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "./auth-provider"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Only redirect if we're on the client and not loading
    if (isClient && !loading && !user) {
      console.log("ProtectedRoute: No user found, redirecting to login")
      router.push("/login")
    }
  }, [user, loading, router, isClient])

  // Show loading state while checking authentication
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If we're not loading and there's no user, don't render children
  // (the redirect will happen in the useEffect)
  if (!user) {
    return null
  }

  // If we have a user, render the children
  return <>{children}</>
}

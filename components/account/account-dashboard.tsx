"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/auth/auth-provider"
import { AccountInfo } from "@/components/account/account-info"
import { AccountSettings } from "@/components/account/account-settings"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AccountDashboard() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're loading, show a loading state
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading account information...</p>
        </div>
      </div>
    )
  }

  // If we don't have a user, redirect to login
  if (!user) {
    router.push("/login")
    return null // Prevent rendering anything else
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountInfo user={user} />
        <AccountSettings user={user} />
      </div>
    </div>
  )
}

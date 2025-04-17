"use client"

import { AccountInfo } from "@/components/account/account-info"
import { AccountSettings } from "@/components/account/account-settings"
import { Loader2 } from "lucide-react"

export function AccountDashboard({user}) {

  // If we're loading, show a loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading account information...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AccountInfo user={user} />
      <AccountSettings user={user} />
    </>
  )
}

import type { Metadata } from "next"
import { AccountDashboard } from "@/components/account/account-dashboard"
import { getUser } from "@/utils/supabase/actions"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account | Vibr",
  description: "Manage your account and projects",
}

export default async function AccountPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountDashboard user={user}  />
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { AccountDashboard } from "@/components/account/account-dashboard"

export const metadata: Metadata = {
  title: "Account | Vibr",
  description: "Manage your account and projects",
}

export default function AccountPage() {
  return <AccountDashboard />
}

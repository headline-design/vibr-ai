"\"use client"

import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AVATAR_GRADIENT_API } from "@/lib/constants"

interface AccountInfoProps {
  user: User
}

export function AccountInfo({ user }: AccountInfoProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  // Generate avatar URL
  const avatarUrl = `${AVATAR_GRADIENT_API}/${encodeURIComponent(user.email || user.id)}.svg`

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "User ID copied",
      description: "User ID copied to clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your profile details and account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={user.email || "User avatar"} />
            <AvatarFallback>{getInitials(user.email || "")}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{user.email}</h3>
            <p className="text-sm text-muted-foreground">User ID: {user.id.substring(0, 8)}...</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
          <Button variant="ghost" size="sm" onClick={handleCopyUserId}>
            {copied ? "Copied!" : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

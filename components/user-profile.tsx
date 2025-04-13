"use client"

import { useAuthContext } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, CreditCard } from "lucide-react"
import Link from "next/link"
import { AVATAR_GRADIENT_API } from "@/lib/constants"

export function UserProfile() {
  const { user, signOut } = useAuthContext()

  if (!user) {
    return null
  }

  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  // Generate avatar URL
  const avatarUrl = `${AVATAR_GRADIENT_API}/${encodeURIComponent(user.email || user.id)}.svg`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-md">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user.email || "User avatar"} />
            <AvatarFallback>{getInitials(user.email || "")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">User ID: {user.id.substring(0, 8)}...</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/projects" className="flex items-center cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            console.log("Signing out...")
            signOut()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

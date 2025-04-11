"use client"
import { Button } from "@/components/ui/button"
import { Settings, ChevronLeft } from "lucide-react"
import { ProjectSelector } from "./project-selector"
import { UserProfile } from "@/components/auth/user-profile"

interface ChatHeaderProps {
  title?: string
  onSettingsClick?: () => void
  showSettings?: boolean
  showBackButton?: boolean
  onBackClick?: () => void
  projects?: any[]
}

export function ChatHeader({
  title = "Chat",
  onSettingsClick,
  showSettings = true,
  showBackButton = false,
  onBackClick,
  projects = [],
}: ChatHeaderProps) {
  return (
    <header className="border-b border-border p-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBackClick}>
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {projects && projects.length > 0 && <ProjectSelector projects={projects} />}

        {showSettings && (
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        )}

        <UserProfile />
      </div>
    </header>
  )
}

"use client"

import { useMetaSession } from "./meta-session-provider"
import { Button } from "@/components/ui/button"

interface MetaSessionDebuggerProps {
  className?: string
}

export function MetaSessionDebugger({ className }: MetaSessionDebuggerProps) {
  const { metaSession, updateMetaSession } = useMetaSession()

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const resetSession = () => {
    updateMetaSession({
      interactionCount: 0,
      lastTopics: [],
      sessionDuration: 0,
    })
  }

  const changeExperienceLevel = () => {
    const levels = ["Beginner", "Intermediate", "Advanced", "Expert"]
    const currentIndex = levels.indexOf(metaSession.experienceLevel)
    const nextIndex = (currentIndex + 1) % levels.length
    updateMetaSession({ experienceLevel: levels[nextIndex] })
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Meta Session Data</h3>
        <Button variant="outline" size="sm" onClick={resetSession}>
          Reset
        </Button>
      </div>
      <div className="border rounded p-3 bg-white">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">User:</div>
          <div>{metaSession.userName}</div>

          <div className="font-medium">Experience:</div>
          <div className="flex items-center">
            <span className="mr-2">{metaSession.experienceLevel}</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={changeExperienceLevel}>
              Change
            </Button>
          </div>

          <div className="font-medium">Time of Day:</div>
          <div>{metaSession.timeOfDay}</div>

          <div className="font-medium">Device:</div>
          <div>{metaSession.deviceType}</div>

          <div className="font-medium">Session Duration:</div>
          <div>{formatDuration(metaSession.sessionDuration)}</div>

          <div className="font-medium">Interactions:</div>
          <div>{metaSession.interactionCount}</div>

          <div className="font-medium">Recent Topics:</div>
          <div>{metaSession.lastTopics.length > 0 ? metaSession.lastTopics.join(", ") : "None"}</div>

          <div className="font-medium">Preferred Languages:</div>
          <div>{metaSession.preferredLanguages.join(", ")}</div>
        </div>
      </div>
    </div>
  )
}

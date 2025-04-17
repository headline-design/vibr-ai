"use client"

import { useState } from "react"
import { SuggestionChips } from "./suggestion-chips"
import { AssistantCapabilities } from "./assistant-capabilities"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { FluxBranding } from "./flux-branding"
import { FluxAvatar } from "./flux-avatar-enhanced"

interface WelcomePanelProps {
  onSuggestionSelect: (suggestion: string) => void
}

export function WelcomePanel({ onSuggestionSelect }: WelcomePanelProps) {
  const [showCapabilities, setShowCapabilities] = useState(false)

  const suggestionExamples = [
    "How can you help me?",
    "Tell me about React",
    "Generate a code example",
    "Explain a concept",
  ]

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center text-center mb-6">
        <FluxAvatar size="lg" mood="neutral" className="mb-3" />
        <FluxBranding size="lg" variant="default" className="mb-2" />
        <p className="text-sm text-muted-foreground max-w-md">
          I'm your AI coding assistant. Ask me questions, request information, or get help with tasks.
        </p>
      </div>

      <div className="text-sm text-muted-foreground mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-medium mb-1">How can I assist you today?</h2>
            <p>Try asking me about code, design patterns, or debugging issues.</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setShowCapabilities(!showCapabilities)}
            aria-label={showCapabilities ? "Hide capabilities" : "Show capabilities"}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showCapabilities && <AssistantCapabilities onClose={() => setShowCapabilities(false)} />}

      <div className="mb-4">
        <SuggestionChips suggestions={suggestionExamples} onSelect={onSuggestionSelect} />
      </div>
    </div>
  )
}

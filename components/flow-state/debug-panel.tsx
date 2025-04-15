"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { MetaSessionDebugger } from "./meta-session-debugger"
import { ConversationTreeVisualizer } from "@/components/flow-state/conversation-tree/conversation-tree-visualizer"
import { Input } from "@/components/ui/input"
import { isGreetingToFlux } from "./greeting-patterns"

interface DebugPanelProps {
  className?: string
}

export function DebugPanel({ className }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [testMessage, setTestMessage] = useState("")
  const [matchResult, setMatchResult] = useState<string | null>(null)

  const testMessageMatching = () => {
    if (!testMessage.trim()) {
      setMatchResult("Please enter a message to test")
      return
    }

    if (isGreetingToFlux(testMessage)) {
      setMatchResult("✅ Matches greeting pattern: Will respond with 'Hello [name], welcome to the grid.'")
    } else {
      setMatchResult("❌ No specific pattern match: Will use general conversation tree logic")
    }
  }

  return (
    <div className={className}>
      <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white border-t border-l shadow-lg z-50">
        <div
          className="flex items-center justify-between p-2 bg-gray-100 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="font-medium">Debug Tools</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </div>

        {isExpanded && (
          <div className="p-3 max-h-[70vh] overflow-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Test Message Matching</h3>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Enter a message to test"
                    className="flex-1"
                  />
                  <Button onClick={testMessageMatching}>Test</Button>
                </div>
                {matchResult && <div className="text-sm p-2 bg-gray-50 rounded border">{matchResult}</div>}
              </div>

              <MetaSessionDebugger />
              <ConversationTreeVisualizer />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

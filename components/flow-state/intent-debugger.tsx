"use client"

import { useState } from "react"
import { detectIntent } from "./intent-patterns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IntentDebuggerProps {
  className?: string
}

export function IntentDebugger({ className }: IntentDebuggerProps) {
  const [message, setMessage] = useState("")
  const [result, setResult] = useState<{
    intent: string | null
    confidence: number
    confirmationMessage: string | null
  } | null>(null)

  const testIntent = () => {
    if (!message.trim()) return
    const intentResult = detectIntent(message)
    setResult(intentResult)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Intent Detection Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message to test intent detection"
              className="flex-1"
            />
            <Button onClick={testIntent}>Test</Button>
          </div>

          {result && (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Intent:</div>
                <div>{result.intent || "No intent detected"}</div>

                <div className="font-medium">Confidence:</div>
                <div>{result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : "N/A"}</div>

                <div className="font-medium">Confirmation:</div>
                <div>{result.confirmationMessage || "N/A"}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
// Update the import to use default import
import {
    MessageSquare,
} from "lucide-react"
import { MetaSessionDebugger } from "@/components/flow-state/meta-session-debugger"
import { ConversationTreeVisualizer } from "@/components/flow-state/conversation-tree-visualizer"
import { Input } from "@/components/ui/input"
import {
    isGreetingToFlux,
    isGeneralGreeting,
    isGratitude,
    isFarewell,
    isAppQuestion,
    isAppRelatedQuery,
} from "@/components/flow-state/greeting-patterns"
import { detectIntent } from "@/components/flow-state/intent-patterns"
import { IntentDebugger } from "@/components/flow-state/intent-debugger"
import { useDemoState } from "@/components/flow-state/demo-state-provider"

export default function ChatDebug() {

    const { theme, setTheme } = useTheme()

    const { isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        demoView,
        setDemoView,
        isFloatingPanelOpen,
        setIsFloatingPanelOpen } = useDemoState();

    const [testMessage, setTestMessage] = useState("")
    const [matchResult, setMatchResult] = useState<string | null>(null)

    const testMessageMatching = () => {
        if (!testMessage.trim()) {
            setMatchResult("Please enter a message to test")
            return
        }

        // Check for intent patterns first
        const { intent, confidence, confirmationMessage } = detectIntent(testMessage)
        if (intent && confidence > 0.3) {
            setMatchResult(`✅ Detected intent: "${intent}" with ${(confidence * 100).toFixed(1)}% confidence.
   Will respond with confirmation: "${confirmationMessage}"`)
            return
        }

        // Check other patterns
        if (isGreetingToFlux(testMessage)) {
            setMatchResult(
                "✅ Matches specific Flux greeting pattern: Will respond with 'Hello [name], welcome to the grid.'",
            )
        } else if (isGeneralGreeting(testMessage)) {
            setMatchResult("✅ Matches general greeting pattern: Will respond with a friendly greeting.")
        } else if (isGratitude(testMessage)) {
            setMatchResult("✅ Matches gratitude pattern: Will respond with 'You're welcome' or similar.")
        } else if (isFarewell(testMessage)) {
            setMatchResult("✅ Matches farewell pattern: Will respond with 'Goodbye' or similar.")
        } else if (isAppQuestion(testMessage)) {
            setMatchResult("✅ Matches app question pattern: Will respond with app information.")
        } else if (isAppRelatedQuery(testMessage)) {
            setMatchResult("✅ Matches general app-related query: Will use client-side response.")
        } else {
            setMatchResult("❌ No specific pattern match: Will use general conversation tree logic or LLM.")
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Pattern Matching Debugger</CardTitle>
                        <CardDescription>Test message pattern matching</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter a test message..."
                                value={testMessage}
                                onChange={(e) => setTestMessage(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={testMessageMatching}>Test</Button>
                        </div>
                        {matchResult && (
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap font-mono text-sm">
                                {matchResult}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Intent Debugger</CardTitle>
                        <CardDescription>View detected intents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IntentDebugger />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Session Debugger</CardTitle>
                        <CardDescription>View session state</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MetaSessionDebugger />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Conversation Tree</CardTitle>
                        <CardDescription>Visualize conversation flow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ConversationTreeVisualizer />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

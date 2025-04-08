"use client"

import { useState, useEffect, useRef } from "react"
import { FluxTypingIndicator } from "./flux-typing-indicator"

interface StreamingLLMResponseProps {
  message: string
  onComplete: (fullResponse: string) => void
  className?: string
}

export function StreamingLLMResponse({ message, onComplete, className }: StreamingLLMResponseProps) {
  const [streamedText, setStreamedText] = useState("")
  const [isStreaming, setIsStreaming] = useState(true)
  const fullResponseRef = useRef("")

  useEffect(() => {
    let isMounted = true
    let index = 0
    const fullResponse = message
    fullResponseRef.current = fullResponse

    // Reset state when message changes
    setStreamedText("")
    setIsStreaming(true)

    // Function to stream text character by character
    const streamText = () => {
      if (!isMounted) return

      if (index < fullResponse.length) {
        setStreamedText((prev) => prev + fullResponse[index])
        index++

        // Random delay between 10ms and 50ms for natural typing feel
        const delay = Math.floor(Math.random() * 40) + 10
        setTimeout(streamText, delay)
      } else {
        setIsStreaming(false)
        onComplete(fullResponse)
      }
    }

    // Start streaming after a small initial delay
    setTimeout(streamText, 500)

    return () => {
      isMounted = false
    }
  }, [message, onComplete])

  return (
    <div className={className}>
      <div className="whitespace-pre-wrap">{streamedText}</div>
      {isStreaming && (
        <div className="mt-2">
          <FluxTypingIndicator />
        </div>
      )}
    </div>
  )
}

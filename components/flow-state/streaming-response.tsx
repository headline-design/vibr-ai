"use client"

import { useState, useEffect, useRef } from "react"

interface StreamingResponseProps {
  content: string
  onComplete?: () => void
  typingSpeed?: { min: number; max: number }
  className?: string
}

export function StreamingResponse({
  content,
  onComplete,
  typingSpeed = { min: 10, max: 50 },
  className,
}: StreamingResponseProps) {
  const [streamedText, setStreamedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const contentRef = useRef(content)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update content ref when content changes
  useEffect(() => {
    contentRef.current = content
  }, [content])

  // Stream the text
  useEffect(() => {
    // Reset state when content changes
    setStreamedText("")
    setIsComplete(false)

    let index = 0
    const fullContent = contentRef.current

    // Function to stream text character by character
    const streamNextChar = () => {
      if (index < fullContent.length) {
        setStreamedText((prev) => prev + fullContent[index])
        index++

        // Random delay between characters for natural typing feel
        const delay = Math.floor(Math.random() * (typingSpeed.max - typingSpeed.min)) + typingSpeed.min
        timeoutRef.current = setTimeout(streamNextChar, delay)
      } else {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    // Start streaming after a small initial delay
    timeoutRef.current = setTimeout(streamNextChar, 100)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, typingSpeed, onComplete])

  return (
    <div className={className}>
      <div className="whitespace-pre-wrap">{streamedText}</div>
    </div>
  )
}

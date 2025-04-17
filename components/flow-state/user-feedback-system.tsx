"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info, X, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type FeedbackType = "success" | "error" | "info" | "warning"

interface FeedbackMessage {
  id: string
  type: FeedbackType
  message: string
  duration?: number
  actions?: {
    label: string
    onClick: () => void
  }[]
}

interface UserFeedbackProps {
  className?: string
}

export function UserFeedbackSystem({ className }: UserFeedbackProps) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([])
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackRating, setFeedbackRating] = useState<"positive" | "negative" | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Add a new feedback message
  const addMessage = (message: Omit<FeedbackMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newMessage = { ...message, id }
    setMessages((prev) => [...prev, newMessage])

    // Auto-remove after duration
    if (message.duration) {
      setTimeout(() => {
        removeMessage(id)
      }, message.duration)
    }

    return id
  }

  // Remove a feedback message
  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }

  // Submit user feedback
  const submitFeedback = () => {
    if (!feedbackRating) return

    // In a real app, you would send this to your API
    console.log("Feedback submitted:", {
      rating: feedbackRating,
      text: feedbackText,
    })

    // Show success message
    addMessage({
      type: "success",
      message: "Thank you for your feedback!",
      duration: 3000,
    })

    // Reset form
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setShowFeedbackForm(false)
      setFeedbackText("")
      setFeedbackRating(null)
      setFeedbackSubmitted(false)
    }, 3000)
  }

  // Get icon based on message type
  const getIcon = (type: FeedbackType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertCircle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
    }
  }

  // Get color based on message type
  const getTypeClasses = (type: FeedbackType) => {
    switch (type) {
      case "success":
        return "bg-success/15 text-success border-success/30"
      case "error":
        return "bg-destructive/15 text-destructive border-destructive/30"
      case "warning":
        return "bg-warning/15 text-warning border-warning/30"
      case "info":
        return "bg-info/15 text-info border-info/30"
    }
  }

  return (
    <div className={cn("fixed z-50 flex flex-col items-end space-y-2",
      className ? "" : "bottom-4 right-4 ",

      className)}>
      {/* Feedback messages */}
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn("flex items-center rounded-lg border px-4 py-3 shadow-sm", getTypeClasses(message.type))}
          >
            <div className="flex items-center">
              {getIcon(message.type)}
              <span className="ml-2">{message.message}</span>
            </div>

            {message.actions && (
              <div className="ml-4 flex items-center space-x-2">
                {message.actions.map((action, index) => (
                  <Button key={index} variant="ghost" size="sm" onClick={action.onClick} className="h-7 px-2 text-xs">
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            <Button variant="ghost" size="icon" className="ml-4 h-5 w-5" onClick={() => removeMessage(message.id)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Feedback form */}
      <AnimatePresence>
        {showFeedbackForm && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 rounded-lg border border-border bg-card p-4 shadow-md"
          >
            {!feedbackSubmitted ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Share your feedback</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFeedbackForm(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="mb-3 flex justify-center space-x-4">
                  <Button
                    variant={feedbackRating === "positive" ? "default" : "outline"}
                    size="sm"
                    className="h-10 w-10 rounded-full p-0"
                    onClick={() => setFeedbackRating("positive")}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="sr-only">Positive feedback</span>
                  </Button>
                  <Button
                    variant={feedbackRating === "negative" ? "default" : "outline"}
                    size="sm"
                    className="h-10 w-10 rounded-full p-0"
                    onClick={() => setFeedbackRating("negative")}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span className="sr-only">Negative feedback</span>
                  </Button>
                </div>

                <Textarea
                  placeholder="Tell us what you think..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mb-3 h-20 resize-none"
                />

                <div className="flex justify-end">
                  <Button size="sm" onClick={submitFeedback} disabled={!feedbackRating}>
                    Submit Feedback
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle className="mb-2 h-8 w-8 text-success" />
                <p className="text-center text-sm">Thank you for your feedback!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback button */}
      {!showFeedbackForm && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFeedbackForm(true)}
          className="rounded-full shadow-sm"
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Feedback
        </Button>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, ChevronLeft, Check, Sparkles, MessageSquare, Code, Settings, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  title: string
  description: string
  target: string
  position: "top" | "right" | "bottom" | "left" | "center"
  icon?: React.ReactNode
}

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  steps: TourStep[]
  className?: string
}

export function OnboardingTour({ isOpen, onClose, onComplete, steps, className }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  // Find target element and calculate position
  useEffect(() => {
    if (!isOpen) return

    const step = steps[currentStep]
    const element = document.querySelector(step.target) as HTMLElement

    if (element) {
      setTargetElement(element)

      // Calculate position
      const rect = element.getBoundingClientRect()
      const tooltipWidth = 320
      const tooltipHeight = 180
      const margin = 12

      let top = 0
      let left = 0

      switch (step.position) {
        case "top":
          top = rect.top - tooltipHeight - margin
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + margin
          break
        case "bottom":
          top = rect.bottom + margin
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - margin
          break
        case "center":
          top = window.innerHeight / 2 - tooltipHeight / 2
          left = window.innerWidth / 2 - tooltipWidth / 2
          break
      }

      // Ensure tooltip stays within viewport
      if (top < 0) top = margin
      if (left < 0) left = margin
      if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - margin
      if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - margin

      setTooltipPosition({ top, left })

      // Highlight target element
      element.classList.add("ring-2", "ring-blue-500", "ring-offset-2", "transition-all", "duration-300")

      return () => {
        element.classList.remove("ring-2", "ring-blue-500", "ring-offset-2", "transition-all", "duration-300")
      }
    }
  }, [isOpen, currentStep, steps])

  // Next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  // Previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Skip tour
  const skipTour = () => {
    onClose()
  }

  if (!isOpen) return null

  const step = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={skipTour} />

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed z-50 w-80 bg-background rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
            className,
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {step.icon || <Sparkles className="h-5 w-5 text-blue-500 mr-2" />}
              <h3 className="font-medium">{step.title}</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={skipTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={prevStep}>
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button size="sm" className="h-8 text-xs" onClick={nextStep}>
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-xs" onClick={onComplete}>
                  Finish
                  <Check className="h-3.5 w-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

// Example usage
export function createDefaultTourSteps(): TourStep[] {
  return [
    {
      title: "Welcome to the Chat Interface",
      description: "This tour will guide you through the main features of our AI chat interface. Let's get started!",
      target: "body", // Target the whole page for intro
      position: "center",
      icon: <Sparkles className="h-5 w-5 text-blue-500 mr-2" />,
    },
    {
      title: "Chat Messages",
      description:
        "This is where your conversation with the AI assistant appears. You can scroll through past messages and see responses in real-time.",
      target: ".chat-messages", // Target the chat messages container
      position: "left",
      icon: <MessageSquare className="h-5 w-5 text-green-500 mr-2" />,
    },
    {
      title: "Message Input",
      description: "Type your questions or requests here. Press Enter to send or use the send button.",
      target: ".message-input", // Target the input area
      position: "top",
      icon: <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />,
    },
    {
      title: "Code Blocks",
      description: "The AI can generate code examples that you can copy, download, or edit directly.",
      target: ".code-block", // Target a code block
      position: "right",
      icon: <Code className="h-5 w-5 text-purple-500 mr-2" />,
    },
    {
      title: "Search Messages",
      description: "Use the search feature to find specific information in your conversation history.",
      target: ".search-button", // Target the search button
      position: "bottom",
      icon: <Search className="h-5 w-5 text-amber-500 mr-2" />,
    },
    {
      title: "Settings",
      description: "Customize your experience with various settings for appearance, notifications, and more.",
      target: ".settings-button", // Target the settings button
      position: "bottom",
      icon: <Settings className="h-5 w-5 text-gray-500 mr-2" />,
    },
    {
      title: "You're All Set!",
      description:
        "You now know the basics of using our chat interface. Feel free to explore and ask the AI assistant any questions you have.",
      target: "body", // Target the whole page for outro
      position: "center",
      icon: <Check className="h-5 w-5 text-green-500 mr-2" />,
    },
  ]
}

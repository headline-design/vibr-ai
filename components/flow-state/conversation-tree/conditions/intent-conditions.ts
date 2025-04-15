"use client"

import { isConfirmationIntent, isDenialIntent } from "@/components/flow-state/intent-patterns"
import { handleProjectCreationIntent } from "./project-conditions"

// State for pending intent
let pendingIntent: {
  intent: string
  confirmationMessage: string
  isConfirmation?: boolean
  originalMessage: string
  actions?: Array<{ id: string; label: string; variant?: string }>
  expectedActionId?: string // Add expectedActionId
} | null = null

export function setPendingIntent(
  intent: {
    intent: string
    confirmationMessage: string
    originalMessage: string
    isConfirmation?: boolean
    actions?: Array<{ id: string; label: string; variant?: string }>
    expectedActionId?: string // Add expectedActionId
  } | null,
) {
  pendingIntent = intent
}

export function getPendingIntent() {
  return pendingIntent
}

export async function handleIntentConditions(
  message: string,
  context: {
    metaSession: any
  },
) {
  // Check if there's a pending intent and the message is a confirmation
  if (pendingIntent) {
    if (isConfirmationIntent(message)) {
      const intent = pendingIntent.intent
      const result = handleConfirmedIntent(intent)
      setPendingIntent(null)
      return result
    } else if (isDenialIntent(message)) {
      setPendingIntent(null)
      return {
        response: "No problem. Is there something else I can help you with?",
        isClientOnly: true,
      }
    }
  }

  // Implementation for handling intent conditions based on message
  // This would be called from the main processUserMessage function
  return null
}

// Function to handle intent-related action clicks
export function handleIntentAction(actionId: string) {
  console.log("Handling intent action:", actionId, "with pending intent:", pendingIntent)

  if (!pendingIntent) {
    return null
  }

  // Handle confirmation actions
  if (actionId === "yes" && pendingIntent) {
    const intent = pendingIntent.intent
    const result = handleConfirmedIntent(intent)
    setPendingIntent(null)
    return result
  } else if (actionId === "no" && pendingIntent) {
    setPendingIntent(null)
    return {
      response: "No problem. Is there something else I can help you with?",
      isClientOnly: true,
    }
  }

  return null
}

function handleConfirmedIntent(intent: string) {
  console.log("Handling confirmed intent:", intent)

  if (intent === "create_project") {
    // Import the project creation handler from project-conditions
    return handleProjectCreationIntent()
  }

  // Handle other intents here

  return null
}

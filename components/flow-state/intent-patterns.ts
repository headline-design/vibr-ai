"use client"

import { getPendingIntent } from "./conversation-tree/conditions/intent-conditions"

// Define intent patterns for different user needs
export interface IntentPattern {
  keywords: string[]
  requiredWords?: string[] // Words that MUST be present
  minMatchCount?: number // Minimum number of keywords that must match
  confirmationMessage?: string // Message to confirm intent
  actions?: Array<{ id: string; label: string; variant?: string }>
}

export const intentPatterns: Record<string, IntentPattern> = {
  // Project creation intent
  create_project: {
    keywords: ["create", "new", "project", "start", "make", "setup", "initialize", "build"],
    requiredWords: ["project"],
    minMatchCount: 2,
    confirmationMessage: "Would you like to create a new project? I can help you set that up.",
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },

  // Billing-related intents
  billing_inquiry: {
    keywords: [
      "bill",
      "billing",
      "invoice",
      "payment",
      "charge",
      "subscription",
      "plan",
      "pay",
      "due",
      "date",
      "when",
      "next",
      "cost",
      "price",
      "fee",
      "amount",
    ],
    requiredWords: ["bill"], // Only require "bill" not "my bill"
    minMatchCount: 1, // Only need 1 match
    confirmationMessage: "Would you like to see your billing details?",
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },

  // Account-related intents
  account_inquiry: {
    keywords: ["account", "profile", "settings", "password", "email", "change", "update", "details", "information"],
    requiredWords: ["my", "account"],
    minMatchCount: 2,
    confirmationMessage: "Would you like to access your account settings?",
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },

  // Feature-related intents
  feature_inquiry: {
    keywords: ["feature", "function", "do", "can", "able", "capability", "support", "handle"],
    requiredWords: ["you", "can"],
    minMatchCount: 2,
    confirmationMessage: "Are you asking about what features are available in this application?",
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },

  // Help-related intents
  help_request: {
    keywords: ["help", "assist", "support", "guide", "tutorial", "learn", "how", "use"],
    requiredWords: ["help"],
    minMatchCount: 1,
    confirmationMessage: "Would you like me to show you how to use this application?",
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },

  // Project-related intents
  project_inquiry: {
    keywords: ["project", "work", "task", "deadline", "status", "progress", "update", "team"],
    requiredWords: ["my", "project"],
    minMatchCount: 2,
    confirmationMessage: "Would you like to see your project status?",
    actions: [
      { id: "yes", label: "Yes", variant: "default" },
      { id: "no", label: "No", variant: "outline" },
    ],
  },
}

export function detectIntent(message: string): {
  intent: string | null
  confidence: number
  confirmationMessage: string | null
  actions?: Array<{ id: string; label: string; variant?: string }>
} {
  const normalizedMessage = message.toLowerCase().trim()
  const words = normalizedMessage.split(/\s+/)

  console.log("Detecting intent for message:", normalizedMessage)

  // Check for pending intent first
  const pendingIntent = getPendingIntent()
  console.log("pending intent", pendingIntent)
  if (pendingIntent) {
    // If there's a pending intent, prioritize confirmation or denial
    if (isConfirmationIntent(normalizedMessage) || pendingIntent?.isConfirmation) {
      console.log("Prioritizing confirmation for pending intent:", pendingIntent.intent)
      return {
        intent: pendingIntent.intent,
        confidence: 1,
        confirmationMessage: pendingIntent.confirmationMessage,
        actions: pendingIntent.actions,
      }
    } else if (isDenialIntent(normalizedMessage)) {
      console.log("Prioritizing denial for pending intent:", pendingIntent.intent)
      return {
        intent: "denial",
        confidence: 1,
        confirmationMessage: "Action cancelled.",
      }
    }
  }

  let bestMatch = {
    intent: null as string | null,
    confidence: 0,
    confirmationMessage: null as string | null,
    actions: undefined as Array<{ id: string; label: string; variant?: string }> | undefined,
  }

  // Check each intent pattern
  console.log("Starting intent pattern matching...")
  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    console.log(`Checking intent: ${intent}`)
    // Check if required words are present
    if (pattern.requiredWords && !pattern.requiredWords.every((word) => words.includes(word))) {
      console.log(`Intent ${intent} skipped: missing required words`)
      continue
    }

    // Count matching keywords
    const matchCount = pattern.keywords.filter(
      (keyword) => words.includes(keyword) || normalizedMessage.includes(keyword),
    ).length

    // Calculate confidence (0-1)
    const minRequired = pattern.minMatchCount || 1
    if (matchCount >= minRequired) {
      // Calculate confidence (0-1)
      const confidence = matchCount / Math.min(pattern.keywords.length, 5) // Cap the denominator

      console.log(`Intent ${intent} matched with confidence ${confidence}`)

      // If this is the best match so far, update bestMatch
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent,
          confidence,
          confirmationMessage: pattern.confirmationMessage || null,
          actions: pattern.actions,
        }
      }
    } else {
      console.log(`Intent ${intent} skipped: not enough keywords matched`)
    }
  }

  console.log("Best match:", bestMatch)
  return bestMatch
}

// Function to check if a message is a confirmation response
export function isConfirmationIntent(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  const confirmationPatterns = [
    "yes",
    "yeah",
    "yep",
    "sure",
    "ok",
    "okay",
    "correct",
    "right",
    "yup",
    "please",
    "please do",
    "that's right",
    "that is correct",
    "exactly",
    "absolutely",
    "definitely",
  ]

  return confirmationPatterns.some(
    (pattern) =>
      normalizedMessage === pattern || normalizedMessage.startsWith(pattern + " ") || normalizedMessage === "y",
  )
}

// Function to check if a message is a denial response
export function isDenialIntent(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  const denialPatterns = [
    "no",
    "nope",
    "nah",
    "not",
    "don't",
    "do not",
    "negative",
    "incorrect",
    "wrong",
    "that's not right",
    "that is not correct",
    "not what i meant",
    "not really",
    "not exactly",
  ]

  return denialPatterns.some(
    (pattern) =>
      normalizedMessage === pattern || normalizedMessage.startsWith(pattern + " ") || normalizedMessage === "n",
  )
}

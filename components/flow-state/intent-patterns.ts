"use client"

// Define intent patterns for different user needs
export interface IntentPattern {
  keywords: string[]
  requiredWords?: string[] // Words that MUST be present
  minMatchCount?: number // Minimum number of keywords that must match
  confirmationMessage?: string // Message to confirm intent
}

export const intentPatterns: Record<string, IntentPattern> = {
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
  },

  // Account-related intents
  account_inquiry: {
    keywords: ["account", "profile", "settings", "password", "email", "change", "update", "details", "information"],
    requiredWords: ["my", "account"],
    minMatchCount: 2,
    confirmationMessage: "Would you like to access your account settings?",
  },

  // Feature-related intents
  feature_inquiry: {
    keywords: ["feature", "function", "do", "can", "able", "capability", "support", "handle"],
    requiredWords: ["you", "can"],
    minMatchCount: 2,
    confirmationMessage: "Are you asking about what features are available in this application?",
  },

  // Help-related intents
  help_request: {
    keywords: ["help", "assist", "support", "guide", "tutorial", "learn", "how", "use"],
    requiredWords: ["help"],
    minMatchCount: 1,
    confirmationMessage: "Would you like me to show you how to use this application?",
  },

  // Project-related intents
  project_inquiry: {
    keywords: ["project", "work", "task", "deadline", "status", "progress", "update", "team"],
    requiredWords: ["my", "project"],
    minMatchCount: 2,
    confirmationMessage: "Would you like to see your project status?",
  },
}

// Function to detect intent from a message
export function detectIntent(message: string): {
  intent: string | null
  confidence: number
  confirmationMessage: string | null
  actions?: Array<{ id: string; label: string; variant?: string }>
} {
  const normalizedMessage = message.toLowerCase().trim()
  const words = normalizedMessage.split(/\s+/)

  let bestMatch = {
    intent: null as string | null,
    confidence: 0,
    confirmationMessage: null as string | null,
    actions: undefined as Array<{ id: string; label: string; variant?: string }> | undefined,
  }

  // Check each intent pattern
  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    // Check if required words are present
    if (pattern.requiredWords && !pattern.requiredWords.every((word) => words.includes(word))) {
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

      // If this is the best match so far, update bestMatch
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent,
          confidence,
          confirmationMessage: pattern.confirmationMessage || null,
          actions: pattern.confirmationMessage
            ? [
                { id: "yes", label: "Yes" },
                { id: "no", label: "No" },
              ]
            : undefined,
        }
      }
    }
  }

  return bestMatch
}

// Function to check if a message is a confirmation response
export function isConfirmation(message: string): boolean {
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
export function isDenial(message: string): boolean {
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

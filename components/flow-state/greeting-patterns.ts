"\"use client"

// Define patterns for greeting recognition
export const greetingPatterns = [
  // Direct greetings to Flux
  "hello flux",
  "hi flux",
  "hey flux",
  "greetings flux",
  "howdy flux",
  "good morning flux",
  "good afternoon flux",
  "good evening flux",

  // Variations with punctuation
  "hello, flux",
  "hi, flux",
  "hey, flux",

  // Variations with emojis
  "hello flux 👋",
  "hi flux 😊",

  // Variations with additional words
  "hello there flux",
  "hi there flux",
  "hey there flux",
]

// General greetings (without mentioning Flux)
export const generalGreetingPatterns = [
  "hello",
  "hi",
  "hey",
  "greetings",
  "howdy",
  "good morning",
  "good afternoon",
  "good evening",
  "👋",
  "hello there",
  "hi there",
  "hey there",
]

// Function to check if a message matches any greeting pattern
export function isGreetingToFlux(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  return greetingPatterns.some((pattern) => normalizedMessage.includes(pattern))
}

// Function to check if a message is a general greeting
export function isGeneralGreeting(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()

  // Check if it's a direct greeting to Flux first
  if (isGreetingToFlux(normalizedMessage)) {
    return true
  }

  // Check if it's a general greeting
  // We need to be more careful with general greetings to avoid false positives
  // So we check if the message is short and matches exactly or starts with a greeting
  if (normalizedMessage.split(" ").length <= 3) {
    return generalGreetingPatterns.some(
      (pattern) =>
        normalizedMessage === pattern ||
        normalizedMessage.startsWith(pattern + " ") ||
        normalizedMessage.endsWith(" " + pattern),
    )
  }

  return false
}

// Common questions about the app/assistant
export const appQuestionPatterns = [
  "what can you do",
  "what are you",
  "who are you",
  "how do you work",
  "what is this",
  "help me",
  "how does this work",
  "what is flux",
  "tell me about yourself",
  "your capabilities",
  "what are your features",
  "how to use",
  "how can you help",
  "what do you know",
  "what's your purpose",
]

// Function to check if a message is asking about the app/assistant
export function isAppQuestion(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  return appQuestionPatterns.some((pattern) => normalizedMessage.includes(pattern))
}

// Common expressions of gratitude
export const gratitudePatterns = ["thank you", "thanks", "thx", "thank u", "appreciate it", "grateful"]

// Function to check if a message expresses gratitude
export function isGratitude(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  return gratitudePatterns.some((pattern) => normalizedMessage.includes(pattern))
}

// Common farewell expressions
export const farewellPatterns = [
  "goodbye",
  "bye",
  "see you",
  "farewell",
  "see ya",
  "cya",
  "talk to you later",
  "ttyl",
  "until next time",
]

// Function to check if a message is a farewell
export function isFarewell(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  return farewellPatterns.some((pattern) => normalizedMessage.includes(pattern))
}

// Helper function to determine if a message is about the app itself
export function isAppRelatedQuery(message: string): boolean {
  // Check if it's a direct question about the app
  if (isAppQuestion(message)) {
    return true
  }

  const appRelatedKeywords = [
    "app",
    "flux",
    "feature",
    "help",
    "how to use",
    "settings",
    "preferences",
    "interface",
    "ui",
    "dashboard",
    "account",
    "profile",
    "login",
    "logout",
    "how does this work",
    "what can you do",
    "what are you",
  ]

  const lowerMessage = message.toLowerCase()
  return appRelatedKeywords.some((keyword) => lowerMessage.includes(keyword))
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Sparkles, Code, FileText, MessageSquare, Zap } from "lucide-react"
import { SuggestionChips } from "./suggestion-chips"
import { cn } from "@/lib/utils"

interface WelcomeScreenProps {
  onSuggestionSelect: (suggestion: string) => void
  className?: string
}

export function WelcomeScreen({ onSuggestionSelect, className }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "code" | "docs">("chat")

  const suggestionsByTab = {
    chat: [
      "How can you help me?",
      "Tell me about React",
      "What's new in Next.js 15?",
      "Explain the difference between REST and GraphQL",
    ],
    code: [
      "Generate a React component for a contact form",
      "Write a function to sort an array of objects",
      "Create a responsive navbar with Tailwind CSS",
      "Show me how to use the useReducer hook",
    ],
    docs: [
      "How do I deploy to Vercel?",
      "Explain server components",
      "What are environment variables?",
      "How to implement authentication?",
    ],
  }

  const features = [
    {
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      title: "Natural Conversations",
      description: "Ask questions in plain language and get helpful responses",
    },
    {
      icon: <Code className="h-4 w-4 text-blue-500" />,
      title: "Code Generation",
      description: "Get working code examples in multiple languages",
    },
    {
      icon: <FileText className="h-4 w-4 text-blue-500" />,
      title: "Documentation",
      description: "Access documentation and best practices",
    },
    {
      icon: <Zap className="h-4 w-4 text-blue-500" />,
      title: "Quick Solutions",
      description: "Solve problems and debug issues efficiently",
    },
  ]

  return (
    <div className={cn("max-w-2xl mx-auto px-4 py-8", className)}>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to AI Assistant</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Your intelligent coding companion. Ask questions, get code examples, and solve problems faster.
        </p>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200",
              activeTab === "chat"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
            )}
            onClick={() => setActiveTab("chat")}
          >
            <MessageSquare className="h-4 w-4 inline-block mr-2" />
            Chat
          </button>
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200",
              activeTab === "code"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
            )}
            onClick={() => setActiveTab("code")}
          >
            <Code className="h-4 w-4 inline-block mr-2" />
            Code
          </button>
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200",
              activeTab === "docs"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
            )}
            onClick={() => setActiveTab("docs")}
          >
            <FileText className="h-4 w-4 inline-block mr-2" />
            Docs
          </button>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Try asking about</h3>
            </div>
            <SuggestionChips suggestions={suggestionsByTab[activeTab]} onSelect={onSuggestionSelect} className="mb-0" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3 mt-0.5">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="text-center text-xs text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <p>Type a message below to get started or select a suggestion above.</p>
      </motion.div>
    </div>
  )
}

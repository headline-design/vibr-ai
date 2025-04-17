"use client"
import {
  Code,
  X,
  FileText,
  MessageSquare,
  HelpCircle,
  Zap,
  GitBranch,
  Brain,
  Search,
  Database,
  Terminal,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FluxBranding } from "./flux-branding"

interface AssistantCapabilitiesProps {
  onClose: () => void
  className?: string
}

export function AssistantCapabilities({ onClose, className }: AssistantCapabilitiesProps) {
  const capabilities = [
    {
      icon: <Code className="h-4 w-4 text-indigo-500" />,
      title: "Code Generation",
      description: "Create code examples in various programming languages.",
    },
    {
      icon: <GitBranch className="h-4 w-4 text-indigo-500" />,
      title: "Debugging Help",
      description: "Identify and fix issues in your code.",
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-indigo-500" />,
      title: "Answer Questions",
      description: "Get accurate information on programming topics.",
    },
    {
      icon: <FileText className="h-4 w-4 text-indigo-500" />,
      title: "Explain Concepts",
      description: "Understand complex programming concepts clearly.",
    },
    {
      icon: <Zap className="h-4 w-4 text-indigo-500" />,
      title: "Optimize Code",
      description: "Improve performance and readability of your code.",
    },
    {
      icon: <HelpCircle className="h-4 w-4 text-indigo-500" />,
      title: "General Assistance",
      description: "Help with a wide range of development tasks.",
    },
    {
      icon: <Brain className="h-4 w-4 text-indigo-500" />,
      title: "Problem Solving",
      description: "Work through complex programming challenges.",
    },
    {
      icon: <Search className="h-4 w-4 text-indigo-500" />,
      title: "Code Analysis",
      description: "Review and understand existing codebases.",
    },
    {
      icon: <Database className="h-4 w-4 text-indigo-500" />,
      title: "Database Queries",
      description: "Help with SQL and database-related questions.",
    },
    {
      icon: <Terminal className="h-4 w-4 text-indigo-500" />,
      title: "Command Line Help",
      description: "Assistance with terminal commands and scripts.",
    },
    {
      icon: <RefreshCw className="h-4 w-4 text-indigo-500" />,
      title: "Refactoring Suggestions",
      description: "Improve code structure and maintainability.",
    },
  ]

  return (
    <div
      className={cn(
        "bg-background rounded-md border border-gray-200 dark:border-gray-700 p-4 mb-4",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <FluxBranding variant="minimal" size="sm" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Capabilities</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onClose}
          aria-label="Close capabilities panel"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {capabilities.map((capability, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="mt-0.5">{capability.icon}</div>
            <div>
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">{capability.title}</h4>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">{capability.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
          Try asking about specific programming languages, frameworks, or development concepts. I'm here to help with
          your coding questions!
        </p>
      </div>
    </div>
  )
}

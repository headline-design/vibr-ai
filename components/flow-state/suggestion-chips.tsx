"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  className?: string
}

export function SuggestionChips({ suggestions, onSelect, className }: SuggestionChipsProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md px-3 py-1 h-auto transition-colors duration-200 hover:border-neutral-300 dark:hover:border-neutral-700"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

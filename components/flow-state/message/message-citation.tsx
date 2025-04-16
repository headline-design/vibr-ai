"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronDown, ChevronUp, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Citation {
  title: string
  url: string
  snippet?: string
}

interface MessageCitationProps {
  citations: Citation[]
  className?: string
}

export function MessageCitation({ citations, className }: MessageCitationProps) {
  const [expanded, setExpanded] = useState(false)

  if (citations.length === 0) return null

  return (
    <div className={cn("mt-2 text-xs", className)}>
      <div className="flex items-center text-gray-500 dark:text-gray-400">
        <Info className="h-3 w-3 mr-1" />
        <button
          className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span>
            {citations.length} {citations.length === 1 ? "source" : "sources"}
          </span>
          {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          {citations.map((citation, index) => (
            <div
              key={index}
              className="p-2 bg-gray-100 rounded border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-1">
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {citation.title}
                </a>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400" asChild>
                  <a href={citation.url} target="_blank" rel="noopener noreferrer" aria-label="Open link">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
              {citation.snippet && <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{citation.snippet}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowUp, ArrowDown, Calendar, HighlighterIcon as HighlightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { ChatMessage } from "./chat-interface"
import { Badge } from "@/components/ui/badge"

interface ChatSearchProps {
  messages: ChatMessage[]
  onResultSelect: (messageId: string) => void
  onClose: () => void
  isOpen: boolean
  className?: string
}

export function ChatSearch({ messages, onResultSelect, onClose, isOpen, className }: ChatSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([])
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({})
  const [activeFilter, setActiveFilter] = useState<"all" | "user" | "assistant">("all")

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearchTerm("")
      setSearchResults([])
      setSelectedResultIndex(0)
      setDateRange({})
      setActiveFilter("all")
    }
  }, [isOpen])

  // Search messages when search term or filters change
  useEffect(() => {
    if (!searchTerm && !dateRange.from && !dateRange.to) {
      setSearchResults([])
      return
    }

    const results = messages.filter((message) => {
      // Role filter
      if (activeFilter === "user" && message.role !== "user") return false
      if (activeFilter === "assistant" && message.role !== "assistant") return false

      // Text search
      const matchesText = searchTerm ? message.content.toLowerCase().includes(searchTerm.toLowerCase()) : true

      // Date filter
      let matchesDate = true
      if (dateRange.from || dateRange.to) {
        const messageDate = message.timestamp ? new Date(message.timestamp) : null
        if (!messageDate) return false

        if (dateRange.from) {
          const fromDate = new Date(dateRange.from)
          fromDate.setHours(0, 0, 0, 0)
          matchesDate = matchesDate && messageDate >= fromDate
        }

        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          matchesDate = matchesDate && messageDate <= toDate
        }
      }

      return matchesText && matchesDate
    })

    setSearchResults(results)
    setSelectedResultIndex(results.length > 0 ? 0 : -1)
  }, [searchTerm, dateRange, activeFilter, messages])

  // Scroll selected result into view
  useEffect(() => {
    if (selectedResultIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedResultIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }, [selectedResultIndex])

  // Navigate to previous result
  const goToPreviousResult = () => {
    if (searchResults.length === 0) return
    setSelectedResultIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
  }

  // Navigate to next result
  const goToNextResult = () => {
    if (searchResults.length === 0) return
    setSelectedResultIndex((prev) => (prev + 1) % searchResults.length)
  }

  // Select a result
  const selectResult = (index: number) => {
    setSelectedResultIndex(index)
    onResultSelect(searchResults[index].id)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setDateRange({})
    setSearchResults([])
    setSelectedResultIndex(0)
    setActiveFilter("all")
    inputRef.current?.focus()
  }

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return ""
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }

  // Highlight search term in text
  const highlightText = (text: string) => {
    if (!searchTerm) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      goToNextResult()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      goToPreviousResult()
    } else if (e.key === "Enter" && selectedResultIndex >= 0) {
      e.preventDefault()
      onResultSelect(searchResults[selectedResultIndex].id)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn("bg-background rounded-lg shadow-lg w-full max-w-lg overflow-hidden", className)}
            onKeyDown={handleKeyDown}
          >
            {/* Search header */}
            <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <Input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 border-none shadow-none focus-visible:ring-0 text-sm"
              />

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-7 text-xs", activeFilter === "all" && "bg-gray-100 dark:bg-gray-700")}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-7 text-xs", activeFilter === "user" && "bg-gray-100 dark:bg-gray-700")}
                  onClick={() => setActiveFilter("user")}
                >
                  You
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-7 text-xs", activeFilter === "assistant" && "bg-gray-100 dark:bg-gray-700")}
                  onClick={() => setActiveFilter("assistant")}
                >
                  AI
                </Button>

                <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                        (dateRange.from || dateRange.to) && "text-blue-600 dark:text-blue-400",
                      )}
                      aria-label="Filter by date"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="range"
                      selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                      onSelect={(range) => setDateRange(range || {})}
                      initialFocus
                    />
                    <div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {dateRange.from && dateRange.to
                          ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                          : dateRange.from
                            ? `From ${formatDate(dateRange.from)}`
                            : dateRange.to
                              ? `Until ${formatDate(dateRange.to)}`
                              : "Select date range"}
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setDateRange({})}>
                        Clear
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {(searchTerm || dateRange.from || dateRange.to || activeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-1"
                onClick={onClose}
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search results */}
            <div ref={resultsRef} className="max-h-[400px] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                    <span>
                      {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                    </span>
                    {searchTerm && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 flex items-center gap-1">
                        <HighlightIcon className="h-2.5 w-2.5" />
                        {searchTerm}
                      </Badge>
                    )}
                  </div>
                  {searchResults.map((result, index) => (
                    <button
                      key={result.id}
                      data-index={index}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200",
                        index === selectedResultIndex && "bg-gray-100 dark:bg-gray-700",
                      )}
                      onClick={() => selectResult(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {result.role === "user" ? "You" : "Assistant"}
                        </div>
                        {result.timestamp && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(result.timestamp).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {highlightText(result.content)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  {searchTerm || dateRange.from || dateRange.to || activeFilter !== "all" ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">No results found</div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">Enter a search term to find messages</div>
                  )}
                </div>
              )}
            </div>

            {/* Search navigation */}
            {searchResults.length > 0 && (
              <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedResultIndex + 1} of {searchResults.length}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={goToPreviousResult}
                    disabled={searchResults.length === 0}
                    aria-label="Previous result"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={goToNextResult}
                    disabled={searchResults.length === 0}
                    aria-label="Next result"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

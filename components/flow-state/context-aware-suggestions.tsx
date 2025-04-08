"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Code, BookOpen, MessageSquare, Lightbulb, Zap } from "lucide-react"

interface Suggestion {
  id: string
  text: string
  category: "code" | "reference" | "question" | "insight"
  relevanceScore: number
  source?: string
}

interface ContextAwareSuggestionsProps {
  conversationContext?: string
  currentTopic?: string
  onSuggestionSelect?: (suggestion: string) => void
  className?: string
}

export function ContextAwareSuggestions({
  conversationContext = "",
  currentTopic = "",
  onSuggestionSelect,
  className = "",
}: ContextAwareSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Mock function to generate suggestions based on context
  // In a real implementation, this would call an API
  useEffect(() => {
    if (!conversationContext && !currentTopic) return

    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        {
          id: "1",
          text: "How would you implement a custom hook for this feature?",
          category: "question",
          relevanceScore: 0.92,
        },
        {
          id: "2",
          text: "Consider using React.memo() to optimize rendering performance",
          category: "insight",
          relevanceScore: 0.87,
        },
        {
          id: "3",
          text: "const useDebounce = (value, delay) => { ... }",
          category: "code",
          relevanceScore: 0.85,
          source: "React Hooks Documentation",
        },
        {
          id: "4",
          text: "Check the React documentation on concurrent mode",
          category: "reference",
          relevanceScore: 0.78,
          source: "React Docs",
        },
        {
          id: "5",
          text: "What are the performance implications of this approach?",
          category: "question",
          relevanceScore: 0.76,
        },
        {
          id: "6",
          text: "useEffect(() => { ... }, [dependency])",
          category: "code",
          relevanceScore: 0.72,
        },
      ]

      setSuggestions(mockSuggestions)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [conversationContext, currentTopic])

  const filteredSuggestions = activeTab === "all" ? suggestions : suggestions.filter((s) => s.category === activeTab)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "code":
        return <Code className="h-3.5 w-3.5" />
      case "reference":
        return <BookOpen className="h-3.5 w-3.5" />
      case "question":
        return <MessageSquare className="h-3.5 w-3.5" />
      case "insight":
        return <Lightbulb className="h-3.5 w-3.5" />
      default:
        return <Sparkles className="h-3.5 w-3.5" />
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion.text)
    }
  }

  return (
    <Card className={`w-full shadow-sm border-gray-100 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Context-Aware Suggestions
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">Based on your current conversation</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4">
            <TabsList className="grid grid-cols-5 h-8 mb-2">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                Code
              </TabsTrigger>
              <TabsTrigger value="question" className="text-xs">
                Questions
              </TabsTrigger>
              <TabsTrigger value="insight" className="text-xs">
                Insights
              </TabsTrigger>
              <TabsTrigger value="reference" className="text-xs">
                References
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[180px] px-4 pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-xs text-gray-400">Generating suggestions...</div>
                </div>
              ) : filteredSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-2 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-sm">{suggestion.text}</div>
                        <Badge
                          variant="outline"
                          className="ml-2 text-[10px] h-5 px-1.5 flex items-center gap-1 whitespace-nowrap"
                        >
                          {getCategoryIcon(suggestion.category)}
                          <span className="capitalize">{suggestion.category}</span>
                        </Badge>
                      </div>
                      {suggestion.source && (
                        <div className="text-xs text-gray-400 mt-1">Source: {suggestion.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-xs text-gray-400">No suggestions available</div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, FileText, Search, ExternalLink, Plus, X, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KnowledgeSource {
  id: string
  name: string
  type: "document" | "database" | "api"
  status: "active" | "pending" | "error"
  lastUpdated: string
  documentCount?: number
}

interface SearchResult {
  id: string
  title: string
  excerpt: string
  source: string
  relevance: number
  url?: string
}

interface KnowledgeBaseIntegrationProps {
  className?: string
}

export function KnowledgeBaseIntegration({ className = "" }: KnowledgeBaseIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [activeTab, setActiveTab] = useState("search")
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  // Mock knowledge sources
  const knowledgeSources: KnowledgeSource[] = [
    {
      id: "1",
      name: "Company Documentation",
      type: "document",
      status: "active",
      lastUpdated: "2023-04-15",
      documentCount: 156,
    },
    {
      id: "2",
      name: "Product Database",
      type: "database",
      status: "active",
      lastUpdated: "2023-04-20",
    },
    {
      id: "3",
      name: "Customer Support Tickets",
      type: "api",
      status: "active",
      lastUpdated: "2023-04-22",
    },
    {
      id: "4",
      name: "Engineering Wiki",
      type: "document",
      status: "error",
      lastUpdated: "2023-04-10",
      documentCount: 89,
    },
    {
      id: "5",
      name: "Market Research",
      type: "document",
      status: "pending",
      lastUpdated: "2023-04-21",
      documentCount: 42,
    },
  ]

  // Mock search function
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    // Simulate API call delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Product Feature Documentation",
          excerpt:
            "The new feature allows users to integrate with third-party APIs through a simple configuration interface...",
          source: "Company Documentation",
          relevance: 0.95,
          url: "#",
        },
        {
          id: "2",
          title: "API Integration Guide",
          excerpt:
            "To connect with external systems, use the provided authentication tokens and follow the OAuth2 flow...",
          source: "Engineering Wiki",
          relevance: 0.87,
          url: "#",
        },
        {
          id: "3",
          title: "Customer Feedback on Integration",
          excerpt:
            "Customers have reported positive experiences with the new integration capabilities, particularly highlighting...",
          source: "Customer Support Tickets",
          relevance: 0.78,
          url: "#",
        },
      ]

      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1200)
  }

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources((prev) => (prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]))
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "api":
        return <ExternalLink className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Check className="h-3.5 w-3.5 text-green-500" />
      case "pending":
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
      case "error":
        return <X className="h-3.5 w-3.5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className={`w-full shadow-sm border-gray-100 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Knowledge Base Integration</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Search across your connected knowledge sources
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4">
            <TabsList className="grid grid-cols-2 h-8 mb-2">
              <TabsTrigger value="search" className="text-xs">
                Search
              </TabsTrigger>
              <TabsTrigger value="sources" className="text-xs">
                Sources
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="m-0 px-4">
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? (
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            <ScrollArea className="h-[220px]">
              {isSearching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-xs text-gray-400">Searching knowledge base...</div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-sm">{result.title}</div>
                        <Badge variant="outline" className="text-[10px] h-5">
                          {Math.round(result.relevance * 100)}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.excerpt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">Source: {result.source}</span>
                        {result.url && (
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <span className="text-xs">View</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-xs text-gray-400">No results found</div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-xs text-gray-400">Enter a search query to find information</div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sources" className="m-0">
            <ScrollArea className="h-[220px] px-4">
              <div className="space-y-2">
                {knowledgeSources.map((source) => (
                  <div
                    key={source.id}
                    className="p-2 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-md">{getSourceIcon(source.type)}</div>
                        <div>
                          <div className="font-medium text-sm flex items-center gap-1.5">
                            {source.name}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">{getStatusIcon(source.status)}</div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs capitalize">Status: {source.status}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="capitalize">{source.type}</span>
                            {source.documentCount && (
                              <>
                                <span>•</span>
                                <span>{source.documentCount} documents</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={selectedSources.includes(source.id) ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toggleSourceSelection(source.id)}
                      >
                        {selectedSources.includes(source.id) ? "Selected" : "Select"}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">Last updated: {source.lastUpdated}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3 px-4">
        {activeTab === "sources" && (
          <Button size="sm" variant="outline" className="text-xs h-7">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Source
          </Button>
        )}
        {activeTab === "search" && searchResults.length > 0 && (
          <Button size="sm" variant="outline" className="text-xs h-7 ml-auto">
            Use in Conversation
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import {
  Book,
  Search,
  Plus,
  FileText,
  X,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Database,
  Globe,
  MessageSquare,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface KnowledgeBaseManagerProps {
  onAddSource: (source: KnowledgeSource) => void
  onRemoveSource: (sourceId: string) => void
  onUpdateSource: (source: KnowledgeSource) => void
  onSearch: (query: string) => Promise<SearchResult[]>
  className?: string
}

interface KnowledgeSource {
  id: string
  name: string
  type: "file" | "website" | "database" | "text"
  status: "active" | "processing" | "error" | "inactive"
  size?: number
  documentCount?: number
  lastUpdated: string
  description?: string
  url?: string
  tags?: string[]
  isPublic?: boolean
}

interface SearchResult {
  id: string
  title: string
  content: string
  source: string
  relevance: number
  metadata?: Record<string, any>
}

export function KnowledgeBaseManager({
  onAddSource,
  onRemoveSource,
  onUpdateSource,
  onSearch,
  className,
}: KnowledgeBaseManagerProps) {
  // State
  const [activeTab, setActiveTab] = useState<string>("sources")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isAddSourceDialogOpen, setIsAddSourceDialogOpen] = useState<boolean>(false)
  const [isEditSourceDialogOpen, setIsEditSourceDialogOpen] = useState<boolean>(false)
  const [isDeleteSourceDialogOpen, setIsDeleteSourceDialogOpen] = useState<boolean>(false)
  const [selectedSource, setSelectedSource] = useState<KnowledgeSource | null>(null)
  const [newSourceType, setNewSourceType] = useState<KnowledgeSource["type"]>("file")
  const [newSourceName, setNewSourceName] = useState<string>("")
  const [newSourceDescription, setNewSourceDescription] = useState<string>("")
  const [newSourceUrl, setNewSourceUrl] = useState<string>("")
  const [newSourceTags, setNewSourceTags] = useState<string[]>([])
  const [newSourceIsPublic, setNewSourceIsPublic] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("lastUpdated")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Sample knowledge sources
  const [sources, setSources] = useState<KnowledgeSource[]>([
    {
      id: "source-1",
      name: "Product Documentation",
      type: "file",
      status: "active",
      size: 2500000,
      documentCount: 15,
      lastUpdated: "2023-06-15T10:30:00",
      description: "Official product documentation and user guides",
      tags: ["documentation", "guides", "official"],
    },
    {
      id: "source-2",
      name: "Company Website",
      type: "website",
      status: "active",
      documentCount: 42,
      lastUpdated: "2023-06-10T14:20:00",
      url: "https://example.com",
      tags: ["website", "public"],
    },
    {
      id: "source-3",
      name: "Customer Support Database",
      type: "database",
      status: "active",
      documentCount: 1250,
      lastUpdated: "2023-06-05T09:15:00",
      description: "Database of customer support tickets and resolutions",
      tags: ["support", "internal"],
    },
    {
      id: "source-4",
      name: "API Documentation",
      type: "file",
      status: "processing",
      size: 1800000,
      lastUpdated: "2023-06-18T16:45:00",
      description: "Technical documentation for API endpoints",
      tags: ["api", "technical", "development"],
    },
    {
      id: "source-5",
      name: "Internal Knowledge Base",
      type: "text",
      status: "inactive",
      documentCount: 78,
      lastUpdated: "2023-05-20T11:30:00",
      description: "Internal company knowledge base",
      tags: ["internal", "knowledge"],
    },
    {
      id: "source-6",
      name: "Competitor Analysis",
      type: "file",
      status: "error",
      size: 3200000,
      lastUpdated: "2023-06-12T13:10:00",
      description: "Analysis of competitor products and features",
      tags: ["competitors", "analysis", "confidential"],
    },
  ])

  // Filter and sort sources
  const filteredSources = sources
    .filter((source) => {
      // Filter by type
      if (filterType !== "all" && source.type !== filterType) {
        return false
      }

      // Filter by status
      if (filterStatus !== "all" && source.status !== filterStatus) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          source.name.toLowerCase().includes(query) ||
          (source.description && source.description.toLowerCase().includes(query)) ||
          (source.tags && source.tags.some((tag) => tag.toLowerCase().includes(query)))
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "lastUpdated") {
        return sortDirection === "asc"
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      } else if (sortBy === "documentCount") {
        const countA = a.documentCount || 0
        const countB = b.documentCount || 0
        return sortDirection === "asc" ? countA - countB : countB - countA
      } else if (sortBy === "size") {
        const sizeA = a.size || 0
        const sizeB = b.size || 0
        return sortDirection === "asc" ? sizeA - sizeB : sizeB - sizeA
      }

      return 0
    })

  // Search knowledge base
  const searchKnowledgeBase = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await onSearch(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Add new source
  const addNewSource = () => {
    const newSource: KnowledgeSource = {
      id: `source-${Date.now()}`,
      name: newSourceName,
      type: newSourceType,
      status: "processing",
      lastUpdated: new Date().toISOString(),
      description: newSourceDescription,
      url: newSourceUrl,
      tags: newSourceTags,
      isPublic: newSourceIsPublic,
      documentCount: 0,
    }

    setSources([...sources, newSource])
    onAddSource(newSource)

    // Reset form
    setNewSourceName("")
    setNewSourceDescription("")
    setNewSourceUrl("")
    setNewSourceTags([])
    setNewSourceIsPublic(false)

    setIsAddSourceDialogOpen(false)
  }

  // Update source
  const updateSource = () => {
    if (!selectedSource) return

    const updatedSource: KnowledgeSource = {
      ...selectedSource,
      name: newSourceName,
      description: newSourceDescription,
      url: newSourceUrl,
      tags: newSourceTags,
      isPublic: newSourceIsPublic,
      lastUpdated: new Date().toISOString(),
    }

    setSources(sources.map((source) => (source.id === updatedSource.id ? updatedSource : source)))

    onUpdateSource(updatedSource)
    setIsEditSourceDialogOpen(false)
  }

  // Delete source
  const deleteSource = () => {
    if (!selectedSource) return

    setSources(sources.filter((source) => source.id !== selectedSource.id))
    onRemoveSource(selectedSource.id)
    setIsDeleteSourceDialogOpen(false)
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined) return "Unknown"

    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get source type icon
  const getSourceTypeIcon = (type: KnowledgeSource["type"]) => {
    switch (type) {
      case "file":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "website":
        return <Globe className="h-5 w-5 text-green-500" />
      case "database":
        return <Database className="h-5 w-5 text-purple-500" />
      case "text":
        return <MessageSquare className="h-5 w-5 text-amber-500" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  // Get source status badge
  const getSourceStatusBadge = (status: KnowledgeSource["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Processing</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Error</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-muted-foreground">Inactive</Badge>
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <Book className="h-5 w-5 mr-2 text-blue-500" />
          Knowledge Base Manager
        </h2>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => {
              setNewSourceType("file")
              setNewSourceName("")
              setNewSourceDescription("")
              setNewSourceUrl("")
              setNewSourceTags([])
              setNewSourceIsPublic(false)
              setIsAddSourceDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="sources" className="flex items-center">
            <Database className="h-4 w-4 mr-1.5" />
            Knowledge Sources
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center">
            <Search className="h-4 w-4 mr-1.5" />
            Search & Query
          </TabsTrigger>
        </TabsList>

        {/* Sources tab */}
        <TabsContent value="sources" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-1.5" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="p-2">
                    <div className="text-xs font-medium mb-1">Source Type</div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="file">Files</SelectItem>
                        <SelectItem value="website">Websites</SelectItem>
                        <SelectItem value="database">Databases</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <div className="text-xs font-medium mb-1">Status</div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <ArrowUpDown className="h-4 w-4 mr-1.5" />
                    Sort
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => {
                      if (sortBy === "name") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortBy("name")
                        setSortDirection("asc")
                      }
                    }}
                    className={cn(sortBy === "name" && "font-medium")}
                  >
                    Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (sortBy === "lastUpdated") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortBy("lastUpdated")
                        setSortDirection("desc")
                      }
                    }}
                    className={cn(sortBy === "lastUpdated" && "font-medium")}
                  >
                    Last Updated {sortBy === "lastUpdated" && (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (sortBy === "documentCount") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortBy("documentCount")
                        setSortDirection("desc")
                      }
                    }}
                    className={cn(sortBy === "documentCount" && "font-medium")}
                  >
                    Document Count {sortBy === "documentCount" && (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (sortBy === "size") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortBy("size")
                        setSortDirection("desc")
                      }
                    }}
                    className={cn(sortBy === "size" && "font-medium")}
                  >
                    Size {sortBy === "size" && (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredSources.length} {filteredSources.length === 1 ? "source" : "sources"}
            </div>
          </div>

          {filteredSources.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Database className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No knowledge sources found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first knowledge source to get started"}
              </p>
              {searchQuery || filterType !== "all" || filterStatus !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterType("all")
                    setFilterStatus("all")
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => {
                    setNewSourceType("file")
                    setNewSourceName("")
                    setNewSourceDescription("")
                    setNewSourceUrl("")
                    setNewSourceTags([])
                    setNewSourceIsPublic(false)
                    setIsAddSourceDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Knowledge Source
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">{getSourceTypeIcon(source.type)}</div>

                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{source.name}</h3>
                            <div className="ml-2">{getSourceStatusBadge(source.status)}</div>
                            {source.isPublic && (
                              <Badge variant="outline" className="ml-2">
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>

                          {source.description && <p className="text-sm text-muted-foreground">{source.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedSource(source)
                            setNewSourceType(source.type)
                            setNewSourceName(source.name)
                            setNewSourceDescription(source.description || "")
                            setNewSourceUrl(source.url || "")
                            setNewSourceTags(source.tags || [])
                            setNewSourceIsPublic(!!source.isPublic)
                            setIsEditSourceDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => {
                            setSelectedSource(source)
                            setIsDeleteSourceDialogOpen(true)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span>Last Updated: {formatDate(source.lastUpdated)}</span>
                        {source.size !== undefined && <span> | Size: {formatFileSize(source.size)}</span>}
                        {source.documentCount !== undefined && <span> | Documents: {source.documentCount}</span>}
                      </div>
                      {source.tags && source.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {source.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        {/* Search tab */}
        <TabsContent value="search" className="space-y-4 mt-6">
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={searchKnowledgeBase} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              {searchQuery ? (
                <p className="text-muted-foreground mb-4">Try adjusting your search query</p>
              ) : (
                <p className="text-muted-foreground mb-4">Enter a search query to find knowledge sources</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id}>
                  <CardContent className="p-6">
                    <h3 className="font-medium">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{result.content.substring(0, 150)}...</p>
                    <div
                      className="mt-4 text-xs text-gray
                      500"
                    >
                      <span>Source: {result.source}</span>
                      {result.metadata && <span className="ml-2">| Relevance: {result.relevance.toFixed(2)}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

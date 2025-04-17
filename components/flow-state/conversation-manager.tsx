"use client"

import type React from "react"

import { useState } from "react"
import {
  MessageSquare,
  Folder,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Search,
  Plus,
  Edit2,
  Copy,
  Share2,
  Download,
  Tag,
  Clock,
  Filter,
  ChevronDown,
  X,
  FolderPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface Conversation {
  id: string
  title: string
  preview: string
  date: string
  folder?: string
  tags?: string[]
  isStarred?: boolean
  isArchived?: boolean
  isDeleted?: boolean
  messageCount?: number
  model?: string
}

interface FolderType {
  id: string
  name: string
  color?: string
}

interface ConversationManagerProps {
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  className?: string
}

export function ConversationManager({ onSelectConversation, onNewConversation, className }: ConversationManagerProps) {
  // Sample data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "React Component Design",
      preview: "Can you help me design a responsive navbar component?",
      date: "2023-06-15T14:30:00",
      folder: "projects",
      tags: ["react", "ui"],
      isStarred: true,
      messageCount: 12,
      model: "gpt-4",
    },
    {
      id: "2",
      title: "Database Schema Planning",
      preview: "I need help designing a schema for a social media app",
      date: "2023-06-14T10:15:00",
      folder: "projects",
      tags: ["database", "planning"],
      messageCount: 8,
      model: "gpt-4",
    },
    {
      id: "3",
      title: "API Integration Help",
      preview: "How do I integrate the Stripe API with my Next.js app?",
      date: "2023-06-10T09:45:00",
      folder: "learning",
      tags: ["api", "next.js"],
      messageCount: 15,
      model: "gpt-3.5",
    },
    {
      id: "4",
      title: "CSS Animation Techniques",
      preview: "What are some advanced CSS animation techniques?",
      date: "2023-06-05T16:20:00",
      folder: "learning",
      tags: ["css", "animation"],
      isArchived: true,
      messageCount: 6,
      model: "gpt-3.5",
    },
    {
      id: "5",
      title: "Performance Optimization",
      preview: "How can I optimize the performance of my React application?",
      date: "2023-06-01T11:10:00",
      tags: ["react", "performance"],
      isDeleted: true,
      messageCount: 9,
      model: "gpt-4",
    },
  ])

  const [folders, setFolders] = useState<FolderType[]>([
    { id: "all", name: "All Conversations" },
    { id: "starred", name: "Starred" },
    { id: "projects", name: "Projects", color: "#3b82f6" },
    { id: "learning", name: "Learning", color: "#10b981" },
    { id: "archived", name: "Archived" },
    { id: "trash", name: "Trash" },
  ])

  // State
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("#3b82f6")
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [conversationToRename, setConversationToRename] = useState<Conversation | null>(null)
  const [newConversationTitle, setNewConversationTitle] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "title" | "messages">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [filterModel, setFilterModel] = useState<string | null>(null)
  const [filterTags, setFilterTags] = useState<string[]>([])

  // Get all unique tags from conversations
  const allTags = Array.from(new Set(conversations.flatMap((conv) => conv.tags || []).filter(Boolean)))

  // Get all unique models from conversations
  const allModels = Array.from(new Set(conversations.map((conv) => conv.model).filter(Boolean) as string[]))

  // Filter conversations based on selected folder, search query, and filters
  const filteredConversations = conversations
    .filter((conv) => {
      // Filter by folder
      if (selectedFolder === "all" && !conv.isArchived && !conv.isDeleted) return true
      if (selectedFolder === "starred" && conv.isStarred && !conv.isArchived && !conv.isDeleted) return true
      if (selectedFolder === "archived" && conv.isArchived) return true
      if (selectedFolder === "trash" && conv.isDeleted) return true
      if (selectedFolder === conv.folder && !conv.isArchived && !conv.isDeleted) return true
      return false
    })
    .filter((conv) => {
      // Filter by search query
      if (!searchQuery) return true
      return (
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.tags && conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    })
    .filter((conv) => {
      // Filter by model
      if (!filterModel) return true
      return conv.model === filterModel
    })
    .filter((conv) => {
      // Filter by tags
      if (filterTags.length === 0) return true
      return conv.tags && filterTags.every((tag) => conv.tags?.includes(tag))
    })

  // Sort conversations
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortBy === "date") {
      return sortDirection === "desc"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    if (sortBy === "title") {
      return sortDirection === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
    }
    if (sortBy === "messages") {
      return sortDirection === "desc"
        ? (b.messageCount || 0) - (a.messageCount || 0)
        : (a.messageCount || 0) - (b.messageCount || 0)
    }
    return 0
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  // Toggle select mode
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    setSelectedConversations([])
  }

  // Toggle conversation selection
  const toggleConversationSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (selectedConversations.includes(id)) {
      setSelectedConversations(selectedConversations.filter((convId) => convId !== id))
    } else {
      setSelectedConversations([...selectedConversations, id])
    }
  }

  // Select all conversations
  const selectAllConversations = () => {
    if (selectedConversations.length === filteredConversations.length) {
      setSelectedConversations([])
    } else {
      setSelectedConversations(filteredConversations.map((conv) => conv.id))
    }
  }

  // Create new folder
  const createNewFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FolderType = {
      id: newFolderName.toLowerCase().replace(/\s+/g, "-"),
      name: newFolderName,
      color: newFolderColor,
    }

    setFolders([...folders, newFolder])
    setNewFolderName("")
    setIsNewFolderDialogOpen(false)
  }

  // Rename conversation
  const renameConversation = () => {
    if (!conversationToRename || !newConversationTitle.trim()) return

    setConversations(
      conversations.map((conv) =>
        conv.id === conversationToRename.id ? { ...conv, title: newConversationTitle } : conv,
      ),
    )

    setConversationToRename(null)
    setNewConversationTitle("")
    setIsRenameDialogOpen(false)
  }

  // Star conversation
  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    setConversations(conversations.map((conv) => (conv.id === id ? { ...conv, isStarred: !conv.isStarred } : conv)))
  }

  // Archive conversations
  const archiveConversations = (ids: string[]) => {
    setConversations(conversations.map((conv) => (ids.includes(conv.id) ? { ...conv, isArchived: true } : conv)))
    setSelectedConversations([])
    setIsSelectMode(false)
  }

  // Unarchive conversations
  const unarchiveConversations = (ids: string[]) => {
    setConversations(conversations.map((conv) => (ids.includes(conv.id) ? { ...conv, isArchived: false } : conv)))
    setSelectedConversations([])
    setIsSelectMode(false)
  }

  // Delete conversations
  const deleteConversations = (ids: string[]) => {
    setConversations(conversations.map((conv) => (ids.includes(conv.id) ? { ...conv, isDeleted: true } : conv)))
    setSelectedConversations([])
    setIsSelectMode(false)
  }

  // Restore conversations from trash
  const restoreConversations = (ids: string[]) => {
    setConversations(conversations.map((conv) => (ids.includes(conv.id) ? { ...conv, isDeleted: false } : conv)))
    setSelectedConversations([])
    setIsSelectMode(false)
  }

  // Permanently delete conversations
  const permanentlyDeleteConversations = (ids: string[]) => {
    setConversations(conversations.filter((conv) => !ids.includes(conv.id)))
    setSelectedConversations([])
    setIsSelectMode(false)
  }

  // Move conversations to folder
  const moveConversationsToFolder = (ids: string[], folderId: string) => {
    setConversations(conversations.map((conv) => (ids.includes(conv.id) ? { ...conv, folder: folderId } : conv)))
    setSelectedConversations([])
    setIsSelectMode(false)
  }

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc")
  }

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter((t) => t !== tag))
    } else {
      setFilterTags([...filterTags, tag])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setFilterModel(null)
    setFilterTags([])
    setSearchQuery("")
  }

  // Get folder color
  const getFolderColor = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId)
    return folder?.color
  }

  // Get folder icon
  const getFolderIcon = (folderId: string) => {
    switch (folderId) {
      case "all":
        return <MessageSquare className="h-4 w-4" />
      case "starred":
        return <Star className="h-4 w-4 text-amber-400" />
      case "archived":
        return <Archive className="h-4 w-4 text-muted-foreground" />
      case "trash":
        return <Trash2 className="h-4 w-4 text-red-400" />
      default:
        return <Folder className="h-4 w-4" style={{ color: getFolderColor(folderId) }} />
    }
  }

  return (
    <div className={cn("flex flex-col h-full border-r border-gray-200 dark:border-gray-800", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Conversations</h2>
          <div className="flex items-center space-x-1">
            {isSelectMode ? (
              <Button variant="ghost" size="sm" onClick={toggleSelectMode} className="text-xs h-8">
                <X className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSelectMode}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
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

          <Button variant="default" size="sm" className="h-9" onClick={onNewConversation}>
            <Plus className="h-4 w-4 mr-1.5" />
            New
          </Button>
        </div>
      </div>

      {/* Folders */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              className={cn(
                "w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors",
                selectedFolder === folder.id
                  ? "bg-background font-medium"
                  : "hover:bg-accent-muted dark:hover:bg-gray-900",
              )}
              onClick={() => setSelectedFolder(folder.id)}
            >
              {getFolderIcon(folder.id)}
              <span className="ml-2">{folder.name}</span>
              {folder.id === "starred" && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {conversations.filter((c) => c.isStarred && !c.isDeleted).length}
                </Badge>
              )}
              {folder.id === "archived" && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {conversations.filter((c) => c.isArchived).length}
                </Badge>
              )}
              {folder.id === "trash" && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {conversations.filter((c) => c.isDeleted).length}
                </Badge>
              )}
            </button>
          ))}

          <button
            className="w-full flex items-center px-2 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-accent-muted dark:hover:bg-gray-900"
            onClick={() => setIsNewFolderDialogOpen(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          {isSelectMode && (
            <Checkbox
              checked={
                selectedConversations.length > 0 && selectedConversations.length === filteredConversations.length
              }
              onCheckedChange={selectAllConversations}
              className="mr-2 h-4 w-4"
            />
          )}

          <div className="text-xs text-muted-foreground">
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {isSelectMode && selectedConversations.length > 0 ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {selectedFolder !== "archived" && (
                    <DropdownMenuItem onClick={() => archiveConversations(selectedConversations)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                  {selectedFolder === "archived" && (
                    <DropdownMenuItem onClick={() => unarchiveConversations(selectedConversations)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Unarchive
                    </DropdownMenuItem>
                  )}
                  {selectedFolder !== "trash" && (
                    <DropdownMenuItem onClick={() => deleteConversations(selectedConversations)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                  {selectedFolder === "trash" && (
                    <>
                      <DropdownMenuItem onClick={() => restoreConversations(selectedConversations)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Restore
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => permanentlyDeleteConversations(selectedConversations)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Permanently
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm">
                      <Folder className="h-4 w-4 mr-2" />
                      Move to Folder
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {folders
                        .filter((f) => !["all", "starred", "archived", "trash"].includes(f.id))
                        .map((folder) => (
                          <DropdownMenuItem
                            key={folder.id}
                            onClick={() => moveConversationsToFolder(selectedConversations, folder.id)}
                          >
                            {getFolderIcon(folder.id)}
                            <span className="ml-2">{folder.name}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Clock className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("date")
                      toggleSortDirection()
                    }}
                    className={cn(sortBy === "date" && "font-medium")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Date {sortBy === "date" && (sortDirection === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("title")
                      toggleSortDirection()
                    }}
                    className={cn(sortBy === "title" && "font-medium")}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Title {sortBy === "title" && (sortDirection === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("messages")
                      toggleSortDirection()
                    }}
                    className={cn(sortBy === "messages" && "font-medium")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages {sortBy === "messages" && (sortDirection === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {isFilterMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-gray-200 dark:border-gray-800"
          >
            <div className="p-3 space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Model</label>
                <Select value={filterModel || ""} onValueChange={(value) => setFilterModel(value || null)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All models" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All models</SelectItem>
                    {allModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filterTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTagFilter(tag)}
                    >
                      {tag}
                      {filterTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                  {allTags.length === 0 && <div className="text-xs text-muted-foreground">No tags available</div>}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <h3 className="text-sm font-medium mb-1">No conversations found</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {searchQuery || filterModel || filterTags.length > 0
                ? "Try adjusting your filters"
                : selectedFolder === "trash"
                  ? "Trash is empty"
                  : selectedFolder === "archived"
                    ? "No archived conversations"
                    : "Start a new conversation"}
            </p>
            {(searchQuery || filterModel || filterTags.length > 0) && (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
            {!searchQuery &&
              !filterModel &&
              filterTags.length === 0 &&
              selectedFolder !== "trash" &&
              selectedFolder !== "archived" && (
                <Button variant="default" size="sm" className="h-8 text-xs" onClick={onNewConversation}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Conversation
                </Button>
              )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "p-3 hover:bg-accent-muted dark:hover:bg-gray-900/50 cursor-pointer transition-colors",
                  selectedConversations.includes(conversation.id) && "bg-blue-50 dark:bg-blue-900/20",
                )}
                onClick={() =>
                  isSelectMode
                    ? toggleConversationSelection(conversation.id, {} as React.MouseEvent)
                    : onSelectConversation(conversation.id)
                }
              >
                <div className="flex items-start mb-1">
                  <div className="flex items-center mr-2">
                    {isSelectMode ? (
                      <Checkbox
                        checked={selectedConversations.includes(conversation.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedConversations([...selectedConversations, conversation.id])
                          } else {
                            setSelectedConversations(selectedConversations.filter((id) => id !== conversation.id))
                          }
                        }}
                        className="h-4 w-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <button
                        className="text-muted-foreground hover:text-amber-400 transition-colors"
                        onClick={(e) => toggleStar(conversation.id, e)}
                      >
                        <Star className={cn("h-4 w-4", conversation.isStarred && "text-amber-400 fill-amber-400")} />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{formatDate(conversation.date)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">{conversation.preview}</p>

                    <div className="flex items-center mt-1 space-x-1">
                      {conversation.folder && (
                        <div
                          className="flex items-center text-xs px-1.5 py-0.5 rounded-sm bg-background"
                          style={{ color: getFolderColor(conversation.folder) }}
                        >
                          {getFolderIcon(conversation.folder)}
                          <span className="ml-1 truncate">
                            {folders.find((f) => f.id === conversation.folder)?.name}
                          </span>
                        </div>
                      )}

                      {conversation.model && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                          {conversation.model}
                        </Badge>
                      )}

                      {conversation.tags &&
                        conversation.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {!isSelectMode && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-1 -mr-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setConversationToRename(conversation)
                            setNewConversationTitle(conversation.title)
                            setIsRenameDialogOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="h-4 w-4 mr-2" />
                          Manage Tags
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!conversation.isArchived && (
                          <DropdownMenuItem onClick={() => archiveConversations([conversation.id])}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        {conversation.isArchived && (
                          <DropdownMenuItem onClick={() => unarchiveConversations([conversation.id])}>
                            <Archive className="h-4 w-4 mr-2" />
                            Unarchive
                          </DropdownMenuItem>
                        )}
                        {!conversation.isDeleted && (
                          <DropdownMenuItem onClick={() => deleteConversations([conversation.id])}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                        {conversation.isDeleted && (
                          <>
                            <DropdownMenuItem onClick={() => restoreConversations([conversation.id])}>
                              <Archive className="h-4 w-4 mr-2" />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => permanentlyDeleteConversations([conversation.id])}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Permanently
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New folder dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Folder Name</label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-6 h-6 rounded-full",
                      newFolderColor === color && "ring-2 ring-offset-2 ring-gray-400",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewFolderColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newConversationTitle}
                onChange={(e) => setNewConversationTitle(e.target.value)}
                placeholder="Enter conversation title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={renameConversation} disabled={!newConversationTitle.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

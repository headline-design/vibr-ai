"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Brain, Trash2, Plus, X, Save, Upload, Download, FileText, Link, Database, Code, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContextItem {
  id: string
  type: "text" | "code" | "link" | "file" | "database"
  title: string
  content: string
  enabled: boolean
}

interface ContextManagerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contexts: ContextItem[]) => void
  initialContexts?: ContextItem[]
  className?: string
}

export function ContextManager({ isOpen, onClose, onSave, initialContexts = [], className }: ContextManagerProps) {
  const [contexts, setContexts] = useState<ContextItem[]>(initialContexts)
  const [activeTab, setActiveTab] = useState<string>("current")
  const [newItemType, setNewItemType] = useState<ContextItem["type"]>("text")
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemContent, setNewItemContent] = useState("")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Add a new context item
  const addContextItem = () => {
    if (!newItemTitle.trim()) return

    const newItem: ContextItem = {
      id: Date.now().toString(),
      type: newItemType,
      title: newItemTitle,
      content: newItemContent,
      enabled: true,
    }

    setContexts([...contexts, newItem])
    setNewItemTitle("")
    setNewItemContent("")
  }

  // Remove a context item
  const removeContextItem = (id: string) => {
    setContexts(contexts.filter((item) => item.id !== id))
  }

  // Toggle a context item's enabled state
  const toggleContextItem = (id: string) => {
    setContexts(contexts.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  // Edit a context item
  const startEditingItem = (id: string) => {
    setEditingItemId(id)
    const item = contexts.find((item) => item.id === id)
    if (item) {
      setNewItemType(item.type)
      setNewItemTitle(item.title)
      setNewItemContent(item.content)
    }
  }

  // Save edited context item
  const saveEditedItem = () => {
    if (!editingItemId || !newItemTitle.trim()) return

    setContexts(
      contexts.map((item) =>
        item.id === editingItemId ? { ...item, type: newItemType, title: newItemTitle, content: newItemContent } : item,
      ),
    )

    setEditingItemId(null)
    setNewItemTitle("")
    setNewItemContent("")
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingItemId(null)
    setNewItemTitle("")
    setNewItemContent("")
  }

  // Save all contexts
  const saveContexts = () => {
    onSave(contexts)
    onClose()
  }

  // Get icon for context type
  const getContextTypeIcon = (type: ContextItem["type"]) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      case "link":
        return <Link className="h-4 w-4" />
      case "file":
        return <Upload className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Get color for context type
  const getContextTypeColor = (type: ContextItem["type"]) => {
    switch (type) {
      case "text":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60"
      case "code":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/60"
      case "link":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/60"
      case "file":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60"
      case "database":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/60"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/60"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Brain className="h-5 w-5 mr-2" />
            AI Context Manager
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="current" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Current Context</span>
              <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                {contexts.filter((c) => c.enabled).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Context</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="current" className="h-full overflow-y-auto mt-0 data-[state=active]:flex-1">
              <div className="space-y-4">
                {contexts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Brain className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p>
                      No context items added yet. Add some context to help the AI understand your conversation better.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contexts.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "border rounded-lg p-3 transition-colors",
                          item.enabled ? "bg-background" : "bg-gray-50 dark:bg-gray-900/50 opacity-70",
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={cn(
                                "mr-2 flex items-center gap-1 px-1.5 py-0.5 text-xs",
                                getContextTypeColor(item.type),
                              )}
                            >
                              {getContextTypeIcon(item.type)}
                              <span>{item.type}</span>
                            </Badge>
                            <h3 className="font-medium text-sm">{item.title}</h3>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Switch
                              checked={item.enabled}
                              onCheckedChange={() => toggleContextItem(item.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-500 hover:text-gray-700"
                              onClick={() => startEditingItem(item.id)}
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700"
                              onClick={() => removeContextItem(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 max-h-32 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900/50">
                          <pre className="whitespace-pre-wrap font-mono text-xs">{item.content}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="add" className="h-full overflow-y-auto mt-0 data-[state=active]:flex-1">
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {(["text", "code", "link", "file", "database"] as const).map((type) => (
                    <Button
                      key={type}
                      variant={newItemType === type ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 p-2"
                      onClick={() => setNewItemType(type)}
                    >
                      {getContextTypeIcon(type)}
                      <span className="mt-2 text-xs capitalize">{type}</span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="context-title">Title</Label>
                    <Input
                      id="context-title"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="Enter a title for this context"
                    />
                  </div>

                  <div>
                    <Label htmlFor="context-content">Content</Label>
                    <Textarea
                      id="context-content"
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      placeholder={
                        newItemType === "text"
                          ? "Enter text content..."
                          : newItemType === "code"
                            ? "Paste code here..."
                            : newItemType === "link"
                              ? "Enter URL..."
                              : newItemType === "file"
                                ? "File content or path..."
                                : "Database connection string or query..."
                      }
                      className="min-h-[150px] font-mono"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    {editingItemId ? (
                      <>
                        <Button variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1.5" />
                          Cancel
                        </Button>
                        <Button onClick={saveEditedItem}>
                          <Save className="h-4 w-4 mr-1.5" />
                          Update
                        </Button>
                      </>
                    ) : (
                      <Button onClick={addContextItem} disabled={!newItemTitle.trim()}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Context
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="h-full overflow-y-auto mt-0 data-[state=active]:flex-1">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col items-start justify-start h-32 p-4 text-left"
                    onClick={() => {
                      setNewItemType("code")
                      setNewItemTitle("JavaScript Helper Functions")
                      setNewItemContent(
                        "// Common utility functions\nfunction formatDate(date) {\n  return new Date(date).toLocaleDateString();\n}\n\nfunction capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}",
                      )
                      setActiveTab("add")
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <Code className="h-5 w-5 mr-2 text-purple-500" />
                      <span className="font-medium">JavaScript Utilities</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Common JavaScript helper functions for date formatting and string manipulation
                    </p>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-start justify-start h-32 p-4 text-left"
                    onClick={() => {
                      setNewItemType("text")
                      setNewItemTitle("Project Requirements")
                      setNewItemContent(
                        "The project requires:\n- User authentication\n- Data visualization\n- Mobile responsiveness\n- Accessibility compliance\n- Performance optimization",
                      )
                      setActiveTab("add")
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="font-medium">Project Requirements</span>
                    </div>
                    <p className="text-xs text-gray-500">Template for project requirements and specifications</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-start justify-start h-32 p-4 text-left"
                    onClick={() => {
                      setNewItemType("database")
                      setNewItemTitle("Database Schema")
                      setNewItemContent(
                        "Users Table:\n- id: primary key\n- name: string\n- email: string\n- created_at: timestamp\n\nPosts Table:\n- id: primary key\n- user_id: foreign key\n- title: string\n- content: text\n- published: boolean",
                      )
                      setActiveTab("add")
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 mr-2 text-red-500" />
                      <span className="font-medium">Database Schema</span>
                    </div>
                    <p className="text-xs text-gray-500">Template for database schema definition</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-start justify-start h-32 p-4 text-left"
                    onClick={() => {
                      setNewItemType("link")
                      setNewItemTitle("API Documentation")
                      setNewItemContent("https://api.example.com/docs")
                      setActiveTab("add")
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <Link className="h-5 w-5 mr-2 text-green-500" />
                      <span className="font-medium">API Documentation</span>
                    </div>
                    <p className="text-xs text-gray-500">Template for API documentation links</p>
                  </Button>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-1.5" />
                    Export Templates
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Upload className="h-4 w-4 mr-1.5" />
                    Import Templates
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button onClick={saveContexts}>
            <Save className="h-4 w-4 mr-1.5" />
            Save Context
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

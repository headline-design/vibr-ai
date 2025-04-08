"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  MessageSquare,
  Share2,
  Lock,
  Globe,
  UserPlus,
  Settings,
  MoreHorizontal,
  Copy,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pencil,
  Trash2,
  FileText,
  FolderTree,
  History,
  Plus,
  Search,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  status: "online" | "offline" | "away" | "busy"
  role: "owner" | "editor" | "viewer" | "commenter"
  lastActive?: string
}

interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  createdBy: User
  isShared: boolean
  isPublic: boolean
  collaborators: User[]
  messageCount: number
  tags?: string[]
  description?: string
}

interface Comment {
  id: string
  user: User
  content: string
  timestamp: string
  messageId: string
  resolved: boolean
  replies?: Comment[]
}

export function CollaborativeWorkspace() {
  const [activeTab, setActiveTab] = useState("conversations")
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("https://vibr.ai/share/conv-123456")
  const [sharePermission, setSharePermission] = useState("view")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  // Sample data
  const users: User[] = [
    {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      status: "online",
      role: "owner",
      lastActive: "2023-12-15T14:30:00Z",
    },
    {
      id: "user-2",
      name: "Sam Taylor",
      email: "sam@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      status: "online",
      role: "editor",
      lastActive: "2023-12-15T14:25:00Z",
    },
    {
      id: "user-3",
      name: "Jordan Lee",
      email: "jordan@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      status: "away",
      role: "commenter",
      lastActive: "2023-12-15T13:45:00Z",
    },
    {
      id: "user-4",
      name: "Casey Kim",
      email: "casey@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      status: "offline",
      role: "viewer",
      lastActive: "2023-12-14T16:20:00Z",
    },
  ]

  const conversations: Conversation[] = [
    {
      id: "conv-1",
      title: "Project Roadmap Discussion",
      createdAt: "2023-12-10T09:30:00Z",
      updatedAt: "2023-12-15T14:30:00Z",
      createdBy: users[0],
      isShared: true,
      isPublic: false,
      collaborators: [users[0], users[1], users[2]],
      messageCount: 48,
      tags: ["roadmap", "planning", "q1-goals"],
      description: "Discussion about Q1 2024 project roadmap and priorities",
    },
    {
      id: "conv-2",
      title: "API Integration Troubleshooting",
      createdAt: "2023-12-12T11:15:00Z",
      updatedAt: "2023-12-15T13:45:00Z",
      createdBy: users[1],
      isShared: true,
      isPublic: false,
      collaborators: [users[0], users[1]],
      messageCount: 36,
      tags: ["api", "technical", "troubleshooting"],
      description: "Debugging the payment API integration issues",
    },
    {
      id: "conv-3",
      title: "UI Design Feedback",
      createdAt: "2023-12-14T15:20:00Z",
      updatedAt: "2023-12-15T10:10:00Z",
      createdBy: users[0],
      isShared: true,
      isPublic: true,
      collaborators: [users[0], users[1], users[2], users[3]],
      messageCount: 27,
      tags: ["design", "feedback", "ui"],
      description: "Collecting feedback on the new dashboard UI designs",
    },
    {
      id: "conv-4",
      title: "Content Strategy Planning",
      createdAt: "2023-12-08T13:40:00Z",
      updatedAt: "2023-12-14T16:20:00Z",
      createdBy: users[2],
      isShared: true,
      isPublic: false,
      collaborators: [users[0], users[2], users[3]],
      messageCount: 52,
      tags: ["content", "marketing", "strategy"],
      description: "Planning our content strategy for the next quarter",
    },
  ]

  const comments: Comment[] = [
    {
      id: "comment-1",
      user: users[1],
      content: "I think we should prioritize the authentication feature before the dashboard redesign.",
      timestamp: "2023-12-15T10:15:00Z",
      messageId: "msg-123",
      resolved: false,
    },
    {
      id: "comment-2",
      user: users[2],
      content: "The API response format needs to be updated to match our new data structure.",
      timestamp: "2023-12-15T11:30:00Z",
      messageId: "msg-456",
      resolved: true,
    },
    {
      id: "comment-3",
      user: users[0],
      content: "Can we add more detailed error handling in this section?",
      timestamp: "2023-12-15T13:45:00Z",
      messageId: "msg-789",
      resolved: false,
      replies: [
        {
          id: "reply-1",
          user: users[1],
          content: "Good point, I'll update the error handling logic.",
          timestamp: "2023-12-15T14:00:00Z",
          messageId: "msg-789",
          resolved: false,
        },
      ],
    },
  ]

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      conversation.title.toLowerCase().includes(query) ||
      (conversation.description && conversation.description.toLowerCase().includes(query)) ||
      (conversation.tags && conversation.tags.some((tag) => tag.toLowerCase().includes(query)))
    )
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status color
  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  // Get role badge
  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Owner</Badge>
      case "editor":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Editor</Badge>
      case "commenter":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Commenter</Badge>
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Viewer</Badge>
      default:
        return null
    }
  }

  // Handle invite
  const handleInvite = () => {
    console.log("Inviting", inviteEmail, "with role", inviteRole)
    setIsInviteDialogOpen(false)
    setInviteEmail("")
  }

  // Handle share
  const handleShare = () => {
    console.log("Sharing with permission", sharePermission)
    setIsShareDialogOpen(false)
  }

  // Copy share link
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Collaborative Workspace</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
          <Button className="gap-2" onClick={() => setIsShareDialogOpen(true)}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Workspace Activity</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {users.filter((u) => u.status === "online").length} online
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Workspace Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <History className="h-4 w-4 mr-2" />
                      View Activity Log
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FolderTree className="h-4 w-4 mr-2" />
                      Manage Access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardDescription>Recent activity and collaboration in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="conversations" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Conversations
                </TabsTrigger>
                <TabsTrigger value="collaborators" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Collaborators
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="conversations" className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        New Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Import Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="flex items-start p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate">{conversation.title}</h4>
                              {conversation.isPublic ? (
                                <Badge variant="outline" className="gap-1">
                                  <Globe className="h-3 w-3" />
                                  Public
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <Lock className="h-3 w-3" />
                                  Private
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>Updated {formatDate(conversation.updatedAt)}</span>
                              <span>•</span>
                              <span>{conversation.messageCount} messages</span>
                            </div>

                            {conversation.description && (
                              <p className="mt-1 text-sm text-muted-foreground truncate">{conversation.description}</p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex -space-x-2">
                                {conversation.collaborators.slice(0, 3).map((user) => (
                                  <TooltipProvider key={user.id} delayDuration={300}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Avatar className="h-6 w-6 border-2 border-background">
                                          {user.avatarUrl ? (
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                          ) : (
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                          )}
                                        </Avatar>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{user.name}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}

                                {conversation.collaborators.length > 3 && (
                                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs">
                                    +{conversation.collaborators.length - 3}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 ml-auto">
                                {conversation.tags?.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                        <h4 className="font-medium">No conversations found</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchQuery ? "Try a different search term" : "Start a new conversation"}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="collaborators" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Active Collaborators</h3>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsInviteDialogOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                              ) : (
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                            />
                          </div>

                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {user.lastActive && (
                            <div className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatTime(user.lastActive)}
                            </div>
                          )}

                          {getRoleBadge(user.role)}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Recent Comments</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Show Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <XCircle className="h-4 w-4 mr-2" />
                        Show Unresolved
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="h-4 w-4 mr-2" />
                        Most Recent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className={`p-3 border rounded-md ${comment.resolved ? "bg-muted/50" : ""}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                {comment.user.avatarUrl ? (
                                  <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                                ) : (
                                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              <span className="font-medium text-sm">{comment.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.timestamp)} at {formatTime(comment.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {comment.resolved ? (
                                <Badge variant="outline" className="gap-1 text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Resolved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-amber-600">
                                  <AlertCircle className="h-3 w-3" />
                                  Open
                                </Badge>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Reply
                                  </DropdownMenuItem>
                                  {comment.resolved ? (
                                    <DropdownMenuItem>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Mark as Unresolved
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Mark as Resolved
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <p className="text-sm">{comment.content}</p>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="pl-6 space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="p-3 border rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      {reply.user.avatarUrl ? (
                                        <AvatarImage src={reply.user.avatarUrl} alt={reply.user.name} />
                                      ) : (
                                        <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                      )}
                                    </Avatar>
                                    <span className="font-medium text-sm">{reply.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(reply.timestamp)} at {formatTime(reply.timestamp)}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle>Workspace Details</CardTitle>
            <CardDescription>Manage your collaborative workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedConversation ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Selected Conversation</h3>
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{selectedConversation.title}</h4>
                      {selectedConversation.isPublic ? (
                        <Badge variant="outline" className="gap-1">
                          <Globe className="h-3 w-3" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Private
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedConversation.description || "No description provided"}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Created by {selectedConversation.createdBy.name}</span>
                      <span>•</span>
                      <span>{formatDate(selectedConversation.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedConversation.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Collaborators</h3>
                  <div className="space-y-2">
                    {selectedConversation.collaborators.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="h-6 w-6">
                              {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                              ) : (
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                            />
                          </div>
                          <span className="text-sm">{user.name}</span>
                        </div>
                        {getRoleBadge(user.role)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsInviteDialogOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Button>
                  <Button className="flex-1 gap-2" onClick={() => setIsShareDialogOpen(true)}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                <h4 className="font-medium">No conversation selected</h4>
                <p className="text-sm text-muted-foreground mt-1">Select a conversation to view details</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Workspace Settings
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Collaborators</DialogTitle>
            <DialogDescription>Add people to your workspace to collaborate on conversations.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Permission Level
              </label>
              <select
                id="role"
                className="w-full p-2 border rounded-md"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="viewer">Viewer (can only view)</option>
                <option value="commenter">Commenter (can view and comment)</option>
                <option value="editor">Editor (can view, comment, and edit)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                You can change permission levels later in workspace settings.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Workspace</DialogTitle>
            <DialogDescription>
              Anyone with the link can access this workspace based on the permission you set.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex items-center gap-2">
                <Input value={shareLink} readOnly />
                <Button variant="outline" size="icon" onClick={copyShareLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Permission Level</label>
              <select
                className="w-full p-2 border rounded-md"
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value)}
              >
                <option value="view">Can view</option>
                <option value="comment">Can comment</option>
                <option value="edit">Can edit</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="allow-reshare" className="rounded border-gray-300" />
              <label htmlFor="allow-reshare" className="text-sm">
                Allow recipients to share
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

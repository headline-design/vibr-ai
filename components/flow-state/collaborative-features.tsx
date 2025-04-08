"use client"

import { useState } from "react"
import {
  Users,
  Share2,
  Link,
  Copy,
  Mail,
  MessageSquare,
  Lock,
  Globe,
  UserPlus,
  Check,
  X,
  Eye,
  Edit2,
  Clock,
  AlertTriangle,
  Shield,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Collaborator {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer" | "commenter"
  avatarUrl?: string
  status?: "online" | "offline" | "away"
  lastActive?: string
}

interface CollaborativeFeaturesProps {
  conversationId: string
  isShared: boolean
  shareUrl?: string
  collaborators: Collaborator[]
  currentUserId: string
  onShareSettingsChange: (settings: ShareSettings) => void
  onCollaboratorAdd: (email: string, role: Collaborator["role"]) => void
  onCollaboratorRemove: (id: string) => void
  onCollaboratorRoleChange: (id: string, role: Collaborator["role"]) => void
  className?: string
}

interface ShareSettings {
  isPublic: boolean
  allowComments: boolean
  allowCopy: boolean
  requireAuthentication: boolean
  expiresAt?: string
}

export function CollaborativeFeatures({
  conversationId,
  isShared,
  shareUrl,
  collaborators,
  currentUserId,
  onShareSettingsChange,
  onCollaboratorAdd,
  onCollaboratorRemove,
  onCollaboratorRoleChange,
  className,
}: CollaborativeFeaturesProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("link")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Collaborator["role"]>("viewer")
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    isPublic: false,
    allowComments: true,
    allowCopy: true,
    requireAuthentication: true,
  })
  const [linkCopied, setLinkCopied] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  // Get current user
  const currentUser = collaborators.find((c) => c.id === currentUserId) || collaborators[0]

  // Check if current user is owner
  const isOwner = currentUser.role === "owner"

  // Handle share settings change
  const handleShareSettingsChange = (newSettings: Partial<ShareSettings>) => {
    const updatedSettings = { ...shareSettings, ...newSettings }
    setShareSettings(updatedSettings)
    onShareSettingsChange(updatedSettings)
  }

  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  // Send invite
  const sendInvite = () => {
    if (inviteEmail) {
      onCollaboratorAdd(inviteEmail, inviteRole)
      setInviteEmail("")
      setIsInviteDialogOpen(false)
    }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  // Get role badge color
  const getRoleBadgeColor = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "commenter":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Get role icon
  const getRoleIcon = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return <Shield className="h-3.5 w-3.5" />
      case "editor":
        return <Edit2 className="h-3.5 w-3.5" />
      case "commenter":
        return <MessageSquare className="h-3.5 w-3.5" />
      case "viewer":
        return <Eye className="h-3.5 w-3.5" />
      default:
        return <User className="h-3.5 w-3.5" />
    }
  }

  // Get status indicator color
  const getStatusColor = (status?: Collaborator["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-amber-500"
      case "offline":
      default:
        return "bg-gray-300 dark:bg-gray-600"
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Collaboration
        </h2>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1.5" />
            Invite
          </Button>

          <Button variant="default" size="sm" className="h-8" onClick={() => setIsShareDialogOpen(true)}>
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Collaborators list */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Collaborators ({collaborators.length})</div>

        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="border rounded-md p-3 flex items-center justify-between bg-white dark:bg-gray-800"
            >
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} />
                    <AvatarFallback>
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800",
                      getStatusColor(collaborator.status),
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center">
                    <div className="font-medium text-sm">
                      {collaborator.name}
                      {collaborator.id === currentUserId && <span className="text-xs text-gray-500 ml-1">(You)</span>}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-2 text-xs flex items-center gap-1 px-1.5 py-0.5",
                        getRoleBadgeColor(collaborator.role),
                      )}
                    >
                      {getRoleIcon(collaborator.role)}
                      <span>{collaborator.role}</span>
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {collaborator.email}
                    {collaborator.lastActive && (
                      <span className="ml-2">• Active {formatDate(collaborator.lastActive)}</span>
                    )}
                  </div>
                </div>
              </div>

              {isOwner && collaborator.id !== currentUserId && (
                <div className="flex items-center space-x-1">
                  <Select
                    value={collaborator.role}
                    onValueChange={(value) => onCollaboratorRoleChange(collaborator.id, value as Collaborator["role"])}
                  >
                    <SelectTrigger className="h-7 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="commenter">Commenter</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => onCollaboratorRemove(collaborator.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Share dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-blue-500" />
              Share Conversation
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="link" className="flex items-center">
                <Link className="h-4 w-4 mr-1.5" />
                Share Link
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center">
                <Lock className="h-4 w-4 mr-1.5" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={shareUrl || `https://chat.example.com/share/${conversationId}`}
                    readOnly
                    className="pl-9 pr-20 h-9"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7"
                    onClick={copyLinkToClipboard}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        <span className="text-green-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-link" className="flex items-center cursor-pointer">
                    <Globe className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>Public link</span>
                  </Label>
                  <Switch
                    id="public-link"
                    checked={shareSettings.isPublic}
                    onCheckedChange={(checked) => handleShareSettingsChange({ isPublic: checked })}
                  />
                </div>

                {shareSettings.isPublic && (
                  <div className="pl-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-auth" className="flex items-center cursor-pointer text-sm">
                        <Lock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>Require authentication</span>
                      </Label>
                      <Switch
                        id="require-auth"
                        checked={shareSettings.requireAuthentication}
                        onCheckedChange={(checked) => handleShareSettingsChange({ requireAuthentication: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-comments" className="flex items-center cursor-pointer text-sm">
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>Allow comments</span>
                      </Label>
                      <Switch
                        id="allow-comments"
                        checked={shareSettings.allowComments}
                        onCheckedChange={(checked) => handleShareSettingsChange({ allowComments: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-copy" className="flex items-center cursor-pointer text-sm">
                        <Copy className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>Allow copying content</span>
                      </Label>
                      <Switch
                        id="allow-copy"
                        checked={shareSettings.allowCopy}
                        onCheckedChange={(checked) => handleShareSettingsChange({ allowCopy: checked })}
                      />
                    </div>

                    {showAdvancedSettings && (
                      <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="expiry-date" className="flex items-center text-sm">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>Link expiry</span>
                          </Label>
                          <Select
                            value={shareSettings.expiresAt || "never"}
                            onValueChange={(value) =>
                              handleShareSettingsChange({
                                expiresAt: value === "never" ? undefined : value,
                              })
                            }
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue placeholder="Never" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never</SelectItem>
                              <SelectItem value={new Date(Date.now() + 86400000).toISOString()}>1 day</SelectItem>
                              <SelectItem value={new Date(Date.now() + 604800000).toISOString()}>7 days</SelectItem>
                              <SelectItem value={new Date(Date.now() + 2592000000).toISOString()}>30 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    >
                      {showAdvancedSettings ? "Hide advanced settings" : "Show advanced settings"}
                    </Button>
                  </div>
                )}
              </div>

              {!shareSettings.isPublic && (
                <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-xs">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    This conversation is only accessible to collaborators. Enable public link to share with others.
                  </span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="text-sm font-medium">Access Levels</div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start p-3 border rounded-md">
                    <Shield className="h-5 w-5 mr-3 text-purple-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Owner</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Full access. Can manage collaborators, change settings, and delete the conversation.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 border rounded-md">
                    <Edit2 className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Editor</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Can view, edit, and continue the conversation with the AI.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 border rounded-md">
                    <MessageSquare className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Commenter</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Can view the conversation and add comments, but cannot edit or continue it.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 border rounded-md">
                    <Eye className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Viewer</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Can only view the conversation. Cannot edit, comment, or continue it.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsShareDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
              Invite Collaborators
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as Collaborator["role"])}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="commenter">Commenter</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              An email invitation will be sent to this address with a link to join the conversation.
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendInvite} disabled={!inviteEmail.trim()}>
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

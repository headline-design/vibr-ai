"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Shield,
  Lock,
  Eye,
  Key,
  Trash2,
  Download,
  Clock,
  AlertTriangle,
  Info,
  FileText,
  Settings,
  Users,
  LogOut,
  Fingerprint,
  Smartphone,
  Mail,
  Bell,
  Globe,
  Database,
  Copy,
} from "lucide-react"

interface SecurityEvent {
  id: string
  type: "login" | "logout" | "settings_change" | "password_change" | "api_access" | "data_export"
  timestamp: string
  ipAddress: string
  location: string
  device: string
  success: boolean
  details?: string
}

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
  scopes: string[]
}

interface ConnectedApp {
  id: string
  name: string
  icon: string
  connectedAt: string
  lastUsed?: string
  permissions: string[]
}

export function SecurityPrivacySettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false)
  const [isCreateApiKeyDialogOpen, setIsCreateApiKeyDialogOpen] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [newApiKeyScopes, setNewApiKeyScopes] = useState<string[]>(["read"])
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isSetup2FADialogOpen, setIsSetup2FADialogOpen] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  // Sample data
  const securityEvents: SecurityEvent[] = [
    {
      id: "event-1",
      type: "login",
      timestamp: "2023-12-15T14:30:00Z",
      ipAddress: "192.168.1.1",
      location: "San Francisco, CA, USA",
      device: "Chrome on macOS",
      success: true,
    },
    {
      id: "event-2",
      type: "settings_change",
      timestamp: "2023-12-14T10:15:00Z",
      ipAddress: "192.168.1.1",
      location: "San Francisco, CA, USA",
      device: "Chrome on macOS",
      success: true,
      details: "Changed notification settings",
    },
    {
      id: "event-3",
      type: "api_access",
      timestamp: "2023-12-13T16:45:00Z",
      ipAddress: "192.168.1.1",
      location: "San Francisco, CA, USA",
      device: "API Client",
      success: true,
      details: "Accessed conversation data",
    },
    {
      id: "event-4",
      type: "login",
      timestamp: "2023-12-12T08:20:00Z",
      ipAddress: "203.0.113.1",
      location: "Unknown Location",
      device: "Firefox on Windows",
      success: false,
      details: "Invalid password",
    },
  ]

  const apiKeys: ApiKey[] = [
    {
      id: "key-1",
      name: "Development API Key",
      key: "••••••••••••••••",
      createdAt: "2023-11-10T09:30:00Z",
      lastUsed: "2023-12-15T14:30:00Z",
      scopes: ["read", "write"],
    },
    {
      id: "key-2",
      name: "Production API Key",
      key: "••••••••••••••••",
      createdAt: "2023-10-05T11:15:00Z",
      lastUsed: "2023-12-14T10:15:00Z",
      scopes: ["read"],
    },
  ]

  const connectedApps: ConnectedApp[] = [
    {
      id: "app-1",
      name: "GitHub",
      icon: "/placeholder.svg?height=40&width=40",
      connectedAt: "2023-11-15T09:30:00Z",
      lastUsed: "2023-12-15T14:30:00Z",
      permissions: ["Read profile", "Access repositories"],
    },
    {
      id: "app-2",
      name: "Slack",
      icon: "/placeholder.svg?height=40&width=40",
      connectedAt: "2023-10-20T11:15:00Z",
      lastUsed: "2023-12-14T10:15:00Z",
      permissions: ["Send messages", "Access channels"],
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get event icon
  const getEventIcon = (type: SecurityEvent["type"], success: boolean) => {
    if (!success) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }

    switch (type) {
      case "login":
        return <LogOut className="h-4 w-4 text-green-500" />
      case "logout":
        return <LogOut className="h-4 w-4 text-blue-500" />
      case "settings_change":
        return <Settings className="h-4 w-4 text-purple-500" />
      case "password_change":
        return <Key className="h-4 w-4 text-amber-500" />
      case "api_access":
        return <Key className="h-4 w-4 text-cyan-500" />
      case "data_export":
        return <Download className="h-4 w-4 text-indigo-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  // Get event description
  const getEventDescription = (event: SecurityEvent) => {
    switch (event.type) {
      case "login":
        return event.success ? "Successful login" : "Failed login attempt"
      case "logout":
        return "Logged out"
      case "settings_change":
        return `Changed settings: ${event.details || "Unknown"}`
      case "password_change":
        return "Changed password"
      case "api_access":
        return `API access: ${event.details || "Unknown"}`
      case "data_export":
        return "Exported data"
      default:
        return "Unknown event"
    }
  }

  // Handle create API key
  const handleCreateApiKey = () => {
    // In a real app, this would call an API to create a new key
    const generatedKey = `vib_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
    setGeneratedApiKey(generatedKey)
  }

  // Handle setup 2FA
  const handleSetup2FA = () => {
    // In a real app, this would verify the code and enable 2FA
    setIs2FAEnabled(true)
    setIsSetup2FADialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Security & Privacy</h2>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-4 w-4" />
          Security Status: Good
        </Badge>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Password</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {is2FAEnabled
                        ? "Enabled - Using Authenticator App"
                        : "Not enabled - Add an extra layer of security"}
                    </p>
                  </div>
                  {is2FAEnabled ? (
                    <Button variant="outline" onClick={() => setIs2FAEnabled(false)}>
                      Disable
                    </Button>
                  ) : (
                    <Button onClick={() => setIsSetup2FADialogOpen(true)}>Enable</Button>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Trusted Devices</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">2 active devices</p>
                  </div>
                  <Button variant="outline">Manage Devices</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Recovery Email</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">r***@example.com</p>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your active sessions and sign out from other devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between p-3 border rounded-md bg-accent/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Current Session</h4>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Chrome on macOS • San Francisco, CA, USA</p>
                    <p className="text-xs text-muted-foreground">Started 2 hours ago • IP: 192.168.1.1</p>
                  </div>
                </div>

                <div className="flex items-start justify-between p-3 border rounded-md">
                  <div className="space-y-1">
                    <h4 className="font-medium">Mobile App</h4>
                    <p className="text-sm text-muted-foreground">Vibr App on iOS • San Francisco, CA, USA</p>
                    <p className="text-xs text-muted-foreground">Last active 1 day ago • IP: 192.168.1.2</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out All Other Devices
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 border border-red-200 rounded-md bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
                <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm" onClick={() => setIsDeleteAccountDialogOpen(true)}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control how your information is used and who can see your activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Profile Visibility</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Control who can see your profile and activity</p>
                  </div>
                  <select className="p-2 border rounded-md">
                    <option value="public">Public</option>
                    <option value="contacts">Contacts Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Conversation Sharing</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Control who can see and share your conversations</p>
                  </div>
                  <select className="p-2 border rounded-md">
                    <option value="anyone">Anyone with link</option>
                    <option value="contacts">Contacts Only</option>
                    <option value="none">No one</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Email Notifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Receive email notifications about activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Public Contributions</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow your conversations to be used for improving AI models
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your personal data and export options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Data Storage</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Control how long your data is stored</p>
                  </div>
                  <select className="p-2 border rounded-md">
                    <option value="indefinite">Indefinitely</option>
                    <option value="1year">1 Year</option>
                    <option value="6months">6 Months</option>
                    <option value="3months">3 Months</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-medium">Export Data</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <h3 className="text-base font-medium">Delete Data</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Delete all your conversation history</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Our commitment to protecting your privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md bg-muted/50">
                <p className="text-sm">
                  Our privacy policy was last updated on December 1, 2023. It explains how we collect, use, and protect
                  your personal information.
                </p>
                <div className="flex justify-end mt-2">
                  <Button variant="link" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    View Privacy Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for accessing the Vibr API</CardDescription>
                </div>
                <Button onClick={() => setIsCreateApiKeyDialogOpen(true)}>Create API Key</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.length > 0 ? (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <Badge variant="outline">{apiKey.scopes.join(", ")}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="bg-muted p-1 rounded text-sm">{apiKey.key}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created: {formatDate(apiKey.createdAt)}</span>
                        {apiKey.lastUsed && <span>Last used: {formatDate(apiKey.lastUsed)}</span>}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="destructive" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Key className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium">No API Keys</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't created any API keys yet</p>
                  <Button onClick={() => setIsCreateApiKeyDialogOpen(true)}>Create API Key</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Applications</CardTitle>
              <CardDescription>Manage third-party applications connected to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedApps.length > 0 ? (
                <div className="space-y-4">
                  {connectedApps.map((app) => (
                    <div key={app.id} className="p-3 border rounded-md">
                      <div className="flex items-start gap-3">
                        <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-10 h-10 rounded" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{app.name}</h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            Connected on {formatDate(app.connectedAt)}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {app.permissions.map((permission, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                          {app.lastUsed && (
                            <p className="text-xs text-muted-foreground">Last used: {formatDate(app.lastUsed)}</p>
                          )}
                        </div>
                        <Button variant="destructive" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium">No Connected Apps</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    You haven't connected any third-party applications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Activity</CardTitle>
                  <CardDescription>Recent security events for your account</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 border rounded-md ${!event.success ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getEventIcon(event.type, event.success)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getEventDescription(event)}</h4>
                          {!event.success && (
                            <Badge variant="destructive" className="text-xs">
                              Failed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{event.device}</span>
                          <span>{event.ipAddress}</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium">
                Type "delete my account" to confirm
              </Label>
              <Input id="confirm" placeholder="delete my account" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete Account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateApiKeyDialogOpen} onOpenChange={setIsCreateApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>Create a new API key to access the Vibr API</DialogDescription>
          </DialogHeader>

          {generatedApiKey ? (
            <div className="space-y-4 py-2">
              <div className="p-3 border border-amber-200 rounded-md bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50">
                <h4 className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Save your API key
                </h4>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1 mb-3">
                  This is the only time you'll be able to view this API key. Save it somewhere secure.
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-white dark:bg-black p-2 rounded text-sm w-full overflow-x-auto">
                    {generatedApiKey}
                  </code>
                  <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(generatedApiKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="key-name" className="text-sm font-medium">
                  Key Name
                </Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Development API Key"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="scope-read"
                      checked={newApiKeyScopes.includes("read")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewApiKeyScopes([...newApiKeyScopes, "read"])
                        } else {
                          setNewApiKeyScopes(newApiKeyScopes.filter((scope) => scope !== "read"))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="scope-read" className="text-sm">
                      Read (View conversations and data)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="scope-write"
                      checked={newApiKeyScopes.includes("write")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewApiKeyScopes([...newApiKeyScopes, "write"])
                        } else {
                          setNewApiKeyScopes(newApiKeyScopes.filter((scope) => scope !== "write"))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="scope-write" className="text-sm">
                      Write (Create and modify conversations)
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {generatedApiKey ? (
              <Button
                onClick={() => {
                  setGeneratedApiKey(null)
                  setIsCreateApiKeyDialogOpen(false)
                  setNewApiKeyName("")
                }}
              >
                Done
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsCreateApiKeyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateApiKey} disabled={!newApiKeyName || newApiKeyScopes.length === 0}>
                  Create
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Setup 2FA Dialog */}
      <Dialog open={isSetup2FADialogOpen} onOpenChange={setIsSetup2FADialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>Add an extra layer of security to your account</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex justify-center mb-4">
              <div className="p-2 border rounded-md">
                <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="w-40 h-40" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-code" className="text-sm font-medium">
                Backup Code
              </Label>
              <div className="flex items-center gap-2">
                <code className="bg-muted p-2 rounded text-sm w-full text-center">ABCD-EFGH-IJKL-MNOP</code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText("ABCD-EFGH-IJKL-MNOP")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Save this backup code in a secure place. You'll need it if you lose access to your authenticator app.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code" className="text-sm font-medium">
                Verification Code
              </Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetup2FADialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetup2FA} disabled={verificationCode.length !== 6}>
              Verify and Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

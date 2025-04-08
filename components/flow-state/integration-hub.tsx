"use client"

import type React from "react"

import { useState } from "react"
import {
  Puzzle,
  Link,
  Check,
  X,
  ExternalLink,
  Plus,
  Search,
  Settings,
  AlertTriangle,
  Lock,
  Zap,
  Database,
  FileText,
  Calendar,
  Mail,
  MessageSquare,
  Code,
  Image,
  Layers,
  Clipboard,
  BarChart,
  Briefcase,
  Headphones,
  Video,
  ShoppingCart,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface IntegrationHubProps {
  onIntegrationConnect: (integration: Integration) => void
  onIntegrationDisconnect: (integrationId: string) => void
  className?: string
}

interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  icon: React.ReactNode
  status: "connected" | "disconnected" | "pending"
  isPopular?: boolean
  isNew?: boolean
  isPremium?: boolean
  connectedAt?: string
  connectionDetails?: {
    accountName?: string
    accountEmail?: string
    plan?: string
    apiUsage?: number
    apiLimit?: number
  }
}

type IntegrationCategory =
  | "productivity"
  | "communication"
  | "development"
  | "data"
  | "design"
  | "marketing"
  | "sales"
  | "finance"
  | "hr"
  | "other"

export function IntegrationHub({ onIntegrationConnect, onIntegrationDisconnect, className }: IntegrationHubProps) {
  // State
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)

  // Sample integrations data
  const integrations: Integration[] = [
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Access and manage files stored in Google Drive",
      category: "productivity",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      status: "connected",
      isPopular: true,
      connectedAt: "2023-05-15T10:30:00",
      connectionDetails: {
        accountName: "John Doe",
        accountEmail: "john.doe@example.com",
        plan: "Business",
        apiUsage: 450,
        apiLimit: 1000,
      },
    },
    {
      id: "slack",
      name: "Slack",
      description: "Send messages and notifications to Slack channels",
      category: "communication",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      status: "connected",
      isPopular: true,
      connectedAt: "2023-06-02T14:15:00",
      connectionDetails: {
        accountName: "Acme Inc",
        plan: "Pro",
        apiUsage: 230,
        apiLimit: 1000,
      },
    },
    {
      id: "github",
      name: "GitHub",
      description: "Integrate with GitHub repositories and issues",
      category: "development",
      icon: <Code className="h-5 w-5 text-gray-700" />,
      status: "disconnected",
      isPopular: true,
    },
    {
      id: "notion",
      name: "Notion",
      description: "Connect to Notion workspaces and databases",
      category: "productivity",
      icon: <Clipboard className="h-5 w-5 text-gray-800" />,
      status: "disconnected",
      isPopular: true,
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Connect to your Supabase database",
      category: "data",
      icon: <Database className="h-5 w-5 text-green-600" />,
      status: "connected",
      connectedAt: "2023-04-10T09:20:00",
      connectionDetails: {
        plan: "Pro",
        apiUsage: 780,
        apiLimit: 1000,
      },
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Manage events and schedules in Google Calendar",
      category: "productivity",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      status: "disconnected",
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Send and analyze emails through Gmail",
      category: "communication",
      icon: <Mail className="h-5 w-5 text-red-500" />,
      status: "disconnected",
    },
    {
      id: "figma",
      name: "Figma",
      description: "Access design files and assets from Figma",
      category: "design",
      icon: <Image className="h-5 w-5 text-purple-500" />,
      status: "disconnected",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      category: "finance",
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      status: "disconnected",
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Manage contacts and marketing campaigns",
      category: "marketing",
      icon: <BarChart className="h-5 w-5 text-orange-500" />,
      status: "disconnected",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Access customer data and sales information",
      category: "sales",
      icon: <Briefcase className="h-5 w-5 text-blue-700" />,
      status: "disconnected",
      isPremium: true,
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Schedule and manage video meetings",
      category: "communication",
      icon: <Video className="h-5 w-5 text-blue-500" />,
      status: "disconnected",
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Manage products and orders from your store",
      category: "sales",
      icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
      status: "disconnected",
    },
    {
      id: "asana",
      name: "Asana",
      description: "Track tasks and project progress",
      category: "productivity",
      icon: <Layers className="h-5 w-5 text-red-400" />,
      status: "disconnected",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Access advanced AI models and capabilities",
      category: "development",
      icon: <Zap className="h-5 w-5 text-green-500" />,
      status: "connected",
      isNew: true,
      connectedAt: "2023-07-01T16:45:00",
      connectionDetails: {
        plan: "Plus",
        apiUsage: 350,
        apiLimit: 500,
      },
    },
    {
      id: "spotify",
      name: "Spotify",
      description: "Access music data and playlists",
      category: "other",
      icon: <Headphones className="h-5 w-5 text-green-500" />,
      status: "disconnected",
      isNew: true,
    },
  ]

  // Filter integrations based on active tab and search query
  const filteredIntegrations = integrations
    .filter((integration) => {
      // Filter by tab
      if (activeTab === "all") {
        return true
      } else if (activeTab === "connected") {
        return integration.status === "connected"
      } else if (activeTab === "popular") {
        return integration.isPopular
      } else if (activeTab === "new") {
        return integration.isNew
      } else {
        return integration.category === activeTab
      }
    })
    .filter((integration) => {
      // Filter by search query
      if (!searchQuery) return true
      return (
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  // Group integrations by category
  const groupedIntegrations = filteredIntegrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = []
      }
      acc[integration.category].push(integration)
      return acc
    },
    {} as Record<IntegrationCategory, Integration[]>,
  )

  // Get category label
  const getCategoryLabel = (category: IntegrationCategory) => {
    switch (category) {
      case "productivity":
        return "Productivity"
      case "communication":
        return "Communication"
      case "development":
        return "Development"
      case "data":
        return "Data & Analytics"
      case "design":
        return "Design"
      case "marketing":
        return "Marketing"
      case "sales":
        return "Sales"
      case "finance":
        return "Finance"
      case "hr":
        return "HR"
      case "other":
        return "Other"
      default:
        return category
    }
  }

  // Get category icon
  const getCategoryIcon = (category: IntegrationCategory) => {
    switch (category) {
      case "productivity":
        return <Zap className="h-4 w-4" />
      case "communication":
        return <MessageSquare className="h-4 w-4" />
      case "development":
        return <Code className="h-4 w-4" />
      case "data":
        return <Database className="h-4 w-4" />
      case "design":
        return <Image className="h-4 w-4" />
      case "marketing":
        return <BarChart className="h-4 w-4" />
      case "sales":
        return <ShoppingCart className="h-4 w-4" />
      case "finance":
        return <CreditCard className="h-4 w-4" />
      case "hr":
        return <Briefcase className="h-4 w-4" />
      case "other":
        return <Puzzle className="h-4 w-4" />
      default:
        return <Puzzle className="h-4 w-4" />
    }
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

  // Connect integration
  const connectIntegration = () => {
    if (selectedIntegration) {
      const updatedIntegration = {
        ...selectedIntegration,
        status: "connected" as const,
        connectedAt: new Date().toISOString(),
        connectionDetails: {
          accountName: "Demo Account",
          accountEmail: "demo@example.com",
          plan: "Free",
          apiUsage: 0,
          apiLimit: 1000,
        },
      }

      onIntegrationConnect(updatedIntegration)
      setIsConnectDialogOpen(false)
    }
  }

  // Disconnect integration
  const disconnectIntegration = () => {
    if (selectedIntegration) {
      onIntegrationDisconnect(selectedIntegration.id)
      setIsDisconnectDialogOpen(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <Puzzle className="h-5 w-5 mr-2 text-blue-500" />
          Integration Hub
        </h2>

        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search integrations..."
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
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all" className="flex items-center">
            <Puzzle className="h-4 w-4 mr-1.5" />
            All
          </TabsTrigger>
          <TabsTrigger value="connected" className="flex items-center">
            <Check className="h-4 w-4 mr-1.5" />
            Connected
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center">
            <Zap className="h-4 w-4 mr-1.5" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center">
            <Plus className="h-4 w-4 mr-1.5" />
            New
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center">
            <Zap className="h-4 w-4 mr-1.5" />
            Productivity
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center">
            <Code className="h-4 w-4 mr-1.5" />
            Development
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <Database className="h-4 w-4 mr-1.5" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredIntegrations.length === 0 ? (
            <div className="text-center py-12">
              <Puzzle className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No integrations found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : "No integrations available in this category"}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {activeTab === "all" || activeTab === "connected" || activeTab === "popular" || activeTab === "new" ? (
                // Group by category
                Object.entries(groupedIntegrations).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center">
                      {getCategoryIcon(category as IntegrationCategory)}
                      <h3 className="text-sm font-medium ml-2">{getCategoryLabel(category as IntegrationCategory)}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((integration) => (
                        <IntegrationCard
                          key={integration.id}
                          integration={integration}
                          onConnect={() => {
                            setSelectedIntegration(integration)
                            setIsConnectDialogOpen(true)
                          }}
                          onDisconnect={() => {
                            setSelectedIntegration(integration)
                            setIsDisconnectDialogOpen(true)
                          }}
                          onSettings={() => {
                            setSelectedIntegration(integration)
                            setIsSettingsDialogOpen(true)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Single category view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredIntegrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={() => {
                        setSelectedIntegration(integration)
                        setIsConnectDialogOpen(true)
                      }}
                      onDisconnect={() => {
                        setSelectedIntegration(integration)
                        setIsDisconnectDialogOpen(true)
                      }}
                      onSettings={() => {
                        setSelectedIntegration(integration)
                        setIsSettingsDialogOpen(true)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Connect dialog */}
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="mr-2">{selectedIntegration?.icon}</div>
              Connect to {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>{selectedIntegration?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h4 className="text-sm font-medium mb-2">Required Permissions</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Read access to your data
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Write access to create new content
                </li>
                {selectedIntegration?.id === "google-drive" && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Access to file metadata
                  </li>
                )}
              </ul>
            </div>

            <div className="text-xs text-gray-500">
              <p className="flex items-center">
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Your credentials are securely stored and can be revoked at any time.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={connectIntegration}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect dialog */}
      <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Disconnect {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>Are you sure you want to disconnect this integration?</DialogDescription>
          </DialogHeader>

          <div className="my-2">
            <p className="text-sm">
              Disconnecting will remove access to {selectedIntegration?.name} and any associated data. You can reconnect
              at any time.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisconnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={disconnectIntegration}>
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="mr-2">{selectedIntegration?.icon}</div>
              {selectedIntegration?.name} Settings
            </DialogTitle>
            <DialogDescription>Configure your integration settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync" className="cursor-pointer">
                  Auto-sync data
                </Label>
                <Switch id="auto-sync" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="cursor-pointer">
                  Receive notifications
                </Label>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="read-only" className="cursor-pointer">
                  Read-only mode
                </Label>
                <Switch id="read-only" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Connection Details</Label>
              <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Connected Account</span>
                  <span>{selectedIntegration?.connectionDetails?.accountName || "Demo Account"}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Email</span>
                  <span>{selectedIntegration?.connectionDetails?.accountEmail || "demo@example.com"}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Plan</span>
                  <Badge variant="outline">{selectedIntegration?.connectionDetails?.plan || "Free"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">API Usage</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            ((selectedIntegration?.connectionDetails?.apiUsage || 0) /
                              (selectedIntegration?.connectionDetails?.apiLimit || 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs">
                      {selectedIntegration?.connectionDetails?.apiUsage || 0} /
                      {selectedIntegration?.connectionDetails?.apiLimit || 1000}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Webhooks</Label>
              <Input placeholder="https://example.com/webhook" />
              <p className="text-xs text-gray-500">Receive real-time updates when changes occur</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSettingsDialogOpen(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Integration card component
function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onSettings,
}: {
  integration: Integration
  onConnect: () => void
  onDisconnect: () => void
  onSettings: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">{integration.icon}</div>
            <div>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{integration.description}</CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {integration.isNew && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                New
              </Badge>
            )}
            {integration.isPremium && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {integration.status === "connected" && (
          <div className="text-xs text-gray-500 flex items-center mb-2">
            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" />
            <span>
              Connected {integration.connectedAt && `on ${new Date(integration.connectedAt).toLocaleDateString()}`}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        {integration.status === "connected" ? (
          <>
            <Button variant="outline" size="sm" className="text-red-500" onClick={onDisconnect}>
              Disconnect
            </Button>
            <Button variant="outline" size="sm" onClick={onSettings}>
              <Settings className="h-4 w-4 mr-1.5" />
              Settings
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://example.com/learn/${integration.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Learn More
              </a>
            </Button>
            <Button variant="default" size="sm" onClick={onConnect}>
              <Link className="h-4 w-4 mr-1.5" />
              Connect
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

"use client"

import { useAuthContext } from "@/components/auth/auth-provider"
import { getProjects } from "@/lib/project-service"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectList } from "@/components/projects/project-list"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { AccountInfo } from "./account-info"
import { AccountSettings } from "./account-settings"
import { useToast } from "@/components/ui/use-toast"

export function AccountDashboard() {
  const { user, signOut, loading } = useAuthContext()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      if (user && !hasError) {
        try {
          setIsLoadingProjects(true)
          const data = await getProjects()
          if (isMounted) {
            setProjects(data)
            setHasError(false)
          }
        } catch (error: any) {
          console.error("Error loading projects:", error)

          if (isMounted) {
            setHasError(true)

            // Check for rate limiting
            if (error.message && error.message.includes("Too Many R")) {
              toast({
                title: "Rate limit exceeded",
                description: "Please wait a moment before trying again.",
                variant: "destructive",
              })

              // Don't retry automatically if rate limited
              return
            }

            // For other errors, show a generic message
            toast({
              title: "Error loading projects",
              description: "There was a problem loading your projects.",
              variant: "destructive",
            })
          }
        } finally {
          if (isMounted) {
            setIsLoadingProjects(false)
          }
        }
      }
    }

    // Only load projects if we have a user and haven't exceeded retry attempts
    if (user && retryCount < 3) {
      loadProjects()
    }

    return () => {
      isMounted = false
    }
  }, [user, retryCount, hasError, toast])

  const handleRefresh = async () => {
    setHasError(false)
    setRetryCount(0)
    setIsLoadingProjects(true)

    try {
      const data = await getProjects()
      setProjects(data)
      toast({
        title: "Projects refreshed",
        description: "Your projects have been successfully loaded.",
      })
    } catch (error: any) {
      console.error("Error refreshing projects:", error)
      setHasError(true)

      // Check for rate limiting
      if (error.message && error.message.includes("Too Many R")) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment before trying again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error refreshing projects",
          description: "There was a problem refreshing your projects.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setHasError(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // This will redirect in the useEffect
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoadingProjects}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProjects ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <AccountInfo user={user} />
        </TabsContent>
        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>
                Manage your projects and create new ones.{" "}
                {!hasError && `You currently have ${projects.length} projects.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : hasError ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <p className="text-muted-foreground">There was an error loading your projects.</p>
                  <Button onClick={handleRetry} disabled={retryCount >= 3}>
                    Try Again
                  </Button>
                  {retryCount >= 3 && (
                    <p className="text-sm text-muted-foreground">Too many retry attempts. Please try again later.</p>
                  )}
                </div>
              ) : (
                <ProjectList initialProjects={projects} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <AccountSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const { signIn, signUp, user } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [errorMessage, setErrorMessage] = useState("")
  const redirectAttempted = useRef(false)

  // If user is already logged in, redirect to home - but only once
  useEffect(() => {
    if (user && !redirectAttempted.current) {
      console.log("LoginForm: User already logged in, redirecting to home")
      redirectAttempted.current = true

      // Use setTimeout to break the render cycle
      setTimeout(() => {
        router.push("/")
      }, 0)
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    console.log("Login attempt started with:", { email, passwordLength: password.length })

    try {
      if (activeTab === "login") {
        console.log("Attempting to sign in...")
        await signIn(email, password)
        console.log("Sign in successful, redirecting...")

        // Set the redirect flag to prevent infinite loops
        redirectAttempted.current = true

        // Use setTimeout to break the render cycle
        setTimeout(() => {
          router.push("/")
        }, 0)

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
      } else {
        console.log("Attempting to sign up...")
        await signUp(email, password)
        console.log("Sign up successful")
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        })
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      // Extract more detailed error information
      const errorDetails = {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.details,
        hint: error.hint,
        stack: error.stack,
      }
      console.error("Detailed error information:", errorDetails)

      // Set a more specific error message
      setErrorMessage(error.message || "Authentication failed. Please check your credentials and try again.")

      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const setDemoCredentials = () => {
    setEmail("johndoe@example.com")
    setPassword("next25")
    console.log("Demo credentials set:", { email: "johndoe@example.com", password: "next25" })
  }

  // If we've already attempted to redirect, show a loading state
  if (user && redirectAttempted.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-sm text-blue-700">
                <strong>Demo User:</strong> johndoe@example.com / next25
                <Button variant="link" className="text-blue-600 p-0 h-auto ml-2" onClick={setDemoCredentials}>
                  Use Demo Credentials
                </Button>
              </AlertDescription>
            </Alert>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {activeTab === "login" ? "Sign In" : "Sign Up"}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              {activeTab === "login"
                ? "Having trouble? Make sure you're using the correct credentials."
                : "By signing up, you agree to our Terms of Service and Privacy Policy."}
            </div>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  )
}

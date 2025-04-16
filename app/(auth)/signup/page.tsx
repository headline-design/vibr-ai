"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Loader2, Github, Check, AlertCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { VibrIcon } from "@/components/vibr-icon"
import { signUp } from "@/utils/supabase/actions"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo validation
    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter your name" })
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address" })
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setMessage({ type: "error", text: "You must accept the terms and conditions" })
      setIsLoading(false)
      return
    }

    // Simulate successful signup
    await signUp(formData)
  }

  const handleGithubSignup = () => {
    setIsLoading(true)
    setMessage({ type: "success", text: "Redirecting to GitHub..." })

    // Simulate redirect delay
    setTimeout(() => {
      window.location.href = "https://github.com/login/oauth/authorize"
    }, 1000)
  }

  return (
    <>
      <Card className="flex w-[32rem] max-w-full flex-col items-center rounded-lg bg-background-100 p-3 shadow">
        {/* Add logo in circle at the top of the card */}
        <div className="flex flex-col items-center gap-6 py-14">
          <div className="flex size-[80px] items-center justify-center border-solid border-gray-alpha-400 bg-background p-4 rounded-full border-2 border-primary/10 ">
            <VibrIcon variant="bolt" className="h-[52px] w-[52px]" />
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-4xl font-semibold">Welcome to Vibr</p>
            <p className="text-muted-foreground text-base ">Sign up for an account</p>
          </div>

          <div className="flex w-80 flex-col gap-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <Link href="/legal/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {message && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                  className={
                    message.type === "error"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }
                >
                  {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <Button className="w-full rounded-md h-10" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>Sign Up</>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-md h-10"
              onClick={handleGithubSignup}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
          <div className="flex flex-row items-center justify-center self-stretch rounded-sm bg-gray-200 p-2">

            <div className="text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

        </div>
      </Card>
    </>
  )
}
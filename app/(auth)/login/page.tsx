"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Loader2, Github, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { VibrIcon } from "@/components/vibr-icon"
import { signIn } from "@/utils/supabase/actions"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (!email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address" })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      setIsLoading(false)
      return
    }

    await signIn(formData)
  }


  const handleGithubLogin = () => {
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
              <p className="text-muted-foreground text-base ">Sign in to your account</p>
            </div>

            <div className="flex w-80 flex-col gap-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12 font-medium"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 font-medium"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
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

                <Button size="xl" className="w-full rounded-md h-10" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>Sign In</>
                  )}
                </Button>
              </form>

              <div className="relative ">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-md "
                onClick={handleGithubLogin}
                disabled={isLoading}
                size="xl"
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center self-stretch rounded-sm bg-gray-200 p-2">

            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </>
    )
  }

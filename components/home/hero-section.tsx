"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Zap, Server, Brain, Lock, Sparkles, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AVATAR_GRADIENT_API } from "@/lib/constants"
import { VibrIcon } from "../vibr-icon"

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("high-proximity")

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/5 via-secondary/5 to-background pointer-events-none"></div>

      <div className="relative px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Vibr AI Coding Assistant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
              Vibr's LLM composability through intent-based responses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/chat">
                Try the AI Chat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="https://github.com/yourusername/vibr" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> View on GitHub
              </Link>
            </Button>
          </div>

          {/* Intent-Based Reasoning Showcase with Tabs */}
          <div className="relative w-full max-w-5xl mt-8">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-70"></div>
            <div className="relative bg-background border rounded-xl shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="p-1 bg-muted">
                <div className="flex items-center space-x-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-muted-foreground">Vibr AI Chat</div>
                </div>
              </div>

              {/* Browser Tabs */}
              <div className="flex border-b bg-muted/50 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("high-proximity")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium flex items-center gap-2 border-r transition-colors whitespace-nowrap ",
                    activeTab === "high-proximity"
                      ? "bg-background text-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  Project Creation
                </button>
                <button
                  onClick={() => setActiveTab("low-proximity")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium flex items-center gap-2 border-r transition-colors whitespace-nowrap ",
                    activeTab === "low-proximity"
                      ? "bg-background text-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Brain className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  Content Generation
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium flex items-center gap-2 border-r transition-colors whitespace-nowrap ",
                    activeTab === "security"
                      ? "bg-background text-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Lock className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Security Handling
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-6">
                {/* High-Proximity Intent Tab */}
                {activeTab === "high-proximity" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-end">

                      <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none text-start">
                        <p>Create a new project called "Next.js Dashboard"</p>
                      </div>
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium" style={
                        {
                          backgroundImage: `url(${AVATAR_GRADIENT_API}/usertest-001)`,
                        } as React.CSSProperties
                      } />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        <VibrIcon variant="circle-alt" className="h-8 w-8" color="flat" glow={false} />
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg rounded-tl-none text-start">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs font-medium text-yellow-500">
                            HIGH-PROXIMITY INTENT: Contextual Engine
                          </span>
                        </div>
                        <p>
                          I've created a new project called "Next.js Dashboard" for you. You can now start adding files
                          and collaborators.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Server className="h-3 w-3" />
                          <span>Processed by specialized contextual engine - faster, more accurate</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-primary/[2%] p-4 rounded-lg border border-dashed text-start">
                      <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <InfoIcon className="h-4 w-4 text-foreground" /> How High-Proximity Intent Works
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Vibr's advanced contextual engine processes high-proximity intents using specialized knowledge
                        graphs tailored to your projects and workflow. This proprietary system delivers personalized,
                        context-aware responses without the latency and cost of LLM processing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Low-Proximity Intent Tab */}
                {activeTab === "low-proximity" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-end">


                      <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none text-start">
                        <p>Write a tweet to promote my Next.js Dashboard project</p>
                      </div>
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium" style={
                        {
                          backgroundImage: `url(${AVATAR_GRADIENT_API}/usertest-001)`,
                        } as React.CSSProperties
                      } />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        <VibrIcon variant="circle-alt" className="h-8 w-8" color="flat" glow={false}/>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg rounded-tl-none text-start">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium text-blue-500">
                            LOW-PROXIMITY INTENT: LLM + Context Enhancement
                          </span>
                        </div>
                        <p>Here's a tweet to promote your project:</p>
                        <div className="mt-2 bg-muted/50 p-3 rounded-md text-sm">
                          "Just launched my new #NextJS Dashboard project! Built with @nextjs, @tailwindcss, and
                          @supabase. Real-time analytics, responsive design, and blazing-fast performance. Check it out:
                          [link] #webdev #javascript"
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>LLM response enhanced with your project context and details</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-primary/[2%] p-4 rounded-lg border border-dashed text-start">
                      <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <InfoIcon className="h-4 w-4 text-foreground" /> How Low-Proximity Intent Works
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        For creative tasks like content generation, Vibr uses the LLM but enhances the prompt with local
                        context from your projects. This creates more personalized, accurate responses that incorporate
                        your specific details without you having to provide them.
                      </p>
                    </div>
                  </div>
                )}

                {/* Security-Sensitive Intent Tab */}
                {activeTab === "security" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-end">

                      <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none text-start">
                        <p>Show me my API keys for the Next.js Dashboard project</p>
                      </div>
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium" style={
                        {
                          backgroundImage: `url(${AVATAR_GRADIENT_API}/usertest-001)`,
                        } as React.CSSProperties
                      } />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        <VibrIcon variant="circle-alt" className="h-8 w-8" color="flat" glow={false}/>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg rounded-tl-none text-start">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium text-green-500">
                            SECURITY-SENSITIVE INTENT: Hybrid Approach
                          </span>
                        </div>
                        <p>
                          For security reasons, I can't directly display your API keys. Instead, I've generated a secure
                          link where you can view and manage your API keys for the Next.js Dashboard project.
                        </p>
                        <div className="mt-2 bg-muted/50 p-3 rounded-md text-sm flex items-center justify-between">
                          <span className="text-primary underline">View API Keys (Secure Portal)</span>
                          <Button variant="outline" size="sm">
                            Open
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          <span>Security-first approach prevents sensitive data exposure</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-primary/[2%] p-4 rounded-lg border border-dashed text-start">
                      <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <InfoIcon className="h-4 w-4 text-foreground" /> How Security-Sensitive Intent Works
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Vibr identifies security-sensitive requests and handles them with a hybrid approach. It uses our
                        specialized contextual engine to ensure sensitive data never reaches the LLM, while maintaining
                        a natural conversational flow. This prevents data leaks and ensures compliance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

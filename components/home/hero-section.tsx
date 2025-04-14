"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Github,
  Zap,
  Server,
  Brain,
  Lock,
  Sparkles,
  InfoIcon,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AVATAR_GRADIENT_API } from "@/lib/constants"
import { VibrIcon } from "../../vibr-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ANIMATION_DURATION, ANIMATION_DELAY_INCREMENT, ANIMATION_EASING } from "@/lib/constants"

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("high-proximity")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-br from-primary/5 via-secondary/5 to-background pointer-events-none"></div>

      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow opacity-70 pointer-events-none"></div>

      <div className="container relative px-4 md:px-6 mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Hero content */}
          <motion.div
            className="space-y-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASING }}
          >
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background border-primary/20 shadow-sm">
                <span className="mr-1.5 text-primary">✦</span>
                Introducing Vibr AI 1.0
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
                Vibr AI Chat
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
              The AI chat that gets your vibe. Built for coders, by coders.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: ANIMATION_DURATION, delay: ANIMATION_DELAY_INCREMENT, ease: ANIMATION_EASING }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full h-12 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden group"
            >
              <Link href="/chat">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/10 to-primary/5 group-hover:opacity-80 transition-opacity"></span>
                <span className="relative flex items-center justify-center">
                  Try Vibr Chat <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-12 px-6 border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="https://github.com/yourusername/vibr" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" /> View on GitHub
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full h-12 px-6 hover:bg-primary/5 transition-all duration-300 hidden md:flex"
            >
              <Link href="/#solutions">
                Learn more <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: ANIMATION_DURATION, delay: ANIMATION_DELAY_INCREMENT * 2, ease: ANIMATION_EASING }}
          >
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50 border border-primary/10 shadow-sm">
              <span className="text-3xl font-bold text-primary">3x</span>
              <span className="text-sm text-muted-foreground">Less Latency</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50 border border-primary/10 shadow-sm">
              <span className="text-3xl font-bold text-primary">4+</span>
              <span className="text-sm text-muted-foreground">AI Models</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50 border border-primary/10 shadow-sm">
              <span className="text-3xl font-bold text-primary">100%</span>
              <span className="text-sm text-muted-foreground">Open Source</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50 border border-primary/10 shadow-sm">
              <span className="text-3xl font-bold text-primary">Q2</span>
              <span className="text-sm text-muted-foreground">2025 Launch</span>
            </div>
          </motion.div>

          {/* Intent-Based Reasoning Showcase with Tabs */}
          <motion.div
            className="relative w-full max-w-5xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: ANIMATION_DURATION, delay: ANIMATION_DELAY_INCREMENT * 3, ease: ANIMATION_EASING }}
          >
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-70"></div>
            <div className="relative bg-background border rounded-xl shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="p-1.5 bg-muted/80 border-b flex items-center justify-between">
                <div className="flex items-center space-x-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
                  vibr.ai/chat
                </div>
                <div className="w-8"></div>
              </div>

              {/* Browser Tabs */}
              <div className="flex border-b bg-muted/50 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("high-proximity")}
                  className={cn(
                    "px-4 py-3 text-sm font-medium flex items-center gap-2 border-r transition-colors whitespace-nowrap ",
                    activeTab === "high-proximity"
                      ? "bg-background text-foreground border-b-2 border-b-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  Project Creation
                </button>
                <button
                  onClick={() => setActiveTab("low-proximity")}
                  className={cn(
                    "px-4 py-3 text-sm font-medium flex items-center gap-2 border-r transition-colors whitespace-nowrap ",
                    activeTab === "low-proximity"
                      ? "bg-background text-foreground border-b-2 border-b-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Brain className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  Content Generation
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={cn(
                    "px-4 py-3 text-sm font-medium flex items-center gap-2 border-r transition-colors whitespace-nowrap ",
                    activeTab === "security"
                      ? "bg-background text-foreground border-b-2 border-b-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Lock className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Security Handling
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* High-Proximity Intent Tab */}
                  {activeTab === "high-proximity" && (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 justify-end">
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none text-start shadow-sm">
                          <p className="text-sm md:text-base">Create a new project called "Next.js Dashboard"</p>
                        </div>
                        <div
                          className="w-10 h-10 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium shadow-sm"
                          style={
                            {
                              backgroundImage: `url(${AVATAR_GRADIENT_API}/usertest-0014123123123qweqe)`,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shadow-sm">
                          <VibrIcon variant="circle-alt" className="h-8 w-8" color="purple" glow={true} />
                        </div>
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tl-none text-start shadow-sm max-w-[85%]">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-2 py-0.5"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              HIGH-PROXIMITY INTENT
                            </Badge>
                          </div>
                          <p className="text-sm md:text-base">
                            I've created a new project called "Next.js Dashboard" for you. You can now start adding
                            files and collaborators.
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg">
                            <Server className="h-3 w-3 text-primary" />
                            <span>Processed by specialized contextual engine - faster, more accurate</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <Button size="sm" variant="default" className="h-8 rounded-full">
                              Open Project <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 rounded-full">
                              Add Collaborators
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-primary/[3%] p-5 rounded-xl border border-dashed text-start">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <InfoIcon className="h-4 w-4 text-primary" /> How High-Proximity Intent Works
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Vibr's advanced contextual engine processes high-proximity intents using specialized knowledge
                          graphs tailored to your projects and workflow. This proprietary system delivers personalized,
                          context-aware responses without the latency and cost of LLM processing.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>10x faster response time</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Project-specific context</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Reduced token usage</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Higher accuracy rate</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Low-Proximity Intent Tab */}
                  {activeTab === "low-proximity" && (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 justify-end">
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none text-start shadow-sm">
                          <p className="text-sm md:text-base">Write a tweet to promote my Next.js Dashboard project</p>
                        </div>
                        <div
                          className="w-10 h-10 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium shadow-sm"
                          style={
                            {
                              backgroundImage: `url(${AVATAR_GRADIENT_API}/usertest-0014123123123qweqe)`,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shadow-sm">
                          <VibrIcon variant="circle-alt" className="h-8 w-8" color="blue" glow={true} />
                        </div>
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tl-none text-start shadow-sm max-w-[85%]">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-2 py-0.5"
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              LOW-PROXIMITY INTENT
                            </Badge>
                          </div>
                          <p className="text-sm md:text-base">Here's a tweet to promote your project:</p>
                          <div className="mt-3 bg-background/80 p-4 rounded-xl text-sm border border-primary/10 shadow-sm">
                            "Just launched my new #NextJS Dashboard project! Built with @nextjs, @tailwindcss, and
                            @supabase. Real-time analytics, responsive design, and blazing-fast performance. Check it
                            out: [link] #webdev #javascript"
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg">
                            <Sparkles className="h-3 w-3 text-blue-500" />
                            <span>LLM response enhanced with your project context and details</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <Button size="sm" variant="default" className="h-8 rounded-full">
                              Copy Tweet
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 rounded-full">
                              Generate Another
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-primary/[3%] p-5 rounded-xl border border-dashed text-start">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <InfoIcon className="h-4 w-4 text-primary" /> How Low-Proximity Intent Works
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          For creative tasks like content generation, Vibr uses the LLM but enhances the prompt with
                          local context from your projects. This creates more personalized, accurate responses that
                          incorporate your specific details without you having to provide them.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Context-enhanced prompts</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Personalized content</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Creative capabilities</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Optimized for sharing</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security-Sensitive Intent Tab */}
                  {activeTab === "security" && (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 justify-end">
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none text-start shadow-sm">
                          <p className="text-sm md:text-base">Show me my API keys for the Next.js Dashboard project</p>
                        </div>
                        <div
                          className="w-10 h-10 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium shadow-sm"
                          style={
                            {
                              backgroundImage: `url(${AVATAR_GRADIENT_API}/usertest-0014123123123qweqe)`,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shadow-sm">
                          <VibrIcon variant="circle-alt" className="h-8 w-8" color="green" glow={true} />
                        </div>
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tl-none text-start shadow-sm max-w-[85%]">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5"
                            >
                              <Lock className="h-3 w-3 mr-1" />
                              SECURITY-SENSITIVE INTENT
                            </Badge>
                          </div>
                          <p className="text-sm md:text-base">
                            For security reasons, I can't directly display your API keys. Instead, I've generated a
                            secure link where you can view and manage your API keys for the Next.js Dashboard project.
                          </p>
                          <div className="mt-3 bg-background/80 p-4 rounded-xl text-sm border border-primary/10 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-green-500" />
                              <span className="text-primary">View API Keys (Secure Portal)</span>
                            </div>
                            <Button variant="default" size="sm" className="h-8 rounded-full">
                              Open Portal
                            </Button>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg">
                            <Lock className="h-3 w-3 text-green-500" />
                            <span>Security-first approach prevents sensitive data exposure</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-primary/[3%] p-5 rounded-xl border border-dashed text-start">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <InfoIcon className="h-4 w-4 text-primary" /> How Security-Sensitive Intent Works
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Vibr identifies security-sensitive requests and handles them with a hybrid approach. It uses
                          our specialized contextual engine to ensure sensitive data never reaches the LLM, while
                          maintaining a natural conversational flow. This prevents data leaks and ensures compliance.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Zero data leakage</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Secure access controls</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Compliance-ready</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Audit trail support</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

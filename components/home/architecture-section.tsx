"use client"

import Link from "next/link"
import { ArrowRight, Zap, Database, Server, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import CompactAIDiagram from "./compact-ai-diagram"
import { SectionReveal } from "@/components/home/section-reveal"

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background to-muted/30"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow opacity-70 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <SectionReveal className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
            Advanced Chatbot Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our innovative architecture combines the latest in AI technology with efficient data management
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <SectionReveal direction="left" delay={0.2}>
            <ul className="space-y-6">
              <SectionReveal className="flex items-start" delay={0.3}>
                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Multi-model AI Pipeline</h3>
                  <p className="text-muted-foreground">
                    Combines multiple AI models for more accurate and context-aware responses. Our intent-based system
                    routes requests to the most appropriate model based on the query type.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal className="flex items-start" delay={0.4}>
                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Real-time Database Sync</h3>
                  <p className="text-muted-foreground">
                    Supabase integration provides instant data synchronization and secure authentication. All user
                    interactions are stored and indexed for improved context awareness in future conversations.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal className="flex items-start" delay={0.5}>
                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Serverless Edge Functions</h3>
                  <p className="text-muted-foreground">
                    Deployed on Vercel's edge network for minimal latency and global availability. Our architecture
                    ensures responses are generated as close to the user as possible, reducing wait times.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal className="flex items-start" delay={0.6}>
                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Adaptive Learning System</h3>
                  <p className="text-muted-foreground">
                    Improves over time by learning from user interactions and feedback. The system continuously refines
                    its understanding of user intent and preferences to deliver more personalized responses.
                  </p>
                </div>
              </SectionReveal>
            </ul>

            <SectionReveal className="mt-10" delay={0.7}>
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              >
                <Link href="/chat">
                  Try the AI Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </SectionReveal>
          </SectionReveal>

          <SectionReveal className="relative" direction="right" delay={0.3}>
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl opacity-70"></div>
            <div className="bg-background z-10 relative border rounded-xl shadow-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="p-1.5 bg-muted/80 border-b flex items-center justify-between">
                <div className="flex items-center space-x-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
                  ai-system-architecture.vercel.app
                </div>
                <div className="w-8"></div>
              </div>

              {/* Content area */}
              <div className="p-6 bg-background">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">AI System Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive diagram showing data flow and component interactions
                  </p>
                </div>

                <CompactAIDiagram />

                <div className="mt-4 text-xs text-muted-foreground flex justify-between items-center">
                  <span>Built with React Flow</span>
                  <span>Last updated: April 11, 2025</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

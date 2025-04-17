"use client"

import { Zap, Shield, Gauge } from "lucide-react"
import { SectionReveal } from "@/components/home/section-reveal"

export function SolutionSection() {
  return (
    <section id="solutions" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-primary/5 via-secondary/5 to-background pointer-events-none"></div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <SectionReveal className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/80">
            The <span className=" ">Intent-First</span> Revolution
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Main pitch text */}
          <SectionReveal className="lg:col-span-7 relative" delay={0.2}>
            <div className="relative z-10 p-6 md:p-8 bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-lg">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
                Most AI tools rely on slow, generic LLM responses for every task—even when speed, security, or accuracy
                matters. Vibr flips that model with an intent-based engine that understands your workflow, routes simple
                tasks through fast local logic, and only uses LLMs when creative reasoning is needed. The result:
                lightning-fast, context-aware AI that's secure by design, with zero unnecessary latency or data risk.
              </p>
            </div>
          </SectionReveal>

          {/* Key benefits */}
          <SectionReveal className="lg:col-span-5" delay={0.3}>
            <div className="grid grid-cols-1 gap-4">
              <SectionReveal
                className="flex items-start p-4 bg-background rounded-lg border border-primary/10 shadow-sm"
                delay={0.4}
              >
                <div className="mr-4 p-2 bg-primary/10 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">10x Faster Response</h3>
                  <p className="text-sm text-muted-foreground">Intent-based routing eliminates unnecessary LLM calls</p>
                </div>
              </SectionReveal>

              <SectionReveal
                className="flex items-start p-4 bg-background rounded-lg border border-primary/10 shadow-sm"
                delay={0.5}
              >
                <div className="mr-4 p-2 bg-primary/10 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Security By Design</h3>
                  <p className="text-sm text-muted-foreground">Sensitive data never reaches external LLMs</p>
                </div>
              </SectionReveal>

              <SectionReveal
                className="flex items-start p-4 bg-background rounded-lg border border-primary/10 shadow-sm"
                delay={0.6}
              >
                <div className="mr-4 p-2 bg-primary/10 rounded-full">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Context-Aware Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Understands your workflow and adapts accordingly</p>
                </div>
              </SectionReveal>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

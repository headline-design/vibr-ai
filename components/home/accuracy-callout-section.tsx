"use client"

import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle } from "lucide-react"
import { SectionReveal } from "@/components/home/section-reveal"
import { cn } from "@/lib/utils"

export function AccuracyCalloutSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <SectionReveal className="bg-background border rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Quote and problem statement */}
            <div className="p-8 md:p-10 bg-primary/5 border-r border-primary/10 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 text-sm font-medium mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <span>OpenAI's Official Disclaimer</span>
                </div>

                <blockquote className="text-2xl md:text-3xl font-medium mb-6 border-l-4 border-primary/30 pl-4">
                  "ChatGPT can make mistakes. Check important info."
                </blockquote>

                <p className="text-muted-foreground mb-6">
                  This isn't just a disclaimer—it's a fundamental limitation of all LLM-based systems. When "mostly
                  right" is the best guarantee, critical operations and sensitive data handling require a different
                  approach.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Hallucinations in critical data</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Inconsistent execution logic</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Security vulnerabilities</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unpredictable outcomes</span>
                </div>
              </div>
            </div>

            {/* Right side - Solution */}
            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
                <ShieldCheck className="h-4 w-4" />
                <span>The Intent-Based Solution</span>
              </div>

              <h3 className="text-2xl font-bold mb-4">Precision Where It Matters Most</h3>

              <p className="text-muted-foreground mb-6">
                Intent-based AI fundamentally transforms this paradigm by separating creative tasks from critical
                operations. By identifying user intent and routing requests accordingly, we can leverage LLMs for their
                creative strengths while ensuring critical functions execute with deterministic precision.
              </p>

              <div className={cn("p-4 rounded-lg border mb-6", "bg-gradient-to-r from-primary/5 to-transparent")}>
                <p className="text-sm font-medium">
                  "In systems where accuracy is non-negotiable, the solution isn't to abandon AI entirely—it's to create
                  intelligent guardrails that direct requests to the appropriate processing engine based on intent."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Deterministic Execution</p>
                    <p className="text-xs text-muted-foreground">For critical operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Creative Generation</p>
                    <p className="text-xs text-muted-foreground">For content and ideas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Intent Classification</p>
                    <p className="text-xs text-muted-foreground">For intelligent routing</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Security Guarantees</p>
                    <p className="text-xs text-muted-foreground">For sensitive operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

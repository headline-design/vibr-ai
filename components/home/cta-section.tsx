"use client"

import Link from "next/link"
import { ArrowRight, MessageSquare, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionReveal } from "@/components/home/section-reveal"

export function CTASection() {
  return (
    <section id="contact" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>

      <div className="container px-4 md:px-6 mx-auto max-w-5xl relative">
        <SectionReveal className="bg-background border rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <SectionReveal className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to experience intent-based AI?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start building with Vibr today and see how our intent-first approach transforms your AI interactions.
              </p>
            </SectionReveal>

            <SectionReveal className="flex flex-col sm:flex-row items-center justify-center gap-4" delay={0.2}>
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/chat">
                  <MessageSquare className="mr-2 h-4 w-4" /> Try Vibr AI Chat
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full h-12 px-6 border-primary/20 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="https://github.com/yourusername/vibr" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full h-12 px-6 hover:bg-background transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/docs">
                  Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </SectionReveal>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

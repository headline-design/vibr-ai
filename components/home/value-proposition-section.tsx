"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap, Clock, ShieldAlert, Lightbulb } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ValuePropositionSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          className="mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-6">Rethinking AI Interaction</h2>
          <p className="text-lg text-muted-foreground text-center">
            Most AI tools rely on slow, generic LLM responses for every task—even when speed, security, or accuracy
            matters. Vibr flips that model with an intent-based engine that understands your workflow.
          </p>
        </motion.div>

        {/* Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Traditional AI Approach */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className={cn(
                "h-full p-8 bg-background rounded-xl border shadow-sm card-hover",
                "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-red-400 before:rounded-t-xl",
              )}
            >
              <div className="flex items-center mb-6">
                <Clock className="h-8 w-8 text-red-400 mr-3" />
                <h3 className="text-xl font-semibold">Traditional AI</h3>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-red-400">•</div>
                  <p>Every request routed through LLM, regardless of complexity</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-red-400">•</div>
                  <p>High latency for even simple operations</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-red-400">•</div>
                  <p>Sensitive data potentially exposed to external models</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-red-400">•</div>
                  <p>Generic responses lacking workflow context</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-red-400">•</div>
                  <p>Increased token usage and operational costs</p>
                </li>
              </ul>

              <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">Inefficient and potentially insecure</p>
              </div>
            </div>
          </motion.div>

          {/* Vibr's Approach */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className={cn(
                "h-full p-8 bg-background rounded-xl border shadow-sm card-hover",
                "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-primary before:rounded-t-xl",
              )}
            >
              <div className="flex items-center mb-6">
                <Zap className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Vibr's Intent-Based AI</h3>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">•</div>
                  <p>Intelligent routing based on detected intent</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">•</div>
                  <p>Simple tasks handled by fast local logic</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">•</div>
                  <p>Sensitive data never leaves your secure environment</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">•</div>
                  <p>Context-aware responses tailored to your workflow</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">•</div>
                  <p>Optimized resource usage and reduced costs</p>
                </li>
              </ul>

              <div className="flex items-center justify-center p-4 bg-primary/5 rounded-lg">
                <Lightbulb className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm text-primary">Faster, more secure, and context-aware</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Summary */}
        <motion.div
          className="bg-background border rounded-xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0 p-4 bg-primary/10 rounded-full">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">The Result</h3>
              <p className="text-muted-foreground">
                Lightning-fast, context-aware AI that's secure by design, with zero unnecessary latency or data risk.
                Vibr routes simple tasks through fast local logic and only uses LLMs when creative reasoning is needed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

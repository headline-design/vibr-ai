"use client"

import type React from "react"

import { CodeBlock } from "./code-block"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [processedContent, setProcessedContent] = useState(content)

  // Process content to handle special cases
  useEffect(() => {
    // Fix code blocks that might be malformed
    const processed = content.replace(/```(\w+)?\s*\n/g, "```$1\n").replace(/```\s*$/g, "\n```")

    setProcessedContent(processed)
  }, [content])

  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({
            node,
            inline,
            className,
            children,
            ...props
          }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""

            if (!inline && language) {
              return <CodeBlock code={String(children).replace(/\n$/, "")} language={language} />
            }

            return (
              <code
                className={cn("px-1 py-0.5 rounded text-sm font-mono bg-background", className)}
                {...props}
              >
                {children}
              </code>
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {children}
              </a>
            )
          },
          img({ src, alt }) {
            return (
              <img
                src={src || "/placeholder.svg"}
                alt={alt || ""}
                className="rounded-md max-w-full h-auto my-2"
                loading="lazy"
              />
            )
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-gray-100">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 whitespace-nowrap text-sm text-muted-foreground border-b border-gray-200 dark:border-gray-700">
                {children}
              </td>
            )
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

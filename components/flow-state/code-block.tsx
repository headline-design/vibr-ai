"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Copy, Download, ExternalLink, Terminal, CodeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-python"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-graphql"
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

interface EnhancedCodeBlockProps {
  code: string
  language?: string
  fileName?: string
  showLineNumbers?: boolean
  className?: string
  maxHeight?: number
}

export function CodeBlock({
  code,
  language = "javascript",
  fileName,
  showLineNumbers = true,
  className,
  maxHeight = 400,
}: EnhancedCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState(language)
  const [isExpanded, setIsExpanded] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Language display names
  const languageNames: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    jsx: "React JSX",
    tsx: "React TSX",
    css: "CSS",
    html: "HTML",
    python: "Python",
    json: "JSON",
    markdown: "Markdown",
    bash: "Bash",
    shell: "Shell",
    sql: "SQL",
    yaml: "YAML",
    graphql: "GraphQL",
    plaintext: "Plain Text",
  }

  // Language icons
  const getLanguageIcon = (lang: string) => {
    if (["javascript", "typescript", "jsx", "tsx"].includes(lang)) {
      return <CodeIcon className="h-3.5 w-3.5" />
    } else if (["bash", "shell"].includes(lang)) {
      return <Terminal className="h-3.5 w-3.5" />
    } else {
      return <CodeIcon className="h-3.5 w-3.5" />
    }
  }

  // Detect language from code block if not provided
  useEffect(() => {
    if (!language) {
      // Simple language detection based on first line or content
      if (
        code.includes("import React") ||
        code.includes("export default") ||
        (code.includes("function") && code.includes("return") && code.includes("<"))
      ) {
        setDetectedLanguage("jsx")
      } else if (code.includes("<html") || code.includes("<!DOCTYPE")) {
        setDetectedLanguage("html")
      } else if (code.includes("SELECT") && code.includes("FROM")) {
        setDetectedLanguage("sql")
      } else if (code.includes("def ") && code.includes(":")) {
        setDetectedLanguage("python")
      } else if (code.includes("{") && code.includes("}") && code.includes(":")) {
        setDetectedLanguage("json")
      } else if (code.includes("function") || code.includes("const") || code.includes("let")) {
        setDetectedLanguage("javascript")
      } else if (code.includes("#") && code.includes("```")) {
        setDetectedLanguage("markdown")
      } else if (code.includes("apt-get") || code.includes("npm") || code.includes("$")) {
        setDetectedLanguage("bash")
      } else {
        setDetectedLanguage("plaintext")
      }
    }
  }, [code, language])

  // Apply syntax highlighting
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, detectedLanguage, isExpanded])

  // Check if code block is overflowing
  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current
      setIsOverflowing(scrollHeight > clientHeight)
    }
  }, [code, maxHeight])

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Download code as file
  const downloadCode = () => {
    const extension =
      detectedLanguage === "jsx"
        ? "jsx"
        : detectedLanguage === "tsx"
          ? "tsx"
          : detectedLanguage === "javascript"
            ? "js"
            : detectedLanguage === "typescript"
              ? "ts"
              : detectedLanguage === "python"
                ? "py"
                : detectedLanguage === "html"
                  ? "html"
                  : detectedLanguage === "css"
                    ? "css"
                    : detectedLanguage === "json"
                      ? "json"
                      : detectedLanguage === "markdown"
                        ? "md"
                        : detectedLanguage === "bash" || detectedLanguage === "shell"
                          ? "sh"
                          : detectedLanguage === "sql"
                            ? "sql"
                            : detectedLanguage === "yaml"
                              ? "yaml"
                              : detectedLanguage === "graphql"
                                ? "graphql"
                                : "txt"

    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName || `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden my-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        className,
      )}
    >
      {/* File name header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {getLanguageIcon(detectedLanguage)}
          <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            {fileName || languageNames[detectedLanguage] || detectedLanguage}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{copied ? "Copied!" : "Copy code"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadCode}
                  className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Download code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {fileName && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Open in editor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Code block */}
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden transition-all duration-300", !isExpanded && `max-h-[${maxHeight}px]`)}
        style={{ maxHeight: isExpanded ? "none" : `${maxHeight}px` }}
      >
        <pre className={cn("p-4 overflow-x-auto text-sm", showLineNumbers && "line-numbers")}>
          <code ref={codeRef} className={`language-${detectedLanguage}`}>
            {code}
          </code>
        </pre>

        {/* Gradient overlay for overflowing content */}
        {isOverflowing && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Show more/less button */}
      {isOverflowing && (
        <div className="flex justify-center border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-1"
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        </div>
      )}
    </div>
  )
}

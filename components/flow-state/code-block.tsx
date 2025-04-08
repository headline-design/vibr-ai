"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Copy, Download } from "lucide-react"
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

interface CodeBlockProps {
  code: string
  language?: string
  fileName?: string
  className?: string
}

export function CodeBlock({ code, language = "javascript", fileName, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState(language)
  const codeRef = useRef<HTMLPreElement>(null)

  // Detect language from code block if not provided
  useEffect(() => {
    if (!language) {
      // Simple language detection based on first line or content
      if (code.includes("import React") || code.includes("export default")) {
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
  }, [code, detectedLanguage])

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
                        : detectedLanguage === "bash"
                          ? "sh"
                          : detectedLanguage === "sql"
                            ? "sql"
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

  return (
    <div className={cn("relative rounded-md overflow-hidden my-4 bg-gray-50 dark:bg-gray-900", className)}>
      {/* File name header */}
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{fileName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{detectedLanguage}</span>
        </div>
      )}

      {/* Code block */}
      <div className="relative group">
        <pre className={cn("p-4 overflow-x-auto text-sm", !fileName && "rounded-t-md")}>
          <code ref={codeRef} className={`language-${detectedLanguage}`}>
            {code}
          </code>
        </pre>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="h-7 w-7 rounded-md bg-gray-200/80 hover:bg-gray-200 dark:bg-gray-700/80 dark:hover:bg-gray-700"
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
                    className="h-7 w-7 rounded-md bg-gray-200/80 hover:bg-gray-200 dark:bg-gray-700/80 dark:hover:bg-gray-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Download code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

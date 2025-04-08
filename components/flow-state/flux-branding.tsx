"use client"

import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

interface FluxBrandingProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal" | "icon-only"
  className?: string
}

export function FluxBranding({ size = "md", variant = "default", className }: FluxBrandingProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  if (variant === "icon-only") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Bot size={iconSizes[size]} className="text-indigo-600" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Bot size={iconSizes[size]} className="text-indigo-600" />
      <span className={cn("font-semibold tracking-tight", sizeClasses[size])}>
        {variant === "minimal" ? "Flux" : "Flux Assistant"}
      </span>
    </div>
  )
}

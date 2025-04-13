"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface IconProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Icon({ icon: LucideIcon, size = "md", className }: IconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return <LucideIcon className={cn(sizeClasses[size], className)} />
}

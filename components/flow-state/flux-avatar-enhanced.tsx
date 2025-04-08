"use client"

import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface FluxAvatarProps {
  size?: "xs" | "sm" | "md" | "lg"
  mood?: "neutral" | "happy" | "thinking" | "excited" | "focused" | "sad"
  animate?: boolean
  className?: string
  [key: string]: any
}

export function FluxAvatar({ size = "md", mood = "neutral", animate = true, className, ...props }: FluxAvatarProps) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const moodColors = {
    neutral: "bg-indigo-600",
    happy: "bg-emerald-500",
    thinking: "bg-violet-600",
    excited: "bg-amber-500",
    focused: "bg-indigo-700",
    sad: "bg-slate-500",
  }

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  }

  return (
    <motion.div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-medium",
        sizeClasses[size],
        moodColors[mood],
        className,
      )}
      animate={
        animate
          ? {
              scale: [1, 1.05, 1],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }
          : undefined
      }
      {...props}
    >
      <Bot size={iconSizes[size]} />
    </motion.div>
  )
}

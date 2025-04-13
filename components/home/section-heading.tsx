"use client"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  centered?: boolean
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeading({
  title,
  description,
  centered = true,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4",
          "bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("text-xl text-muted-foreground", centered && "max-w-2xl mx-auto", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  )
}

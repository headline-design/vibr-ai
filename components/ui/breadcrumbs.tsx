"use client"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface BreadcrumbsProps {
  segments: { label: string; href: string }[]
  className?: string
}

export function Breadcrumbs({ segments, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumbs" className={cn("text-sm", className)}>
      <ol className="list-none p-0 flex items-center">
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center">
            <Link
              href={segment.href}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                index === segments.length - 1 && "font-medium text-foreground",
              )}
            >
              {segment.label}
            </Link>
            {index < segments.length - 1 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}

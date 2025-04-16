"use client"


import { getOgImageUrl } from "@/lib/og-image"
import ImageV2 from "@/components/ui/image-v2"
import { useState, useEffect } from "react"
import { useCurrentTheme } from "@/hooks/use-theme"

interface OgImageProps {
  title: string
  fallbackImage?: string
}

export function OgPostImage({
  title,
  fallbackImage,
}: OgImageProps) {
  const currentTheme = useCurrentTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use static image during SSR, then switch to OG image after hydration
  const imageUrl = mounted ? getOgImageUrl(title, currentTheme) : fallbackImage || "/placeholder.svg"

  return (
    <ImageV2
    src={imageUrl || "/placeholder.svg"}
    alt={title}
    width={1200}
    height={630}
    className="aspect-[21/9] w-full object-cover"
    priority={true}
  />
  )
}


"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

interface SectionIndicatorProps {
  sections: Array<{
    id: string
    label: string
  }>
}

export function SectionIndicator({ sections }: SectionIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const activeSection = useActiveSection(
    sections.map((s) => s.id),
    200,
  )

  // Only show after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click to scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      // Get the height of the navbar
      const navbarHeight = 80 // Adjust based on your navbar height

      // Calculate the position to scroll to
      const offsetPosition = section.offsetTop - navbarHeight

      // Scroll to that position
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative flex items-center"
          aria-label={`Scroll to ${section.label} section`}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150",
              activeSection === section.id
                ? "bg-primary scale-150"
                : "bg-muted-foreground/30 group-hover:bg-muted-foreground/70",
            )}
          />
          <span
            className={cn(
              "absolute right-4 py-1 px-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              activeSection === section.id ? "text-primary font-medium" : "text-muted-foreground",
            )}
          >
            {section.label}
          </span>
        </button>
      ))}
    </motion.div>
  )
}

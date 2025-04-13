"use client"

import { useState, useEffect } from "react"

export function useActiveSection(sections: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      // Get current scroll position
      const scrollY = window.scrollY

      // Find the current section
      let current: string | null = null

      // Check each section
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId)

        if (section) {
          // Get the top position of the section relative to the viewport
          const sectionTop = section.getBoundingClientRect().top + window.scrollY

          // If we've scrolled past the section (minus offset), update current
          if (scrollY >= sectionTop - offset) {
            current = sectionId
          }
        }
      })

      // Update the active section
      setActiveSection(current)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Call once on mount to set initial state
    handleScroll()

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections, offset])

  return activeSection
}

"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import { VibrIcon } from "@/components/vibr-icon"
import { Home, MessageSquare, Menu, X, Github, Sun, Moon, ChevronRight, ArrowUp } from "lucide-react"

// Animation constants for consistent timing
const ANIMATION_CONSTANTS = {
  SCROLL_THRESHOLD_START: 0,
  SCROLL_THRESHOLD_END: 60,
  SCROLL_TO_TOP_THRESHOLD: 300,
  LOGO_SCALE_FINAL: 0.8,
  LOGO_Y_OFFSET_FINAL: -8,
  NAV_X_OFFSET_FINAL: 32, // Increased for better spacing
  TRANSITION_DURATION: 150,
  EASING: "cubic-bezier(0.33, 1, 0.68, 1)", // Easing function for smooth motion
  HOMEPAGE_TRANSPARENCY_THRESHOLD: 20, // When to start transitioning homepage navbar
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthContext()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLSpanElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const chatNavItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [hoveredChatIndex, setHoveredChatIndex] = useState<number | null>(null)

  // Single source of truth for scroll position
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [homepageScrolled, setHomepageScrolled] = useState(false)

  // Determine if we're in the chat section or on homepage
  const isInChatSection = pathname === "/chat" || pathname.startsWith("/chat/")
  const isHomepage = pathname === "/"

  // Derived styles from scroll progress
  const logoStyle = {
    position: scrollProgress > 0 ? "fixed" : "absolute",
    transform:
      scrollProgress > 0
        ? `translateY(${ANIMATION_CONSTANTS.LOGO_Y_OFFSET_FINAL * scrollProgress}px) scale(${1 - (1 - ANIMATION_CONSTANTS.LOGO_SCALE_FINAL) * scrollProgress})`
        : "none",
    left: "24px",
    top: "16px",
    zIndex: 50,
    transition:
      scrollProgress === 0 || scrollProgress === 1
        ? `transform ${ANIMATION_CONSTANTS.TRANSITION_DURATION}ms ${ANIMATION_CONSTANTS.EASING}`
        : "none", // Only apply transition at the start and end points for smoother animation
  } as React.CSSProperties

  const navTranslateX = ANIMATION_CONSTANTS.NAV_X_OFFSET_FINAL * scrollProgress

  // Define main navigation items
  const mainNavItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/chat",
      label: "Chat",
      icon: MessageSquare,
    },
    // Add other main nav items here
  ]

  // Define chat navigation items
  const chatNavItems = [
    {
      href: "/chat",
      label: "Chat",
    },
    {
      href: "/chat/ai-tools",
      label: "AI Tools",
    },
    {
      href: "/chat/design-system",
      label: "Design",
    },
    {
      href: "/chat/debug",
      label: "Debug",
    },
    {
      href: "/chat/settings",
      label: "Settings",
    },
  ]

  // Memoized scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    // Show scroll-to-top button when scrolled down enough
    setShowScrollToTop(currentScrollY > ANIMATION_CONSTANTS.SCROLL_TO_TOP_THRESHOLD)

    // Handle homepage navbar transparency
    if (isHomepage) {
      setHomepageScrolled(currentScrollY > ANIMATION_CONSTANTS.HOMEPAGE_TRANSPARENCY_THRESHOLD)
    }

    // Handle chat section animations
    if (isInChatSection) {
      // Calculate scroll progress (0 to 1)
      const { SCROLL_THRESHOLD_START, SCROLL_THRESHOLD_END } = ANIMATION_CONSTANTS

      if (currentScrollY <= SCROLL_THRESHOLD_START) {
        setScrollProgress(0)
      } else if (currentScrollY >= SCROLL_THRESHOLD_END) {
        setScrollProgress(1)
      } else {
        // Smooth progress between thresholds
        const progress = (currentScrollY - SCROLL_THRESHOLD_START) / (SCROLL_THRESHOLD_END - SCROLL_THRESHOLD_START)
        setScrollProgress(progress)
      }
    }
  }, [isInChatSection, isHomepage])

  // Function to scroll to top with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Add scroll event listener with debounce for performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const debouncedScrollHandler = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 5) // Small timeout for smoother performance
    }

    window.addEventListener("scroll", debouncedScrollHandler, { passive: true })
    handleScroll() // Initialize on mount

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [handleScroll])

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false)
    }
  }, [isDesktop])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Main Navbar - sticky for non-chat pages, static for chat pages */}
      <header
        className={cn(
          "w-full z-40 px-6 items-center h-16 min-h-16 flex",
          // Make navbar sticky for non-chat pages
          !isInChatSection ? "sticky top-0" : "",
          // Background styles based on page and scroll state
          isInChatSection
            ? "bg-background"
            : isHomepage && !homepageScrolled && !isOpen
              ? "bg-transparent"
              : "bg-background/80 backdrop-blur-md border-b shadow-sm transition-colors duration-200",
        )}
        ref={navRef}
      >
        <Link href="/" className="inline">
          {isInChatSection ? (
            // Animated logo for chat section
            <span ref={logoRef} style={logoStyle} className="inline-flex">
              <VibrIcon variant="circle" className="h-8 w-8" />
            </span>
          ) : (
            // Static logo for other pages
            <span className="inline-flex">
              <VibrIcon variant="circle" className="h-8 w-8" />
            </span>
          )}
        </Link>
        <nav className="w-full pl-8">
          <div className="flex h-auto items-center justify-between">
            {/* Left side: Brand logo and navigation links */}
            <div className="flex items-center space-x-4">
              {isInChatSection ? (
                // Special header for chat section with animated logo
                <div className="flex items-center">
                  <div className="flex items-center">
                    {/* Added ml-4 for proper spacing from the logo */}
                    <span className="font-bold text-xl ml-4">VIBR</span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span className="text-lg">AI Chat</span>
                  </div>
                </div>
              ) : (
                // Regular logo and navigation for other pages
                <>
                  <span className="font-bold text-xl">Vibr</span>
                  {/* Desktop navigation - only show when not in chat section */}
                  <div className="hidden md:flex md:items-center md:space-x-2 ml-4">
                    {mainNavItems.map((item) => {
                      const isActive = item.href === "/" ? pathname === "/" : pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-[30px] px-4 relative",
                            isActive
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          )}
                        >
                          {item.label}
                          {isActive && (
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Right side: Theme toggle, buttons, etc. - change to rounded-md */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-md h-8 w-8"
                aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* GitHub button */}
              <Button asChild variant="outline" size="sm" className="rounded-md hidden md:flex h-8">
                <Link href="https://github.com/yourusername/vibr" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-3 w-3" /> GitHub
                </Link>
              </Button>

              {/* User profile or sign in */}
              {user ? (
                <UserProfile />
              ) : (
                <Button asChild variant="default" size="sm" className="rounded-md hidden md:flex h-8">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  className="relative rounded-md h-8 w-8"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile navigation - fixed to viewport */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm pt-16 overflow-auto flex flex-col">
          <div className="flex-1 p-4">
            <div className="space-y-1 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Navigation</h3>
              {mainNavItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || (item.href === "/chat" && isInChatSection)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </span>
                    <span className="text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer with sign in/out */}
          <div className="p-4 border-t">
            {user ? (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user.email}</span>
                </p>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md"
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                >
                  <span className="flex items-center">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button asChild variant="default" className="w-full rounded-md">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Chat Navigation - now outside the main navbar with sticky positioning */}
      {isInChatSection && (
        <div className="sticky top-0 w-full bg-background border-b shadow-sm z-40">
          <div className="container mx-auto px-6">
            <div className="relative flex items-center h-[46px] overflow-hidden">
              <div
                className="flex space-x-2 items-center h-full"
                style={{
                  transform: `translateX(${navTranslateX}px)`,
                  transition:
                    scrollProgress === 0 || scrollProgress === 1
                      ? `transform ${ANIMATION_CONSTANTS.TRANSITION_DURATION}ms ${ANIMATION_CONSTANTS.EASING}`
                      : "none",
                }}
              >
                {chatNavItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <div
                      key={item.href}
                      ref={(el) => (chatNavItemsRef.current[index] = el)}
                      className={cn(
                        "relative px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap h-full flex items-center",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                      )}
                      onMouseEnter={() => setHoveredChatIndex(index)}
                      onMouseLeave={() => setHoveredChatIndex(null)}
                      onClick={() => router.push(item.href)}
                    >
                      <span className="text-sm font-medium">{item.label}</span>

                      {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-primary" />}
                    </div>
                  )
                })}
              </div>

              {/* Right side controls - Scroll to top button */}
              <div className="ml-auto flex items-center space-x-2">
                {/* Scroll to top button - only show when scrolled down */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollToTop}
                  className={cn(
                    "rounded-md h-7 w-7 transition-opacity duration-300",
                    showScrollToTop ? "opacity-100" : "opacity-0 pointer-events-none",
                  )}
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>

                {/* User profile */}
                {user && <UserProfile />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

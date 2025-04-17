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
import {
  Home,
  MessageSquare,
  Menu,
  X,
  Github,
  Sun,
  Moon,
  ChevronRight,
  ArrowUp,
  LogIn,
  UserPlus,
  Cpu,
  Server,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Animation constants for consistent timing
const ANIMATION_CONSTANTS = {
  SCROLL_THRESHOLD_START: 0,
  SCROLL_THRESHOLD_END: 60,
  SCROLL_TO_TOP_THRESHOLD: 300,
  LOGO_SCALE_FINAL: 0.8,
  LOGO_Y_OFFSET_FINAL: -8,
  NAV_X_OFFSET_FINAL: 36, // Increased for better spacing
  TRANSITION_DURATION: 150,
  TRANSITION_DURATION_X: 20,
  EASING: "cubic-bezier(0.33, 1, 0.68, 1)", // Easing function for smooth motion
  HOMEPAGE_TRANSPARENCY_THRESHOLD: 20, // When to start transitioning homepage navbar
}

// Update the props definition to include default values
export function Navbar({
  visibleRoutes = [],
  activeSection = "",
  socialLinks = [],
}: {
  visibleRoutes?: any[]
  activeSection?: string
  socialLinks?: any[]
} = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthContext()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLSpanElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const chatNavItemsRef = useRef <HTMLDivElement[]>([])

  // Added for hover and active indicators - exactly like reference code
  const [hoveredChatIndex, setHoveredChatIndex] = useState<number | null>(null)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })

  // Single source of truth for scroll position
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [navbarScrolled, setNavbarScrolled] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Determine if we're in the chat section or on homepage
  const isInChatSection = pathname === "/chat" || pathname.startsWith("/chat/")
  const isHomepage = pathname === "/"

  // First, let's modify the isAuthPage check to include both login and signup pages
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password" || pathname === "/error"

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

  // Find active chat nav index
  const initialActiveIndex = chatNavItems.findIndex((item) => pathname === item.href)
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex !== -1 ? initialActiveIndex : 0)

  // Memoized scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    // Show scroll-to-top button when scrolled down enough
    setShowScrollToTop(currentScrollY > ANIMATION_CONSTANTS.SCROLL_TO_TOP_THRESHOLD)

    // Handle homepage navbar transparency
    if (isHomepage || isAuthPage) {
      setNavbarScrolled(currentScrollY > ANIMATION_CONSTANTS.HOMEPAGE_TRANSPARENCY_THRESHOLD)
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

    setScrolled(currentScrollY > 0)
  }, [isInChatSection, isHomepage, isAuthPage])

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

  // Added for hover indicator - exactly like reference code
  useEffect(() => {
    if (hoveredChatIndex !== null) {
      const hoveredElement = chatNavItemsRef.current[hoveredChatIndex]
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }
  }, [hoveredChatIndex])

  // Added for active indicator - exactly like reference code
  useEffect(() => {
    // Update active index when pathname changes
    const newActiveIndex = chatNavItems.findIndex((item) => pathname === item.href)
    if (newActiveIndex !== -1) {
      setActiveIndex(newActiveIndex)
    }
  }, [pathname])

  // Added for active indicator - exactly like reference code
  useEffect(() => {
    const activeElement = chatNavItemsRef.current[activeIndex]
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      })
    }
  }, [activeIndex])

  // Added for active indicator initialization - exactly like reference code
  useEffect(() => {
    if (isInChatSection) {
      requestAnimationFrame(() => {
        const activeElement = chatNavItemsRef.current[activeIndex]
        if (activeElement) {
          const { offsetLeft, offsetWidth } = activeElement
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
      })
    }
  }, [activeIndex, isInChatSection])

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
          (!isInChatSection && !isOpen) ? "sticky top-0" : "",
          // Background styles based on page and scroll state
          isInChatSection
            ? "bg-background-100"
            : (isHomepage || isAuthPage) && !navbarScrolled && !isOpen
              ? "bg-transparent"
              : "bg-background border-b shadow-sm transition-colors duration-200",
          isOpen ? "z-[120] fixed top-0 border-b-0" : "z-40",
        )}
        ref={navRef}
      >
        <Link href="/" className="inline h-8">
          {isInChatSection ? (
            // Animated logo for chat section
            <span ref={logoRef} style={logoStyle} className="inline-flex absolute">
              <VibrIcon variant="circle" className="h-8 w-8" />
            </span>
          ) : (
            // Static logo for other pages
            <span className="inline-flex absolute">
              <VibrIcon variant="circle" className="h-8 w-8" />
            </span>
          )}
        </Link>
        <nav className="w-full pl-10">
          <div className="flex h-auto items-center justify-between w-full">
            {/* Left side: Brand logo and navigation links */}
            <div className="flex items-center space-x-4 w-full">
              {isInChatSection ? (
                // Special header for chat section with animated logo
                <div className="flex items-center">
                  <div className="flex items-center">
                    {/* Added ml-4 for proper spacing from the logo */}
                    <span className="font-bold text-xl ml-3">VIBR</span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span className="text-lg">AI Chat</span>
                  </div>
                </div>
              ) : (
                // Regular logo and navigation for other pages
                <>
                  <span className="font-bold text-xl">VIBR</span>
                  {/* Desktop navigation */}
                  {isAuthPage ? (
                    <div className="hidden md:flex md:items-center justify-end w-full md:space-x-4 ml-auto">
                      {pathname === "/login" ? (
                        <Button asChild variant="outline" size="sm" className="rounded-md h-8">
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      ) : (
                        <Button asChild variant="outline" size="sm" className="rounded-md h-8">
                          <Link href="/login">Sign In</Link>
                        </Button>
                      )}
                      <Button asChild variant="default" size="sm" className="rounded-md h-8">
                        <Link href="/#contact">Contact</Link>
                      </Button>
                    </div>
                  ) : (
                    !isAuthPage && (
                      <div className="hidden md:flex md:items-center md:space-x-2">
                        {visibleRoutes && visibleRoutes.map((route) => {
                          // Existing route rendering code...
                          const isActive =
                            route.active || (pathname === "/" && route.sectionId && route.sectionId === activeSection)

                          return (
                            <Link
                              key={route.href}
                              href={route.href}
                              className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-[30px] px-4 relative",
                                isActive
                                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                              )}
                              title={route.description}
                            >
                              {route.label}
                              {isActive && (
                                <motion.span
                                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                                  layoutId="navIndicator"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    )
                  )}
                </>
              )}
            </div>

            {/* Right side: Theme toggle, buttons, etc. */}
            <div className="flex  space-x-2">

              {!isAuthPage && (
                <>
                  {/* GitHub button */}
                  <Button asChild variant="outline" size="sm" className="rounded-md hidden md:flex h-8">
                    <Link href="https://github.com/headline-design/vibr-ai" target="_blank" rel="noopener noreferrer">
                      <Github className="h-3.5 w-3.5" /> GitHub
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
                </>
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
                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background border-b z-50 overflow-auto flex flex-col"
          >
            <div className="flex-1 p-4">
              {isAuthPage ? (
                <div className="space-y-1 mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Navigation</h3>
                  <Link
                    href="/"
                    className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors text-foreground hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center">
                      <Home className="mr-3 h-5 w-5" />
                      Home
                    </span>
                    <span className="text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </Link>
                  {pathname === "/login" ? (
                    <Link
                      href="/signup"
                      className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors text-foreground hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center">
                        <UserPlus className="mr-3 h-5 w-5" />
                        Sign Up
                      </span>
                      <span className="text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors text-foreground hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center">
                        <LogIn className="mr-3 h-5 w-5" />
                        Sign In
                      </span>
                      <span className="text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  )}
                  <Link
                    href="/#contact"
                    className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors text-foreground hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center">
                      <MessageSquare className="mr-3 h-5 w-5" />
                      Contact
                    </span>
                    <span className="text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              ) : (
                // Original mobile menu content for non-auth pages
                <>
                  <div className="space-y-1 mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Navigation</h3>
                    {/* Include Home link in mobile menu for clarity */}
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                        pathname === "/" && !activeSection
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center">
                        <Home className="mr-3 h-5 w-5" />
                        Home
                      </span>
                      <span className="text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                    {!isAuthPage && visibleRoutes && visibleRoutes.map((route) => {
                      // Existing mobile route rendering code...
                      const isActive =
                        route.active || (pathname === "/" && route.sectionId && route.sectionId === activeSection)

                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          className={cn(
                            "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                            isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="flex items-center">
                            {route.icon && <route.icon className="mr-3 h-5 w-5" />}
                            {route.label}
                          </span>
                          <span className="text-muted-foreground">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Section links for homepage */}
                  {pathname === "/" && (
                    <div className="space-y-1 mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Sections</h3>
                      <Link
                        href="/#solutions"
                        className={cn(
                          "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                          activeSection === "solutions"
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center">
                          <Cpu className="mr-3 h-5 w-5" />
                          Features
                        </span>
                        <span className="text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Link>
                      <Link
                        href="/#integrations"
                        className={cn(
                          "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                          activeSection === "integrations"
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center">
                          <Cpu className="mr-3 h-5 w-5" />
                          Integrations
                        </span>
                        <span className="text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Link>
                      <Link
                        href="/#architecture"
                        className={cn(
                          "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                          activeSection === "architecture"
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center">
                          <Server className="mr-3 h-5 w-5" />
                          Architecture
                        </span>
                        <span className="text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Link>
                      <Link
                        href="/#contact"
                        className={cn(
                          "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                          activeSection === "contact"
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center">
                          <MessageSquare className="mr-3 h-5 w-5" />
                          Contact
                        </span>
                        <span className="text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </div>
                  )}

                  {/* Social links section */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Connect</h3>
                    {socialLinks && socialLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md text-foreground hover:bg-accent transition-colors"
                      >
                        <span className="flex items-center">
                          {link.icon && <link.icon className="mr-3 h-5 w-5" />}
                          {link.label}
                        </span>
                        <span className="text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {/* Theme toggle in mobile menu */}
              <div className="mt-6 px-3">
                <Button variant="outline" className="w-full justify-start rounded-md" onClick={toggleTheme}>
                  <span className="flex items-center">
                    {resolvedTheme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-5 w-5" /> Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-5 w-5" /> Dark Mode
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>

            {/* Footer with sign in/out */}
            {!isAuthPage && (
              <div className="p-4 border-t">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Signed in as <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                  </div>
                ) : (
                  <Button asChild variant="default" className="w-full rounded-md">
                    <Link href="/login">Sign In</Link>
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Navigation - now outside the main navbar with sticky positioning */}
      {isInChatSection && (
        <div
          className="sticky top-0 mt-[-10px] w-full bg-background-100 border-b shadow-sm z-40"
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div className="mx-auto px-6 h-[46px]">
            <div
              className="relative h-full flex items-center"
              style={{
                transform: `translateX(${navTranslateX}px)`,
                transition:
                  scrollProgress === 0 || scrollProgress === 1
                    ? `transform ${ANIMATION_CONSTANTS.TRANSITION_DURATION_X}ms ${ANIMATION_CONSTANTS.EASING}`
                    : "none",
              }}
            >
              {/* Hover Highlight - exactly like reference code */}
              <div
                className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
                style={{
                  ...hoverStyle,
                  opacity: hoveredChatIndex !== null ? 1 : 0,
                }}
              />

              {/* Active Indicator - exactly like reference code */}
              <div
                className="absolute bottom-0 h-[2px] bg-primary dark:bg-primary transition-all duration-300 ease-out"
                style={activeStyle}
              />

              {/* Tabs - exactly like reference code structure */}
              <div className="relative flex space-x-[6px] items-center">
                {chatNavItems.map((item, index) => (
                  <div
                    key={item.href}
                    ref={(el) => {
                      if (el) {
                        chatNavItemsRef.current[index] = el;
                      }
                    }}
                    className={cn(
                      "px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px]",
                      index === activeIndex
                        ? "text-foreground dark:text-white"
                        : "text-muted-foreground dark:text-[#ffffff99]",
                    )}
                    onMouseEnter={() => setHoveredChatIndex(index)}
                    onMouseLeave={() => setHoveredChatIndex(null)}
                    onClick={() => {
                      setActiveIndex(index)
                      router.push(item.href)
                    }}
                  >
                    <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll to top button - only show when scrolled down */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className={cn(
              "rounded-md h-7 w-7 transition-opacity duration-300 fixed top-3 right-3",
              showScrollToTop ? "opacity-100 z-[120]" : "opacity-0 pointer-events-none",
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}

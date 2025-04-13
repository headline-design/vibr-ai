"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useActiveSection } from "@/hooks/use-active-section"
import { VibrIcon } from "../../vibr-icon"
import {
  Home,
  MessageSquare,
  Cpu,
  Settings,
  Menu,
  X,
  Github,
  Sun,
  Moon,
  ChevronRight,
  Twitter,
  Server,
} from "lucide-react"

// Define route types for better organization
type RouteType = "public" | "protected" | "social"

interface NavRoute {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  type: RouteType
  description?: string
  sectionId?: string
}

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuthContext()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Track active section for homepage
  const sectionIds = ["solutions", "integrations", "architecture", "contact"]
  const activeSection = useActiveSection(sectionIds, 200)

  // Add a state to track scroll position
  const [scrolled, setScrolled] = useState(false)

  // Add a scroll event listener to track when the page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Call once on mount to set initial state
    handleScroll()

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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

  const routes: NavRoute[] = [
    {
      href: "/chat",
      label: "Chat",
      icon: MessageSquare,
      active: pathname === "/chat",
      type: "public",
      description: "AI-powered chat interface",
    },
    {
      href: pathname === "/" ? "/#solutions" : "/features",
      label: "Features",
      icon: Cpu,
      active: pathname === "/features" || (pathname === "/" && activeSection === "solutions"),
      type: "public",
      description: "Explore Vibr's features",
      sectionId: "solutions",
    },
    {
      href: pathname === "/" ? "/#integrations" : "/integrations",
      label: "Integrations",
      icon: Cpu,
      active: pathname === "/integrations" || (pathname === "/" && activeSection === "integrations"),
      type: "public",
      description: "Explore our integrations",
      sectionId: "integrations",
    },
    {
      href: "/docs",
      label: "Docs",
      icon: Settings,
      active: pathname === "/docs",
      type: "public",
      description: "Documentation and guides",
    },
  ]

  const socialLinks: NavRoute[] = [
    {
      href: "https://github.com/yourusername/vibr",
      label: "GitHub",
      icon: Github,
      active: false,
      type: "social",
      description: "View source code",
    },
    {
      href: "https://twitter.com/vibr_ai",
      label: "Twitter",
      icon: Twitter,
      active: false,
      type: "social",
      description: "Follow us for updates",
    },
  ]

  // Filter routes based on authentication status
  const publicRoutes = routes.filter((route) => route.type === "public")
  const visibleRoutes = [...publicRoutes]

  // Add this after the existing useEffect hooks
  useEffect(() => {
    // Handle anchor links on the homepage
    if (pathname === "/") {
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const anchor = target.closest("a")

        if (anchor && anchor.hash && anchor.pathname === "/") {
          e.preventDefault()
          const sectionId = anchor.hash.substring(1)
          const section = document.getElementById(sectionId)

          if (section) {
            // Get the height of the navbar
            const navbarHeight = navRef.current?.offsetHeight || 80

            // Calculate the position to scroll to
            const offsetPosition = section.offsetTop - navbarHeight

            // Scroll to that position
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
          }
        }
      }

      document.addEventListener("click", handleAnchorClick)
      return () => document.removeEventListener("click", handleAnchorClick)
    }
  }, [pathname])

  if (!mounted) {
    return null
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/" || isOpen
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
      ref={navRef}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Brand logo and navigation links */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center gap-2 mr-4">
              <VibrIcon variant="circle" className="h-8 w-8" />
              <span className="font-bold text-xl">Vibr</span>
            </Link>

            {/* Desktop navigation - keep rounded-full for nav links */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {visibleRoutes.map((route) => {
                // Check if this route is active based on section
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
      </div>

      {/* Mobile navigation - full height with animation - with icons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} // Using Material Design easing
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-b z-50 overflow-auto flex flex-col"
          >
            <div className="flex-1 p-4">
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
                {visibleRoutes.map((route) => {
                  // Check if this route is active based on section
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
                        <route.icon className="mr-3 h-5 w-5" />
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
                      activeSection === "solutions" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
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
                      activeSection === "contact" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
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
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md text-foreground hover:bg-accent transition-colors"
                  >
                    <span className="flex items-center">
                      <link.icon className="mr-3 h-5 w-5" />
                      {link.label}
                    </span>
                    <span className="text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>

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
                      // Handle sign out
                      signOut()
                    }}
                  >
                    <span className="flex items-center">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="default" className="w-full rounded-md">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

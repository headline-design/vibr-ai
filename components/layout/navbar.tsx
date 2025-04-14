"use client"

import type React from "react"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import { VibrIcon } from "@/components/vibr-icon"
import { Home, MessageSquare, Menu, X, Github, Sun, Moon, ChevronRight } from "lucide-react"

interface ScrollContextType {
  scrolled: boolean
  scrollY: number
}

const ScrollContext = createContext<ScrollContextType>({
  scrolled: false,
  scrollY: 0,
})

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setScrollY(offset)
      if (offset > 60) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return <ScrollContext.Provider value={{ scrolled, scrollY }}>{children}</ScrollContext.Provider>
}

export const useScrollContext = () => useContext(ScrollContext)

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthContext()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const chatNavItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [hoveredChatIndex, setHoveredChatIndex] = useState<number | null>(null)

  // Add a state to track scroll position
  const [scrolled, setScrolled] = useState(false)
  // Track if the main navbar is completely hidden (for secondary logo)
  const [mainNavHidden, setMainNavHidden] = useState(false)
  const mainNavHiddenTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Determine if we're in the chat section
  const isInChatSection = pathname === "/chat" || pathname.startsWith("/chat/")

  // Add a scroll event listener to track when the page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Basic scrolled state for navbar positioning
      if (currentScrollY > 60) {
        setScrolled(true)

        // When scrolled, add a small delay before showing the secondary logo
        // This ensures the main nav is fully hidden first
        if (mainNavHiddenTimerRef.current) clearTimeout(mainNavHiddenTimerRef.current)
        mainNavHiddenTimerRef.current = setTimeout(() => {
          setMainNavHidden(true)
        }, 150)
      } else {
        // When at the top, immediately hide the secondary logo and show the main nav
        setScrolled(false)
        setMainNavHidden(false)
        if (mainNavHiddenTimerRef.current) {
          clearTimeout(mainNavHiddenTimerRef.current)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (mainNavHiddenTimerRef.current) {
        clearTimeout(mainNavHiddenTimerRef.current)
      }
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

  if (!mounted) {
    return null
  }

  // Animation variants for smoother transitions
  const mainNavVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
    hidden: {
      y: "-100%",
      opacity: 0.8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
  }

  const secondaryNavVariants = {
    top: {
      top: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
    below: {
      top: "64px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
  }

  const logoVariants = {
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.05,
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
  }

  const controlsVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.1, // Slightly delayed after logo
      },
    },
    hidden: {
      opacity: 0,
      x: 10,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
  }

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          isInChatSection
            ? "bg-background"
            : scrolled || pathname !== "/" || isOpen
              ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
              : "bg-transparent",
        )}
        ref={navRef}
        variants={mainNavVariants}
        animate={isInChatSection && scrolled ? "hidden" : "visible"}
        initial="visible"
        onAnimationComplete={(definition) => {
          // When the main nav finishes animating to hidden, update the state
          if (definition === "hidden") {
            setMainNavHidden(true)
          } else if (definition === "visible") {
            setMainNavHidden(false)
          }
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left side: Brand logo and navigation links */}
            <div className="flex items-center space-x-4">
              {isInChatSection ? (
                // Special header for chat section
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <VibrIcon variant="circle" className="h-8 w-8" />
                  </Link>
                  <div className="flex items-center">
                    <span className="font-bold text-xl ml-2">VIBR</span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span className="text-lg">AI Chat</span>
                  </div>
                </div>
              ) : (
                // Regular logo and navigation for other pages
                <>
                  <Link href="/" className="flex items-center gap-2 mr-4">
                    <VibrIcon variant="circle" className="h-8 w-8" />
                    <span className="font-bold text-xl">Vibr</span>
                  </Link>

                  {/* Desktop navigation - only show when not in chat section */}
                  <div className="hidden md:flex md:items-center md:space-x-2">
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Chat Navigation - now integrated in the main component */}
      {isInChatSection && (
        <motion.div
          className={cn("w-full bg-background border-b fixed left-0 right-0 z-10", scrolled ? "shadow-sm" : "")}
          variants={secondaryNavVariants}
          animate={scrolled ? "top" : "below"}
          initial="below"
        >
          <div className="container mx-auto px-4">
            <div className="relative flex items-center h-12 overflow-x-auto hide-scrollbar">
              {/* Logo that appears when scrolled - only when main nav is hidden */}
              <AnimatePresence mode="wait">
                {mainNavHidden && (
                  <motion.div
                    className="flex items-center mr-4"
                    variants={logoVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link href="/" className="flex items-center gap-2">
                      <VibrIcon variant="circle" className="h-6 w-6" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex space-x-1 items-center h-full">
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

                      {isActive && (
                        <motion.div
                          className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-primary"
                          layoutId="chatNavIndicator"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Right side controls that appear when scrolled - only when main nav is hidden */}
              <AnimatePresence mode="wait">
                {mainNavHidden && (
                  <motion.div
                    className="ml-auto flex items-center space-x-2"
                    variants={controlsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* Theme toggle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="rounded-md h-7 w-7"
                      aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                    >
                      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>

                    {/* User profile */}
                    {user && <UserProfile />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

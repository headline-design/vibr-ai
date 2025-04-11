"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuthContext } from "@/components/auth/auth-provider"
import {
  Home,
  Folder,
  Settings,
  Menu,
  X,
  MessageSquare,
  Code,
  User,
  Cpu,
  Palette,
  Bug,
  ChevronRight,
  Github,
  Twitter,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { VibrIcon } from "../vibr-icon"

// Define route types for better organization
type RouteType = "public" | "protected" | "social"

interface NavRoute {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  type: RouteType
  description?: string
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthContext()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

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

  const routes: NavRoute[] = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
      type: "public",
      description: "Main dashboard and overview",
    },
    {
      href: "/chat",
      label: "Chat",
      icon: MessageSquare,
      active: pathname === "/chat",
      type: "public",
      description: "AI-powered chat interface",
    },
    {
      href: "/ai-tools",
      label: "AI Tools",
      icon: Cpu,
      active: pathname === "/ai-tools",
      type: "public",
      description: "Advanced AI capabilities",
    },
    {
      href: "/design-system",
      label: "Design",
      icon: Palette,
      active: pathname === "/design-system",
      type: "public",
      description: "UI components and design system",
    },
    {
      href: "/debug",
      label: "Debug",
      icon: Bug,
      active: pathname === "/debug",
      type: "public",
      description: "Debugging tools and utilities",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
      type: "public",
      description: "Application settings and preferences",
    },
    {
      href: "/projects",
      label: "Projects",
      icon: Folder,
      active: pathname === "/projects" || pathname.startsWith("/projects/"),
      type: "protected",
      description: "Manage your projects",
    },
    {
      href: "/account",
      label: "Account",
      icon: User,
      active: pathname === "/account",
      type: "protected",
      description: "Your profile and account settings",
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
  const protectedRoutes = routes.filter((route) => route.type === "protected")
  const visibleRoutes = [...publicRoutes, ...(user ? protectedRoutes : [])]

  if (!mounted) {
    return null
  }

  return (
    <nav className="border-b bg-background relative z-40" ref={navRef}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
             <VibrIcon className="h-8 w-8" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {visibleRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                  route.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
                title={route.description}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfile />
            ) : (
              <Button asChild variant="default" size="sm" className="shadow-sm hover:shadow transition-all">
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
                className="relative"
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

      {/* Mobile navigation - full height with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background border-b z-50 overflow-auto flex flex-col"
          >
            <div className="flex-1 p-4">
              <div className="space-y-1 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Navigation</h3>
                {visibleRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 text-base font-medium rounded-md transition-colors",
                      route.active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
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
                ))}
              </div>

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
                    className="w-full justify-start"
                    onClick={() => {
                      // Handle sign out
                      router.push("/api/auth/signout")
                    }}
                  >
                    <span className="flex items-center">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="default" className="w-full">
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

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { VibrIcon } from "../vibr-icon"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import ThemeSwitcher from "../ui/theme-switcher/theme-switcher"

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Check if we're on the login page or similar auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"

  // Render slim footer for auth pages
  if (isAuthPage) {
    return (
      <footer className="border-t py-8">
        <div className="container px-4 md:px-6 mx-auto">
          {/* First row: Logo and links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <VibrIcon variant="circle" className="h-6 w-6" />
              <span className="font-medium">Vibr</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                Help
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href="https://github.com/headline-design/vibr-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="https://twitter.com/vibrai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Second row: Copyright */}
          <div className="text-center sm:text-left border-t pt-4">
            <p className="text-xs text-muted-foreground">&copy; {currentYear} Vibr AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  // Original full footer for regular pages
  return (
    <footer className="bg-muted/30 border-t py-12 md:py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <VibrIcon variant="circle" className="h-8 w-8" />
              <span className="font-bold text-xl">Vibr</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Intent-based AI that understands your workflow and delivers faster, more secure responses.
            </p>

            <ThemeSwitcher />
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#solutions"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#integrations"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#architecture"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/headline-design/vibr-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    GitHub Repository
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#solutions"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#integrations"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#architecture"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Architecture
                  </Link>
                </li>
              </ul>
            </div>



            <div>
              <h3 className="font-medium mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Legal Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:aaron@headline.dev"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    legal@vibr.fun
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Social</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://twitter.com/vibrai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="inline w-4 h-4 mr-1"/>       Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/headline-design/vibr-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="inline w-4 h-4 mr-1"/>      GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:aaron@headline.dev"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="inline w-4 h-4 mr-1"/>      EMail
                  </a>
                </li>

              </ul>
            </div>

          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} VIBR AI. All rights reserved.</p>
          <div className="flex items-start sm:items-center justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Built with</span>
            <span className="text-primary">❤️</span>
            <span className="text-sm text-muted-foreground">by the VIBR team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

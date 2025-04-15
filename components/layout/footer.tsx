"use client"

import Link from "next/link"
import { VibrIcon } from "../vibr-icon"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

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
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/yourusername/vibr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/vibrai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/vibrai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:hello@vibr.ai"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
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
                    href="https://github.com/yourusername/vibr"
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
                    href="mailto:legal@vibr.ai"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    legal@vibr.ai
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} Vibr AI. All rights reserved.</p>
          <div className="flex items-center justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Built with</span>
            <span className="text-primary">❤️</span>
            <span className="text-sm text-muted-foreground">by the Vibr team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

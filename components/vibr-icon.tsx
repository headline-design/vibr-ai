"use client"

import { useFlareColor } from "@/providers/flare-color-provider"
import type { HTMLAttributes } from "react"

interface VibrIconProps extends HTMLAttributes<SVGElement> {
  variant?: "circle" | "circle-alt" | "bolt"
  className?: string
  color?: "purple" | "amber" | "blue" | "pink" | "green" | "flat"
  glow?: boolean
}

export function VibrIcon({ variant = "circle", color, glow = true, className = "", ...props }: VibrIconProps) {
  const { flareColor } = useFlareColor()

  // Define color values for each option
  const colors = {
    purple: {
      primary: "#8b5cf6",
      secondary: "#d8b4fe",
    },
    amber: {
      primary: "#f59e0b",
      secondary: "#fde68a",
    },
    blue: {
      primary: "#3b82f6",
      secondary: "#93c5fd",
    },
    pink: {
      primary: "#ec4899",
      secondary: "#f9a8d4",
    },
    green: {
      primary: "#22c55e",
      secondary: "#86efac",
    },
    flat: {
      primary: "#4b5563",
      secondary: "#9ca3af",
    },
  }

  const currentColor = color !== undefined ? colors[color] : colors[flareColor]

  // SVG content based on variant
  const renderIcon = () => {
    switch (variant) {
      case "circle":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" className={className} {...props}>
            <defs>
              <linearGradient id="vibr-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentColor.primary} />
                <stop offset="100%" stopColor={currentColor.secondary} />
              </linearGradient>
            </defs>
            <path
              fill="url(#vibr-icon-gradient)"
              d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m0-3.984C16.937 47.922 8.1 39.062 8.1 28c0-11.04 8.813-19.922 19.876-19.922c11.039 0 19.921 8.883 19.945 19.922c.023 11.063-8.883 19.922-19.922 19.922m-13.875-14.04c.328 0 .633-.093.984-.304l7.078-4.078l10.36 5.555c.469.234.89.375 1.265.375c.586 0 1.102-.235 1.57-.867l7.759-9.844c.304-.375.421-.703.421-1.102c0-.82-.68-1.523-1.593-1.523c-.328 0-.703.117-1.055.304L33.836 26.5l-10.383-5.555c-.445-.258-.867-.375-1.289-.375c-.516 0-1.031.258-1.524.867l-7.78 9.844c-.282.352-.423.727-.423 1.078c0 .82.774 1.524 1.688 1.524"
            />
          </svg>
        )
      case "circle-alt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" className={className} {...props}>
            <defs>
              <linearGradient id="vibr-icon-gradient-alt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentColor.primary} />
                <stop offset="100%" stopColor={currentColor.secondary} />
              </linearGradient>
            </defs>
            <path
              fill="url(#vibr-icon-gradient-alt)"
              d="M28 51.906c13.055 0 23.906-10.851 23.906-23.906c0-13.078-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.922 4.095 28c0 13.055 10.828 23.906 23.906 23.906m-13.875-18.07c-.914 0-1.688-.703-1.688-1.523c0-.352.141-.727.422-1.079l7.781-9.843c.493-.61 1.008-.868 1.524-.868c.422 0 .844.118 1.289.375l10.383 5.555l7.078-4.101c.352-.188.727-.305 1.055-.305c.914 0 1.593.703 1.593 1.523c0 .399-.117.727-.421 1.102l-7.758 9.844c-.469.632-.985.867-1.57.867c-.376 0-.797-.14-1.266-.375l-10.36-5.555l-7.078 4.078c-.351.211-.656.305-.984.305"
            />
          </svg>
        )
      case "bolt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" className={className} {...props}>
            <defs>
              <linearGradient id="vibr-icon-gradient-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentColor.primary} />
                <stop offset="100%" stopColor={currentColor.secondary} />
              </linearGradient>
            </defs>
            <path
              fill="url(#vibr-icon-gradient-bolt)"
              d="M2.987 38.469c.585 0 1.19-.152 1.819-.498l12.728-7.36l18.638 9.979c.844.433 1.602.693 2.294.693c1.018 0 1.884-.477 2.792-1.559l14.006-17.707c.498-.65.736-1.32.736-1.948c0-1.494-1.234-2.771-2.9-2.771c-.585 0-1.235.152-1.884.541l-12.75 7.36l-18.638-9.98c-.844-.475-1.623-.692-2.316-.692c-.995 0-1.883.455-2.749 1.559L.758 33.793C.217 34.443 0 35.113 0 35.74c0 1.515 1.342 2.727 2.987 2.727"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative">
      {/* Glow effect */}
      {glow &&
        <div className="absolute inset-0 blur-md opacity-70" style={{ color: currentColor.secondary }}>
          {renderIcon()}
        </div>
      }

      {/* Main icon */}
      <div className="relative">{renderIcon()}</div>
    </div>
  )
}


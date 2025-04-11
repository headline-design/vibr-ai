"use client"

import { cn } from "@/lib/utils"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface StaticFluxAvatarProps {
  size?: AvatarSize
  className?: string
  label?: string
  accessory?: "sunglasses" | null
}

const sizeMap = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
}

const viewBoxMap = {
  xs: "0 0 32 32",
  sm: "0 0 40 40",
  md: "0 0 48 48",
  lg: "0 0 64 64",
  xl: "0 0 80 80",
}

const sizePxMap = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
}

function getFaceElements(width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  const scale = width / 48 // Base scale on a 48px avatar

  const eyeY = centerY - 5 * scale
  const eyeDistance = 6 * scale
  const eyeSize = 1.5 * scale

  return {
    leftEyeX: centerX - eyeDistance,
    leftEyeY: eyeY,
    rightEyeX: centerX + eyeDistance,
    rightEyeY: eyeY,
    eyeRadius: eyeSize,
    sunglassesY: centerY - 4 * scale,
    sunglassesWidth: 22 * scale,
    sunglassesHeight: 10 * scale,
    mouthY: centerY + 7 * scale,
    mouthWidth: 8 * scale,
  }
}

export function StaticFluxAvatar({ size = "md", className, label, accessory = null }: StaticFluxAvatarProps) {
  const pixelSize = sizePxMap[size]
  const viewBox = viewBoxMap[size]

  const {
    leftEyeX,
    leftEyeY,
    rightEyeX,
    rightEyeY,
    eyeRadius,
    sunglassesY,
    sunglassesWidth,
    sunglassesHeight,
    mouthY,
    mouthWidth,
  } = getFaceElements(pixelSize, pixelSize)

  const centerX = pixelSize / 2

  return (
    <div
      className={cn("relative rounded-full overflow-hidden", sizeMap[size], className)}
      role="img"
      aria-label={label || "Abstract avatar"}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated" }}
      >
        <defs>
          <linearGradient id="avatarGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={pixelSize / 2} cy={pixelSize / 2} r={pixelSize / 2 - 1} fill="url(#avatarGradient)" />
        {accessory === "sunglasses" ? (
          <>
            <circle cx={leftEyeX} cy={sunglassesY + sunglassesHeight / 2} r={sunglassesHeight / 2} fill="#333" />
            <circle cx={rightEyeX} cy={sunglassesY + sunglassesHeight / 2} r={sunglassesHeight / 2} fill="#333" />
            <line
              x1={leftEyeX + sunglassesHeight / 2}
              y1={sunglassesY + sunglassesHeight / 2}
              x2={rightEyeX - sunglassesHeight / 2}
              y2={sunglassesY + sunglassesHeight / 2}
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={centerX - mouthWidth / 2}
              y1={mouthY}
              x2={centerX + mouthWidth / 2}
              y2={mouthY}
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx={leftEyeX} cy={leftEyeY} r={eyeRadius} fill="#fff" />
            <circle cx={rightEyeX} cy={rightEyeY} r={eyeRadius} fill="#fff" />
            <line
              x1={centerX - mouthWidth / 2}
              y1={mouthY}
              x2={centerX + mouthWidth / 2}
              y2={mouthY}
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  )
}

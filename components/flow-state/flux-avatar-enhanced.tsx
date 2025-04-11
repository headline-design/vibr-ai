"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"
type AvatarMood = "neutral" | "happy" | "thinking" | "focused" | "excited" | "sad"

interface FluxAvatarProps {
  size?: AvatarSize
  mood?: AvatarMood
  animate?: boolean
  className?: string
  pulseOnHover?: boolean
  onClick?: () => void
  label?: string
}

const sizeMap = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
}

const sizePxMap = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
}

export function FluxAvatar({
  size = "md",
  mood = "neutral",
  animate = true,
  className,
  pulseOnHover = true,
  onClick,
  label,
}: FluxAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(animate)
  const [isHovering, setIsHovering] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<any[]>([])
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Initialize canvas and particles
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size based on the avatar size
    const pixelSize = sizePxMap[size]

    // Set the canvas size with higher resolution for retina displays
    const scale = window.devicePixelRatio || 1
    canvas.width = pixelSize * scale
    canvas.height = pixelSize * scale
    ctx.scale(scale, scale)
    setCanvasSize({ width: pixelSize, height: pixelSize })

    // Create particles
    const particleCount = Math.floor(pixelSize / 4) // Adjust particle count based on size
    const particles = [] as any[]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * pixelSize,
        y: Math.random() * pixelSize,
        radius: Math.random() * 2 + 1,
        color: getParticleColor(mood),
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        // Add some variation to particles
        pulse: Math.random() * 0.5 + 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      }) as any
    }

    particlesRef.current = particles
  }, [size, mood])

  // Animation loop
  useEffect(() => {
    if (!isAnimating && !isHovering) return

    const animate = (time: number) => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current
        // Clear canvas
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

        // Draw avatar background with gradient
        const gradient = ctx.createRadialGradient(
          canvasSize.width / 2,
          canvasSize.height / 2,
          0,
          canvasSize.width / 2,
          canvasSize.height / 2,
          canvasSize.width / 2,
        )

        const [baseColor, gradientColor] = getAvatarGradientColors(mood)
        gradient.addColorStop(0, baseColor)
        gradient.addColorStop(1, gradientColor)

        ctx.beginPath()
        ctx.arc(canvasSize.width / 2, canvasSize.height / 2, canvasSize.width / 2 - 1, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Add subtle shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1

        // Draw particles with pulsing effect
        particlesRef.current.forEach((particle) => {
          // Update particle position
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Bounce off edges
          if (particle.x <= 0 || particle.x >= canvasSize.width) {
            particle.speedX *= -1
          }
          if (particle.y <= 0 || particle.y >= canvasSize.height) {
            particle.speedY *= -1
          }

          // Calculate pulsing opacity
          const pulsingOpacity =
            particle.opacity * (1 + 0.3 * Math.sin(time * particle.pulseSpeed + particle.pulseOffset))

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${particle.color}, ${pulsingOpacity})`
          ctx.fill()
        })

        // Reset shadow for face drawing
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // Draw avatar face based on mood
        drawFace(ctx, mood, canvasSize.width, canvasSize.height, time)
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isAnimating, isHovering, canvasSize, mood])

  // Update animation state when animate prop changes
  useEffect(() => {
    setIsAnimating(animate)
  }, [animate])

  // Helper function to get particle color based on mood
  function getParticleColor(mood: AvatarMood): string {
    switch (mood) {
      case "happy":
        return "255, 220, 100"
      case "thinking":
        return "200, 200, 200"
      case "focused":
        return "180, 120, 255"
      case "excited":
        return "255, 150, 100"
      case "sad":
        return "100, 150, 255"
      default:
        return "200, 200, 200"
    }
  }

  // Helper function to get avatar background gradient colors based on mood
  function getAvatarGradientColors(mood: AvatarMood): [string, string] {
    switch (mood) {
      case "happy":
        return ["#FFE082", "#FFD54F"]
      case "thinking":
        return ["#F5F5F5", "#E0E0E0"]
      case "focused":
        return ["#D1C4E9", "#B39DDB"]
      case "excited":
        return ["#FFCCBC", "#FFAB91"]
      case "sad":
        return ["#B3E5FC", "#81D4FA"]
      default:
        return ["#F5F5F5", "#E0E0E0"]
    }
  }

  // Helper function to draw face based on mood
  function drawFace(ctx: CanvasRenderingContext2D, mood: AvatarMood, width: number, height: number, time: number) {
    const centerX = width / 2
    const centerY = height / 2
    const scale = width / 48 // Base scale on a 48px avatar

    // Add subtle animation to face elements based on time
    const animationOffset = Math.sin(time * 0.002) * 0.5 * scale

    ctx.fillStyle = "#333"
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1.5 * scale
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Draw eyes
    const eyeY = centerY - 2 * scale
    const eyeDistance = 8 * scale

    switch (mood) {
      case "happy":
        // Smiling eyes
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Smiling mouth with subtle animation
        ctx.beginPath()
        ctx.arc(centerX, centerY + 5 * scale + animationOffset * 0.3, 6 * scale, 0.1 * Math.PI, 0.9 * Math.PI)
        ctx.stroke()
        break

      case "thinking":
        // Eyes - alert, neutral
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Eyebrows - flat and parallel, higher above eyes
        ctx.beginPath()
        ctx.moveTo(centerX - eyeDistance - 2 * scale, eyeY - 4.5 * scale)
        ctx.lineTo(centerX - eyeDistance + 2 * scale, eyeY - 4.5 * scale)
        ctx.moveTo(centerX + eyeDistance - 2 * scale, eyeY - 4.5 * scale)
        ctx.lineTo(centerX + eyeDistance + 2 * scale, eyeY - 4.5 * scale)
        ctx.stroke()

        // Mouth - flat and tight
        ctx.beginPath()
        ctx.moveTo(centerX - 5 * scale, centerY + 5.5 * scale)
        ctx.lineTo(centerX + 5 * scale, centerY + 5.5 * scale)
        ctx.stroke()
        break

      case "focused":
        // Narrowed eyes with subtle animation
        ctx.beginPath()
        ctx.ellipse(centerX - eyeDistance, eyeY, 2 * scale, 1 * scale + animationOffset * 0.2, 0, 0, Math.PI * 2)
        ctx.ellipse(centerX + eyeDistance, eyeY, 2 * scale, 1 * scale + animationOffset * 0.2, 0, 0, Math.PI * 2)
        ctx.fill()

        // Straight mouth
        ctx.beginPath()
        ctx.moveTo(centerX - 4 * scale, centerY + 5 * scale)
        ctx.lineTo(centerX + 4 * scale, centerY + 5 * scale)
        ctx.stroke()
        break

      case "excited":
        // Wide eyes with subtle animation
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 2 * scale + animationOffset * 0.2, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 2 * scale + animationOffset * 0.2, 0, Math.PI * 2)
        ctx.fill()

        // Open mouth with subtle animation
        ctx.beginPath()
        ctx.ellipse(centerX, centerY + 5 * scale, 4 * scale, 3 * scale + animationOffset * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        break

      case "sad":
        // Droopy eyes
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Sad mouth with subtle animation
        ctx.beginPath()
        ctx.arc(centerX, centerY + 9 * scale + animationOffset * 0.3, 6 * scale, 1.1 * Math.PI, 1.9 * Math.PI)
        ctx.stroke()
        break

      default:
        // Neutral eyes with subtle blinking
        const blinkOffset = Math.sin(time * 0.001) > 0.95 ? 1 : 0

        ctx.beginPath()
        ctx.ellipse(centerX - eyeDistance, eyeY, 1.5 * scale, 1.5 * scale * (1 - blinkOffset * 0.9), 0, 0, Math.PI * 2)
        ctx.ellipse(centerX + eyeDistance, eyeY, 1.5 * scale, 1.5 * scale * (1 - blinkOffset * 0.9), 0, 0, Math.PI * 2)
        ctx.fill()

        // Neutral mouth with subtle animation
        ctx.beginPath()
        ctx.moveTo(centerX - 5 * scale, centerY + 5 * scale + animationOffset * 0.2)
        ctx.lineTo(centerX + 5 * scale, centerY + 5 * scale + animationOffset * 0.2)
        ctx.stroke()
    }
  }

  return (
    <motion.div
      className={cn("relative rounded-full overflow-hidden", sizeMap[size], onClick && "cursor-pointer", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      whileHover={pulseOnHover ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 25 }}
      role={onClick ? "button" : "img"}
      aria-label={label || `Avatar with ${mood} mood`}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} aria-hidden="true" />
      {/* Add subtle ring effect */}
      <motion.div
        className="absolute inset-0 rounded-full ring-2 ring-white/10 dark:ring-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}

export default FluxAvatar

export function StaticFluxAvatar({
  size = "md",
  mood = "neutral",
  animate = true,
  className,
  pulseOnHover = true,
  onClick,
  label,
}: FluxAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(animate)
  const [isHovering, setIsHovering] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | undefined>(undefined)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pixelSize = sizePxMap[size]
    const scale = window.devicePixelRatio || 1
    canvas.width = pixelSize * scale
    canvas.height = pixelSize * scale
    ctx.scale(scale, scale)
    setCanvasSize({ width: pixelSize, height: pixelSize })
  }, [size])

  useEffect(() => {
    if (!isAnimating && !isHovering) return

    const animate = (time: number) => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (previousTimeRef.current !== undefined) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

        // Draw avatar background with gradient
        const gradient = ctx.createRadialGradient(
          canvasSize.width / 2,
          canvasSize.height / 2,
          0,
          canvasSize.width / 2,
          canvasSize.height / 2,
          canvasSize.width / 2,
        )

        const [baseColor, gradientColor] = getAvatarGradientColors(mood)
        gradient.addColorStop(0, baseColor)
        gradient.addColorStop(1, gradientColor)

        ctx.beginPath()
        ctx.arc(canvasSize.width / 2, canvasSize.height / 2, canvasSize.width / 2 - 1, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        drawFace(ctx, mood, canvasSize.width, canvasSize.height, time)
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isAnimating, isHovering, canvasSize, mood])

  useEffect(() => {
    setIsAnimating(animate)
  }, [animate])

  function getAvatarGradientColors(mood: AvatarMood): [string, string] {
    switch (mood) {
      case "happy": return ["#FFE082", "#FFD54F"]
      case "thinking":
        return ["#F5F5F5", "#E0E0E0"]
      case "focused": return ["#D1C4E9", "#B39DDB"]
      case "excited": return ["#FFCCBC", "#FFAB91"]
      case "sad": return ["#B3E5FC", "#81D4FA"]
      default: return ["#F5F5F5", "#E0E0E0"]
    }
  }

  function drawFace(ctx: CanvasRenderingContext2D, mood: AvatarMood, width: number, height: number, time: number) {
    const centerX = width / 2
    const centerY = height / 2
    const scale = width / 48
    const animationOffset = Math.sin(time * 0.002) * 0.5 * scale

    ctx.fillStyle = "#333"
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1.5 * scale
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Draw eyes
    const eyeY = centerY - 2 * scale
    const eyeDistance = 8 * scale

    switch (mood) {
      case "happy":
        // Smiling eyes
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Smiling mouth with subtle animation
        ctx.beginPath()
        ctx.arc(centerX, centerY + 5 * scale + animationOffset * 0.3, 6 * scale, 0.1 * Math.PI, 0.9 * Math.PI)
        ctx.stroke()
        break

      case "thinking":
        // Eyes - alert, neutral
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Eyebrows - flat and parallel, higher above eyes
        ctx.beginPath()
        ctx.moveTo(centerX - eyeDistance - 2 * scale, eyeY - 4.5 * scale)
        ctx.lineTo(centerX - eyeDistance + 2 * scale, eyeY - 4.5 * scale)
        ctx.moveTo(centerX + eyeDistance - 2 * scale, eyeY - 4.5 * scale)
        ctx.lineTo(centerX + eyeDistance + 2 * scale, eyeY - 4.5 * scale)
        ctx.stroke()

        // Mouth - flat and tight
        ctx.beginPath()
        ctx.moveTo(centerX - 5 * scale, centerY + 5.5 * scale)
        ctx.lineTo(centerX + 5 * scale, centerY + 5.5 * scale)
        ctx.stroke()
        break

      case "focused":
        // Narrowed eyes with subtle animation
        ctx.beginPath()
        ctx.ellipse(centerX - eyeDistance, eyeY, 2 * scale, 1 * scale + animationOffset * 0.2, 0, 0, Math.PI * 2)
        ctx.ellipse(centerX + eyeDistance, eyeY, 2 * scale, 1 * scale + animationOffset * 0.2, 0, 0, Math.PI * 2)
        ctx.fill()

        // Straight mouth
        ctx.beginPath()
        ctx.moveTo(centerX - 4 * scale, centerY + 5 * scale)
        ctx.lineTo(centerX + 4 * scale, centerY + 5 * scale)
        ctx.stroke()
        break

      case "excited":
        // Wide eyes with subtle animation
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 2 * scale + animationOffset * 0.2, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 2 * scale + animationOffset * 0.2, 0, Math.PI * 2)
        ctx.fill()

        // Open mouth with subtle animation
        ctx.beginPath()
        ctx.ellipse(centerX, centerY + 5 * scale, 4 * scale, 3 * scale + animationOffset * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        break

      case "sad":
        // Droopy eyes
        ctx.beginPath()
        ctx.arc(centerX - eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.arc(centerX + eyeDistance, eyeY, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Sad mouth with subtle animation
        ctx.beginPath()
        ctx.arc(centerX, centerY + 9 * scale + animationOffset * 0.3, 6 * scale, 1.1 * Math.PI, 1.9 * Math.PI)
        ctx.stroke()
        break

      default:

        const blinkOffset = 0

        ctx.beginPath()
        ctx.ellipse(centerX - eyeDistance, eyeY, 1.5 * scale, 1.5 * scale * (1 - blinkOffset * 0.9), 0, 0, Math.PI * 2)
        ctx.ellipse(centerX + eyeDistance, eyeY, 1.5 * scale, 1.5 * scale * (1 - blinkOffset * 0.9), 0, 0, Math.PI * 2)
        ctx.fill()

        // Neutral mouth with subtle animation
        ctx.beginPath()
        ctx.moveTo(centerX - 5 * scale, centerY + 5 * scale + animationOffset * 0.2)
        ctx.lineTo(centerX + 5 * scale, centerY + 5 * scale + animationOffset * 0.2)
        ctx.stroke()
    }
  }

  return (
    <motion.div
      className={cn("relative rounded-full overflow-hidden", sizeMap[size], onClick && "cursor-pointer", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      whileHover={pulseOnHover ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 25 }}
      role={onClick ? "button" : "img"}
      aria-label={label || `Avatar with ${mood} mood`}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} aria-hidden="true" />
      {/* Add subtle ring effect */}
      <motion.div
        className="absolute inset-0 rounded-full ring-2 ring-white/10 dark:ring-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}


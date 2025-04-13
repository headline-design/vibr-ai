// Animation constants
export const ANIMATION_DURATION = 0.5
export const ANIMATION_DELAY_INCREMENT = 0.1
export const ANIMATION_EASING = [0.4, 0, 0.2, 1] // Material Design easing

// Avatar API URL based on environment
export const AVATAR_GRADIENT_API =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://vibr.vercel.app/api/www/avatar"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? "https://vibr-git-preview-yourusername.vercel.app/api/www/avatar"
      : "/api/www/avatar"

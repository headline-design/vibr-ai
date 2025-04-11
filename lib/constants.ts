// Avatar API URL based on environment
export const AVATAR_GRADIENT_API =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://vibr.vercel.app/api/www/avatar"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? "https://vibr-git-preview-yourusername.vercel.app/api/www/avatar"
      : "/api/www/avatar"

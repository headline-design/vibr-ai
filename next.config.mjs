import { withContentlayer } from "next-contentlayer2";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ["contentlayer2"],
  images: {
    remotePatterns: [
      {
        hostname: "www.google.com",
      },
    ],
  },
};

export default withContentlayer(nextConfig);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ava07.eduno.com.br",
      },
      {
        protocol: "https",
        hostname: "ava05.eduno.com.br",
      },
      {
        protocol: "https",
        hostname: "ead.eduno.com.br",
      },
      {
        protocol: "https",
        hostname: "teste02.genora.com.br",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;

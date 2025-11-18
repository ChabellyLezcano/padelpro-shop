import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fdvwzcienajisnwbvtks.supabase.co",
        pathname: "/storage/v1/object/public/PadelProShop/**",
      },
    ],
  },
}

export default nextConfig

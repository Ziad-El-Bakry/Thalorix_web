import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://thalorix-back-end--omarshabour1.replit.app/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;

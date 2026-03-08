/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://thalorix-back-end--om8523302.replit.app/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
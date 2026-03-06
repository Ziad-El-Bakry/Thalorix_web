/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://ec2c4293-09f7-4f14-abb7-719218c2dde6-00-1i7vvmht2kv2r.worf.replit.dev/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
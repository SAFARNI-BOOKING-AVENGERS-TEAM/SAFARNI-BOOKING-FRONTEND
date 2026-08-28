/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") || "";

const nextConfig = {
  // Proxy API requests to your Express backend when a backend URL is configured.
  // Returning no rewrites keeps production builds from failing when an env file
  // has not been created yet; runtime API calls still require configuration.
  async rewrites() {
    if (!apiUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },

  images: {
    // Next.js 16 blocks optimization requests to local/private IPs by default.
    // Allow it only during local development so avatars served by the Express
    // backend (http://localhost:5000/uploads/...) can be rendered by next/image.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },

  // Environment variable available to browser-side API clients at build time.
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
  },
};

module.exports = nextConfig;

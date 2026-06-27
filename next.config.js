/** @type {import('next').NextConfig} */

// Where to proxy /api/* requests. Set API_PROXY_TARGET in each environment:
//   local dev   -> http://localhost:5000
//   production  -> https://startupforge-server.vercel.app
const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:5000'

const nextConfig = {
  // Proxy the API through this Next.js app so the browser only ever talks to the
  // client's own origin. This keeps the Better Auth session + JWT cookies
  // first-party, so they work in every browser (Safari/strict Chrome block the
  // third-party cookies you'd get when calling a separate *.vercel.app domain).
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_TARGET}/api/:path*` },
    ]
  },
};

export default nextConfig;

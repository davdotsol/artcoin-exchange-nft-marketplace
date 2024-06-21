/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages'], // Only run ESLint on the 'pages' directory during production builds (next build)
  },
};

export default nextConfig;

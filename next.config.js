/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'play.google.com' },
      { hostname: 'tools.applemediaservices.com' },
    ],
  },
};
module.exports = nextConfig;
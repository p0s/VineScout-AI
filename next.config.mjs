/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "commons.wikimedia.org",
        protocol: "https"
      }
    ]
  },
  poweredByHeader: false
};

export default nextConfig;

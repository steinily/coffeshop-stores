/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com','source.unsplash.com/','unsplash.com/','https://images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        port: '443',
        hostname: 'images.unsplash.com',
      },
    ],
  }
}
module.exports = nextConfig

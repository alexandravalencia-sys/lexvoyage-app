/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // add others you may use later (cloudinary, etc)
      // { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default nextConfig

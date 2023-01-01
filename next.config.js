/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // env: {},
  images: {
    domains: [
      "images.unsplash.com",
      "media.gettyimages.com",
      "imageio.forbes.com",
    ],
  },
};

module.exports = nextConfig;

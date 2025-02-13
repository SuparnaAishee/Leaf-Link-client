/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com", // Allow images from Cloudinary
      "cdn.pixabay.com", // Allow images from Pixabay
    ],
  },
  reactStrictMode: true, // Enable React's strict mode for additional checks
};

module.exports = nextConfig;

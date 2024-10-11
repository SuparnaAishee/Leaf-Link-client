/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com", // Allow images from Cloudinary
      "cdn.pixabay.com", // Allow images from Pixabay
    ],
  },
};

module.exports = nextConfig;

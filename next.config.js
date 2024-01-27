/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "disabilityforums.com.au",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

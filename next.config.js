/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    // Required setup for RainbowKit
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
  images: {
    domains: ["images.unsplash.com", "ipfs.io"],
  },
};

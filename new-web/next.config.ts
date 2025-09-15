import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'static.tildacdn.com' },
      { protocol: 'https', hostname: 's3.tildacdn.com' },
      { protocol: 'https', hostname: 'downloader.disk.yandex.ru' },
      { protocol: 'https', hostname: 'yastatic.net' },
    ],
  },
};

export default nextConfig;

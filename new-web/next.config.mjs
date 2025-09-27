/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.tildacdn.com' },
      { protocol: 'https', hostname: 'downloader.disk.yandex.ru' },
      { protocol: 'https', hostname: '**.yandex.net' },
    ],
  },
};

export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'plus.unsplash.com',
      'openweathermap.org',
      'unsplash.com',
      'images.unsplash.com',
      'i1.daumcdn.net',
      'k.kakaocdn.net',
      'scontent.cdninstagram.com',
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // React 19와 Next.js 15 호환성을 위해 활성화
  // DevTools 표시기 위치 설정
  devIndicators: {
    position: 'bottom-right'
  },
  // 컴파일 경고 및 에러 억제
  eslint: {
    ignoreDuringBuilds: false
  },
  typescript: {
    ignoreBuildErrors: false
  },
  // 컴파일러 최적화
  compiler: {
    removeConsole: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'search.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.daumcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'zdthxekwgqcsqryszavw.supabase.co',
      },
    ],
  },
  // React 19 및 Next.js 15 호환성 개선
  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
    webVitalsAttribution: ['CLS', 'LCP'],
    // App Router 전용 최적화
    typedRoutes: false,
  },
  // 서버 컴포넌트 외부 패키지 설정
  serverExternalPackages: [],
  // Turbopack 설정이 더 이상 next.config.mjs에서 지원되지 않음 (deprecated)
  // Webpack 최적화
  webpack: (config, { dev, isServer }) => {
    // 폰트 파일 처리 규칙 추가
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[hash][ext][query]'
      }
    })
    
    return config
  },
  // 개발 환경 최적화 - 환경 변수는 .env.local에서 처리
  // env: {} 제거 - NODE_ENV 충돌 방지
};

export default nextConfig;

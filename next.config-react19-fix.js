/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 + Quill 호환성 최적화
  experimental: {
    // React 19 Compiler 비활성화 (Quill 호환성)
    reactCompiler: false,
    // SSR 최적화
    esmExternals: 'loose',
    // 동적 import 최적화
    optimizePackageImports: ['quill', 'react-quill']
  },

  // Webpack 설정 - React 19 호환성
  webpack: (config, { isServer }) => {
    // Quill 관련 모듈 외부화
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false
      }
      
      // React 19 호환을 위한 alias
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom')
      }
      
      // Quill 최적화
      config.optimization.splitChunks.cacheGroups.quill = {
        name: 'quill',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](quill|react-quill|quill-.*)[\\/]/
      }
    }

    // ESM 모듈 지원
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    })

    return config
  },

  // 에러 최적화
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2
  },

  // 추가 최적화
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // 이미지 최적화
  images: {
    domains: [],
    unoptimized: false
  },

  // 환경변수
  env: {
    FORCE_REACT_19_COMPAT: 'true'
  }
}

module.exports = nextConfig
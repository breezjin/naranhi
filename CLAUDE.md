# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Naranhi is a Korean mental health clinic website built with Next.js 14, TypeScript, and Tailwind CSS. The site features both a hospital section and a counseling/psychological development center. The name "나란히" means "side by side" in Korean, reflecting the clinic's philosophy of standing together with patients.

## Development Commands

```bash
# Development
yarn dev            # Start development server at http://localhost:3000

# Production
yarn build          # Build for production
yarn start          # Start production server

# Code Quality
yarn lint           # Run ESLint
```

## Architecture & Structure

### App Router Structure (Next.js 14)
- Uses Next.js App Router with TypeScript
- Korean language support (`lang='ko'` in layout)
- Custom font integration (RidiBatang Korean font)
- Theme system with dark/light mode support

### Key Directories
- `src/app/` - App Router pages and API routes
- `src/components/` - Reusable React components
- `src/config/` - Site configuration and constants
- `src/lib/` - Utility functions and shared logic
- `src/styles/` - Global CSS and Tailwind styles

### Component Organization
- `components/ui/` - shadcn/ui components (Radix UI primitives)
- `components/layouts/` - Layout components (Header, Footer, Analytics)
- `components/siteHeaders/` - Navigation components
- `components/links/` - Custom link components

### Design System
- Uses shadcn/ui component library built on Radix UI
- Custom color scheme: `naranhiGreen` and `naranhiYellow` brand colors
- Tailwind CSS with custom configuration
- CSS variables for theming support
- Animation system with Framer Motion

### External Integrations
- **Notion API**: Content management for notices (`@notionhq/client`)
- **Kakao Maps**: Location services with custom SDK integration
- **Analytics**: Custom analytics implementation
- **Social Media**: Instagram, Naver Blog, Kakao Channel integration

### Key Features
- Bilingual content structure (primarily Korean)
- Mobile-responsive design with custom breakpoints
- Server-side rendering with Next.js
- Image optimization with extensive remote patterns configured
- Accessibility considerations with semantic markup

### Environment Variables Required
- `NEXT_PUBLIC_KAKAO_APP_JS_KEY` - Kakao Maps SDK
- `NEXT_PUBLIC_NOTION_SECRET_KEY` - Notion API access
- `NEXT_PUBLIC_NOTION_NOTICE_DB_ID` - Notion database ID for notices

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Includes Kakao Maps type definitions
- Next.js plugin integration

### State Management
- Zustand for client-side state management
- React Server Components for server state
- Next.js built-in caching strategies

## Development Notes

- The project follows Korean web standards and practices
- All content is in Korean language
- Uses Korean web fonts (RidiBatang)
- Mobile-first responsive design approach
- SEO optimized with Korean metadata
- Includes Korean business registration information in footer
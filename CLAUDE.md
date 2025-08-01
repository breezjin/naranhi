# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Naranhi Mental Health Clinic website - a modern, responsive website for a comprehensive mental health care facility in Korea. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Development Commands

```bash
# Development
yarn dev          # Start development server at http://localhost:3000
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint with TypeScript and custom rules

# Dependencies
yarn install      # Install all dependencies (prefer over npm install)
```

## Architecture & Key Technologies

### Core Stack
- **Next.js 15** with App Router and TypeScript
- **React 19** with TypeScript support
- **Tailwind CSS** with custom design system colors (naranhiGreen, naranhiYellow)
- **shadcn/ui + Radix UI** for accessible component primitives
- **Framer Motion + AOS** for animations and scroll effects
- **Zustand** for lightweight state management

### External Integrations
- **Notion API** - Headless CMS for dynamic notice board content
- **Kakao Maps SDK** - Korean map services (requires NEXT_PUBLIC_KAKAO_APP_JS_KEY)
- **Vercel Analytics + Speed Insights** - Performance monitoring

### Content Management
- Static content in TypeScript files (staff profiles, programs, etc.)
- Dynamic notices via Notion API integration
- Image assets organized by category in `/public` (facilities, hospital, center, staff photos)

## Project Structure

### App Router Structure
```
src/app/
├── about-hospital/     # Hospital information and staff profiles
├── hospital-programs/  # Medical services and treatment programs
├── about-center/       # Counseling center and psychological development
├── center-programs/    # Center-specific therapy services
├── facilities/         # Interactive photo galleries
├── notice/            # Dynamic notice board with [id] routes
├── contact-us/        # Contact information and Kakao Maps
└── api/               # Notion API integration routes
```

### Component Organization
```
src/components/
├── ui/                # shadcn/ui components (button, card, dialog, etc.)
├── layouts/           # Footer, Analytics, ThemeProvider, AOS setup
├── siteHeaders/       # Navigation (MainNav, SiteHeader)
└── links/             # Custom link components with different styles
```

### Configuration
- **Site config**: `src/config/site.ts` - Navigation structure and social media links
- **Theme**: Custom brand colors in `tailwind.config.js` with HSL variables
- **Component config**: `components.json` for shadcn/ui CLI

## Environment Variables

Required for full functionality:
```bash
NEXT_PUBLIC_KAKAO_APP_JS_KEY=your_kakao_maps_api_key
NEXT_PUBLIC_NOTION_SECRET_KEY=your_notion_integration_secret  # Optional
NEXT_PUBLIC_NOTION_NOTICE_DB_ID=your_notion_database_id      # Optional
```

## Development Patterns

### Component Development
- Use TypeScript for all components
- Follow shadcn/ui patterns for new UI components
- Use Tailwind CSS with custom design system colors
- Ensure responsive design (mobile-first approach)
- Include proper accessibility with ARIA labels

### Content Updates
- Staff profiles: Edit `src/app/about-hospital/staffs.ts` or `src/informations/staffs.ts`
- Programs: Update respective page components in app router
- Site navigation: Modify `src/config/site.ts`
- Static images: Add to appropriate `/public` subdirectory

### API Integration
- Notion notices: `src/app/api/notice/route.ts` handles the integration
- Notice pages use dynamic routing with `[id]` parameter
- Graceful fallbacks when environment variables are missing

## Code Quality Setup
- ESLint with TypeScript, React, and custom rules
- Prettier with Tailwind CSS plugin for consistent formatting
- Husky pre-commit hooks for automated quality checks
- Import sorting and unused import removal


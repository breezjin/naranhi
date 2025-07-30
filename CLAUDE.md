# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Naranhi Mental Health Clinic website (나란히정신건강의학과의원) - a Next.js 14 application for a mental health clinic in Korea. The site features information about the hospital, staff, facilities, and various mental health programs.

## Development Commands

- `yarn dev` - Start development server on http://localhost:3000
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Architecture & Structure

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: Zustand
- **Animations**: Framer Motion, AOS (Animate On Scroll)
- **Maps**: Kakao Maps SDK
- **CMS**: Notion API for notices/announcements
- **Analytics**: Vercel Analytics & Speed Insights

### Key Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/ui/` - Reusable UI components (buttons, dialogs, etc.)
- `src/components/layouts/` - Layout components (header, footer, theme)
- `src/components/siteHeaders/` - Navigation components
- `src/config/site.ts` - Site configuration including navigation structure
- `src/lib/` - Utilities, fonts, and shared functions
- `public/` - Static assets organized by content type

### Core Features
- **Multi-page site** with hospital info, programs, facilities, staff, notices
- **Kakao Maps integration** for location services
- **Notion CMS** for dynamic notice/announcement content
- **Responsive design** with dark/light theme support
- **Image galleries** for facilities and staff photos
- **PDF document serving** for patient reviews

### Important Notes
- Uses Korean language throughout (lang="ko")
- Requires `NEXT_PUBLIC_KAKAO_APP_JS_KEY` environment variable for maps
- Custom font loading with Ridibatang Korean font
- Notion integration requires proper API setup for notices
- Site config in `src/config/site.ts` defines main navigation structure
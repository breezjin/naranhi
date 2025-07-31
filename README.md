# 나란히정신건강의학과의원 (Naranhi Mental Health Clinic)

> 함께 서있지만 너무 가깝지 않고, 또 너무 멀지도 않게, 나란히.  
> *Together, but not too close, nor too far apart, side by side.*

A modern, responsive website for Naranhi Mental Health Clinic - a comprehensive mental health care facility in Korea offering psychiatric services, counseling, and psychological development programs.

## ✨ Features

### 🏥 Core Clinic Features
- **Hospital Information** - Comprehensive clinic overview and philosophy
- **Medical Programs** - Detailed psychiatric and medical service offerings
- **Counseling & Psychological Development Center** - Specialized therapy services
- **Facilities Gallery** - Interactive photo galleries of clinic facilities
- **Staff Profiles** - Meet our qualified medical professionals
- **Notice Board** - Dynamic announcements powered by Notion CMS

### 🌐 Technical Features
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Interactive Maps** - Kakao Maps integration for location services
- **Modern UI Components** - Built with Radix UI and shadcn/ui components
- **Smooth Animations** - Framer Motion and AOS (Animate On Scroll) effects
- **Performance Optimized** - Next.js 14 with App Router and Vercel Analytics
- **SEO Friendly** - Comprehensive meta tags and sitemap generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Kakao Maps API key (for location services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd naranhi
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_KAKAO_APP_JS_KEY=your_kakao_maps_api_key
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production


yarn build
yarn start


## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with TypeScript support
- **TypeScript** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **shadcn/ui** - Re-usable component library
- **Framer Motion** - Animation library
- **AOS** - Animate On Scroll library

### State & Data Management
- **Zustand** - Lightweight state management
- **Notion API** - Headless CMS for dynamic content
- **Axios** - HTTP client for API requests

### Maps & Integrations
- **Kakao Maps SDK** - Korean map services
- **React Kakao Maps SDK** - React wrapper for Kakao Maps

### Development Tools
- **ESLint** - Code linting with custom rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality control
- **TypeScript** - Static type checking

### Analytics & Performance
- **Vercel Analytics** - Web analytics
- **Vercel Speed Insights** - Performance monitoring
- **Sharp** - Image optimization

## 📁 Project Structure


src/
├── app/                    # Next.js App Router pages
│   ├── about-hospital/     # Hospital information
│   ├── hospital-programs/  # Medical services
│   ├── about-center/       # Counseling center
│   ├── facilities/         # Facility galleries
│   ├── notice/            # Notice board with [id] routes
│   ├── contact-us/        # Contact & location info
│   └── api/               # API routes (Notion integration)
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layouts/           # Layout components (header, footer)
│   └── siteHeaders/       # Navigation components
├── config/
│   └── site.ts           # Site configuration & navigation
├── lib/                  # Utilities and shared functions
├── types/                # TypeScript type definitions
└── styles/               # Global CSS styles

public/
├── imgs/                 # Static images and assets
├── facilities/           # Facility photos
├── hospital/             # Hospital photos
├── center/              # Center photos
├── staffs/              # Staff profile photos
├── icons/               # Social media and UI icons
└── reviews/             # Patient review PDFs


## 🔧 Configuration

### Site Configuration
Main navigation and site settings are configured in `src/config/site.ts`:


export const siteConfig = {
  name: '나란히정신건강의학과의원',
  description: '함께 서있지만 너무 가깝지 않고, 또 너무 멀지도 않게, 나란히.',
  mainNav: [
    { title: '병원소개', href: '/about-hospital' },
    { title: '병원 진료안내', href: '/hospital-programs' },
    // ... more navigation items
  ],
  // ... social media links and other config
}


### Theme Configuration
The application supports dark/light themes configured in `tailwind.config.js` with custom color schemes:

- `naranhiGreen` - Primary brand color
- `naranhiYellow` - Secondary brand color
- Custom HSL color system for theme switching

### Environment Variables
Required environment variables:


NEXT_PUBLIC_KAKAO_APP_JS_KEY=your_kakao_maps_js_key


## 🏃‍♂️ Development

### Available Scripts


yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint


### Code Quality
The project includes comprehensive linting and formatting:

- **ESLint** with TypeScript, React, and custom rules
- **Prettier** with Tailwind CSS plugin
- **Husky** pre-commit hooks
- **Import sorting** and unused import removal

### Adding New Pages
1. Create page component in `src/app/[page-name]/page.tsx`
2. Add navigation entry to `src/config/site.ts`
3. Update sitemap generation in `src/app/sitemap.ts`

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code patterns and conventions
   - Use TypeScript for type safety
   - Follow the established component structure
   - Ensure responsive design principles

4. **Test your changes**
   ```bash
   yarn build  # Verify production build
   yarn lint   # Check code quality
   ```

5. **Commit and push**
   ```bash
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

### Code Style Guidelines
- Use TypeScript for all new components
- Follow existing naming conventions (camelCase for functions, PascalCase for components)
- Use Tailwind CSS for styling
- Ensure accessibility with proper ARIA labels
- Optimize images and assets
- Follow Korean language conventions for user-facing text

### Component Development
- Use shadcn/ui components as base
- Follow the existing component structure in `src/components/ui/`
- Ensure responsive design (mobile-first approach)
- Include proper TypeScript types
- Use Framer Motion for animations when appropriate

## 📄 License

This project is developed for Naranhi Mental Health Clinic. All rights reserved.

## 🙏 Acknowledgments

- **shadcn/ui** - For the excellent component library
- **Radix UI** - For accessible UI primitives
- **Vercel** - For hosting and analytics
- **Kakao** - For mapping services
- **Notion** - For content management capabilities

---

For development questions or support, please refer to the existing codebase patterns and component implementations.

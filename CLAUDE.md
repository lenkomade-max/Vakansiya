# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vakansiya.az** is an Azerbaijani job portal with a unique dual offering:
1. **Vakansiyalar** - Traditional full-time job listings
2. **Gündəlik İşlər** - Short-term/gig work marketplace (FIRST IN AZERBAIJAN MARKET - key differentiator)

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Material Tailwind

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm start               # Start production server
npm run lint            # ESLint
npm run type-check      # TypeScript type checking
```

## Architecture Overview

### Critical Routing Rules

**IMPORTANT:** There are known inconsistencies documented in `SUMMARY_PROBLEMY.md`. When working on navigation/links:

**Correct routes:**
- `/` - Homepage
- `/vakansiyalar` - Job listings catalog
- `/vakansiyalar/[id]` - Job detail
- `/gundelik-isler` - Short jobs catalog (NOT `/short-jobs`)
- `/gundelik-isler/[id]` - Short job detail
- `/companies` - Companies catalog
- `/companies/[id]` - Company profile
- `/post-job` - Post job page (NOT `/vakansiyalar/yeni`)
- `/about` - About page
- `/contact` - Contact page

**Known issues to fix:**
- Navigation.tsx uses `/short-jobs` instead of `/gundelik-isler` (lines 48, 128)
- Logo in Navigation.tsx is not clickable (should link to `/`)
- Many pages use console.log in `handlePostJob` instead of `router.push('/post-job')`
- Footer links inconsistent across pages - see SUMMARY_PROBLEMY.md for details

### Project Structure

```
app/
├── page.tsx                      # Homepage with job listings
├── vakansiyalar/
│   ├── page.tsx                  # Job catalog
│   ├── [id]/page.tsx            # Job detail
│   └── layout.tsx
├── gundelik-isler/               # Short-term gig work (UNIQUE FEATURE)
│   ├── page.tsx                  # Short jobs catalog
│   ├── [id]/page.tsx            # Short job detail
│   └── layout.tsx
├── companies/
│   ├── page.tsx                  # Companies catalog
│   ├── [id]/page.tsx            # Company profile
│   └── layout.tsx
├── post-job/page.tsx            # Unified job posting (tabs for both types)
├── about/page.tsx
└── contact/page.tsx

components/
├── ui/                          # Core UI components
│   ├── Navigation.tsx           # Main navigation (has known issues)
│   ├── SearchBar.tsx            # Search with filters
│   ├── FilterModal.tsx
│   ├── ContactModal.tsx
│   └── Button.tsx
├── job/                         # Regular job components
│   ├── JobCard.tsx
│   └── JobCardFeatured.tsx      # Premium jobs with gradient backgrounds
├── short-jobs/                  # Short-term work components
│   ├── ShortJobCard.tsx
│   └── CategoryIcons.tsx        # 10 category icons with config
├── company/
│   └── CompanyCard.tsx
└── ads/
    └── AdCard.tsx               # Google AdSense placeholder
```

### Import Aliases

Always use `@/` for project root imports:
```typescript
import Navigation from '@/components/ui/Navigation'
import { CategoryIcon } from '@/components/short-jobs/CategoryIcons'
```

### Gündəlik İşlər (Short Jobs) - Core Feature

**10 predefined categories** in `components/short-jobs/CategoryIcons.tsx`:
- `transport` - Nəqliyyat (taxi, courier, drivers)
- `construction` - Tikinti (builders, electricians, plumbers)
- `cleaning` - Təmizlik (cleaning services)
- `garden` - Bağçılıq (gardening)
- `restaurant` - Restoran (waiters, kitchen staff)
- `events` - Tədbir və reklam (event staff, promoters)
- `warehouse` - Anbar (warehouse workers)
- `office` - Ofis (office helpers)
- `creative` - Yaradıcılıq (photographers, designers)
- `services` - Xidmətlər (repair, handyman)

Each category has: icon component, color, bgColor, and Azerbaijani name.

**Key differentiators from regular jobs:**
- No resume required
- Direct contact (phone/WhatsApp)
- Hourly/daily pay (always shown)
- Date when work starts (not posting date)
- Simpler, faster workflow

Full concept documentation: `GUNDELIK_ISLER_PLAN.md`

## Design System

**Philosophy:** 90% neutral (black/white/gray) + 10% colored accents

### Colors (tailwind.config.js)

```javascript
// Neutral base (use these 90% of the time)
white, black
gray: 50, 100, 200, 400, 700, 900

// Accent colors (use sparingly for emphasis)
accent-primary: #3B82F6      // Blue - buttons, links
accent-success: #10B981      // Green - status indicators
accent-warning: #F59E0B      // Orange - premium features
accent-danger: #EF4444       // Red - destructive actions
accent-info: #8B5CF6         // Purple - info badges

// Category gradients (for premium job cards only)
category.it, category.marketing, category.design, category.sales, category.management
```

### Typography

- **Font:** Poppins (loaded via next/font/google)
- **Language:** All UI text in Azerbaijani (az-AZ)
- Defined font sizes with line heights in tailwind.config.js

### Custom Utility Classes (globals.css)

- `.btn-primary`, `.btn-secondary`, `.btn-accent` - Button styles
- `.container-main` - Main content container
- `.card-job`, `.card-featured` - Job card variants

## Current Implementation State

### Working Features
- ✅ All page routes created and rendering
- ✅ Navigation, search bar, modals
- ✅ Job cards (regular + featured with gradient backgrounds)
- ✅ Short job cards with category icons
- ✅ Company cards
- ✅ Responsive mobile-first design
- ✅ Infinite scroll on homepage

### Using Mock Data
Currently using generated fake data:
- `generateJobs()` - Creates job listings in pages
- `generateShortJobs()` - Creates short job listings

**Backend NOT implemented yet.** Environment variables defined in `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=           # Planned Supabase database
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=                 # Planned AI job standardization
BREVO_API_KEY=                      # Planned email service
NEXT_PUBLIC_SITE_URL=
```

### Advertisement Integration (Planned)
- `AdCard` component ready
- `injectAds()` utility inserts ads at positions 7, 15, 23, 31...
- Not connected to actual AdSense account yet
- See: `REKLAMA_INTEGRATION.md`

## Navigation Patterns

### Next.js App Router
```typescript
'use client'
import { useRouter } from 'next/navigation'  // NOT 'next/router'

const router = useRouter()
router.push('/vakansiyalar')
```

### State Management
- No global state library (Redux/Zustand)
- Local state with React hooks
- Props drilling from pages to components

## Common Development Tasks

### Adding a New Page
1. Create `app/route-name/page.tsx`
2. Add optional `layout.tsx` for nested routes
3. Use `'use client'` directive if using client-side hooks
4. Update navigation links if needed

### Adding a New Component
1. Choose category: `ui/`, `job/`, `short-jobs/`, `company/`, `ads/`
2. Create TypeScript file with interface for props
3. Export component and types
4. Import using `@/components/...`

### Styling Guidelines
- Prefer Tailwind utility classes over custom CSS
- Use design tokens from `tailwind.config.js`
- Follow 90-10 color rule (neutral base + accent highlights)
- Mobile-first approach (base styles for mobile, then `md:` and `lg:` breakpoints)

### TypeScript
- Strict mode enabled (`tsconfig.json`)
- Always define interfaces for component props
- Export types when reused across files

## Known Issues & Technical Debt

**CRITICAL** - See `SUMMARY_PROBLEMY.md` for complete list (30 issues documented):

**Navigation Issues (High Priority):**
1. Navigation.tsx: `/short-jobs` should be `/gundelik-isler` (lines 48, 128)
2. Logo not clickable (should wrap in `<a href="/">`)
3. Multiple pages use `console.log` in `handlePostJob` instead of routing to `/post-job`

**Footer Inconsistencies (Medium Priority):**
- "Vakansiyalar" link varies across pages (should always be `/vakansiyalar`)
- "Elan yerləşdir" link varies (should always be `/post-job`)
- `/pricing` page referenced but doesn't exist

**Estimated fix time:** 2-3 hours for critical issues

## Important Context for AI Assistants

### When working on this codebase:
1. **DO NOT** create new pages unnecessarily - structure is complete
2. **DO** check `SUMMARY_PROBLEMY.md` before modifying navigation/links
3. **DO** use `useRouter` from `next/navigation` (NOT `next/router`)
4. **DO** maintain the Azerbaijani language for all UI text
5. **DO** follow the 90-10 color philosophy
6. **DO NOT** change the design system - focus on functionality fixes
7. **DO** ask for clarification if routing behavior seems inconsistent

### Key Documentation References
- **Full feature roadmap:** `PLAN_REALIZACII.md`
- **Short jobs concept:** `GUNDELIK_ISLER_PLAN.md`
- **Known issues:** `SUMMARY_PROBLEMY.md`
- **Ad integration:** `REKLAMA_INTEGRATION.md`
- **Current state docs:** `docs/current/` directory

### Material Tailwind Integration
Configured in `tailwind.config.js`:
```javascript
const withMT = require("@material-tailwind/react/utils/withMT");
```
Use sparingly for complex components only.

## Testing & Quality

### Manual Testing Checklist
When making changes to navigation/routing:
1. Test logo click → goes to `/`
2. Test "Gündəlik işlər" link → goes to `/gundelik-isler`
3. Test "Elan yerləşdir" button → goes to `/post-job`
4. Test job card click → goes to `/vakansiyalar/[id]`
5. Test short job card click → goes to `/gundelik-isler/[id]`
6. Verify footer links are consistent
7. Test on mobile viewport

### Build Verification
Always run before committing significant changes:
```bash
npm run type-check && npm run build
```

## Deployment

**Platform:** Vercel (auto-deploy from repo)
- Automatically detects Next.js
- No special configuration needed
- Environment variables set in Vercel dashboard

---

**Last Updated:** December 2024
**Project Status:** MVP Complete - Fixing Navigation Issues

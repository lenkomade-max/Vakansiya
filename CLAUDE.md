# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vakansiya.az** is an Azerbaijani job portal with a unique dual offering:
1. **Vakansiyalar** - Traditional full-time job listings
2. **Gündəlik İşlər** - Short-term/gig work marketplace (FIRST IN AZERBAIJAN MARKET - key differentiator)

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Material Tailwind, Supabase (PostgreSQL), OpenRouter AI

**Current Status:** Full-stack implementation with AI moderation system

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

## Backend Architecture (IMPLEMENTED)

### Supabase + Server Actions

**Database:** PostgreSQL via Supabase
**API Pattern:** Next.js 15 Server Actions (`'use server'`)

**Key Tables:**
- `jobs` - All job postings (vakansiya + gündəlik)
- `profiles` - User profiles with role (admin/user)
- `moderation_logs` - Admin moderation actions

**Important:** All database operations use Server Actions, NOT API routes!

### Authentication & Authorization
```typescript
// lib/supabase/server.ts - Server-side Supabase client
import { createClient } from '@/lib/supabase/server'

// Always check auth in Server Actions
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

**Admin Check:**
```typescript
import { isAdmin } from '@/lib/api/moderation'
const admin = await isAdmin() // Checks profiles.role === 'admin'
```

### Environment Variables (REQUIRED)

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

**AI Moderation:**
```
OPENROUTER_API_KEY=sk-or-v1-xxx  # CRITICAL - платная модель DeepSeek
```

**Site URL:**
```
NEXT_PUBLIC_SITE_URL=https://vakansiya.az  # For OpenRouter headers
```

## 🤖 AI MODERATION SYSTEM (КРИТИЧНАЯ СИСТЕМА)

### Overview

**90% автоматических решений** - только сложные случаи идут на manual review.

**Двухуровневая система:**
1. **Rules-based** (`lib/moderation/rules.ts`) - быстрые keyword/pattern проверки
2. **AI-based** (`lib/moderation/ai.ts`) - глубокий контекстный анализ

### Модели AI

**Primary:** `deepseek/deepseek-r1` (ПЛАТНАЯ, с reasoning)
- 671B параметров
- Показывает рассуждения (reasoning)
- Идеально для детекта скама

**Fallback:** `deepseek/deepseek-chat` (ПЛАТНАЯ, быстрая)
- Используется если primary упал

**ВАЖНО:** FREE модели НЕ работают (429 rate limit, 404)! Только ПЛАТНЫЕ!

### Workflow Модерации

```
1. Пользователь создает объявление
   ↓
2. Rules check (keywords, patterns)
   - Critical flags (мат, fraud) → AUTO REJECT
   - Low score (<40) → AUTO REJECT
   - Все остальное → AI REVIEW
   ↓
3. AI Review (DeepSeek R1)
   - Анализирует ВЕСЬ текст
   - Находит скам даже в длинных описаниях
   - Confidence >= 0.9 → AUTO DECISION
   - Confidence < 0.9 → MANUAL REVIEW
   ↓
4. Если AI упал → status: 'pending_moderation'
   ↓
5. Retry Queue обрабатывает pending_moderation
   - Vercel Cron (каждую ночь в 00:00)
   - Админ вручную (кнопка "Yenidən yoxla")
```

### Job Statuses

- `pending_review` - ждет ручной проверки админа (AI не уверен)
- `pending_moderation` - ждет retry (AI упал)
- `active` - одобрено, показывается на сайте
- `rejected` - отклонено (скам/мат)
- `inactive` - пауза (пользователь отключил)
- `expired` - истек срок

### AI Capabilities (ЧТО УМЕЕТ AI)

**1. Детект скама:**
- Prepayment scams ("qeydiyyat üçün ödəniş")
- Pyramid schemes (MLM, "dostlarını gətir")
- Unrealistic promises ("günə 200 AZN")

**2. Проверка мата:**
- Контекстная проверка (отличает "IT" от мата)
- Азербайджанский + Русский
- False positives отправляет на одобрение

**3. Автофикс названий:**
```typescript
// Input: "iş" или "+++" или "vakansiya"
// AI Output: "Frontend Developer" или "Satış meneceri"
```

**4. Определение типа работы:**
```typescript
// Анализирует контекст:
// "günlük 50 AZN, bir dəfəlik" → jobType: "gundelik"
// "aylıq 2000 AZN, daimi" → jobType: "vakansiya"
```

### Critical Files

**Moderation Logic:**
- `lib/moderation/rules.ts` - Rules-based модерация (90% фильтрация)
- `lib/moderation/ai.ts` - AI модерация (DeepSeek R1/Chat)
- `lib/moderation/keywords.ts` - Keywords для spam/fraud/profanity

**Server Actions:**
- `lib/api/jobs.ts` - createJob() с модерацией
- `lib/api/moderation.ts` - Admin functions (approve/reject)

**Retry Queue:**
- `app/api/admin/retry-moderation/route.ts` - Endpoint для retry
- `vercel.json` - Cron job config (0 0 * * *)

**Admin Panel:**
- `app/admin/moderation/page.tsx` - Админка с фильтрами и retry кнопкой

### Debugging Moderation

**Vercel Runtime Logs:**
```
[createJob] Running moderation...
[createJob] Moderation result: { approved: true, score: 100 }
[AI Moderation] Model: deepseek/deepseek-r1
[AI Moderation] Response status: 200
[AI Moderation] AI response content: {...}
[createJob] AUTO APPROVE by AI (confidence: 0.95)
```

**Supabase Columns:**
- `rules_moderation_result` - JSON с флагами и score
- `ai_moderation_result` - JSON с AI decision
- `ai_checked_at` - Timestamp когда AI проверял

**Common Issues:**
1. "AI moderation failed" → проверь OPENROUTER_API_KEY в Vercel
2. "429 rate limit" → используешь free модель (нужна платная)
3. "404 no endpoints" → неправильное имя модели

### Testing Moderation

**Test Plan:** `TESTING_PLAN.md` - подробные сценарии

**Quick Test:**
1. Создай объявление с текстом из TESTING_PLAN.md
2. Смотри Vercel Runtime Logs
3. Проверь статус в админке

**Scam Test:**
```
Title: İş imkanı
Description: Günə 200 AZN! Qeydiyyat üçün 20 AZN ödəyin.
Expected: AI rejects with confidence 0.95+
```

## Current Implementation State

### Working Features
- ✅ Full backend (Supabase + Server Actions)
- ✅ AI moderation system (DeepSeek R1)
- ✅ Retry queue (Vercel Cron + manual button)
- ✅ Admin panel с фильтрами
- ✅ Auto-fix job titles
- ✅ Auto-detect job type (vakansiya/gundelik)
- ✅ All page routes created and rendering
- ✅ Navigation, search bar, modals
- ✅ Job cards (regular + featured with gradient backgrounds)
- ✅ Short job cards with category icons
- ✅ Company cards
- ✅ Responsive mobile-first design

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

## Development Workflow

### Git Workflow

**Branches:**
- `main` - Production (auto-deploys to Vercel)
- `feature/supabase-auth` - Feature branches

**Commit Process:**
```bash
# Работаем в feature ветке
git checkout feature/supabase-auth
git add -A
git commit -m "Описание изменений"

# Когда готово к продакшену - мержим в main
git checkout main
git merge feature/supabase-auth
git push origin main  # Vercel auto-deploys
```

**Commit Message Style:**
```
✅ FIX: Описание бага
✨ FEATURE: Новая функция
🤖 AI: Изменения в AI модерации
📝 DOCS: Документация
```

**ВАЖНО:** Всегда тестируй билд перед пушем:
```bash
npx tsc --noEmit  # TypeScript check
```

### Vercel Deployment

**Auto-deploy:**
- Push в `main` → автоматический деплой
- Preview deployments для feature branches

**После деплоя ОБЯЗАТЕЛЬНО:**
1. Проверь **Environment Variables** в Vercel:
   - `OPENROUTER_API_KEY` - должен быть заполнен!
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Проверь **Cron Jobs**:
   - Должен быть job `retry-moderation`
   - Schedule: `0 0 * * *` (каждую ночь)

3. Проверь **Runtime Logs**:
   - При создании объявления смотри логи AI модерации
   - Ищи ошибки API keys

### Supabase Migrations

**Когда меняешь схему БД:**

1. Создай миграцию в `supabase/migrations/XXX_description.sql`
2. Запусти в Supabase Dashboard → SQL Editor
3. Или через CLI: `supabase db push`

**Пример:**
```sql
-- supabase/migrations/004_add_pending_moderation_status.sql
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check
    CHECK (status IN ('pending_review', 'pending_moderation', 'active', 'inactive', 'expired', 'rejected'));
```

### TypeScript Best Practices

**Всегда определяй типы:**
```typescript
// ❌ BAD
const result = await someFunction()

// ✅ GOOD
const result: AIReviewResult = await someFunction()
```

**Обновляй типы при изменении:**
```typescript
// Если добавляешь новый статус:
// 1. Обнови тип Job
status: 'pending_review' | 'pending_moderation' | 'active' | ...

// 2. Обнови функции
getAllJobs(statusFilter?: 'all' | 'pending_moderation' | ...)

// 3. Обнови переменные
let finalStatus: 'pending_review' | 'pending_moderation' | ...

// 4. Обнови SQL миграцию
ALTER TABLE jobs ADD CONSTRAINT ...
```

## Deployment

**Platform:** Vercel (auto-deploy from main)
- Production: https://vakansiya.az (main branch)
- Hobby Plan: 1 cron job per day limit
- Environment variables set in Vercel Dashboard

**Critical Settings:**
1. **Environment Variables:**
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxx  # MUST BE SET!
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   NEXT_PUBLIC_SITE_URL=https://vakansiya.az
   ```

2. **Cron Jobs:**
   ```json
   {
     "crons": [{
       "path": "/api/admin/retry-moderation",
       "schedule": "0 0 * * *"  // Daily at midnight (Hobby limit)
     }]
   }
   ```

3. **Build Settings:**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`

## Troubleshooting

### "AI moderation failed"
1. Проверь OPENROUTER_API_KEY в Vercel env vars
2. Проверь что используешь ПЛАТНЫЕ модели (deepseek/deepseek-r1, НЕ :free)
3. Смотри Vercel Runtime Logs для деталей

### "Type error: pending_moderation not assignable"
1. Обнови ВСЕ места где есть статусы:
   - `Job` type (lib/api/jobs.ts)
   - `getAllJobs` parameter (lib/api/moderation.ts)
   - `statusFilter` useState (app/admin/moderation/page.tsx)
   - `finalStatus` variable (lib/api/jobs.ts)
2. Запусти SQL миграцию в Supabase

### "Cron job runs more than once per day"
- Vercel Hobby план разрешает только daily crons
- Измени `"0 * * * *"` на `"0 0 * * *"` в vercel.json

### Build Fails
```bash
# Проверь TypeScript ошибки:
npx tsc --noEmit

# Проверь что все env переменные в .env.local
cat .env.local | grep OPENROUTER
```

## Important Principles

### DO:
- ✅ Всегда используй Server Actions (`'use server'`)
- ✅ Всегда логируй AI результаты (`console.log('[AI Moderation] ...')`)
- ✅ Всегда проверяй типы перед коммитом
- ✅ Всегда тестируй модерацию с TESTING_PLAN.md
- ✅ Всегда мержи в main только после проверки

### DON'T:
- ❌ НЕ используй free AI модели (не работают!)
- ❌ НЕ обновляй схему БД без миграции
- ❌ НЕ коммить без TypeScript check
- ❌ НЕ пушить в main без тестов
- ❌ НЕ забывай про env variables в Vercel

### AI Moderation Specifics:
- 🤖 AI должен проверять ВЕСЬ текст, даже длинные описания
- 🤖 AI исправляет тупые названия ("iş" → "Frontend Developer")
- 🤖 AI определяет тип работы (vakansiya/gundelik)
- 🤖 Keywords не должны создавать false positives (убрали "it")
- 🤖 Profanity идет на AI review, не auto-reject
- 🤖 Retry queue обрабатывает упавшие модерации

---

**Last Updated:** January 2025
**Project Status:** Full-stack MVP with AI Moderation - WORKING

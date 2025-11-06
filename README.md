## Changelog (ключевые актуализации)

- Navigation: исправлены классы и onClick для кнопок; актуальная ссылка на размещение — `/post-job`. См. коммит `cbd743bab3c405aaba39dbc3d1161293bb172639`.
- В этом каталоге создана «актуальная» документация, не затрагивающая старые файлы.

## Gündəlik İşlər — практическое ядро (по коду)

Мини-выжимка из `GUNDELIK_ISLER_PLAN.md`, соответствующая текущей реализации.

### Что есть в коде
- Маршруты: `/gundelik-isler`, `/gundelik-isler/[id]`
- Компоненты: `ShortJobCard.tsx`, `CategoryIcons.tsx`
- Единые правила навигации: см. `Navigation-and-Links.md`

### Что ещё планируется
Полная концепция, категории, UX-детали — см. корневой `GUNDELIK_ISLER_PLAN.md`.

## Реализовано vs Запланировано

Только факты из кода → «Реализовано». Остальное — «Запланировано» и хранится в исходных документах.

### Реализовано (по коду)
- Маршруты: см. `docs/current/Routes.md`
- Компоненты: см. `docs/current/Components.md`
- Базовая навигация, поиск, карточки, модалки, AdCard

### Запланировано (ссылки на исходные документы)
- Полный функционал фильтров, профили, админка, платежи и т.д. — см. `PLAN_REALIZACII.md`
- Полная концепция Gündəlik İşlər — см. `GUNDELIK_ISLER_PLAN.md`
- Интеграция рекламы — детали в `REKLAMA_INTEGRATION.md`

## Нативная реклама (текущее состояние)

База на `REKLAMA_INTEGRATION.md`. В коде есть:
- `components/ads/AdCard.tsx`
- утилита `injectAds` для вставки рекламы через каждые N элементов

Осталось подключить:
- переменные окружения (`NEXT_PUBLIC_ADSENSE_CLIENT`, слоты)
- `<Script>` в `app/layout.tsx`
- использование на страницах каталогов

Подробности: см. корневой `REKLAMA_INTEGRATION.md`.

## Навигация и правила ссылок

Единые правила, чтобы не было расхождений между страницами.

### Хедер
- "Gündəlik işlər" → `/gundelik-isler`
- Логотип кликабелен → `/`
- Кнопка "Elan yerləşdir" → `/post-job`

### Футер
- "Vakansiyalar" → `/vakansiyalar`
- "Elan yerləşdir" → `/post-job`
- Ссылка на `/pricing` использовать только если страница создана. Сейчас страницы нет.

### Известные несоответствия (из `SUMMARY_PROBLEMY.md`)
- В `Navigation.tsx`: заменить `/short-jobs` на `/gundelik-isler`; обернуть логотип в ссылку `/`
- На ряде страниц `handlePostJob` должен вести на `/post-job` вместо логов/`/vakansiyalar/yeni`
- Привести footer-ссылки к правилам выше

## Компоненты (по коду `components/`)

### UI (`components/ui`)
- `Navigation.tsx` — верхняя навигация
- `SearchBar.tsx` — поиск
- `FilterModal.tsx` — модалка фильтров
- `ContactModal.tsx` — модалка контактов
- `Button.tsx` — кнопка

### Вакансии (`components/job`)
- `JobCard.tsx`
- `JobCardFeatured.tsx`

### Короткие работы (`components/short-jobs`)
- `ShortJobCard.tsx`
- `CategoryIcons.tsx`

### Компании (`components/company`)
- `CompanyCard.tsx`

### Реклама (`components/ads`)
- `AdCard.tsx` + утилита `injectAds`

## Реальные маршруты (по коду `app/`)

- `/` — главная (`app/page.tsx`)
- `/vakansiyalar` — каталог вакансий (`app/vakansiyalar/page.tsx`)
- `/vakansiyalar/[id]` — детальная вакансия (`app/vakansiyalar/[id]/page.tsx`)
- `/gundelik-isler` — каталог коротких работ (`app/gundelik-isler/page.tsx`)
- `/gundelik-isler/[id]` — детальная короткая работа (`app/gundelik-isler/[id]/page.tsx`)
- `/companies` — каталог компаний (`app/companies/page.tsx`)
- `/companies/[id]` — детальная компания (`app/companies/[id]/page.tsx`)
- `/post-job` — размещение объявления (`app/post-job/page.tsx`)
- `/about` — о нас (`app/about/page.tsx`)
- `/contact` — контакты (`app/contact/page.tsx`)
- `/test` — тестовая (`app/test/page.tsx`)

Страницы `layout.tsx` присутствуют для разделов с несколькими страницами.

## Vakansiya.az — актуальный обзор

— Единый источник правды по текущему состоянию. Только то, что реально есть в коде. Планы и идеи остаются в корневых документах и упоминаются ссылками.

### Запуск

```bash
npm install
npm run dev
# http://localhost:3000
```

### Технологии
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Vercel (хостинг)

### Реализовано (по коду)
- Страницы: главная, вакансии, детальная вакансия, gündəlik işlər (каталог и детальная), компании (каталог и детальная), постинг вакансии, about, contact, test
- Компоненты: навигация, поиск, карточки вакансий/коротких работ/компаний, модалки, фильтры, базовый AdCard

### Ссылки на исходники
- Маршруты: см. `docs/current/Routes.md`
- Компоненты: см. `docs/current/Components.md`
- Навигация и правила ссылок: см. `docs/current/Navigation-and-Links.md`
- Реклама: см. `docs/current/Adsense.md`
- Реализовано vs План: см. `docs/current/Implemented-vs-Planned.md`

# Vakansiya.az - Job Portal for Azerbaijan

> Modern job search platform built with Next.js 15, TypeScript, and Tailwind CSS

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lenkomade-max/Vakansiya)

## 🚀 Quick Start

### For Vercel Deployment

**Easy:** Just connect this repo to Vercel and click Deploy!

Vercel will **automatically detect** Next.js and use optimal settings.

**No configuration needed!** ✨

### Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 🎨 Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript & Tailwind CSS
- ✅ Modern white design with colored accents (90-10 rule)
- ✅ Responsive UI components
- ✅ Azerbaijani language interface
- ✅ Job cards (regular + Featured/Premium with gradients)
- ✅ Search with quick filters
- ✅ Mobile-first design

## 🛠 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** (planned) - Backend
- **Vercel** - Hosting

## 📦 Build Commands

```bash
npm run dev         # Development server
npm run build       # Production build
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

## 🔧 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://vakansiya.az
```

## 🎨 Design System

- **90% neutral colors** (white, black, gray)
- **10% colored accents** (blue, green, yellow, red, purple)
- **Inter font** for typography
- **Gradient cards** for Premium jobs by category
- **Mobile-first** responsive design

---

Built with ❤️ for Azerbaijan job market © 2025 Vakansiya.az

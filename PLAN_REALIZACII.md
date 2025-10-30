# 📋 ПЛАН ПОЛНОЙ РЕАЛИЗАЦИИ VAKANSIYA.AZ

> Полная реализация job-портала по этапам (НЕ MVP)
> Основано на анализе: tap.az, ejob.az, boss.az
> Стиль: 90% белый/черный + 10% цветные акценты, шрифт Poppins

---

## 🎯 ОБЩАЯ СТРУКТУРА САЙТА

### **Основные разделы:**
1. Главная страница (/)
2. Вакансии (/vakansiyalar)
3. Компании (/companies)
4. Короткие работы (/gundelik-isler)
5. Профиль пользователя (/profile)
6. Кабинет работодателя (/employer)
7. Админ-панель (/admin)
8. Служебные страницы

---

## 📊 ЭТАП 1: ОСНОВНЫЕ СТРАНИЦЫ (2-3 недели)

### 1.1. Главная страница (/) ✅ ЧАСТИЧНО ГОТОВА
**Что есть:**
- ✅ Навигация с логотипом
- ✅ Поисковая строка (3 элемента в ряд)
- ✅ Сетка вакансий 2x2 (мобильный) / 3-4 (десктоп)
- ✅ Infinite scroll
- ✅ Footer
- ✅ CTA секция

**Что добавить:**
- [ ] Hero-баннер с анимацией (как на tap.az)
- [ ] Популярные категории (8 иконок с счетчиками)
- [ ] Топ компании (карусель с логотипами)
- [ ] Блок "Как это работает" (3 шага)
- [ ] Последние статьи из блога
- [ ] Счетчики статистики (с анимацией)
- [ ] Newsletter форма

**Компоненты:**
```
/components/home/
  - HeroBanner.tsx
  - CategoryGrid.tsx
  - TopCompanies.tsx
  - HowItWorks.tsx
  - BlogPreviews.tsx
  - Stats.tsx
  - Newsletter.tsx
```

---

### 1.2. Страница вакансий (/vakansiyalar)
**Макет:** 2 колонки - фильтры (слева) + список (справа)

**Функции:**
- [ ] Расширенные фильтры (sidebar):
  - Категория (чекбоксы)
  - Город (мультиселект)
  - Зарплата (range slider)
  - Тип работы (Full-time, Part-time, Remote)
  - Опыт (0-1, 1-3, 3-5, 5+ лет)
  - Компания (поиск с автокомплитом)
  - Дата публикации (сегодня, неделя, месяц)

- [ ] Сортировка:
  - По дате (новые/старые)
  - По зарплате
  - По релевантности

- [ ] Сохраненные поиски
- [ ] Переключение вид: сетка / список
- [ ] Быстрое применение (Quick apply)
- [ ] Массовая отправка резюме

**Компоненты:**
```
/app/vakansiyalar/
  - page.tsx
  - layout.tsx
/components/vakansiyalar/
  - FiltersSidebar.tsx
  - SortDropdown.tsx
  - JobsList.tsx
  - JobsGrid.tsx
  - SavedSearches.tsx
  - QuickApplyButton.tsx
```

---

### 1.3. Страница одной вакансии (/vakansiyalar/[id])
**Макет:** Детальная информация + sidebar с компанией

**Разделы:**
- [ ] Заголовок с badge (VIP, Premium, Urgent)
- [ ] Основная информация:
  - Название позиции
  - Компания (ссылка на профиль)
  - Локация + тип работы
  - Зарплата
  - Дата публикации
  - Количество просмотров
  - Срок подачи заявок

- [ ] Кнопки действий:
  - Подать заявку (большая кнопка)
  - Сохранить (иконка сердца)
  - Поделиться (соцсети)
  - Пожаловаться

- [ ] Описание вакансии:
  - Обязанности
  - Требования
  - Условия
  - Что мы предлагаем

- [ ] Sidebar:
  - Карточка компании
  - Другие вакансии компании
  - Похожие вакансии
  - Реклама (Premium)

**Компоненты:**
```
/app/vakansiyalar/[id]/
  - page.tsx
/components/vakansiya-detail/
  - VacancyHeader.tsx
  - VacancyActions.tsx
  - VacancyDescription.tsx
  - CompanySidebar.tsx
  - SimilarJobs.tsx
  - ApplicationModal.tsx
  - ShareModal.tsx
```

---

### 1.4. Страница компаний (/companies)
**Макет:** Каталог компаний с фильтрами

**Фильтры:**
- [ ] Индустрия (IT, Finance, Marketing...)
- [ ] Размер компании (1-10, 10-50, 50-200, 200+)
- [ ] Город
- [ ] Верифицированные (галочка)

**Карточка компании:**
- Логотип
- Название
- Индустрия
- Локация
- Количество вакансий
- Badge (Top employer, Verified)
- Кнопка "Смотреть вакансии"

**Компоненты:**
```
/app/companies/
  - page.tsx
/components/companies/
  - CompanyFilters.tsx
  - CompanyGrid.tsx
  - CompanyCard.tsx
  - TopEmployers.tsx
```

---

### 1.5. Профиль компании (/companies/[slug])
**Макет:** Профиль компании как лендинг

**Секции:**
- [ ] Header:
  - Cover image
  - Логотип
  - Название + verified badge
  - Кнопка "Следить"
  - Социальные сети

- [ ] О компании:
  - Описание
  - Индустрия
  - Размер команды
  - Год основания
  - Веб-сайт

- [ ] Активные вакансии (табы: Все/IT/Marketing...)
- [ ] Фото офиса (галерея)
- [ ] Отзывы сотрудников
- [ ] Видео о компании
- [ ] Контакты

**Компоненты:**
```
/app/companies/[slug]/
  - page.tsx
/components/company-profile/
  - CompanyHeader.tsx
  - CompanyAbout.tsx
  - CompanyJobs.tsx
  - OfficeGallery.tsx
  - EmployeeReviews.tsx
  - ContactInfo.tsx
```

---

## 📊 ЭТАП 2: КОРОТКИЕ РАБОТЫ / ГИГИ (1-2 недели)

### 2.1. Каталог коротких работ (/gundelik-isler)
**Особенности:**
- Простые задачи (курьер, грузчик, помощник)
- Оплата за день/час
- Быстрая заявка (без резюме)

**Функции:**
- [ ] Фильтры (попроще чем у вакансий)
- [ ] Карта с отметками
- [ ] Быстрая заявка (телефон + имя)
- [ ] Календарь доступности

**Компоненты:**
```
/app/gundelik-isler/
  - page.tsx
  - [id]/page.tsx
/components/short-jobs/
  - ShortJobCard.tsx
  - QuickResponseForm.tsx
  - MapView.tsx
  - Calendar.tsx
```

---

## 📊 ЭТАП 3: ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (2 недели)

### 3.1. Регистрация / Вход (/auth)
**Метод:**
- [ ] **ТОЛЬКО Google OAuth** (Supabase)
- ❌ Нет email + password
- ❌ Нет смены пароля
- ❌ Нет reset password

**Компоненты:**
```
/app/auth/
  - login/page.tsx (только Google кнопка)
/components/auth/
  - GoogleButton.tsx
```

---

### 3.2. Личный кабинет (/profile)
**Разделы:**

#### Dashboard
- [ ] Активные заявки (статус: отправлено, просмотрено, отклонено)
- [ ] Сохраненные вакансии
- [ ] Рекомендации для вас
- [ ] Уведомления

#### Мое резюме (/profile/resume)
- [ ] Основная информация
- [ ] Опыт работы
- [ ] Образование
- [ ] Навыки (теги)
- [ ] Языки
- [ ] Портфолио / проекты
- [ ] Загрузка файла CV (PDF)

#### Настройки (/profile/settings)
**Минимальные настройки:**
- [ ] Личные данные (имя, телефон, фото)
- [ ] Приватность резюме (публичное/приватное)
- [ ] Удалить аккаунт

**❌ НЕТ:**
- ❌ Email уведомления (принудительная рассылка)
- ❌ SMS уведомления
- ❌ Изменить пароль (только Google OAuth)

**Компоненты:**
```
/app/profile/
  - page.tsx (dashboard)
  - resume/page.tsx
  - applications/page.tsx
  - saved/page.tsx
  - settings/page.tsx
/components/profile/
  - ApplicationsList.tsx
  - ResumeEditor.tsx
  - SavedJobs.tsx
  - Notifications.tsx
  - SettingsForm.tsx
```

---

## 📊 ЭТАП 4: КАБИНЕТ РАБОТОДАТЕЛЯ (2-3 недели)

### 4.1. Dashboard работодателя (/employer)
**Разделы:**

#### Главная
- [ ] Статистика:
  - Просмотры вакансий
  - Количество откликов
  - Активные вакансии
  - Баланс (для платных услуг)

#### Мои вакансии (/employer/vacancies)
- [ ] Список всех вакансий (активные/завершенные)
- [ ] Создать вакансию
- [ ] Редактировать
- [ ] Дублировать
- [ ] Снять с публикации
- [ ] Статистика по каждой

#### Отклики (/employer/responses)
- [ ] Список всех откликов
- [ ] Фильтры (по вакансии, дате, статусу)
- [ ] Просмотр резюме
- [ ] Изменение статуса (рассмотрено, приглашен, отклонен)
- [ ] Комментарии к кандидату
- [ ] Массовые действия

#### Профиль компании (/employer/company)
- [ ] Редактирование профиля
- [ ] Загрузка логотипа
- [ ] Cover image
- [ ] Фото офиса
- [ ] Социальные сети
- [ ] О компании

#### Платежи (/employer/billing)
- [ ] Баланс
- [ ] История транзакций
- [ ] Тарифы (Free, Premium, VIP)
- [ ] Пополнение счета
- [ ] Invoices

**Компоненты:**
```
/app/employer/
  - page.tsx
  - vacancies/page.tsx
  - vacancies/new/page.tsx
  - vacancies/[id]/edit/page.tsx
  - responses/page.tsx
  - company/page.tsx
  - billing/page.tsx
/components/employer/
  - DashboardStats.tsx
  - VacanciesList.tsx
  - VacancyForm.tsx
  - ResponsesList.tsx
  - ResponseCard.tsx
  - CompanyEditor.tsx
  - BillingInfo.tsx
  - TariffsTable.tsx
```

---

## 📊 ЭТАП 5: АДМИН-ПАНЕЛЬ (1-2 недели)

### 5.1. Admin Dashboard (/admin)
**Доступ:** Только для пользователей с ролью admin

**Разделы:**

#### Общая статистика
- [ ] Всего пользователей
- [ ] Всего вакансий
- [ ] Всего компаний
- [ ] Графики (новые пользователи, вакансии за месяц)

#### Модерация вакансий (/admin/vacancies)
- [ ] Список всех вакансий
- [ ] Фильтры (статус: ожидает, одобрено, отклонено)
- [ ] Одобрить / Отклонить
- [ ] Редактировать
- [ ] Удалить
- [ ] Причина отклонения

#### Управление компаниями (/admin/companies)
- [ ] Список компаний
- [ ] Верифицировать компанию
- [ ] Редактировать профиль
- [ ] Заблокировать / Разблокировать

#### Управление пользователями (/admin/users)
- [ ] Список всех пользователей
- [ ] Фильтры (роль, статус, дата регистрации)
- [ ] Изменить роль
- [ ] Заблокировать пользователя
- [ ] Просмотр активности

#### Платежи (/admin/payments)
- [ ] Список транзакций
- [ ] Подтвердить оплату (manual)
- [ ] История платежей
- [ ] Экспорт в Excel

#### Настройки сайта (/admin/settings)
- [ ] Категории вакансий
- [ ] Города
- [ ] Тарифы
- [ ] Email шаблоны
- [ ] Настройки рекламы

**Компоненты:**
```
/app/admin/
  - page.tsx
  - vacancies/page.tsx
  - companies/page.tsx
  - users/page.tsx
  - payments/page.tsx
  - settings/page.tsx
/components/admin/
  - AdminStats.tsx
  - VacancyModeration.tsx
  - CompanyManagement.tsx
  - UserManagement.tsx
  - PaymentsList.tsx
  - SettingsEditor.tsx
```

---

## 📊 ЭТАП 6: СЛУЖЕБНЫЕ СТРАНИЦЫ (1 неделя)

### 6.1. Статические страницы

#### О нас (/about)
- [ ] История компании
- [ ] Команда
- [ ] Миссия и ценности
- [ ] Статистика

#### Контакты (/contact)
- [ ] Форма обратной связи
- [ ] Email, телефон
- [ ] Адрес офиса
- [ ] Карта

#### FAQ (/faq)
- [ ] Аккордеон с вопросами
- [ ] Категории (для соискателей, для работодателей)
- [ ] Поиск по FAQ

#### Правила (/terms)
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy

#### Цены (/pricing)
- [ ] Тарифы для работодателей
- [ ] Сравнительная таблица
- [ ] FAQ по оплате
- [ ] CTA "Начать бесплатно"

#### Блог (/blog)
- [ ] Список статей
- [ ] Категории
- [ ] Поиск
- [ ] Страница статьи (/blog/[slug])

**Компоненты:**
```
/app/
  - about/page.tsx
  - contact/page.tsx
  - faq/page.tsx
  - terms/page.tsx
  - privacy/page.tsx
  - pricing/page.tsx
  - blog/page.tsx
  - blog/[slug]/page.tsx
/components/static/
  - ContactForm.tsx
  - FaqAccordion.tsx
  - PricingTable.tsx
  - BlogCard.tsx
  - BlogPost.tsx
```

---

## 📊 ЭТАП 7: ДОПОЛНИТЕЛЬНЫЕ ФИЧИ (2 недели)

### 7.1. Уведомления (Принудительные)
**Типы уведомлений:**
- [ ] In-app уведомления (колокольчик в хедере)
- [ ] Email уведомления (Brevo) - всем принудительно
- [ ] Push уведомления (опционально для PWA)

**❌ НЕТ настроек:**
- ❌ Нельзя отключить уведомления
- ❌ Нельзя выбрать частоту
- ❌ Все получают всё

### 7.2. Поиск
- [ ] Глобальный поиск (вакансии + компании)
- [ ] Автокомплит
- [ ] История поиска
- [ ] Популярные запросы

### 7.3. Избранное
- [ ] Сохранить вакансию
- [ ] Сохранить компанию
- [ ] Папки для организации
- [ ] Экспорт списка

### 7.4. Email Marketing (Принудительная рассылка)
**Все пользователи получают:**
- [ ] Еженедельный дайджест вакансий
- [ ] Персональные рекомендации на основе резюме
- [ ] Новости от компаний
- [ ] Уведомления о новых откликах

**❌ НЕТ:**
- ❌ Unsubscribe (нельзя отписаться)
- ❌ Настройки частоты рассылки
- ❌ Выбор типов писем

### 7.5. Аналитика
- [ ] Google Analytics
- [ ] Facebook Pixel
- [ ] Heatmaps (Hotjar)
- [ ] A/B тестирование

**Компоненты:**
```
/components/notifications/
  - NotificationBell.tsx
  - NotificationsList.tsx
  - NotificationItem.tsx
/components/search/
  - GlobalSearch.tsx
  - SearchAutocomplete.tsx
  - SearchHistory.tsx
/components/favorites/
  - FavoriteButton.tsx
  - FavoritesList.tsx
  - FavoriteFolders.tsx
```

---

## 📊 ЭТАП 8: МОБИЛЬНАЯ ОПТИМИЗАЦИЯ (1 неделя)

### 8.1. Mobile UI
- [ ] Адаптация всех страниц
- [ ] Мобильное меню (hamburger)
- [ ] Bottom navigation (опционально)
- [ ] Touch-friendly кнопки
- [ ] Swipe gestures

### 8.2. PWA
- [ ] Service Worker
- [ ] Offline mode
- [ ] Install prompt
- [ ] Push notifications

**Файлы:**
```
/public/
  - manifest.json
  - service-worker.js
  - icons/ (разные размеры)
```

---

## 📊 ЭТАП 9: SEO & PERFORMANCE (1 неделя)

### 9.1. SEO
- [ ] Meta tags (title, description)
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs

### 9.2. Performance
- [ ] Image optimization (Next.js Image)
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] Lighthouse score 90+

### 9.3. Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast
- [ ] Focus indicators

**Файлы:**
```
/app/
  - sitemap.ts
  - robots.ts
/lib/
  - seo.ts
  - structured-data.ts
```

---

## 📊 ЭТАП 10: ИНТЕГРАЦИИ (1-2 недели)

### 10.1. Backend (Supabase)
- [ ] Настройка таблиц
- [ ] Row Level Security (RLS)
- [ ] Stored procedures
- [ ] Triggers
- [ ] Real-time subscriptions

### 10.2. Автопарсинг (Отдельный сервис)
- [ ] Scraper для tap.az
- [ ] Scraper для boss.az
- [ ] AI стандартизация (OpenRouter)
- [ ] Cron schedule (каждый час)
- [ ] Дубликаты detection
- [ ] POST к /api/import-jobs

### 10.3. Платежи
- [ ] Manual payment (агент)
- [ ] Будущее: Stripe, PayPal, местные (Portmanat)

### 10.4. Email (Brevo)
- [ ] Transactional emails
- [ ] Marketing campaigns
- [ ] Templates
- [ ] Analytics

**Файлы:**
```
/supabase/
  - schema.sql
  - seed.sql
  - migrations/
/scraper/ (отдельный репозиторий)
  - src/scrapers/
  - src/ai/
  - src/api/
/app/api/
  - import-jobs/route.ts
  - webhooks/
```

---

## 🎨 ДИЗАЙН-СИСТЕМА (В ТЕЧЕНИЕ ВСЕХ ЭТАПОВ)

### Компоненты UI (готовые + кастомные)
```
/components/ui/
  - Button.tsx ✅
  - Input.tsx
  - Select.tsx
  - Checkbox.tsx
  - Radio.tsx
  - Textarea.tsx
  - Badge.tsx
  - Tag.tsx
  - Modal.tsx
  - Dropdown.tsx
  - Tabs.tsx
  - Accordion.tsx
  - Tooltip.tsx
  - Alert.tsx
  - Card.tsx
  - Avatar.tsx
  - Loader.tsx
  - Skeleton.tsx
  - Pagination.tsx
  - Breadcrumbs.tsx
```

### Стиль
- **Цвета:** 90% черно-белые + 10% акценты (синий, зеленый, красный, желтый)
- **Шрифт:** Poppins (400, 500, 600, 700)
- **Отступы:** 4px/8px система
- **Радиусы:** 8px, 12px, 16px
- **Тени:** Мягкие, 10-15px blur

---

## 📅 ОБЩИЙ TIMELINE

| Этап | Описание | Время |
|------|----------|-------|
| **1** | Основные страницы | 2-3 недели |
| **2** | Короткие работы | 1-2 недели |
| **3** | Профиль пользователя | 2 недели |
| **4** | Кабинет работодателя | 2-3 недели |
| **5** | Админ-панель | 1-2 недели |
| **6** | Служебные страницы | 1 неделя |
| **7** | Дополнительные фичи | 2 недели |
| **8** | Мобильная оптимизация | 1 неделя |
| **9** | SEO & Performance | 1 неделя |
| **10** | Интеграции | 1-2 недели |

**ИТОГО: ~14-18 недель (3.5-4.5 месяца)**

---

## 🚀 ПРИОРИТЕТЫ

### HIGH (Критично для запуска)
1. Главная страница
2. Каталог вакансий + детальная страница
3. Профиль компании
4. Регистрация / Вход
5. Создание вакансии (работодатель)
6. Подача заявки (соискатель)

### MEDIUM (Важно, но не блокирует запуск)
1. Короткие работы
2. Расширенные фильтры
3. Личный кабинет
4. Админ-панель базовая
5. Email уведомления

### LOW (Можно добавить позже)
1. Блог
2. Отзывы сотрудников
3. PWA
4. Push уведомления
5. Видео о компании

---

## ✅ ГОТОВО К ИСПОЛЬЗОВАНИЮ

- ✅ Material Tailwind установлен
- ✅ Heroicons установлен
- ✅ React Icons установлен
- ✅ Tailwind конфигурация
- ✅ Poppins шрифт
- ✅ Базовые компоненты (Navigation, SearchBar, JobCard)
- ✅ Главная страница (базовая версия)
- ✅ Дизайн-система (цвета, spacing, shadows)

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

1. **Выбери этап** с которого начать
2. Я создам детальную структуру компонентов
3. Реализуем поэтапно, используя готовые Tailwind компоненты
4. Регулярно проверяем соответствие дизайн-системе

**Готов начинать! С какого этапа начнем?** 🚀

---

## ⚠️ ВАЖНЫЕ ОГРАНИЧЕНИЯ

### 🔐 Авторизация
- **ТОЛЬКО Google OAuth** через Supabase
- Нет регистрации по email/паролю
- Нет функции "забыли пароль"
- Нет смены пароля

### ⚙️ Настройки пользователя
- **Минимум настроек:**
  - Личные данные (имя, телефон, фото)
  - Приватность резюме
  - Удалить аккаунт
- **Нет:**
  - Настроек уведомлений
  - Настроек рассылки
  - Языковых настроек

### 📧 Email рассылка
- **Принудительная для всех пользователей**
- Нельзя отписаться
- Нельзя выбрать частоту
- Нельзя выбрать типы писем
- Все получают: дайджесты, рекомендации, уведомления

### 👤 Профиль
- Только базовая информация + резюме
- Нет сложных настроек
- Простой и чистый интерфейс

---

## 📝 ИТОГОВАЯ ФИЛОСОФИЯ

**Простота > Функциональность**
- Меньше настроек = меньше путаницы
- Google OAuth = безопасность + удобство
- Принудительная рассылка = больше engagement
- Фокус на резюме и вакансиях, а не на настройках

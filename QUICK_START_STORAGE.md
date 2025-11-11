# ⚡ БЫСТРЫЙ СТАРТ: SUPABASE STORAGE

## 🎯 Что делаем?
Переносим фотки категорий из `/public/images/categories/` в Supabase Storage для ускорения сайта.

---

## 📋 ИНСТРУКЦИЯ (5 минут)

### ШАГ 1: Создай bucket
1. Открой: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets
2. Нажми **"New bucket"**
3. Заполни:
   - Name: `category-images`
   - Public: ✅ **ДА**
4. Нажми **"Create bucket"**

---

### ШАГ 2: Загрузи фотки

**Вариант A - Автоматически (рекомендую):**
```bash
node scripts/upload-images-to-storage.mjs
```

**Вариант B - Вручную:**
1. Открой: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets/category-images
2. Нажми "Upload files"
3. Выбери все из `/public/images/categories/`

---

### ШАГ 3: Обнови БД
```bash
node scripts/update-category-images.mjs
```

---

### ШАГ 4: Проверь
1. Открой сайт: http://localhost:3000
2. Посмотри на карточки вакансий
3. Фотки должны загружаться с `giunonajbfrlasaxqvoi.supabase.co`

---

## ✅ ГОТОВО!

После настройки:
- Фотки грузятся через CDN (быстрее)
- Git не грузится фотками (легче)
- Можно легко добавлять новые фотки

---

## 📝 Добавление новых фоток

### Через интерфейс:
1. Открой Storage: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets/category-images
2. Загрузи `barista.png`
3. Обнови БД через SQL:
```sql
UPDATE categories
SET image_url = 'https://giunonajbfrlasaxqvoi.supabase.co/storage/v1/object/public/category-images/barista.png'
WHERE name = 'Barista';
```

---

## 🆘 Проблемы?

**Bucket не создается:**
- Убедись что ты админ проекта
- Проверь что используешь Service Role Key

**Фотки не загружаются:**
- Проверь что bucket Public
- Проверь размер файлов (< 1MB)

**image_url не обновляется:**
- Проверь маппинг в `scripts/update-category-images.mjs`
- Убедись что файлы загружены в Storage

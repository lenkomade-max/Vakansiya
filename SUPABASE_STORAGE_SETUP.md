# 📦 НАСТРОЙКА SUPABASE STORAGE ДЛЯ ФОТОК КАТЕГОРИЙ

## Шаг 1: Создай bucket в Supabase

1. Открой: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets
2. Нажми **"New bucket"**
3. Заполни форму:
   - **Name:** `category-images`
   - **Public:** ✅ **ДА** (чтобы фотки были доступны без авторизации)
   - **File size limit:** `1 MB` (достаточно для всех фоток)
   - **Allowed MIME types:** `image/png, image/jpeg, image/webp`
4. Нажми **"Create bucket"**

---

## Шаг 2: Загрузи фотки

### Вариант A: Вручную через интерфейс (просто)

1. Открой: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets/category-images
2. Нажми **"Upload files"**
3. Выбери все файлы из `/Volumes/Lexar/Tapla.az:Cursor/Vakansiya/public/images/categories/`
4. Загрузи (займет ~1 минуту для 43 фоток)

### Вариант B: Через скрипт (автоматически)

Запусти:
```bash
node scripts/upload-images-to-storage.mjs
```

---

## Шаг 3: Обнови image_url в БД

После загрузки фоток запусти:
```bash
node scripts/update-category-images.mjs
```

Этот скрипт:
1. Найдет все категории в БД
2. Для каждой категории найдет соответствующую фотку в Storage
3. Обновит `image_url` в БД

---

## Формат URL

После загрузки фотки будут доступны по адресу:
```
https://giunonajbfrlasaxqvoi.supabase.co/storage/v1/object/public/category-images/driver.png
```

**Структура:**
- `https://giunonajbfrlasaxqvoi.supabase.co` - твой Supabase проект
- `/storage/v1/object/public` - публичный Storage API
- `/category-images` - название bucket
- `/driver.png` - название файла

---

## Маппинг категорий → файлы

Я создал маппинг на основе существующих файлов:

| Категория (name) | Файл |
|------------------|------|
| Driver | driver.png |
| Waiter | waiter.png |
| Teacher | teacher.png |
| MarketingManager | marketing.png |
| SMMManager | smm.png |
| Event | event.png |
| Translator | translator.png |

Полный список в `scripts/category-image-mapping.json`

---

## Добавление новых фоток

### Через интерфейс:
1. Открой Storage: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets/category-images
2. Загрузи новую фотку (например `barista.png`)
3. Обнови БД через SQL Editor:
```sql
UPDATE categories
SET image_url = 'https://giunonajbfrlasaxqvoi.supabase.co/storage/v1/object/public/category-images/barista.png'
WHERE name = 'Barista';
```

### Через скрипт:
```bash
node scripts/add-category-image.mjs --category "Barista" --file "barista.png"
```

---

## Проверка

После настройки открой сайт и проверь что фотки загружаются:
1. Открой главную страницу
2. Посмотри на карточки вакансий
3. Открой DevTools → Network → Images
4. Фотки должны грузиться с `giunonajbfrlasaxqvoi.supabase.co`

---

## Плюсы Supabase Storage

✅ **CDN из коробки** - быстрая загрузка по всему миру
✅ **Не грузит git** - репозиторий остается легким
✅ **Легко обновлять** - просто заменяешь файл
✅ **Бесплатно до 1GB** - хватит на тысячи фоток
✅ **Автоматическая оптимизация** - Supabase сжимает изображения

---

## Что дальше?

После настройки Storage:
- [ ] Удали фотки из `/public/images/categories/` (они уже в Storage)
- [ ] Обнови `.gitignore` чтобы не коммитить новые фотки в `/public`
- [ ] Добавь оставшиеся ~107 фоток для всех категорий

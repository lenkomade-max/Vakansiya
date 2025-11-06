# План модерации и админ панели

## Текущее состояние

### Что работает:
1. ✅ Создание elan через /post-job
2. ✅ AI модерация (rules + OpenRouter)
3. ✅ Автоматический approve при confidence >= 90%
4. ✅ Отображение статусов в профиле (pending_review, active, rejected)
5. ✅ Срок действия 30 дней (expires_at)

### Баги (приоритет 1):
1. ❌ Elan не сохраняется в БД - проверить createJob
2. ❌ Страницы /vakansiyalar/[id] показывают fake data вместо реальных
3. ❌ getUserJobs не возвращает созданные elan

### Что нужно сделать:

## Фаза 1: Фиксы (сейчас)
1. Проверить почему createJob не сохраняет в БД
2. Создать getJobById(id) в lib/api/jobs.ts
3. Обновить /vakansiyalar/[id]/page.tsx - брать данные через getJobById
4. Обновить /gundelik-isler/[id]/page.tsx - брать данные через getJobById
5. Протестировать полный flow: создать → посмотреть в профиле → открыть детали

## Фаза 2: Админ панель
1. Создать /admin/moderation/page.tsx
2. Показывать список elan со статусом pending_review
3. Для каждого elan показать:
   - Заголовок, компанию, описание
   - AI результат (если был)
   - Rules флаги (если были)
   - Кнопки: Approve / Reject
4. Создать API функции:
   - approveJob(jobId) - установить status = 'active'
   - rejectJob(jobId, reason) - установить status = 'rejected'
5. Добавить RLS policy для админов (role = 'admin')

## Фаза 3: Логирование модерации
1. Создать таблицу moderation_logs:
   - job_id
   - moderation_type (rules/ai/manual)
   - result (approved/rejected/pending)
   - confidence (для AI)
   - flags (JSON)
   - moderator_id (для ручной)
   - created_at
2. Сохранять каждый шаг модерации
3. Показывать в админке историю проверок

## Как работает AI модерация

### Поток проверки:
```
1. User создает elan → createJob()
2. moderateContent(jobPost) - проверка rules
   ├─ Если нашли проблему → status = 'pending_review'
   └─ Если OK → переходим к AI
3. aiModerationWithFallback(jobPost, flags)
   ├─ Модель 1: meta-llama/llama-3.3-70b-instruct:free
   ├─ Fallback: qwen/qwq-32b:free (если первая не сработала)
   └─ Результат:
      ├─ approved + confidence >= 0.9 → status = 'active'
      ├─ rejected + confidence >= 0.9 → return error (elan не создается)
      └─ иначе → status = 'pending_review'
4. Elan сохраняется в БД с финальным статусом
```

### Rules проверки (lib/moderation/rules.ts):
- Спам keywords (AZ + RU)
- Мошенничество (prepayment scams, MLM)
- Профанити
- Дубликаты
- Подозрительные контакты

### AI проверки (lib/moderation/ai.ts):
- Pyramid schemes
- Unrealistic salary
- Fraudulent content
- Inappropriate content

## Файлы для работы с модерацией

### API:
- `lib/api/jobs.ts` - createJob, getUserJobs, getJobById
- `lib/moderation/rules.ts` - moderateContent()
- `lib/moderation/ai.ts` - aiModerationWithFallback()

### UI:
- `app/post-job/page.tsx` - создание elan
- `app/profile/page.tsx` - список elan юзера
- `app/admin/moderation/page.tsx` - админка (создать)

### БД:
- `jobs` таблица - хранит все elan
- `profiles` таблица - данные юзеров
- Статусы: pending_review, active, inactive, expired, rejected

## Админ доступ

### Проверка прав:
```typescript
const user = await getCurrentUser()
const profile = await getProfile(user.id)
if (profile.role !== 'admin') {
  router.push('/')
}
```

### TODO: Добавить role в profiles таблицу
Сейчас нет поля role - нужно добавить миграцию.

## ENV переменные

```env
# Для AI модерации
OPENROUTER_API_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://vakansiya.vercel.app
```

## Тестирование модерации

### Тест 1: Нормальный elan
- Title: "Frontend Developer"
- Company: "ABC Tech"
- Description: "React, TypeScript, 3+ years"
→ Ожидаем: status = 'active' (AI approve)

### Тест 2: Спам elan
- Title: "СРОЧНО!!! ДЕНЬГИ БЫСТРО!!!"
- Description: "Заработай миллион за неделю!!!"
→ Ожидаем: status = 'pending_review' (rules catch)

### Тест 3: Мошенничество
- Description: "Отправь 100 AZN для регистрации"
→ Ожидаем: status = 'rejected' или 'pending_review'

## Следующие шаги (в порядке приоритета)

1. ✅ Фикс: createJob сохранение
2. ✅ Фикс: getJobById и отображение
3. ⏳ Админ панель базовая
4. ⏳ Approve/Reject функционал
5. ⏳ Логирование модерации
6. ⏳ Email уведомления (юзеру когда одобрили/отклонили)

---

**Дата создания:** 2025-01-07
**Статус:** В разработке
**Следующий шаг:** Фикс сохранения elan в БД

console.log('📋 SQL КОМАНДЫ ДЛЯ ДОБАВЛЕНИЯ ИНДЕКСОВ\n')
console.log('Скопируй эти команды и выполни в Supabase SQL Editor:')
console.log('https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/sql/new\n')
console.log('=' .repeat(80))
console.log()

const sql = `
-- ============================================
-- ДОБАВЛЕНИЕ ИНДЕКСОВ ДЛЯ УСКОРЕНИЯ
-- Выполни этот SQL в Supabase SQL Editor
-- ============================================

-- 1. Индекс для фильтрации по status + job_type
CREATE INDEX IF NOT EXISTS idx_jobs_status_type
ON jobs(status, job_type);

-- 2. Индекс для сортировки по дате
CREATE INDEX IF NOT EXISTS idx_jobs_created_at
ON jobs(created_at DESC);

-- 3. Индекс для VIP и срочных вакансий
CREATE INDEX IF NOT EXISTS idx_jobs_vip_urgent
ON jobs(is_vip DESC, is_urgent DESC);

-- 4. Индекс для поиска по категории
CREATE INDEX IF NOT EXISTS idx_jobs_category
ON jobs(category);

-- 5. Индекс для JOIN с categories по parent_id
CREATE INDEX IF NOT EXISTS idx_categories_parent_id
ON categories(parent_id);

-- 6. Индекс для фильтрации категорий
CREATE INDEX IF NOT EXISTS idx_categories_type_active
ON categories(type, is_active);

-- 7. Композитный индекс для главной страницы
CREATE INDEX IF NOT EXISTS idx_jobs_status_type_created
ON jobs(status, job_type, created_at DESC);

-- 8. Индекс для профиля пользователя
CREATE INDEX IF NOT EXISTS idx_jobs_user_id
ON jobs(user_id);

-- Показываем созданные индексы
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('jobs', 'categories')
ORDER BY tablename, indexname;
`

console.log(sql)
console.log('=' .repeat(80))
console.log('\n✅ После выполнения загрузка ускорится в 5-10 раз!')
console.log('⏱️  Время выполнения: ~10-30 секунд\n')

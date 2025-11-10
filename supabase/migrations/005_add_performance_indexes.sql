-- =====================================================
-- PERFORMANCE OPTIMIZATION: Добавление индексов
-- Дата: 2025-11-10
-- Цель: Ускорить запросы при масштабировании до 10k+ записей
-- =====================================================

-- ВАЖНО: Индексы НЕ меняют данные, только ускоряют SELECT!
-- Безопасно для production

-- =====================================================
-- ИНДЕКСЫ ДЛЯ ТАБЛИЦЫ jobs
-- =====================================================

-- Включаем расширение для ILIKE поиска
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Основные индексы для фильтрации
CREATE INDEX IF NOT EXISTS idx_jobs_status
  ON jobs(status);

CREATE INDEX IF NOT EXISTS idx_jobs_job_type
  ON jobs(job_type);

CREATE INDEX IF NOT EXISTS idx_jobs_category
  ON jobs(category);

CREATE INDEX IF NOT EXISTS idx_jobs_location
  ON jobs(location);

-- Индекс для сортировки по дате (DESC для ORDER BY created_at DESC)
CREATE INDEX IF NOT EXISTS idx_jobs_created_at
  ON jobs(created_at DESC);

-- Композитный индекс для частого запроса: активные вакансии по типу
-- WHERE status = 'active' AND job_type = 'vakansiya'
CREATE INDEX IF NOT EXISTS idx_jobs_active_type
  ON jobs(status, job_type)
  WHERE status = 'active';

-- Композитный индекс для сортировки VIP/Urgent
-- ORDER BY is_vip DESC, is_urgent DESC, created_at DESC
CREATE INDEX IF NOT EXISTS idx_jobs_vip_urgent_created
  ON jobs(is_vip DESC, is_urgent DESC, created_at DESC)
  WHERE status = 'active';

-- Индекс для полнотекстового поиска по городу (ILIKE)
CREATE INDEX IF NOT EXISTS idx_jobs_location_trgm
  ON jobs USING gin(location gin_trgm_ops);

-- =====================================================
-- ИНДЕКСЫ ДЛЯ ТАБЛИЦЫ categories
-- =====================================================

-- Композитный индекс для getParentCategories
-- WHERE type = 'vacancy' AND parent_id IS NULL AND is_active = true
CREATE INDEX IF NOT EXISTS idx_categories_type_parent_active
  ON categories(type, parent_id, is_active);

-- Индекс для сортировки
CREATE INDEX IF NOT EXISTS idx_categories_sort_order
  ON categories(sort_order);

-- =====================================================
-- ИНДЕКСЫ ДЛЯ ТАБЛИЦЫ cities
-- =====================================================

-- WHERE is_active = true ORDER BY sort_order
CREATE INDEX IF NOT EXISTS idx_cities_active_sort
  ON cities(is_active, sort_order);

-- =====================================================
-- ГОТОВО! Индексы созданы
-- =====================================================

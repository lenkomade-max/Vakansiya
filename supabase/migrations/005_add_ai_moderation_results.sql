-- ============================================
-- ADD AI MODERATION RESULTS STORAGE
-- Сохраняет результаты AI проверки для админов
-- ============================================

-- 1. Добавить поле для AI результатов в jobs
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS ai_moderation_result JSONB;

-- 2. Добавить поле для rules результатов
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS rules_moderation_result JSONB;

-- 3. Добавить timestamp AI проверки
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS ai_checked_at TIMESTAMP WITH TIME ZONE;

-- 4. Индекс для быстрого поиска заданий с AI проверкой
CREATE INDEX IF NOT EXISTS idx_jobs_ai_checked ON jobs(ai_checked_at) WHERE ai_checked_at IS NOT NULL;

-- 5. Комментарии для документации
COMMENT ON COLUMN jobs.ai_moderation_result IS 'AI moderation result from OpenRouter (approved, confidence, reason, violations, recommendation)';
COMMENT ON COLUMN jobs.rules_moderation_result IS 'Rules-based moderation result (flags, score, language)';
COMMENT ON COLUMN jobs.ai_checked_at IS 'Timestamp when AI moderation was performed';

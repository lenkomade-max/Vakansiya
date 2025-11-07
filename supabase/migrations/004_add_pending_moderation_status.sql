-- ============================================
-- ADD pending_moderation STATUS
-- Добавляет статус для очереди retry модерации
-- ============================================

-- Убрать старый CHECK constraint
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;

-- Добавить новый CHECK constraint с pending_moderation
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check
    CHECK (status IN ('pending_review', 'pending_moderation', 'active', 'inactive', 'expired', 'rejected'));

-- Комментарий для документации
COMMENT ON COLUMN jobs.status IS 'Job status: pending_review (manual review), pending_moderation (AI retry queue), active (approved), inactive (paused), expired, rejected';

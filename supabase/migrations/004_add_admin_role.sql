-- ============================================
-- ADD ADMIN ROLE SYSTEM
-- Добавляет роли пользователей и логи модерации
-- ============================================

-- 1. Добавить роль в profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Создать таблицу логов модерации
CREATE TABLE IF NOT EXISTS moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    moderator_id UUID NOT NULL REFERENCES profiles(id),
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'flag')),
    reason TEXT,
    ai_result JSONB,  -- Результат AI модерации
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- 3. RLS политики для moderation_logs
-- Только админы могут видеть логи
CREATE POLICY "Admins can view all moderation logs"
    ON moderation_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Только админы могут создавать логи
CREATE POLICY "Admins can insert moderation logs"
    ON moderation_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 4. Обновить RLS для jobs - админы видят все
CREATE POLICY "Admins can view all jobs"
    ON jobs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Админы могут обновлять любые jobs
CREATE POLICY "Admins can update all jobs"
    ON jobs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 5. Создать функцию для проверки админа (helper)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_moderation_logs_job_id ON moderation_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_moderator_id ON moderation_logs(moderator_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 7. Сделать первого пользователя админом (ВРЕМЕННО - УДАЛИ ПОСЛЕ ЗАПУСКА!)
-- Замени email на свой email
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com' LIMIT 1);

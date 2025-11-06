-- ============================================
-- JOBS TABLE
-- Хранит вакансии и гундалик работы
-- ============================================

-- Удалить старую таблицу и все политики
DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Тип работы
    job_type TEXT NOT NULL CHECK (job_type IN ('vakansiya', 'gundelik')),

    -- Общие поля
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    salary TEXT,
    description TEXT,

    -- Поля для вакансий
    company TEXT,
    employment_type TEXT,
    experience TEXT,
    education TEXT,
    deadline DATE,
    requirements TEXT,
    benefits TEXT,

    -- Поля для гундалик
    start_date TEXT,
    duration TEXT,

    -- Контакты
    contact_phone TEXT NOT NULL,

    -- Статус
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'active', 'inactive', 'expired', 'rejected')),
    is_vip BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,

    -- Метаданные
    views_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all active jobs
CREATE POLICY "Anyone can view active jobs"
    ON jobs
    FOR SELECT
    USING (status = 'active');

-- Policy: Users can view their own jobs (any status)
CREATE POLICY "Users can view own jobs"
    ON jobs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own jobs
CREATE POLICY "Users can insert own jobs"
    ON jobs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own jobs
CREATE POLICY "Users can update own jobs"
    ON jobs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own jobs
CREATE POLICY "Users can delete own jobs"
    ON jobs
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on job changes
CREATE TRIGGER set_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_jobs_updated_at();

-- Index for faster queries
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

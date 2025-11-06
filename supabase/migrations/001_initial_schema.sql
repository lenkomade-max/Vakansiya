-- ============================================
-- Vakansiya.AZ Database Schema
-- For Supabase/PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('user', 'employer', 'admin');
CREATE TYPE work_type AS ENUM ('tam', 'yarım', 'uzaqdan');
CREATE TYPE vacancy_status AS ENUM ('draft', 'active', 'expired', 'pending_payment');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE short_job_status AS ENUM ('active', 'done', 'expired', 'cancelled');
CREATE TYPE response_status AS ENUM ('pending', 'approved', 'declined');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    balance NUMERIC(10,2) DEFAULT 0,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- COMPANIES TABLE
-- ============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_city ON companies(city);

-- ============================================
-- VACANCIES TABLE (Regular Jobs)
-- ============================================

CREATE TABLE vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    city TEXT NOT NULL,
    category TEXT NOT NULL,
    work_type work_type DEFAULT 'tam',
    is_paid BOOLEAN DEFAULT FALSE,
    status vacancy_status DEFAULT 'draft',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vacancies_status ON vacancies(status);
CREATE INDEX idx_vacancies_city ON vacancies(city);
CREATE INDEX idx_vacancies_category ON vacancies(category);
CREATE INDEX idx_vacancies_user_id ON vacancies(user_id);
CREATE INDEX idx_vacancies_company_id ON vacancies(company_id);
CREATE INDEX idx_vacancies_created_at ON vacancies(created_at DESC);

-- ============================================
-- SHORT JOBS TABLE (Gündəlik işlər)
-- ============================================

CREATE TABLE short_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    work_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    wage NUMERIC(10,2) NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_name TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status short_job_status DEFAULT 'active',
    is_paid BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_short_jobs_status ON short_jobs(status);
CREATE INDEX idx_short_jobs_city ON short_jobs(city);
CREATE INDEX idx_short_jobs_category ON short_jobs(category);
CREATE INDEX idx_short_jobs_work_date ON short_jobs(work_date);
CREATE INDEX idx_short_jobs_user_id ON short_jobs(user_id);
CREATE INDEX idx_short_jobs_created_at ON short_jobs(created_at DESC);

-- ============================================
-- SHORT JOB RESPONSES TABLE
-- ============================================

CREATE TABLE short_job_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES short_jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    phone TEXT,
    status response_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

CREATE INDEX idx_short_job_responses_job_id ON short_job_responses(job_id);
CREATE INDEX idx_short_job_responses_user_id ON short_job_responses(user_id);
CREATE INDEX idx_short_job_responses_status ON short_job_responses(status);

-- ============================================
-- VACANCY APPLICATIONS TABLE
-- ============================================

CREATE TABLE vacancy_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    resume_url TEXT,
    phone TEXT,
    status response_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vacancy_id, user_id)
);

CREATE INDEX idx_vacancy_applications_vacancy_id ON vacancy_applications(vacancy_id);
CREATE INDEX idx_vacancy_applications_user_id ON vacancy_applications(user_id);
CREATE INDEX idx_vacancy_applications_status ON vacancy_applications(status);

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE SET NULL,
    short_job_id UUID REFERENCES short_jobs(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'AZN',
    method TEXT,
    status payment_status DEFAULT 'pending',
    transaction_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_vacancy_id ON payments(vacancy_id);
CREATE INDEX idx_payments_short_job_id ON payments(short_job_id);

-- ============================================
-- FAVORITES TABLE
-- ============================================

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE CASCADE,
    short_job_id UUID REFERENCES short_jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vacancy_id, short_job_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_vacancy_id ON favorites(vacancy_id);
CREATE INDEX idx_favorites_short_job_id ON favorites(short_job_id);

-- ============================================
-- CATEGORIES TABLE (for both vacancies and short jobs)
-- ============================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_az TEXT NOT NULL,
    type TEXT NOT NULL, -- 'vacancy' or 'short_job'
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================
-- CITIES TABLE
-- ============================================

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    name_az TEXT NOT NULL,
    region TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_cities_name ON cities(name);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Cities (Major cities in Azerbaijan)
INSERT INTO cities (name, name_az, region) VALUES
('Bakı', 'Bakı', 'Abşeron'),
('Sumqayıt', 'Sumqayıt', 'Abşeron'),
('Gəncə', 'Gəncə', 'Gəncə-Qazax'),
('Mingəçevir', 'Mingəçevir', 'Aran'),
('Şirvan', 'Şirvan', 'Aran'),
('Naxçıvan', 'Naxçıvan', 'Naxçıvan'),
('Lənkəran', 'Lənkəran', 'Lənkəran-Astara'),
('Şəki', 'Şəki', 'Şəki-Zaqatala'),
('Quba', 'Quba', 'Quba-Xaçmaz'),
('Xırdalan', 'Xırdalan', 'Abşeron');

-- Regular Vacancy Categories (base + from screenshot)
INSERT INTO categories (name, name_az, type, sort_order) VALUES
('IT', 'İnformasiya texnologiyaları, telekom', 'vacancy', 1),
('Sales', 'Satış', 'vacancy', 2),
('Marketing', 'Marketinq, reklam, PR', 'vacancy', 3),
('Healthcare', 'Tibb və əczaçılıq', 'vacancy', 4),
('Education', 'Təhsil və elm', 'vacancy', 5),
('Finance', 'Maliyyə', 'vacancy', 6),
('Construction', 'Tikinti və təmir (usta, rəngsaz, santexnik, elektrik, fəhlələr)', 'vacancy', 7),
('Restaurant', 'Restoran işi və turizm', 'vacancy', 8),
('Transport', 'Nəqliyyat, logistika, anbar', 'vacancy', 9),
('Administration', 'İnzibati heyət', 'vacancy', 10),
('HR', 'HR, kadrlar', 'vacancy', 11),
('Legal', 'Hüquqşünaslıq', 'vacancy', 12),
('Auto', 'Avtobiznes və servis', 'vacancy', 13),
('Design', 'Dizayn', 'vacancy', 14),
('Home', 'Ev personalı və təmizlik', 'vacancy', 15),
('Beauty', 'Gözəllik, Fitnes, İdman', 'vacancy', 16),
('Industry', 'Sənaye və istehsalat', 'vacancy', 17),
('Security', 'Təhlükəsizlik', 'vacancy', 18);

-- Short Job Categories (Gündəlik işlər - base expanded + vacancy categories)
INSERT INTO categories (name, name_az, type, sort_order) VALUES
-- Base daily job categories
('Cleaning', 'Təmizlik', 'short_job', 1),
('Cooking', 'Aşpazlıq', 'short_job', 2),
('Delivery', 'Çatdırılma', 'short_job', 3),
('Loading', 'Yükləmə/Boşaltma', 'short_job', 4),
('Warehouse', 'Anbar işləri', 'short_job', 5),
('Gardening', 'Bağçılıq', 'short_job', 6),
('Moving', 'Köçürmə', 'short_job', 7),
('Construction', 'Tikinti və təmir (usta, rəngsaz, santexnik, elektrik, fəhlələr)', 'short_job', 8),
('Helper', 'Köməkçi', 'short_job', 9),
('Care', 'Baxıcılıq (uşaq, yaşlı, heyvan)', 'short_job', 10),
('Event', 'Tədbir köməkçisi', 'short_job', 11),
('Promotion', 'Promoter', 'short_job', 12),
('Translation', 'Tərcümə', 'short_job', 13),
('DataEntry', 'Məlumat daxiletməsi', 'short_job', 14),
('Photography', 'Fotoqrafiya', 'short_job', 15),
('Driving', 'Sürücülük', 'short_job', 16),
-- Also include vacancy categories for gündəlik
('IT', 'İnformasiya texnologiyaları, telekom', 'short_job', 17),
('Sales', 'Satış', 'short_job', 18),
('Marketing', 'Marketinq, reklam, PR', 'short_job', 19),
('Healthcare', 'Tibb və əczaçılıq', 'short_job', 20),
('Education', 'Təhsil və elm', 'short_job', 21),
('Finance', 'Maliyyə', 'short_job', 22),
('Restaurant', 'Restoran işi və turizm', 'short_job', 23),
('Transport', 'Nəqliyyat, logistika, anbar', 'short_job', 24),
('Administration', 'İnzibati heyət', 'short_job', 25),
('HR', 'HR, kadrlar', 'short_job', 26),
('Legal', 'Hüquqşünaslıq', 'short_job', 27),
('Auto', 'Avtobiznes və servis', 'short_job', 28),
('Design', 'Dizayn', 'short_job', 29),
('Home', 'Ev personalı və təmizlik', 'short_job', 30),
('Beauty', 'Gözəllik, Fitnes, İdman', 'short_job', 31),
('Industry', 'Sənaye və istehsalat', 'short_job', 32),
('Security', 'Təhlükəsizlik', 'short_job', 33),
('Other', 'Digər', 'short_job', 34);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_job_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users: Users can read all, but only update their own
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Companies: Public read, owners can manage
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Users can create companies" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own companies" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own companies" ON companies FOR DELETE USING (auth.uid() = user_id);

-- Vacancies: Public read active, owners can manage
CREATE POLICY "Active vacancies are viewable by everyone" ON vacancies FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "Users can create vacancies" ON vacancies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vacancies" ON vacancies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vacancies" ON vacancies FOR DELETE USING (auth.uid() = user_id);

-- Short Jobs: Public read active, owners can manage
CREATE POLICY "Active short jobs are viewable by everyone" ON short_jobs FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "Users can create short jobs" ON short_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own short jobs" ON short_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own short jobs" ON short_jobs FOR DELETE USING (auth.uid() = user_id);

-- Short Job Responses: Users can see their own, job owners can see all for their jobs
CREATE POLICY "Users can view their own responses" ON short_job_responses FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM short_jobs WHERE id = job_id)
);
CREATE POLICY "Users can create responses" ON short_job_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own responses" ON short_job_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Job owners can update responses" ON short_job_responses FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM short_jobs WHERE id = job_id)
);

-- Vacancy Applications: Similar to short job responses
CREATE POLICY "Users can view their own applications" ON vacancy_applications FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM vacancies WHERE id = vacancy_id)
);
CREATE POLICY "Users can create applications" ON vacancy_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON vacancy_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Vacancy owners can update applications" ON vacancy_applications FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM vacancies WHERE id = vacancy_id)
);

-- Payments: Users can only see their own
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites: Users can only see and manage their own
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Categories and Cities: Public read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Cities are viewable by everyone" ON cities FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vacancies_updated_at BEFORE UPDATE ON vacancies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_short_jobs_updated_at BEFORE UPDATE ON short_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-expire jobs
CREATE OR REPLACE FUNCTION expire_old_jobs()
RETURNS void AS $$
BEGIN
    -- Expire vacancies
    UPDATE vacancies
    SET status = 'expired'
    WHERE status = 'active'
    AND expires_at < NOW();

    -- Expire short jobs
    UPDATE short_jobs
    SET status = 'expired'
    WHERE status = 'active'
    AND work_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- Active vacancies with company info
CREATE VIEW active_vacancies_with_company AS
SELECT
    v.*,
    c.name as company_name,
    c.logo_url as company_logo,
    c.city as company_city
FROM vacancies v
LEFT JOIN companies c ON v.company_id = c.id
WHERE v.status = 'active'
ORDER BY v.created_at DESC;

-- Active short jobs with user info
CREATE VIEW active_short_jobs_with_user AS
SELECT
    sj.*,
    u.name as poster_name,
    u.avatar_url as poster_avatar
FROM short_jobs sj
LEFT JOIN users u ON sj.user_id = u.id
WHERE sj.status = 'active'
ORDER BY sj.work_date ASC, sj.created_at DESC;

-- ============================================
-- INDEXES FOR FULL TEXT SEARCH
-- ============================================

CREATE INDEX idx_vacancies_title_search ON vacancies USING gin(to_tsvector('simple', title));
CREATE INDEX idx_vacancies_description_search ON vacancies USING gin(to_tsvector('simple', description));
CREATE INDEX idx_short_jobs_title_search ON short_jobs USING gin(to_tsvector('simple', title));
CREATE INDEX idx_short_jobs_description_search ON short_jobs USING gin(to_tsvector('simple', description));

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE vacancies IS 'Regular job vacancies (permanent positions)';
COMMENT ON TABLE short_jobs IS 'Short-term daily jobs (gündəlik işlər)';
COMMENT ON TABLE short_job_responses IS 'User responses to short-term job postings';
COMMENT ON TABLE vacancy_applications IS 'User applications to regular vacancies';
COMMENT ON TABLE payments IS 'Payment records for both vacancies and short jobs';
COMMENT ON TABLE favorites IS 'User saved jobs (both types)';
COMMENT ON TABLE categories IS 'Categories for both job types';
COMMENT ON TABLE cities IS 'Cities/regions in Azerbaijan';

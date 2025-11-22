-- Fix role constraint issue
-- Проблема: существующие профили могут иметь NULL или другие значения role

-- 1. СНАЧАЛА удаляем constraint (чтобы можно было обновлять данные)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Обновляем все неправильные значения на 'user'
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL OR role NOT IN ('user', 'recruiter');

-- 3. Устанавливаем default для новых записей
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- 4. ТЕПЕРЬ создаем constraint (данные уже исправлены)
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'recruiter'));

-- Комментарий
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 'Allows only user or recruiter roles';

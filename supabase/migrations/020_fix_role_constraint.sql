-- Fix role constraint issue
-- Проблема: существующие профили могут иметь NULL или другие значения role

-- 1. Сначала обновляем все NULL значения на 'user'
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL;

-- 2. Удаляем старый constraint (если есть)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 3. Добавляем новый constraint с правильными значениями
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'recruiter'));

-- 4. Устанавливаем default для новых записей
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- Комментарий
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 'Allows only user or recruiter roles';

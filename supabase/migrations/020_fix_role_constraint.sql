-- НАСТОЯЩАЯ ПРОБЛЕМА: user_role ENUM не содержит 'recruiter'
-- В миграции 001 создан: CREATE TYPE user_role AS ENUM ('user', 'employer', 'admin')
-- Нужно добавить 'recruiter' в ENUM

-- Добавляем новое значение в ENUM (безопасно, ничего не ломает)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'recruiter';

-- Готово! Теперь role может быть 'recruiter'

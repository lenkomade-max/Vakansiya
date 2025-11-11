-- ============================================
-- DELETE OLD JOBS WITH WRONG CATEGORY STRUCTURE
-- Удаляем вакансии, которые напрямую привязаны к главным категориям
-- (правильные вакансии должны быть в подкатегориях)
-- ============================================

-- ВАЖНО: Этот скрипт удалит ~94 вакансии, которые неправильно структурированы
-- Новые вакансии (после исправления парсера) будут сохранены

-- 1. Показываем статистику перед удалением
DO $$
DECLARE
  main_cat_count INTEGER;
  sub_cat_count INTEGER;
BEGIN
  -- Считаем вакансии в главных категориях (НЕПРАВИЛЬНО)
  SELECT COUNT(*) INTO main_cat_count
  FROM jobs j
  JOIN categories c ON j.category = c.id
  WHERE j.status = 'active'
    AND j.job_type IN ('vakansiya', 'gundelik')
    AND c.parent_id IS NULL;

  -- Считаем вакансии в подкатегориях (ПРАВИЛЬНО)
  SELECT COUNT(*) INTO sub_cat_count
  FROM jobs j
  JOIN categories c ON j.category = c.id
  WHERE j.status = 'active'
    AND j.job_type IN ('vakansiya', 'gundelik')
    AND c.parent_id IS NOT NULL;

  RAISE NOTICE 'Статистика до удаления:';
  RAISE NOTICE '  - Вакансии в главных категориях (будут удалены): %', main_cat_count;
  RAISE NOTICE '  - Вакансии в подкатегориях (будут сохранены): %', sub_cat_count;
END $$;

-- 2. Удаляем вакансии напрямую в главных категориях
DELETE FROM jobs
WHERE id IN (
  SELECT j.id
  FROM jobs j
  JOIN categories c ON j.category = c.id
  WHERE j.status = 'active'
    AND j.job_type IN ('vakansiya', 'gundelik')
    AND c.parent_id IS NULL
);

-- 3. Показываем результат
DO $$
DECLARE
  remaining_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_count
  FROM jobs
  WHERE status = 'active'
    AND job_type IN ('vakansiya', 'gundelik');

  RAISE NOTICE 'После удаления осталось % активных вакансий', remaining_count;
END $$;

-- Комментарий для документации
COMMENT ON TABLE jobs IS 'Jobs table. После миграции 011: удалены вакансии напрямую в главных категориях. Теперь все вакансии должны быть в подкатегориях.';

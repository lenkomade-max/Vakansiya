-- ============================================
-- ADD CONTACT NAME AND WORK ADDRESS FIELDS
-- Добавляет поля для имени контакта и точного адреса работы
-- ============================================

-- Add contact_name field (имя человека который создает объявление)
ALTER TABLE jobs ADD COLUMN contact_name TEXT;

-- Add work_address field (точный адрес работы, отдельно от города)
ALTER TABLE jobs ADD COLUMN work_address TEXT;

-- Add comments for documentation
COMMENT ON COLUMN jobs.contact_name IS 'Имя контактного лица (человека который создал объявление)';
COMMENT ON COLUMN jobs.work_address IS 'Точный адрес работы (улица, дом, офис) - дополнение к location (город)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully added contact_name and work_address fields to jobs table';
END $$;

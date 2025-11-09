-- ============================================
-- UPDATE JOBS CATEGORY TO UUID FOREIGN KEY
-- Changes category field from TEXT to UUID with foreign key constraint
-- ============================================

-- Step 1: Add a temporary new column for UUID category
ALTER TABLE jobs ADD COLUMN category_uuid UUID;

-- Step 2: For existing data, try to match category names to IDs (if any exist)
-- This is safe to run even if there's no data
UPDATE jobs
SET category_uuid = (
  SELECT id FROM categories
  WHERE categories.name = jobs.category
  OR categories.name_az = jobs.category
  LIMIT 1
);

-- Step 3: For records that didn't match, assign a default "Other" category
-- For vakansiya jobs without category, use "Other" subcategory under "OtherVacancyMain"
UPDATE jobs
SET category_uuid = (
  SELECT c.id FROM categories c
  INNER JOIN categories parent ON c.parent_id = parent.id
  WHERE c.name = 'Other'
    AND c.type = 'vacancy'
    AND parent.name = 'OtherVacancyMain'
  LIMIT 1
)
WHERE category_uuid IS NULL AND job_type = 'vakansiya';

-- For gundelik jobs without category, use "Other" subcategory under "OtherServicesMain"
UPDATE jobs
SET category_uuid = (
  SELECT c.id FROM categories c
  INNER JOIN categories parent ON c.parent_id = parent.id
  WHERE c.name = 'Other'
    AND c.type = 'short_job'
    AND parent.name = 'OtherServicesMain'
  LIMIT 1
)
WHERE category_uuid IS NULL AND job_type = 'gundelik';

-- Step 4: If there are still NULL values (shouldn't happen), delete those jobs
-- This is a safety measure - we log them first
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM jobs WHERE category_uuid IS NULL;
  IF null_count > 0 THEN
    RAISE NOTICE 'Found % jobs with NULL category - these will be deleted', null_count;
    DELETE FROM jobs WHERE category_uuid IS NULL;
  END IF;
END $$;

-- Step 5: Drop the old TEXT category column
ALTER TABLE jobs DROP COLUMN category;

-- Step 6: Rename the new UUID column to category
ALTER TABLE jobs RENAME COLUMN category_uuid TO category;

-- Step 7: Make category NOT NULL (now that it's UUID and all values are set)
ALTER TABLE jobs ALTER COLUMN category SET NOT NULL;

-- Step 8: Add foreign key constraint to categories table
ALTER TABLE jobs
ADD CONSTRAINT fk_jobs_category
FOREIGN KEY (category)
REFERENCES categories(id)
ON DELETE RESTRICT;

-- Step 9: Create index for faster category lookups
CREATE INDEX idx_jobs_category ON jobs(category);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully updated jobs.category to UUID with foreign key constraint';
END $$;

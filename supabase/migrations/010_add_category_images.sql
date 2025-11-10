-- ============================================
-- ADD IMAGE FIELDS TO CATEGORIES TABLE
-- ============================================

-- Add image_url and image_alt columns
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Add comments
COMMENT ON COLUMN categories.image_url IS 'URL to category image (e.g., /images/categories/construction.jpg)';
COMMENT ON COLUMN categories.image_alt IS 'Alt text for category image (for SEO and accessibility)';

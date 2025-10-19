-- Add support for multiple categories, custom featured icon, and product page customization

-- First, add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS featured_icon TEXT DEFAULT '⭐',
ADD COLUMN IF NOT EXISTS page_layout TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]';

-- Migrate existing single category to categories array
UPDATE products
SET categories = ARRAY[category]
WHERE categories = '{}' AND category IS NOT NULL AND category != '';

-- Update products with empty category
UPDATE products
SET categories = ARRAY['Sem Categoria']
WHERE categories = '{}' OR categories IS NULL;

-- Create index for better performance on categories queries
CREATE INDEX IF NOT EXISTS idx_products_categories ON products USING GIN(categories);

-- Add comment to explain the new fields
COMMENT ON COLUMN products.categories IS 'Array of category names for the product';
COMMENT ON COLUMN products.featured_icon IS 'Custom icon/emoji for featured products (default: ⭐)';
COMMENT ON COLUMN products.page_layout IS 'Layout style for product page: default, minimal, detailed';
COMMENT ON COLUMN products.custom_sections IS 'JSON array of custom sections for product page';

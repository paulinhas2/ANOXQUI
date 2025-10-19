-- Drop the old global product_page_settings table
DROP TABLE IF EXISTS product_page_settings;

-- Add new columns to products table for per-product customization
ALTER TABLE products
ADD COLUMN IF NOT EXISTS badge_id UUID REFERENCES featured_badges(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS enable_reviews BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS custom_rating DECIMAL(2,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS related_product_ids TEXT[] DEFAULT '{}';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_badge_id ON products(badge_id);

-- Add featured column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add images array column to products table (stores multiple image URLs as JSON)
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Update existing products to have at least one image in the array
UPDATE products SET images = ARRAY[image] WHERE images = '{}' OR images IS NULL;

-- Step 1: Rename price column to original_price in products table
ALTER TABLE products RENAME COLUMN price TO original_price;

-- Step 2: Create promotions table for custom discount badges and product promotions
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  badge_text TEXT DEFAULT 'OFF',
  badge_color TEXT DEFAULT '#ef4444',
  badge_text_color TEXT DEFAULT '#ffffff',
  badge_style TEXT DEFAULT 'default' CHECK (badge_style IN ('default', 'rounded', 'sharp', 'glow')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Enable Row Level Security
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to promotions" ON promotions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to promotions" ON promotions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to promotions" ON promotions FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_product_id ON promotions(product_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

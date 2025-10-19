-- Create featured_badges table for customizable badges
CREATE TABLE IF NOT EXISTS featured_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL DEFAULT '⭐',
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_page_settings table for global product page customization
CREATE TABLE IF NOT EXISTS product_page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enable_reviews BOOLEAN DEFAULT true,
  enable_related_products BOOLEAN DEFAULT true,
  max_related_products INTEGER DEFAULT 3,
  default_rating DECIMAL(2,1) DEFAULT 4.5,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default product page settings
INSERT INTO product_page_settings (enable_reviews, enable_related_products, max_related_products, default_rating, total_reviews)
VALUES (true, true, 3, 4.5, 0)
ON CONFLICT DO NOTHING;

-- Insert default featured badges
INSERT INTO featured_badges (name, emoji, color) VALUES
  ('Destaque', '⭐', '#10b981'),
  ('Novo', '🆕', '#3b82f6'),
  ('Popular', '🔥', '#ef4444'),
  ('Oferta', '💎', '#8b5cf6')
ON CONFLICT (name) DO NOTHING;

-- Add badge_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_id UUID REFERENCES featured_badges(id);

-- Enable RLS
ALTER TABLE featured_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_page_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for featured_badges
CREATE POLICY "Allow public read access to featured_badges" ON featured_badges FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to featured_badges" ON featured_badges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to featured_badges" ON featured_badges FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to featured_badges" ON featured_badges FOR DELETE USING (true);

-- Create policies for product_page_settings
CREATE POLICY "Allow public read access to product_page_settings" ON product_page_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update access to product_page_settings" ON product_page_settings FOR UPDATE USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount NUMERIC(5, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Allow public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view)
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Allow public read access to store_settings" ON store_settings FOR SELECT USING (true);

-- Create policies for public write access (for admin panel - in production, you'd want auth)
CREATE POLICY "Allow public insert to products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public insert to categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow public insert to coupons" ON coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to coupons" ON coupons FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to coupons" ON coupons FOR DELETE USING (true);

CREATE POLICY "Allow public insert to store_settings" ON store_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to store_settings" ON store_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to store_settings" ON store_settings FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_store_settings_key ON store_settings(key);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Doces'),
  ('Salgados'),
  ('Bebidas'),
  ('Sobremesas')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, price, image, category, description, stock) VALUES
  ('Brigadeiro', 2.50, '/placeholder.svg?height=200&width=200', 'Doces', 'Delicioso brigadeiro tradicional', 100),
  ('Beijinho', 2.50, '/placeholder.svg?height=200&width=200', 'Doces', 'Beijinho de coco cremoso', 100),
  ('Coxinha', 5.00, '/placeholder.svg?height=200&width=200', 'Salgados', 'Coxinha de frango crocante', 50),
  ('Pastel', 4.50, '/placeholder.svg?height=200&width=200', 'Salgados', 'Pastel de carne ou queijo', 50),
  ('Refrigerante', 5.00, '/placeholder.svg?height=200&width=200', 'Bebidas', 'Refrigerante gelado', 200),
  ('Suco Natural', 6.00, '/placeholder.svg?height=200&width=200', 'Bebidas', 'Suco natural de frutas', 150),
  ('Pudim', 8.00, '/placeholder.svg?height=200&width=200', 'Sobremesas', 'Pudim de leite condensado', 30),
  ('Mousse', 7.00, '/placeholder.svg?height=200&width=200', 'Sobremesas', 'Mousse de chocolate', 40)
ON CONFLICT DO NOTHING;

-- Insert default store settings
INSERT INTO store_settings (key, value) VALUES
  ('storeName', 'Minha Loja Digital'),
  ('storeDescription', 'Os melhores produtos para você!'),
  ('whatsappNumber', '5511999999999'),
  ('primaryColor', '#8b5cf6'),
  ('secondaryColor', '#ec4899')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert sample coupon
INSERT INTO coupons (code, discount, type, active) VALUES
  ('BEMVINDO10', 10, 'percentage', true)
ON CONFLICT (code) DO NOTHING;

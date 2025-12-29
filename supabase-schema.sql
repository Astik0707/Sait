-- ============================================
-- SUPABASE SCHEMA для Pach Group
-- ============================================
-- Выполните этот SQL в Supabase SQL Editor
-- Dashboard → SQL Editor → New Query

-- Таблица объектов недвижимости
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  district TEXT NOT NULL,
  address_hint TEXT NOT NULL,
  price_rub INTEGER NOT NULL,
  area_m2 DECIMAL(10, 2) NOT NULL,
  rooms INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'sale' CHECK (status IN ('sale', 'sold')),
  image_url TEXT NOT NULL,
  image_urls TEXT, -- JSON массив URL изображений
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Таблица завершенных сделок
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge TEXT NOT NULL DEFAULT 'Продано',
  district TEXT NOT NULL,
  date_label TEXT NOT NULL,
  price_rub INTEGER,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  initials TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) - разрешаем чтение всем, запись только авторизованным
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Политики для properties
CREATE POLICY "Anyone can read properties"
  ON properties FOR SELECT
  USING (true);

-- Политики для deals
CREATE POLICY "Anyone can read deals"
  ON deals FOR SELECT
  USING (true);

-- Политики для testimonials
CREATE POLICY "Anyone can read testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- ВАЖНО: Для записи нужно будет настроить аутентификацию через Supabase Auth
-- Или использовать Service Role Key в API (небезопасно для клиента!)
-- Пока используем API с проверкой JWT токена на бэкенде

-- Комментарии к таблицам
COMMENT ON TABLE properties IS 'Объекты недвижимости на продажу';
COMMENT ON TABLE deals IS 'Завершенные сделки';
COMMENT ON TABLE testimonials IS 'Отзывы клиентов';


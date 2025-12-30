-- Добавление полей для изображений в таблицу deals
-- Выполните этот SQL в Supabase SQL Editor

-- Добавляем поля для изображений
ALTER TABLE deals 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT; -- JSON массив URL изображений

-- Комментарии к полям
COMMENT ON COLUMN deals.image_url IS 'Основное изображение сделки';
COMMENT ON COLUMN deals.image_urls IS 'JSON массив URL изображений сделки';


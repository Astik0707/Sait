-- Миграция: Добавление поля image_urls в таблицу properties
-- Выполните этот SQL в Supabase SQL Editor, если таблица уже создана

-- Добавляем поле image_urls (опциональное, может быть NULL)
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS image_urls TEXT;

-- Комментарий к полю
COMMENT ON COLUMN properties.image_urls IS 'JSON массив URL изображений для объекта недвижимости';


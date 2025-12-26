-- Удаление дубликатов из таблицы properties
-- Оставляет только первый объект (по created_at) для каждой уникальной комбинации полей

DELETE FROM properties
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY title, district, address_hint, price_rub, area_m2, rooms
             ORDER BY created_at ASC
           ) as rn
    FROM properties
  ) t
  WHERE rn > 1
);


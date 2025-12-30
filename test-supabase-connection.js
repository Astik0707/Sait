// Простая проверка подключения к Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log('❌ Переменные окружения не найдены');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  try {
    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('❌ Ошибка:', error.message);
    } else {
      console.log('✅ Подключение успешно!');
      console.log(`📊 Записей в таблице properties: ${count || 0}`);
    }
  } catch (e) {
    console.log('❌ Ошибка подключения:', e.message);
  }
}

test();

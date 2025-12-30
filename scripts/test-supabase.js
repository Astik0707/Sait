// Тестовый скрипт для проверки подключения к Supabase
// Запуск: node scripts/test-supabase.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Проверка подключения к Supabase...\n');

// Проверка наличия переменных
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Ошибка: Переменные окружения не найдены!');
  console.log('Проверьте .env.local файл:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Переменные окружения найдены');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

// Создание клиента
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Тест 1: Проверка подключения
    console.log('📡 Тест 1: Проверка подключения...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('properties')
      .select('count')
      .limit(0);
    
    if (healthError && healthError.code !== 'PGRST116') {
      throw healthError;
    }
    console.log('✅ Подключение успешно!\n');

    // Тест 2: Проверка таблиц
    console.log('📊 Тест 2: Проверка таблиц...');
    
    const tables = ['properties', 'deals', 'testimonials'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Таблица "${table}": ${error.message}`);
      } else {
        console.log(`   ✅ Таблица "${table}": OK`);
      }
    }
    console.log('');

    // Тест 3: Подсчет записей
    console.log('📈 Тест 3: Подсчет записей...');
    
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    const { count: dealsCount } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true });
    
    const { count: testimonialsCount } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   📦 Properties: ${propertiesCount || 0} записей`);
    console.log(`   📦 Deals: ${dealsCount || 0} записей`);
    console.log(`   📦 Testimonials: ${testimonialsCount || 0} записей\n`);

    // Тест 4: Проверка структуры таблицы properties
    console.log('🔍 Тест 4: Проверка структуры таблицы properties...');
    const { data: sample, error: sampleError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log(`   ⚠️  Не удалось получить структуру: ${sampleError.message}`);
    } else if (sample && sample.length > 0) {
      console.log('   ✅ Структура таблицы:');
      const keys = Object.keys(sample[0]);
      keys.forEach(key => {
        console.log(`      - ${key}: ${typeof sample[0][key]}`);
      });
    } else {
      console.log('   ℹ️  Таблица пустая, структуру проверить нельзя');
    }
    console.log('');

    // Тест 5: Проверка Service Role Key (если есть)
    if (supabaseServiceRoleKey) {
      console.log('🔐 Тест 5: Проверка Service Role Key...');
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      
      const { data: adminTest, error: adminError } = await supabaseAdmin
        .from('properties')
        .select('count')
        .limit(0);
      
      if (adminError && adminError.code !== 'PGRST116') {
        console.log(`   ⚠️  Service Role Key: ${adminError.message}`);
      } else {
        console.log('   ✅ Service Role Key работает!');
      }
      console.log('');
    }

    console.log('🎉 Все тесты завершены!');
    console.log('\n💡 Следующие шаги:');
    console.log('   1. Если таблицы не существуют, выполните supabase-schema.sql в SQL Editor');
    console.log('   2. Добавьте данные через админку или напрямую в Supabase');
    console.log('   3. Проверьте работу сайта на http://localhost:3000');

  } catch (error) {
    console.error('\n❌ Ошибка при тестировании:');
    console.error('   ', error.message);
    console.error('\n💡 Возможные причины:');
    console.error('   - Неправильный URL или ключ');
    console.error('   - Таблицы не созданы (выполните supabase-schema.sql)');
    console.error('   - Проблемы с сетью');
    process.exit(1);
  }
}

testConnection();


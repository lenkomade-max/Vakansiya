import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://giunonajbfrlasaxqvoi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s'
)

console.log('⏱️  АНАЛИЗ ПРОИЗВОДИТЕЛЬНОСТИ ЗАГРУЗКИ ВАКАНСИЙ\n')

// Тест 1: Загрузка вакансий (как на главной)
console.log('📊 ТЕСТ 1: Загрузка 15 вакансий (первый экран главной)\n')

const start1 = Date.now()
const { data: jobs, error } = await supabase
  .from('jobs')
  .select(`
    *,
    category_info:categories!category (
      id,
      name,
      name_az,
      image_url,
      image_alt,
      parent_id,
      parent_category:categories!parent_id (
        id,
        name_az,
        image_url
      )
    )
  `)
  .eq('status', 'active')
  .eq('job_type', 'vakansiya')
  .order('is_vip', { ascending: false })
  .order('is_urgent', { ascending: false })
  .order('created_at', { ascending: false })
  .limit(15)

const time1 = Date.now() - start1

console.log(`  ✅ Загружено ${jobs?.length} вакансий за ${time1}ms`)
console.log(`  Средняя скорость: ${(time1 / (jobs?.length || 1)).toFixed(0)}ms на вакансию`)

// Тест 2: Загрузка категорий
console.log('\n📊 ТЕСТ 2: Загрузка категорий\n')

const start2 = Date.now()
const { data: categories } = await supabase
  .from('categories')
  .select('*')
  .eq('type', 'vacancy')
  .is('parent_id', null)
  .order('sort_order')

const time2 = Date.now() - start2

console.log(`  ✅ Загружено ${categories?.length} категорий за ${time2}ms`)

// Тест 3: Загрузка городов
console.log('\n📊 ТЕСТ 3: Загрузка городов\n')

const start3 = Date.now()
const { data: cities } = await supabase
  .from('cities')
  .select('name_az')
  .eq('is_active', true)
  .order('sort_order')

const time3 = Date.now() - start3

console.log(`  ✅ Загружено ${cities?.length} городов за ${time3}ms`)

// ИТОГО
console.log('\n📊 ИТОГО для загрузки главной страницы:\n')
const totalTime = time1 + time2 + time3
console.log(`  Вакансии: ${time1}ms`)
console.log(`  Категории: ${time2}ms`)
console.log(`  Города: ${time3}ms`)
console.log(`  ────────────────`)
console.log(`  ВСЕГО: ${totalTime}ms (${(totalTime / 1000).toFixed(1)}s)`)

if (totalTime > 3000) {
  console.log('\n  ⚠️  МЕДЛЕННО! (> 3 секунд)')
  console.log('  Причины:')
  console.log('    - JOIN запросы на parent_category')
  console.log('    - Возможно нет индексов')
  console.log('    - Географическая удаленность от сервера Supabase')
} else if (totalTime > 1000) {
  console.log('\n  ⚡ Приемлемо (1-3 секунды)')
} else {
  console.log('\n  ✅ БЫСТРО! (< 1 секунды)')
}

// Тест 4: Размер данных
console.log('\n📊 ТЕСТ 4: Размер данных\n')
const dataSize = JSON.stringify(jobs).length
console.log(`  Размер ответа: ${(dataSize / 1024).toFixed(1)} KB`)
console.log(`  На 1 вакансию: ${(dataSize / 1024 / (jobs?.length || 1)).toFixed(1)} KB`)

// Проверка индексов
console.log('\n📊 ТЕСТ 5: Проверка фильтров (с индексами?)\n')

const start5 = Date.now()
const { data: filteredJobs } = await supabase
  .from('jobs')
  .select('id, title')
  .eq('status', 'active')
  .eq('job_type', 'vakansiya')
  .limit(50)

const time5 = Date.now() - start5
console.log(`  ✅ Загружено 50 вакансий (без JOIN): ${time5}ms`)

if (time5 > 500) {
  console.log('  ⚠️  Медленно даже без JOIN → возможно нет индексов!')
}

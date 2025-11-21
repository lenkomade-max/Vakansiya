import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://giunonajbfrlasaxqvoi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
    console.log('🔍 Проверка базы данных Supabase...\n')

    // 1. Проверяем количество записей
    console.log('📈 Статистика таблицы jobs:')
    const { count: jobsCount, error: countError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })

    if (!countError) {
        console.log(`   Всего записей: ${jobsCount}`)
    }

    // Количество активных вакансий
    const { count: activeCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('job_type', 'vakansiya')

    console.log(`   Активных вакансий: ${activeCount}`)

    // Количество gündəlik
    const { count: gundelikCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('job_type', 'gundelik')

    console.log(`   Активных gündəlik: ${gundelikCount}`)

    // 2. Тестируем скорость запроса (как на главной странице)
    console.log('\n⏱️  Тест производительности запроса (как на главной):')
    const startTime = Date.now()

    const { data: testJobs, error: testError } = await supabase
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
        .range(0, 14) // Первые 15 записей

    const endTime = Date.now()
    const queryTime = endTime - startTime

    console.log(`   ⏱️  Время выполнения: ${queryTime}ms`)
    console.log(`   📦 Получено записей: ${testJobs?.length || 0}`)

    if (queryTime > 500) {
        console.log('   ⚠️  МЕДЛЕННО! Нужны индексы.')
    } else if (queryTime > 200) {
        console.log('   ⚡ Приемлемо, но можно улучшить.')
    } else {
        console.log('   ✅ БЫСТРО! Индексы работают.')
    }

    // 3. Проверяем таблицу categories
    console.log('\n📊 Проверка таблицы categories:')
    const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

    console.log(`   Всего категорий: ${categoriesCount}`)

    // 4. Делаем еще один тест - простой запрос без JOIN
    console.log('\n⏱️  Тест простого запроса (без JOIN):')
    const startTime2 = Date.now()

    const { data: simpleJobs, error: simpleError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .eq('job_type', 'vakansiya')
        .order('created_at', { ascending: false })
        .range(0, 14)

    const endTime2 = Date.now()
    const queryTime2 = endTime2 - startTime2

    console.log(`   ⏱️  Время выполнения: ${queryTime2}ms`)
    console.log(`   📦 Получено записей: ${simpleJobs?.length || 0}`)

    // 5. Проверяем индексы через SQL
    console.log('\n📊 Проверка индексов в таблице jobs:')
    try {
        const { data: indexes, error: indexError } = await supabase
            .rpc('exec_sql', {
                sql: `
          SELECT 
            indexname,
            indexdef
          FROM pg_indexes 
          WHERE tablename = 'jobs'
          ORDER BY indexname;
        `
            })

        if (indexError) {
            console.log('   ⚠️  Не удалось получить список индексов (нужна RPC функция exec_sql)')
            console.log('   💡 Но мы можем определить наличие индексов по скорости запросов')
        } else {
            console.log('   ✅ Найденные индексы:')
            indexes.forEach(idx => {
                console.log(`      - ${idx.indexname}`)
            })
        }
    } catch (e) {
        console.log('   ⚠️  RPC exec_sql недоступна, пропускаем проверку индексов')
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 ИТОГОВЫЙ АНАЛИЗ:')
    console.log('='.repeat(60))

    if (queryTime > 500) {
        console.log('❌ ПРОБЛЕМА: Запросы очень медленные (>500ms)')
        console.log('💡 РЕШЕНИЕ: Добавить индексы в Supabase')
        console.log('📝 SQL для индексов находится в ANALYSIS.md')
    } else if (queryTime > 200) {
        console.log('⚡ Запросы приемлемые, но есть место для улучшения')
        console.log('💡 Рекомендация: Добавить индексы для еще большей скорости')
    } else {
        console.log('✅ Запросы быстрые! Индексы, скорее всего, уже есть.')
    }

    console.log('\n✅ Проверка завершена!')
}

// Запускаем проверку
checkDatabase().catch(console.error)

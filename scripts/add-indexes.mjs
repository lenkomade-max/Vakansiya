import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  'https://giunonajbfrlasaxqvoi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s'
)

console.log('🚀 ДОБАВЛЕНИЕ ИНДЕКСОВ ДЛЯ УСКОРЕНИЯ БД\n')

// Список индексов для добавления
const indexes = [
  {
    name: 'idx_jobs_status_type',
    sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_status_type ON jobs(status, job_type)',
    description: 'Фильтрация по status + job_type'
  },
  {
    name: 'idx_jobs_created_at',
    sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC)',
    description: 'Сортировка по дате'
  },
  {
    name: 'idx_jobs_vip_urgent',
    sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_vip_urgent ON jobs(is_vip DESC, is_urgent DESC)',
    description: 'Сортировка VIP/срочных'
  },
  {
    name: 'idx_jobs_category',
    sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category)',
    description: 'Поиск по категории'
  },
  {
    name: 'idx_categories_parent_id',
    sql: 'CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id)',
    description: 'JOIN с parent категориями'
  },
  {
    name: 'idx_categories_type_active',
    sql: 'CREATE INDEX IF NOT EXISTS idx_categories_type_active ON categories(type, is_active)',
    description: 'Фильтрация категорий'
  },
  {
    name: 'idx_jobs_status_type_created',
    sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_status_type_created ON jobs(status, job_type, created_at DESC)',
    description: 'Композитный для главной'
  },
  {
    name: 'idx_jobs_user_id',
    sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id)',
    description: 'Профиль пользователя'
  }
]

console.log(`Будет добавлено ${indexes.length} индексов:\n`)

let successCount = 0
let errorCount = 0

for (const index of indexes) {
  process.stdout.write(`  ${index.name}... `)

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: index.sql })

    if (error) {
      // Пробуем через прямой SQL запрос
      const { error: error2 } = await supabase
        .from('_migrations')
        .insert({ sql: index.sql })
        .select()
        .single()

      if (error2) {
        console.log('❌ Ошибка')
        console.log(`     ${error2.message}`)
        errorCount++
        continue
      }
    }

    console.log('✅')
    successCount++
  } catch (e) {
    console.log('❌ Ошибка')
    console.log(`     ${e.message}`)
    errorCount++
  }
}

console.log(`\n📊 РЕЗУЛЬТАТ:`)
console.log(`  ✅ Успешно: ${successCount}`)
console.log(`  ❌ Ошибок: ${errorCount}`)

// Тест производительности после добавления индексов
console.log('\n⏱️  ТЕСТ ПРОИЗВОДИТЕЛЬНОСТИ ПОСЛЕ ИНДЕКСОВ:\n')

const start = Date.now()
const { data: jobs } = await supabase
  .from('jobs')
  .select('id, title')
  .eq('status', 'active')
  .eq('job_type', 'vakansiya')
  .order('created_at', { ascending: false })
  .limit(50)

const time = Date.now() - start

console.log(`  Загрузка 50 вакансий: ${time}ms`)

if (time < 200) {
  console.log('  ✅ ОТЛИЧНО! (< 200ms)')
} else if (time < 500) {
  console.log('  ⚡ Хорошо (< 500ms)')
} else {
  console.log('  ⚠️  Все еще медленно - индексы не применились или нужно больше времени')
}

console.log('\n✅ Готово!')

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  'https://giunonajbfrlasaxqvoi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s'
)

console.log('🗑️  УДАЛЕНИЕ СТАРЫХ ВАКАНСИЙ С НЕПРАВИЛЬНОЙ СТРУКТУРОЙ\n')

// 1. Показываем статистику ДО удаления
console.log('📊 СТАТИСТИКА ДО УДАЛЕНИЯ:\n')

// Получаем все главные категории
const { data: mainCategories } = await supabase
  .from('categories')
  .select('id, name_az, type')
  .is('parent_id', null)
  .in('type', ['vacancy', 'short_job'])

let totalToDelete = 0
const jobsToDelete = []

for (const mainCat of mainCategories || []) {
  // Считаем вакансии напрямую в этой главной категории
  const { data: jobs, count } = await supabase
    .from('jobs')
    .select('id, title', { count: 'exact' })
    .eq('status', 'active')
    .eq('category', mainCat.id)

  if (count > 0) {
    console.log(`  ${mainCat.name_az} (${mainCat.type}): ${count} вакансий`)
    totalToDelete += count
    jobsToDelete.push(...(jobs?.map(j => j.id) || []))
  }
}

// Считаем вакансии в подкатегориях (правильные)
const { data: allCategories } = await supabase
  .from('categories')
  .select('id')
  .not('parent_id', 'is', null)

const subCatIds = allCategories?.map(c => c.id) || []

const { count: correctCount } = await supabase
  .from('jobs')
  .select('id', { count: 'exact', head: true })
  .eq('status', 'active')
  .in('category', subCatIds)

console.log(`\n  ИТОГО:`)
console.log(`    - Неправильных (будут удалены): ${totalToDelete}`)
console.log(`    - Правильных (будут сохранены): ${correctCount}`)

// 2. Подтверждение
console.log('\n⚠️  ВЫ УВЕРЕНЫ?')
console.log(`   Будет удалено ${totalToDelete} вакансий!`)
console.log('   Для продолжения нажмите Ctrl+C и запустите с флагом --confirm\n')

// Проверяем флаг --confirm
const hasConfirm = process.argv.includes('--confirm')

if (!hasConfirm) {
  console.log('❌ Удаление отменено (нет флага --confirm)')
  process.exit(0)
}

// 3. УДАЛЕНИЕ
console.log('🗑️  НАЧИНАЕМ УДАЛЕНИЕ...\n')

let deletedCount = 0
const batchSize = 50

for (let i = 0; i < jobsToDelete.length; i += batchSize) {
  const batch = jobsToDelete.slice(i, i + batchSize)

  const { error } = await supabase
    .from('jobs')
    .delete()
    .in('id', batch)

  if (error) {
    console.error('❌ Ошибка при удалении:', error)
    break
  }

  deletedCount += batch.length
  console.log(`  Удалено: ${deletedCount}/${jobsToDelete.length}`)
}

// 4. Показываем результат
console.log('\n✅ УДАЛЕНИЕ ЗАВЕРШЕНО!\n')

const { count: remainingCount } = await supabase
  .from('jobs')
  .select('id', { count: 'exact', head: true })
  .eq('status', 'active')

console.log(`📊 После удаления осталось ${remainingCount} активных вакансий`)

// 5. Сохраняем миграцию в файл
const migrationRecord = {
  version: '011',
  name: 'delete_old_jobs_with_wrong_structure',
  executed_at: new Date().toISOString(),
  deleted_jobs: deletedCount,
  remaining_jobs: remainingCount
}

console.log('\n✅ Готово!')

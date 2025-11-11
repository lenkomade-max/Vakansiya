import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabase = createClient(
  'https://giunonajbfrlasaxqvoi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s'
)

const BUCKET_NAME = 'category-images'
const IMAGES_DIR = path.join(__dirname, '../public/images/categories')

console.log('📦 ЗАГРУЗКА ФОТОК В SUPABASE STORAGE\n')

// Проверяем что bucket существует
console.log('1️⃣ Проверяем bucket...\n')

const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

if (bucketsError) {
  console.error('❌ Ошибка при проверке buckets:', bucketsError.message)
  process.exit(1)
}

const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

if (!bucketExists) {
  console.log('❌ Bucket "category-images" не найден!')
  console.log('\n📋 СОЗДАЙ BUCKET СНАЧАЛА:')
  console.log('1. Открой: https://supabase.com/dashboard/project/giunonajbfrlasaxqvoi/storage/buckets')
  console.log('2. Нажми "New bucket"')
  console.log('3. Name: category-images')
  console.log('4. Public: ✅ ДА')
  console.log('5. Нажми "Create bucket"\n')
  process.exit(1)
}

console.log('✅ Bucket найден!\n')

// Читаем все файлы из папки
console.log('2️⃣ Сканируем папку с фотками...\n')

if (!fs.existsSync(IMAGES_DIR)) {
  console.error('❌ Папка не найдена:', IMAGES_DIR)
  process.exit(1)
}

const files = fs.readdirSync(IMAGES_DIR).filter(file => {
  return file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp')
})

console.log(`✅ Найдено ${files.length} фоток\n`)

// Загружаем каждый файл
console.log('3️⃣ Загружаем фотки в Storage...\n')

let successCount = 0
let errorCount = 0
let skippedCount = 0

for (const file of files) {
  const filePath = path.join(IMAGES_DIR, file)
  const fileBuffer = fs.readFileSync(filePath)

  process.stdout.write(`  ${file}... `)

  // Проверяем существует ли уже
  const { data: existingFile } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', { search: file })

  if (existingFile && existingFile.length > 0) {
    console.log('⏭️  (уже есть)')
    skippedCount++
    continue
  }

  // Загружаем
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(file, fileBuffer, {
      contentType: file.endsWith('.png') ? 'image/png' :
                   file.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      upsert: false
    })

  if (error) {
    console.log('❌')
    console.log(`     Ошибка: ${error.message}`)
    errorCount++
  } else {
    console.log('✅')
    successCount++
  }
}

console.log('\n📊 РЕЗУЛЬТАТ:')
console.log(`  ✅ Загружено: ${successCount}`)
console.log(`  ⏭️  Пропущено (уже есть): ${skippedCount}`)
console.log(`  ❌ Ошибок: ${errorCount}`)

if (successCount > 0 || skippedCount > 0) {
  console.log('\n✅ ГОТОВО!')
  console.log('\n📋 СЛЕДУЮЩИЙ ШАГ:')
  console.log('Запусти: node scripts/update-category-images.mjs')
  console.log('Это обновит image_url в БД для всех категорий\n')
} else {
  console.log('\n❌ Ничего не загружено. Проверь bucket и папку с фотками.\n')
}

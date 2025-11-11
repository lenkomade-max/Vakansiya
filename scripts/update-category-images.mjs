import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://giunonajbfrlasaxqvoi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s'
)

const BUCKET_NAME = 'category-images'
const STORAGE_BASE_URL = `https://giunonajbfrlasaxqvoi.supabase.co/storage/v1/object/public/${BUCKET_NAME}`

console.log('🔄 ОБНОВЛЕНИЕ IMAGE_URL В БД\n')

// Маппинг: название категории (en) → файл
const categoryImageMapping = {
  // IT & Technology
  'FrontendDev': 'developer.jpeg',
  'BackendDev': 'developer.jpeg',
  'FullStackDev': 'developer.jpeg',
  'MobileDev': 'developer.jpeg',
  'DevOps': 'developer.jpeg',
  'QAEngineer': 'developer.jpeg',
  'DataAnalyst': 'data-analyst.jpeg',
  'SystemAdmin': 'it-support.jpeg',
  'ITSupport': 'it-support.jpeg',

  // Sales
  'SalesManager': 'sales.jpeg',
  'Cashier': 'cashier.jpeg',

  // Marketing
  'MarketingManager': 'marketing.png',
  'SMMManager': 'smm.png',
  'ContentManager': 'office.jpeg',

  // Healthcare
  'Doctor': 'doctor.jpeg',
  'Nurse': 'doctor.jpeg',
  'Pharmacist': 'pharmacist.jpeg',

  // Education
  'Teacher': 'teacher.png',
  'Tutor': 'teacher.png',
  'LanguageTeacher': 'teacher.png',
  'Translator': 'translator.png',

  // Finance
  'Accountant': 'accountant.jpeg',

  // Construction
  'Engineer': 'engineer.jpeg',
  'Electrician': 'electrician.jpeg',

  // Restaurant
  'Chef': 'chef.jpeg',
  'Waiter': 'waiter.png',
  'Barista': 'barista.jpeg',

  // Transport
  'Driver': 'driver.png',
  'Courier': 'courier.jpeg',

  // Admin
  'OfficeManager': 'office-manager.jpeg',
  'Secretary': 'office.jpeg',
  'Receptionist': 'receptionist.jpeg',

  // Design
  'GraphicDesigner': 'designer.jpeg',
  'UXUIDesigner': 'ux-designer.jpeg',

  // Other
  'Security': 'security.jpeg',
  'Cleaner': 'cleaning.jpeg',
  'Photographer': 'photographer.jpeg',

  // Short jobs
  'Cleaning': 'cleaning.jpeg',
  'Cooking': 'chef.jpeg',
  'Event': 'event.png',
  'Promotion': 'sales.jpeg',
  'Loading': 'warehouse.jpeg',
  'Packing': 'warehouse.jpeg',
}

// 1. Получаем список файлов в Storage
console.log('1️⃣ Получаем список файлов из Storage...\n')

const { data: files, error: filesError } = await supabase.storage
  .from(BUCKET_NAME)
  .list('')

if (filesError) {
  console.error('❌ Ошибка:', filesError.message)
  process.exit(1)
}

console.log(`✅ Найдено ${files?.length || 0} файлов в Storage\n`)

// 2. Получаем все категории
console.log('2️⃣ Получаем категории из БД...\n')

const { data: categories, error: categoriesError } = await supabase
  .from('categories')
  .select('id, name, name_az, image_url, type')
  .order('name')

if (categoriesError) {
  console.error('❌ Ошибка:', categoriesError.message)
  process.exit(1)
}

console.log(`✅ Найдено ${categories?.length || 0} категорий\n`)

// 3. Обновляем image_url
console.log('3️⃣ Обновляем image_url...\n')

let updatedCount = 0
let skippedCount = 0
let notFoundCount = 0

for (const category of categories || []) {
  // Ищем соответствующий файл
  const fileName = categoryImageMapping[category.name]

  if (!fileName) {
    // Нет маппинга для этой категории
    skippedCount++
    continue
  }

  // Проверяем что файл существует в Storage
  const fileExists = files?.some(f => f.name === fileName)

  if (!fileExists) {
    console.log(`  ⚠️  ${category.name_az}: файл ${fileName} не найден в Storage`)
    notFoundCount++
    continue
  }

  // Формируем URL
  const imageUrl = `${STORAGE_BASE_URL}/${fileName}`

  // Обновляем в БД
  const { error } = await supabase
    .from('categories')
    .update({ image_url: imageUrl })
    .eq('id', category.id)

  if (error) {
    console.log(`  ❌ ${category.name_az}: ошибка обновления`)
  } else {
    console.log(`  ✅ ${category.name_az}: ${fileName}`)
    updatedCount++
  }
}

console.log('\n📊 РЕЗУЛЬТАТ:')
console.log(`  ✅ Обновлено: ${updatedCount}`)
console.log(`  ⏭️  Пропущено (нет маппинга): ${skippedCount}`)
console.log(`  ⚠️  Файл не найден: ${notFoundCount}`)

if (updatedCount > 0) {
  console.log('\n✅ ГОТОВО! Фотки категорий обновлены.')
  console.log('Открой сайт и проверь что фотки загружаются.\n')
} else {
  console.log('\n⚠️  Ничего не обновлено. Проверь маппинг и файлы в Storage.\n')
}

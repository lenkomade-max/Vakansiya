/**
 * Утилита для получения изображений категорий
 *
 * Логика:
 * 1. Проверяет category.image_url из БД
 * 2. Если NULL → использует fallback из конфига
 * 3. Если и там нет → placeholder
 */

import { CATEGORY_IMAGES, PLACEHOLDER_IMAGE, CATEGORY_IMAGE_ALTS } from '@/lib/category-images';

export interface CategoryWithImage {
  name: string;
  image_url?: string | null;
  image_alt?: string | null;
}

/**
 * Получить URL изображения для категории
 *
 * @param category - Категория с опциональным image_url
 * @returns URL изображения
 */
export function getCategoryImage(category: CategoryWithImage | string): string {
  // Если передана строка (имя категории)
  if (typeof category === 'string') {
    return CATEGORY_IMAGES[category] || PLACEHOLDER_IMAGE;
  }

  // Если передан объект категории
  // 1. Приоритет: image_url из БД
  if (category.image_url) {
    return category.image_url;
  }

  // 2. Fallback: конфиг
  if (CATEGORY_IMAGES[category.name]) {
    return CATEGORY_IMAGES[category.name];
  }

  // 3. Placeholder
  return PLACEHOLDER_IMAGE;
}

/**
 * Получить alt текст для изображения категории
 *
 * @param category - Категория с опциональным image_alt
 * @returns Alt текст для изображения
 */
export function getCategoryImageAlt(category: CategoryWithImage | string): string {
  // Если передана строка (имя категории)
  if (typeof category === 'string') {
    return CATEGORY_IMAGE_ALTS[category] || 'Kateqoriya şəkli';
  }

  // Если передан объект категории
  // 1. Приоритет: image_alt из БД
  if (category.image_alt) {
    return category.image_alt;
  }

  // 2. Fallback: конфиг
  if (CATEGORY_IMAGE_ALTS[category.name]) {
    return CATEGORY_IMAGE_ALTS[category.name];
  }

  // 3. Generic fallback
  return 'Kateqoriya şəkli';
}

/**
 * Проверить существует ли изображение для категории
 *
 * @param categoryName - Название категории
 * @returns true если изображение настроено
 */
export function hasCategoryImage(categoryName: string): boolean {
  return categoryName in CATEGORY_IMAGES;
}

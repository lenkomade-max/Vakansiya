'use client'

import React from 'react'
import { CategoryIcon, CATEGORIES, ShortJobCategory } from '@/components/short-jobs/CategoryIcons'

export type Category = {
  id: string
  name: string
  name_az: string
  type: 'vacancy' | 'short_job'
  parent_id: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface CategoryDashboardProps {
  activeTab: 'vakansiyalar' | 'gundelik'
  selectedCategory?: string
  onCategorySelect: (category: string) => void
  vakansiyaCategories?: Category[]
  gundelikCategories?: Category[]
}

export const CategoryDashboard: React.FC<CategoryDashboardProps> = ({
  activeTab,
  selectedCategory,
  onCategorySelect,
  vakansiyaCategories = [],
  gundelikCategories = [],
}) => {
  // Маппинг категорий из БД к иконкам
  const getCategoryIcon = (name: string): string => {
    const iconMap: Record<string, string> = {
      // Vakansiyalar
      'it': '💻',
      'texnologiya': '💻',
      'satış': '🛒',
      'marketinq': '📢',
      'hr': '👥',
      'kadr': '👥',
      'maliyyə': '💰',
      'təhsil': '📚',
      'tibb': '⚕️',
      'sağlamlıq': '⚕️',
    }

    const nameLower = name.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (nameLower.includes(key)) return icon
    }
    return '📋'
  }

  const categories = activeTab === 'vakansiyalar' ? vakansiyaCategories : gundelikCategories

  // Маппинг name к ShortJobCategory для иконок
  const getShortJobCategoryId = (name: string): ShortJobCategory | null => {
    const nameMap: Record<string, ShortJobCategory> = {
      'TransportMain': 'transport',
      'ConstructionMain': 'construction',
      'HomeServicesMain': 'cleaning',
      'RestaurantMain': 'restaurant',
      'WarehouseMain': 'warehouse',
      'OfficeMain': 'office',
      'CreativeMain': 'creative',
      'ITMain': 'services',
    }
    return nameMap[name] || null
  }

  return (
    <div className="w-full bg-white py-4 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-8">
          {/* Кнопка "Hamısı" */}
          <button
            onClick={() => onCategorySelect('')}
            className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all ${
              !selectedCategory
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl">📋</span>
            <span className="text-xs font-medium whitespace-nowrap">Hamısı</span>
          </button>

          {/* Категории из БД */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name_az
            const shortJobCategoryId = getShortJobCategoryId(cat.name)

            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.name_az)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {activeTab === 'gundelik' && shortJobCategoryId ? (
                  <CategoryIcon
                    category={shortJobCategoryId}
                    size="md"
                    showBackground={false}
                  />
                ) : (
                  <span className="text-2xl">{getCategoryIcon(cat.name_az)}</span>
                )}
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}>
                  {cat.name_az}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryDashboard

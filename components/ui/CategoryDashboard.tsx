'use client'

import React from 'react'
import { CategoryIcon, CATEGORIES, ShortJobCategory } from '@/components/short-jobs/CategoryIcons'

export interface CategoryDashboardProps {
  activeTab: 'vakansiyalar' | 'gundelik'
  selectedCategory?: string
  onCategorySelect: (category: string) => void
}

// Категории для Vakansiyalar (обычные вакансии)
const VAKANSIYA_CATEGORIES = [
  { id: 'all', nameAz: 'Hamısı', icon: '📋' },
  { id: 'it', nameAz: 'İT', icon: '💻' },
  { id: 'sales', nameAz: 'Satış', icon: '🛒' },
  { id: 'marketing', nameAz: 'Marketinq', icon: '📢' },
  { id: 'hr', nameAz: 'HR', icon: '👥' },
  { id: 'finance', nameAz: 'Maliyyə', icon: '💰' },
  { id: 'education', nameAz: 'Təhsil', icon: '📚' },
  { id: 'health', nameAz: 'Tibb', icon: '⚕️' },
]

export const CategoryDashboard: React.FC<CategoryDashboardProps> = ({
  activeTab,
  selectedCategory,
  onCategorySelect,
}) => {
  // Выбираем категории в зависимости от активного таба
  const categories = activeTab === 'vakansiyalar' ? VAKANSIYA_CATEGORIES : CATEGORIES

  return (
    <div className="w-full bg-white py-4 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-8">
          {activeTab === 'vakansiyalar' ? (
            // Vakansiyalar categories (emoji icons)
            VAKANSIYA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id === 'all' ? '' : cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all ${
                  (cat.id === 'all' && !selectedCategory) || selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{cat.nameAz}</span>
              </button>
            ))
          ) : (
            // Gündəlik categories (CategoryIcon components)
            <>
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
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategorySelect(cat.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-black'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <CategoryIcon
                    category={cat.id as ShortJobCategory}
                    size="md"
                    showBackground={false}
                  />
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    selectedCategory === cat.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {cat.nameAz}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryDashboard

'use client'

import React from 'react'
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  PaintBrushIcon,
  CameraIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  HeartIcon,
  BanknotesIcon,
  EllipsisHorizontalIcon,
  BriefcaseIcon,
  ChartBarIcon,
  MegaphoneIcon,
  UserGroupIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

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

// Конфигурация иконок для категорий
type CategoryConfig = {
  icon: React.ComponentType<{ className?: string }>
}

export const CategoryDashboard: React.FC<CategoryDashboardProps> = ({
  activeTab,
  selectedCategory,
  onCategorySelect,
  vakansiyaCategories = [],
  gundelikCategories = [],
}) => {
  const categories = activeTab === 'vakansiyalar' ? vakansiyaCategories : gundelikCategories

  // Маппинг категорий к иконкам
  const getCategoryConfig = (name: string, nameAz: string): CategoryConfig => {
    const nameLower = name.toLowerCase()
    const nameAzLower = nameAz.toLowerCase()

    // Gündəlik İşlər
    if (nameLower.includes('transport') || nameAzLower.includes('nəqliyyat')) {
      return { icon: TruckIcon }
    }
    if (nameLower.includes('construction') || nameAzLower.includes('tikinti')) {
      return { icon: WrenchScrewdriverIcon }
    }
    if (nameLower.includes('home') || nameAzLower.includes('ev xidmət')) {
      return { icon: SparklesIcon }
    }
    if (nameLower.includes('restaurant') || nameAzLower.includes('restoran')) {
      return { icon: ShoppingBagIcon }
    }
    if (nameLower.includes('warehouse') || nameAzLower.includes('anbar')) {
      return { icon: BuildingOfficeIcon }
    }
    if (nameLower.includes('office') || nameAzLower.includes('ofis')) {
      return { icon: BriefcaseIcon }
    }
    if (nameLower.includes('creative') || nameAzLower.includes('yaradıcı')) {
      return { icon: PaintBrushIcon }
    }
    if (nameLower.includes('education') || nameAzLower.includes('təhsil')) {
      return { icon: AcademicCapIcon }
    }
    if (nameLower.includes('health') || nameAzLower.includes('tibb') || nameAzLower.includes('gözəllik')) {
      return { icon: HeartIcon }
    }
    if (nameLower.includes('finance') || nameAzLower.includes('maliyyə')) {
      return { icon: BanknotesIcon }
    }

    // Vakansiyalar
    if (nameLower.includes('it') || nameAzLower.includes('texnologiya')) {
      return { icon: ComputerDesktopIcon }
    }
    if (nameAzLower.includes('satış')) {
      return { icon: ChartBarIcon }
    }
    if (nameAzLower.includes('marketinq')) {
      return { icon: MegaphoneIcon }
    }
    if (nameAzLower.includes('kadr') || nameLower.includes('hr')) {
      return { icon: UserGroupIcon }
    }

    // Default
    return { icon: EllipsisHorizontalIcon }
  }

  return (
    <div className="w-full bg-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Grid: 2 columns mobile, 4 columns desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Кнопка "Hamısı" */}
          <button
            onClick={() => onCategorySelect('')}
            className="flex flex-col items-center gap-3 group"
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all ${!selectedCategory
                ? 'bg-black shadow-lg'
                : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
              <BriefcaseIcon className={`w-8 h-8 md:w-10 md:h-10 ${!selectedCategory ? 'text-white' : 'text-gray-700'
                }`} />
            </div>
            <span className={`text-sm font-medium text-center ${!selectedCategory ? 'text-black font-bold' : 'text-gray-600'
              }`}>
              Hamısı
            </span>
          </button>

          {/* Категории из БД */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name_az
            const config = getCategoryConfig(cat.name, cat.name_az)
            const Icon = config.icon

            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.name_az)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all ${isSelected
                    ? 'bg-black shadow-lg'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${isSelected ? 'text-white' : 'text-gray-700'
                    }`} />
                </div>
                <span className={`text-sm font-medium text-center leading-tight ${isSelected ? 'text-black font-bold' : 'text-gray-600'
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

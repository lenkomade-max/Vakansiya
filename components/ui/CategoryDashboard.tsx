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

// Конфигурация иконок и цветов для категорий
type CategoryConfig = {
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
}

export const CategoryDashboard: React.FC<CategoryDashboardProps> = ({
  activeTab,
  selectedCategory,
  onCategorySelect,
  vakansiyaCategories = [],
  gundelikCategories = [],
}) => {
  const categories = activeTab === 'vakansiyalar' ? vakansiyaCategories : gundelikCategories

  // Маппинг категорий к иконкам и цветам
  const getCategoryConfig = (name: string, nameAz: string): CategoryConfig => {
    const nameLower = name.toLowerCase()
    const nameAzLower = nameAz.toLowerCase()

    // Gündəlik İşlər
    if (nameLower.includes('transport') || nameAzLower.includes('nəqliyyat')) {
      return { icon: TruckIcon, bgColor: 'bg-blue-500' }
    }
    if (nameLower.includes('construction') || nameAzLower.includes('tikinti')) {
      return { icon: WrenchScrewdriverIcon, bgColor: 'bg-orange-500' }
    }
    if (nameLower.includes('home') || nameAzLower.includes('ev xidmət')) {
      return { icon: SparklesIcon, bgColor: 'bg-green-500' }
    }
    if (nameLower.includes('restaurant') || nameAzLower.includes('restoran')) {
      return { icon: ShoppingBagIcon, bgColor: 'bg-pink-500' }
    }
    if (nameLower.includes('warehouse') || nameAzLower.includes('anbar')) {
      return { icon: BuildingOfficeIcon, bgColor: 'bg-purple-500' }
    }
    if (nameLower.includes('office') || nameAzLower.includes('ofis')) {
      return { icon: BriefcaseIcon, bgColor: 'bg-indigo-500' }
    }
    if (nameLower.includes('creative') || nameAzLower.includes('yaradıcı')) {
      return { icon: PaintBrushIcon, bgColor: 'bg-pink-500' }
    }
    if (nameLower.includes('education') || nameAzLower.includes('təhsil')) {
      return { icon: AcademicCapIcon, bgColor: 'bg-yellow-500' }
    }
    if (nameLower.includes('health') || nameAzLower.includes('tibb') || nameAzLower.includes('gözəllik')) {
      return { icon: HeartIcon, bgColor: 'bg-rose-500' }
    }
    if (nameLower.includes('finance') || nameAzLower.includes('maliyyə')) {
      return { icon: BanknotesIcon, bgColor: 'bg-emerald-500' }
    }

    // Vakansiyalar
    if (nameLower.includes('it') || nameAzLower.includes('texnologiya')) {
      return { icon: ComputerDesktopIcon, bgColor: 'bg-cyan-500' }
    }
    if (nameAzLower.includes('satış')) {
      return { icon: ChartBarIcon, bgColor: 'bg-teal-500' }
    }
    if (nameAzLower.includes('marketinq')) {
      return { icon: MegaphoneIcon, bgColor: 'bg-violet-500' }
    }
    if (nameAzLower.includes('kadr') || nameLower.includes('hr')) {
      return { icon: UserGroupIcon, bgColor: 'bg-fuchsia-500' }
    }

    // Default
    return { icon: EllipsisHorizontalIcon, bgColor: 'bg-gray-500' }
  }

  return (
    <div className="w-full bg-white py-6 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-8">
          {/* Кнопка "Hamısı" */}
          <button
            onClick={() => onCategorySelect('')}
            className="flex-shrink-0 flex flex-col items-center gap-3 group"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${!selectedCategory
                ? 'bg-black shadow-lg scale-110'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}>
              <BriefcaseIcon className={`w-7 h-7 ${!selectedCategory ? 'text-white' : 'text-gray-700'
                }`} />
            </div>
            <span className={`text-xs font-medium text-center whitespace-nowrap ${!selectedCategory ? 'text-black font-bold' : 'text-gray-600'
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
                className="flex-shrink-0 flex flex-col items-center gap-3 group"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isSelected
                    ? 'bg-black shadow-lg scale-110'
                    : `${config.bgColor} hover:scale-105`
                  }`}>
                  <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-white'
                    }`} />
                </div>
                <span className={`text-xs font-medium text-center whitespace-nowrap max-w-[80px] ${isSelected ? 'text-black font-bold' : 'text-gray-600'
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

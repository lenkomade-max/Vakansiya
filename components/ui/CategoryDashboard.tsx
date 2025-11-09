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
  iconColor: string
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
      return { icon: TruckIcon, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' }
    }
    if (nameLower.includes('construction') || nameAzLower.includes('tikinti')) {
      return { icon: WrenchScrewdriverIcon, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' }
    }
    if (nameLower.includes('home') || nameAzLower.includes('ev xidmət')) {
      return { icon: SparklesIcon, bgColor: 'bg-green-100', iconColor: 'text-green-600' }
    }
    if (nameLower.includes('restaurant') || nameAzLower.includes('restoran')) {
      return { icon: ShoppingBagIcon, bgColor: 'bg-red-100', iconColor: 'text-red-600' }
    }
    if (nameLower.includes('warehouse') || nameAzLower.includes('anbar')) {
      return { icon: BuildingOfficeIcon, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' }
    }
    if (nameLower.includes('office') || nameAzLower.includes('ofis')) {
      return { icon: BriefcaseIcon, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' }
    }
    if (nameLower.includes('creative') || nameAzLower.includes('yaradıcı')) {
      return { icon: PaintBrushIcon, bgColor: 'bg-pink-100', iconColor: 'text-pink-600' }
    }
    if (nameLower.includes('education') || nameAzLower.includes('təhsil')) {
      return { icon: AcademicCapIcon, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' }
    }
    if (nameLower.includes('health') || nameAzLower.includes('tibb') || nameAzLower.includes('gözəllik')) {
      return { icon: HeartIcon, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' }
    }
    if (nameLower.includes('finance') || nameAzLower.includes('maliyyə')) {
      return { icon: BanknotesIcon, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' }
    }

    // Vakansiyalar
    if (nameLower.includes('it') || nameAzLower.includes('texnologiya')) {
      return { icon: ComputerDesktopIcon, bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' }
    }
    if (nameAzLower.includes('satış')) {
      return { icon: ChartBarIcon, bgColor: 'bg-teal-100', iconColor: 'text-teal-600' }
    }
    if (nameAzLower.includes('marketinq')) {
      return { icon: MegaphoneIcon, bgColor: 'bg-violet-100', iconColor: 'text-violet-600' }
    }
    if (nameAzLower.includes('kadr') || nameLower.includes('hr')) {
      return { icon: UserGroupIcon, bgColor: 'bg-fuchsia-100', iconColor: 'text-fuchsia-600' }
    }

    // Default
    return { icon: EllipsisHorizontalIcon, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' }
  }

  return (
    <div className="w-full bg-white py-4 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-8">
          {/* Кнопка "Hamısı" */}
          <button
            onClick={() => onCategorySelect('')}
            className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
              !selectedCategory
                ? 'bg-black'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              !selectedCategory ? 'bg-white' : 'bg-gray-200'
            }`}>
              <BriefcaseIcon className={`w-6 h-6 ${
                !selectedCategory ? 'text-black' : 'text-gray-600'
              }`} />
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${
              !selectedCategory ? 'text-white' : 'text-gray-700'
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
                className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-black'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-white' : config.bgColor
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-black' : config.iconColor
                  }`} />
                </div>
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

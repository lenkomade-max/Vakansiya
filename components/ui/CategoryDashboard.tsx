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
  BeakerIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  FunnelIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon
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

  // Маппинг категорий к УНИКАЛЬНЫМ иконкам
  const getCategoryConfig = (name: string, nameAz: string): CategoryConfig => {
    const nameLower = name.toLowerCase()
    const nameAzLower = nameAz.toLowerCase()

    // === VAKANSIYALAR ===
    // IT və texnologiya
    if (nameLower.includes('it') || nameAzLower.includes('texnologiya')) {
      return { icon: ComputerDesktopIcon }
    }
    // Satış
    if (nameAzLower.includes('satış') || nameLower.includes('sales')) {
      return { icon: ChartBarIcon }
    }
    // Marketinq və reklam
    if (nameAzLower.includes('marketinq') || nameAzLower.includes('reklam')) {
      return { icon: MegaphoneIcon }
    }
    // Tibb və əczaçılıq
    if (nameAzLower.includes('tibb') || nameAzLower.includes('əczaçılıq') || nameLower.includes('medical')) {
      return { icon: HeartIcon }
    }
    // Təhsil
    if (nameAzLower.includes('təhsil') || nameLower.includes('education')) {
      return { icon: AcademicCapIcon }
    }
    // Maliyyə və mühasibat
    if (nameAzLower.includes('maliyyə') || nameAzLower.includes('mühasibat') || nameLower.includes('finance') || nameLower.includes('accounting')) {
      return { icon: BanknotesIcon }
    }
    // Tikinti və təmir
    if (nameAzLower.includes('tikinti') || nameAzLower.includes('təmir') || nameLower.includes('construction')) {
      return { icon: WrenchScrewdriverIcon }
    }
    // Restoran və turizm
    if (nameAzLower.includes('restoran') || nameAzLower.includes('turizm') || nameLower.includes('restaurant') || nameLower.includes('tourism')) {
      return { icon: ShoppingBagIcon }
    }
    // Nəqliyyat və logistika
    if (nameAzLower.includes('nəqliyyat') || nameAzLower.includes('logistika') || nameLower.includes('transport') || nameLower.includes('logistics')) {
      return { icon: TruckIcon }
    }
    // İnzibati işlər
    if (nameAzLower.includes('inzibati') || nameLower.includes('administrative')) {
      return { icon: ClipboardDocumentListIcon }
    }
    // Dizayn
    if (nameAzLower.includes('dizayn') || nameLower.includes('design')) {
      return { icon: PaintBrushIcon }
    }
    // Kadr və HR
    if (nameAzLower.includes('kadr') || nameLower.includes('hr') || nameLower.includes('human resources')) {
      return { icon: UserGroupIcon }
    }
    // Hüquq
    if (nameAzLower.includes('hüquq') || nameLower.includes('legal') || nameLower.includes('law')) {
      return { icon: ShieldCheckIcon }
    }

    // === GÜNDƏLIK İŞLƏR ===
    // Ev xidməti
    if (nameAzLower.includes('ev xidmət') || nameLower.includes('home service')) {
      return { icon: SparklesIcon }
    }
    // Anbar
    if (nameAzLower.includes('anbar') || nameLower.includes('warehouse')) {
      return { icon: BuildingOfficeIcon }
    }
    // Ofis işləri
    if (nameAzLower.includes('ofis') && !nameAzLower.includes('inzibati')) {
      return { icon: BriefcaseIcon }
    }
    // Yaradıcı işlər
    if (nameAzLower.includes('yaradıcı') || nameLower.includes('creative')) {
      return { icon: CameraIcon }
    }
    // Gözəllik
    if (nameAzLower.includes('gözəllik') || nameLower.includes('beauty')) {
      return { icon: SparklesIcon }
    }

    // Digər (Other)
    if (nameAzLower.includes('digər') || nameAzLower.includes('diger') || nameLower.includes('other')) {
      return { icon: EllipsisHorizontalIcon }
    }

    // Default fallback
    return { icon: BriefcaseIcon }
  }

  return (
    <div className="w-full bg-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:grid md:grid-cols-4 md:gap-8">
          {/* Кнопка "Hamısı" */}
          <button
            onClick={() => onCategorySelect('')}
            className="flex-shrink-0 flex flex-col items-center gap-3 group"
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${!selectedCategory
                ? 'bg-black shadow-lg'
                : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
              <BriefcaseIcon className={`w-4 h-4 md:w-5 md:h-5 ${!selectedCategory ? 'text-white' : 'text-gray-700'
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
                className="flex-shrink-0 flex flex-col items-center gap-3 group"
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${isSelected
                    ? 'bg-black shadow-lg'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isSelected ? 'text-white' : 'text-gray-700'
                    }`} />
                </div>
                <span className={`text-sm font-medium text-center leading-tight whitespace-nowrap ${isSelected ? 'text-black font-bold' : 'text-gray-600'
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

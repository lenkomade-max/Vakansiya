'use client'

import React, { useState } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'

export interface FilterOptions {
  minSalary?: number
  maxSalary?: number
  location?: string
  startDate?: string
}

export interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  if (!isOpen) return null

  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  const cities = [
    'Bakı, Nəsimi',
    'Bakı, Nərimanov',
    'Bakı, Yasamal',
    'Bakı, Xətai',
    'Bakı, Səbail',
    'Bakı, Nizami',
    'Bakı, Binəqədi',
    'Bakı, Sabunçu',
    'Sumqayıt',
    'Gəncə',
  ]

  const startDates = [
    'Bu gün',
    'Sabah',
    '3 Noyabr',
    '4 Noyabr',
    '5 Noyabr',
    '8 Noyabr',
    'Bu həftə',
    'Gələn həftə',
  ]

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({})
    onApply({})
    onClose()
  }

  const handleInputChange = (field: keyof FilterOptions, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg md:mx-4 p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-6 h-6 text-black" />
            <h3 className="text-xl font-bold text-black">
              Filtr
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Bağla"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {/* Şəhər/Rayon */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Şəhər / Rayon
            </label>
            <select
              value={filters.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
            >
              <option value="">Hamısı</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Başlama tarixi */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Başlama tarixi
            </label>
            <select
              value={filters.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
            >
              <option value="">Hamısı</option>
              {startDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          {/* Əmək haqqı aralığı */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Əmək haqqı (AZN/gün)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  value={filters.minSalary || ''}
                  onChange={(e) => handleInputChange('minSalary', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Min"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={filters.maxSalary || ''}
                  onChange={(e) => handleInputChange('maxSalary', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Max"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Gündəlik əmək haqqı aralığını daxil edin
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleApply}
            className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95"
          >
            Filtri tətbiq et
          </button>

          <button
            onClick={handleReset}
            className="w-full px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
          >
            Sıfırla
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @media (min-width: 768px) {
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default FilterModal

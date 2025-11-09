'use client'

import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  placeholder?: string
  cities?: string[] // Города из БД
}

export interface SearchFilters {
  query: string
  location: string
  category: string
  salaryMin?: number
  salaryMax?: number
  employmentType?: string
  experience?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Vəzifə, açar söz...',
  cities = [],
}) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [experience, setExperience] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      query,
      location,
      category,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      employmentType,
      experience,
    })
  }

  const handleClear = () => {
    setQuery('')
    setLocation('')
    setCategory('')
    setSalaryMin('')
    setSalaryMax('')
    setEmploymentType('')
    setExperience('')
    onSearch({
      query: '',
      location: '',
      category: '',
      salaryMin: undefined,
      salaryMax: undefined,
      employmentType: '',
      experience: '',
    })
  }

  // Подсчет активных фильтров
  const activeFiltersCount = [
    query,
    location,
    salaryMin,
    salaryMax,
    employmentType,
    experience
  ].filter(Boolean).length

  // Формирование текста активных фильтров
  const getActiveFiltersText = () => {
    const filters = []
    if (query) filters.push(`"${query}"`)
    if (location) filters.push(location)
    if (salaryMin || salaryMax) {
      if (salaryMin && salaryMax) filters.push(`${salaryMin}-${salaryMax} AZN`)
      else if (salaryMin) filters.push(`${salaryMin}+ AZN`)
      else if (salaryMax) filters.push(`${salaryMax}- AZN`)
    }
    if (employmentType) filters.push(employmentType)
    if (experience) filters.push(experience)
    return filters
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* MOBILE: Минималистичный поиск */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {/* Input с иконкой лупы внутри */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* Кнопка расширенного поиска */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`relative px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                showAdvanced
                  ? 'bg-gray-800 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Активные фильтры (чипы) */}
          {activeFiltersCount > 0 && !showAdvanced && (
            <div className="mt-2 flex flex-wrap gap-2">
              {getActiveFiltersText().map((filter, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-black text-white text-xs rounded-full"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}

          {/* Расширенный поиск (выдвижная панель) */}
          {showAdvanced && (
            <div className="mt-3 bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Ətraflı axtarış</h3>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(false)}
                  className="text-gray-400 hover:text-black"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Город */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Şəhər</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Hamısı</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Зарплата (min/max) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Maaş (AZN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Тип занятости */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">İş rejimi</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Hamısı</option>
                  <option value="Tam ştat">Tam ştat</option>
                  <option value="Yarım ştat">Yarım ştat</option>
                  <option value="Distant">Distant</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              {/* Опыт */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Təcrübə</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Hamısı</option>
                  <option value="Təcrübəsiz">Təcrübəsiz</option>
                  <option value="1 ildən aşağı">1 ildən aşağı</option>
                  <option value="1 ildən 3 ilə qədər">1-3 il</option>
                  <option value="3 ildən 5 ilə qədər">3-5 il</option>
                  <option value="5 ildən artıq">5+ il</option>
                </select>
              </div>

              {/* Кнопки */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all"
                >
                  Axtar
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Təmizlə
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP: Полный поиск сразу */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md p-6">
          {/* Основная строка поиска */}
          <div className="grid grid-cols-12 gap-3 mb-4">
            {/* Поиск по ключевым словам */}
            <div className="col-span-4 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* Город */}
            <div className="col-span-3">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
              >
                <option value="">Bütün şəhərlər</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Зарплата Min */}
            <div className="col-span-2">
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="Min maaş"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Зарплата Max */}
            <div className="col-span-2">
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="Max maaş"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Кнопка поиска */}
            <div className="col-span-1">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all flex items-center justify-center"
              >
                Axtar
              </button>
            </div>
          </div>

          {/* Дополнительные фильтры */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-medium">Filtr:</span>

            {/* Тип занятости */}
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="">İş rejimi</option>
              <option value="Tam ştat">Tam ştat</option>
              <option value="Yarım ştat">Yarım ştat</option>
              <option value="Distant">Distant</option>
              <option value="Freelance">Freelance</option>
            </select>

            {/* Опыт */}
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="">Təcrübə</option>
              <option value="Təcrübəsiz">Təcrübəsiz</option>
              <option value="1 ildən aşağı">1 ildən aşağı</option>
              <option value="1 ildən 3 ilə qədər">1-3 il</option>
              <option value="3 ildən 5 ilə qədər">3-5 il</option>
              <option value="5 ildən artıq">5+ il</option>
            </select>

            {/* Активные фильтры и кнопка очистки */}
            <div className="flex-1 flex items-center gap-2 justify-end">
              {getActiveFiltersText().map((filter, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium"
                >
                  {filter}
                </span>
              ))}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all"
                >
                  Təmizlə
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar

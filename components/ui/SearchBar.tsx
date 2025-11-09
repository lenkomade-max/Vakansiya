'use client'

import React, { useState } from 'react'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  placeholder?: string
}

export interface SearchFilters {
  query: string
  location: string
  category: string
  salary?: string
  employmentType?: string
  experience?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Vəzifə, açar söz...',
}) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [salary, setSalary] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [experience, setExperience] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      query,
      location,
      category,
      salary,
      employmentType,
      experience,
    })
  }

  const handleClear = () => {
    setQuery('')
    setLocation('')
    setCategory('')
    setSalary('')
    setEmploymentType('')
    setExperience('')
    onSearch({
      query: '',
      location: '',
      category: '',
      salary: '',
      employmentType: '',
      experience: '',
    })
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
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                showAdvanced
                  ? 'bg-gray-800 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Расширенный поиск (выдвижная панель) */}
          {showAdvanced && (
            <div className="mt-3 bg-white rounded-xl border border-gray-200 p-4 space-y-3 animate-in slide-in-from-top">
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
                  <option value="Bakı">Bakı</option>
                  <option value="Gəncə">Gəncə</option>
                  <option value="Sumqayıt">Sumqayıt</option>
                  <option value="Mingəçevir">Mingəçevir</option>
                  <option value="Lənkəran">Lənkəran</option>
                  <option value="Şəki">Şəki</option>
                  <option value="Naxçıvan">Naxçıvan</option>
                  <option value="Distant">Distant</option>
                </select>
              </div>

              {/* Зарплата */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Maaş</label>
                <select
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Hamısı</option>
                  <option value="500-1000">500-1000 AZN</option>
                  <option value="1000-2000">1000-2000 AZN</option>
                  <option value="2000-3000">2000-3000 AZN</option>
                  <option value="3000+">3000+ AZN</option>
                </select>
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
            <div className="col-span-5 relative">
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
                <option value="Bakı">Bakı</option>
                <option value="Gəncə">Gəncə</option>
                <option value="Sumqayıt">Sumqayıt</option>
                <option value="Mingəçevir">Mingəçevir</option>
                <option value="Lənkəran">Lənkəran</option>
                <option value="Şəki">Şəki</option>
                <option value="Naxçıvan">Naxçıvan</option>
                <option value="Distant">Distant</option>
              </select>
            </div>

            {/* Зарплата */}
            <div className="col-span-2">
              <select
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
              >
                <option value="">Maaş</option>
                <option value="500-1000">500-1000</option>
                <option value="1000-2000">1000-2000</option>
                <option value="2000-3000">2000-3000</option>
                <option value="3000+">3000+</option>
              </select>
            </div>

            {/* Кнопка поиска */}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
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

            {/* Быстрые фильтры */}
            <div className="flex-1 flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setLocation('Distant')
                  onSearch({ query, location: 'Distant', category, salary, employmentType, experience })
                }}
                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-all"
              >
                Distant işlər
              </button>
              <button
                type="button"
                onClick={() => {
                  setExperience('Təcrübəsiz')
                  onSearch({ query, location, category, salary, employmentType, experience: 'Təcrübəsiz' })
                }}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition-all"
              >
                Təcrübəsiz
              </button>
              {(query || location || salary || employmentType || experience) && (
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

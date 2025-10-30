'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { ShortJobCard, ShortJob } from '@/components/short-jobs/ShortJobCard'
import { CategoryGrid, ShortJobCategory } from '@/components/short-jobs/CategoryIcons'
import FilterModal, { FilterOptions } from '@/components/ui/FilterModal'
import { FunnelIcon } from '@heroicons/react/24/outline'

export default function GundelikIslerPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<ShortJob[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ShortJobCategory | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const observerTarget = useRef(null)

  // Генерируем fake данные для демо коротких работ
  const generateShortJobs = (startId: number, count: number): ShortJob[] => {
    const categories: ShortJobCategory[] = [
      'transport', 'construction', 'cleaning', 'garden',
      'restaurant', 'events', 'warehouse', 'office',
      'creative', 'services'
    ]

    const titlesByCategory: Record<ShortJobCategory, string[]> = {
      transport: ['Taksi sürücüsü', 'Kuryer', 'Yük daşıma sürücüsü', 'Moped kuryer'],
      construction: ['Bənna', 'Dülgər', 'Elektrik', 'Santexnik', 'Malyar'],
      cleaning: ['Ofis təmizliyi', 'Mənzil təmizliyi', 'Binaya xidmət', 'Pəncərə təmizləmə'],
      garden: ['Bağban', 'Ağac budama', 'Həyət təmizliyi', 'Çiçək əkimi'],
      restaurant: ['Ofisiant', 'Aşpaz köməkçisi', 'Qabları yuma', 'Çatdırılma kuryer'],
      events: ['Promouşn işçisi', 'Həftəsonu köməkçi', 'Anket aparıcı', 'Məhsul nümayişi'],
      warehouse: ['Anbar işçisi', 'Yükdaşıma', 'Sortirovka', 'Paket yığma'],
      office: ['Sənəd daşıma', 'Ofis köməkçisi', 'Resepşn əvəzi', 'Arxiv tərtibatı'],
      creative: ['Fotoqraf', 'Video operator', 'Qrafik dizayner', 'Tərcüməçi'],
      services: ['Təmir ustası', 'Kondisioner təmiri', 'Kompüter təmiri', 'Mebel yığılması']
    }

    const locations = ['Bakı, Nəsimi', 'Bakı, Nərimanov', 'Bakı, Yasamal', 'Bakı, Xətai', 'Bakı, Səbail', 'Bakı, Nizami']
    const startDates = ['Bu gün', 'Sabah', '3 Noyabr', '4 Noyabr', '5 Noyabr', '8 Noyabr']
    const durations = ['1 gün', '2 gün', '3 gün', '1 həftə', '2 həftə']

    return Array.from({ length: count }, (_, i) => {
      const id = startId + i
      const category = categories[id % categories.length]
      const titles = titlesByCategory[category]

      return {
        id: `short-job-${id}`,
        title: titles[id % titles.length],
        category,
        location: locations[id % locations.length],
        salary: `${50 + (id % 10) * 20} AZN/gün`, // ОБЯЗАТЕЛЬНОЕ поле!
        startDate: startDates[id % startDates.length],
        duration: id % 3 === 0 ? durations[id % durations.length] : undefined,
        isVIP: id % 8 === 0,
        isUrgent: id % 12 === 0,
      }
    })
  }

  // Загружаем initial jobs
  useEffect(() => {
    setJobs(generateShortJobs(0, 20))
  }, [])

  // Infinite scroll с Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loading, page])

  const loadMore = () => {
    if (loading) return

    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const newJobs = generateShortJobs(page * 20, 20)
      setJobs((prev) => [...prev, ...newJobs])
      setPage((prev) => prev + 1)
      setLoading(false)
    }, 500)
  }

  const handleLogin = () => {
    console.log('Вход')
  }

  const handlePostJob = () => {
    router.push('/post-job')
  }

  const handleCategoryClick = (category: ShortJobCategory) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    console.log('Фильтр по категории:', category)
  }

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    console.log('Применены фильтры:', newFilters)
  }

  // Фильтруем работы по всем параметрам
  const filteredJobs = jobs.filter(job => {
    // Фильтр по категории
    if (selectedCategory && job.category !== selectedCategory) {
      return false
    }

    // Фильтр по городу
    if (filters.location && job.location !== filters.location) {
      return false
    }

    // Фильтр по дате начала
    if (filters.startDate && job.startDate !== filters.startDate) {
      return false
    }

    // Фильтр по зарплате (парсим значение из строки типа "80 AZN/gün")
    if (filters.minSalary || filters.maxSalary) {
      const salaryMatch = job.salary.match(/(\d+)/)
      if (salaryMatch) {
        const salary = parseInt(salaryMatch[1])
        if (filters.minSalary && salary < filters.minSalary) {
          return false
        }
        if (filters.maxSalary && salary > filters.maxSalary) {
          return false
        }
      }
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <Navigation
        onLogin={handleLogin}
        onPostJob={handlePostJob}
        isAuthenticated={false}
      />

      {/* Hero Section */}
      <section className="bg-white py-6 md:py-10 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">
              Gündəlik İşlər
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Qısa müddətli işlər və gündəlik qazanc imkanları
            </p>
          </div>

          {/* Категории - Быстрые фильтры */}
          <CategoryGrid onCategoryClick={handleCategoryClick} />
        </div>
      </section>

      {/* Фильтры */}
      <section className="bg-white py-3 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1.5 bg-black text-white text-sm rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  Hamısı ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              Filtr
            </button>
          </div>
        </div>
      </section>

      {/* Gündəlik İşlər Grid - 2x2 на мобилке */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-black">
              {selectedCategory ? 'Seçilmiş kateqoriya' : 'Bütün işlər'}
            </h2>
            <span className="text-xs md:text-sm text-gray-600">{filteredJobs.length} iş</span>
          </div>

          {/* СЕТКА: 2 колонки на мобилке, 3-4 на десктопе */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredJobs.map((job) => (
              <ShortJobCard key={job.id} {...job} />
            ))}
          </div>

          {/* Loading indicator + Observer target */}
          <div ref={observerTarget} className="py-8 text-center">
            {loading && (
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            İşəgötürənsiniz?
          </h2>
          <p className="text-sm md:text-xl text-white/80 mb-6 md:mb-8">
            Gündəlik iş elanları yerləşdirin və tez bir zamanda işçi tapın
          </p>
          <button
            onClick={handlePostJob}
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all text-sm md:text-base"
          >
            İş elanı yerləşdir →
          </button>
        </div>
      </section>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
        currentFilters={filters}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-base md:text-xl font-bold text-black">VAKANSIYA.AZ</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                Azərbaycanda №1 iş axtarış platforması
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşaxtaranlar</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/vakansiyalar">Vakansiyalar</a></li>
                <li><a href="/gundelik-isler">Gündəlik işlər</a></li>
                <li><a href="/companies">Şirkətlər</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşəgötürənlər</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/post-job">Vakansiya yerləşdir</a></li>
                <li><a href="/pricing">Qiymətlər</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">Haqqımızda</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/about">Biz kimik</a></li>
                <li><a href="/contact">Əlaqə</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-600">
            © 2025 Vakansiya.az
          </div>
        </div>
      </footer>
    </div>
  )
}

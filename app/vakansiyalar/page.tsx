'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import JobCard from '@/components/job/JobCard'
import FilterModal, { FilterOptions } from '@/components/ui/FilterModal'
import { FunnelIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

type JobCategory = 'it' | 'marketing' | 'design' | 'sales' | 'management' | 'finance' | 'hr' | 'other'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  postedAt: string
  category: JobCategory
  isRemote?: boolean
  isVIP?: boolean
  isUrgent?: boolean
}

export default function VakansiyalarPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const observerTarget = useRef(null)

  const categories: { id: JobCategory; name: string; nameAz: string }[] = [
    { id: 'it', name: 'IT', nameAz: 'İT və Texnologiya' },
    { id: 'marketing', name: 'Marketing', nameAz: 'Marketinq' },
    { id: 'design', name: 'Design', nameAz: 'Dizayn' },
    { id: 'sales', name: 'Sales', nameAz: 'Satış' },
    { id: 'management', name: 'Management', nameAz: 'İdarəetmə' },
    { id: 'finance', name: 'Finance', nameAz: 'Maliyyə' },
    { id: 'hr', name: 'HR', nameAz: 'İnsan Resursları' },
    { id: 'other', name: 'Other', nameAz: 'Digər' },
  ]

  // Генерируем fake данные для демо вакансий
  const generateJobs = (startId: number, count: number): Job[] => {
    const companies = ['ABC Tech', 'MediaPro MMC', 'DesignHub', 'BakıBank', 'AzTelecom', 'ModaStyle', 'TechSolutions', 'Creative Agency']
    const titlesByCategory: Record<JobCategory, string[]> = {
      it: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'QA Engineer'],
      marketing: ['Marketing Manager', 'SMM Manager', 'Content Manager', 'SEO Specialist', 'Brand Manager'],
      design: ['UX/UI Designer', 'Graphic Designer', 'Motion Designer', 'Product Designer', 'Web Designer'],
      sales: ['Sales Manager', 'Account Manager', 'Business Development', 'Sales Representative'],
      management: ['Product Manager', 'Project Manager', 'Team Lead', 'Operations Manager'],
      finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Auditor'],
      hr: ['HR Manager', 'Recruiter', 'HR Specialist', 'Talent Acquisition'],
      other: ['Office Manager', 'Assistant', 'Administrator', 'Coordinator']
    }

    const locations = ['Bakı, Nəsimi', 'Bakı, Nərimanov', 'Bakı, Yasamal', 'Bakı, Xətai', 'Bakı, Səbail', 'Bakı, Nizami']
    const times = ['2 saat əvvəl', '5 saat əvvəl', '1 gün əvvəl', '2 gün əvvəl', '3 gün əvvəl']

    const cats: JobCategory[] = ['it', 'marketing', 'design', 'sales', 'management', 'finance', 'hr', 'other']

    return Array.from({ length: count }, (_, i) => {
      const id = startId + i
      const category = cats[id % cats.length]
      const titles = titlesByCategory[category]

      return {
        id: `job-${id}`,
        title: titles[id % titles.length],
        company: companies[id % companies.length],
        location: locations[id % locations.length],
        salary: id % 3 === 0 ? `${1000 + (id % 5) * 500}-${2000 + (id % 5) * 500} AZN` : undefined,
        postedAt: times[id % times.length],
        category,
        isRemote: id % 4 === 0,
        isVIP: id % 7 === 0,
        isUrgent: id % 11 === 0,
      }
    })
  }

  // Загружаем initial jobs
  useEffect(() => {
    setJobs(generateJobs(0, 20))
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

    setTimeout(() => {
      const newJobs = generateJobs(page * 20, 20)
      setJobs((prev) => [...prev, ...newJobs])
      setPage((prev) => prev + 1)
      setLoading(false)
    }, 500)
  }

  const handleLogin = () => {
    console.log('Вход')
  }

  const handlePostJob = () => {
    router.push('/vakansiyalar/yeni')
  }

  const handleCategoryClick = (category: JobCategory) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleApply = (jobId: string) => {
    router.push(`/vakansiyalar/${jobId}`)
  }

  // Фильтруем работы по всем параметрам
  const filteredJobs = jobs.filter(job => {
    if (selectedCategory && job.category !== selectedCategory) {
      return false
    }

    if (filters.location && job.location !== filters.location) {
      return false
    }

    if (filters.minSalary || filters.maxSalary) {
      if (!job.salary) return false
      const salaryMatch = job.salary.match(/(\d+)-(\d+)/)
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[1])
        const maxSalary = parseInt(salaryMatch[2])
        const avgSalary = (minSalary + maxSalary) / 2

        if (filters.minSalary && avgSalary < filters.minSalary) {
          return false
        }
        if (filters.maxSalary && avgSalary > filters.maxSalary) {
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
              Vakansiyalar
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Azərbaycanda iş tap
            </p>
          </div>

          {/* Категории */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.nameAz}
              </button>
            ))}
          </div>
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

      {/* Vakansiyalar Grid - 2x2 на мобилке */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-black">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.nameAz : 'Bütün vakansiyalar'}
            </h2>
            <span className="text-xs md:text-sm text-gray-600">{filteredJobs.length} vakansiya</span>
          </div>

          {/* СЕТКА: 2 колонки на мобилке, 3-4 на десктопе */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onApply={() => handleApply(job.id)}
              />
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
            Vakansiyalarınızı yerləşdirin və minlərlə işaxtaran arasından uyğun namizədləri tapın
          </p>
          <button
            onClick={handlePostJob}
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all text-sm md:text-base"
          >
            Pulsuz vakansiya yerləşdir →
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
                <li><a href="/">Vakansiyalar</a></li>
                <li><a href="/gundelik-isler">Gündəlik işlər</a></li>
                <li><a href="/companies">Şirkətlər</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşəgötürənlər</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/vakansiyalar/yeni">Vakansiya yerləşdir</a></li>
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

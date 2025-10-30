'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import SearchBar from '@/components/ui/SearchBar'
import JobCard from '@/components/job/JobCard'
import { ShortJobCard, ShortJob } from '@/components/short-jobs/ShortJobCard'
import { BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'vakansiyalar' | 'gundelik'>('vakansiyalar')
  const [jobs, setJobs] = useState<any[]>([])
  const [shortJobs, setShortJobs] = useState<ShortJob[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const observerTarget = useRef(null)

  // Генерируем fake данные для демо
  const generateJobs = (startId: number, count: number) => {
    const companies = ['ABC Tech', 'MediaPro MMC', 'DesignHub', 'BakıBank', 'AzTelecom', 'ModaStyle']
    const titles = ['Frontend Developer', 'Backend Developer', 'UX/UI Designer', 'Content Manager', 'Marketing Manager', 'Sales Manager', 'Product Manager', 'HR Manager']
    const locations = ['Bakı', 'Bakı, Nəsimi', 'Bakı, Nərimanov', 'Sumqayıt', 'Gəncə', 'Distant']
    const categories = ['it', 'marketing', 'design', 'sales', 'management'] as const
    const times = ['2 saat əvvəl', '5 saat əvvəl', '1 gün əvvəl', '2 gün əvvəl', '3 gün əvvəl']

    return Array.from({ length: count }, (_, i) => {
      const id = startId + i
      return {
        id: `job-${id}`,
        title: titles[id % titles.length],
        company: companies[id % companies.length],
        location: locations[id % locations.length],
        salary: id % 3 === 0 ? `${1000 + (id % 5) * 500}-${2000 + (id % 5) * 500} AZN` : undefined,
        postedAt: times[id % times.length],
        category: categories[id % categories.length],
        isRemote: id % 4 === 0,
        isVIP: id % 7 === 0,
        isUrgent: id % 11 === 0,
      }
    })
  }

  // Генерируем fake данные для коротких работ
  const generateShortJobs = (startId: number, count: number): ShortJob[] => {
    const categories: any[] = ['transport', 'construction', 'cleaning', 'garden', 'restaurant', 'events', 'warehouse', 'office', 'creative', 'services']
    const titles: Record<string, string[]> = {
      transport: ['Taksi sürücüsü', 'Kuryer', 'Yük daşıma'],
      construction: ['Bənna', 'Dülgər', 'Elektrik', 'Santexnik'],
      cleaning: ['Ofis təmizliyi', 'Mənzil təmizliyi'],
      garden: ['Bağban', 'Ağac budama'],
      restaurant: ['Ofisiant', 'Aşpaz köməkçisi'],
      events: ['Promouşn işçisi', 'Anket aparıcı'],
      warehouse: ['Anbar işçisi', 'Yükdaşıma'],
      office: ['Sənəd daşıma', 'Ofis köməkçisi'],
      creative: ['Fotoqraf', 'Video operator'],
      services: ['Təmir ustası', 'Mebel yığılması']
    }
    const locations = ['Bakı, Nəsimi', 'Bakı, Nərimanov', 'Bakı, Yasamal']
    const startDates = ['Bu gün', 'Sabah', '3 Noyabr']

    return Array.from({ length: count }, (_, i) => {
      const id = startId + i
      const category = categories[id % categories.length]
      const categoryTitles = titles[category] || ['İş']

      return {
        id: `short-job-${id}`,
        title: categoryTitles[id % categoryTitles.length],
        category,
        location: locations[id % locations.length],
        salary: `${50 + (id % 10) * 20} AZN/gün`,
        startDate: startDates[id % startDates.length],
        duration: id % 3 === 0 ? `${1 + (id % 3)} gün` : undefined,
        isVIP: id % 8 === 0,
        isUrgent: id % 12 === 0,
      }
    })
  }

  // Загружаем initial jobs
  useEffect(() => {
    setJobs(generateJobs(0, 20))
    setShortJobs(generateShortJobs(0, 8))
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
      const newJobs = generateJobs(page * 20, 20)
      setJobs((prev) => [...prev, ...newJobs])
      setPage((prev) => prev + 1)
      setLoading(false)
    }, 500)
  }

  const handleSearch = (query: string, location: string, category: string) => {
    // Переход на страницу вакансий с параметрами поиска
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('location', location)
    if (category) params.set('category', category)
    router.push(`/vakansiyalar?${params.toString()}`)
  }

  const handleLogin = () => {
    console.log('Вход')
  }

  const handlePostJob = () => {
    router.push('/post-job')
  }

  const handleApply = (jobId: string) => {
    router.push(`/vakansiyalar/${jobId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <Navigation
        onLogin={handleLogin}
        onPostJob={handlePostJob}
        isAuthenticated={false}
      />

      {/* Hero Section */}
      <section className="bg-white py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Поиск */}
          <SearchBar onSearch={handleSearch} />

          {/* Табы - переключение между Vakansiyalar и Gündəlik işlər */}
          <div className="mt-4 flex items-center gap-2 bg-gray-100 p-1 rounded-xl max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('vakansiyalar')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'vakansiyalar'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" />
              Vakansiyalar
            </button>
            <button
              onClick={() => setActiveTab('gundelik')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'gundelik'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <ClockIcon className="w-5 h-5" />
              Gündəlik İş
            </button>
          </div>
        </div>
      </section>

      {/* Vakansiyalar - показываем только если выбран таб vakansiyalar */}
      <section className={`py-6 md:py-12 bg-gray-50 ${activeTab !== 'vakansiyalar' ? 'hidden' : ''}`}>
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold text-black">Vakansiyalar</h2>
              <span className="text-xs md:text-sm text-gray-600">{jobs.length} nəticə</span>
            </div>

            {/* СЕТКА: 2 колонки на мобилке, 3-4 на десктопе */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {jobs.map((job) => (
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

      {/* Gündəlik İşlər - показываем только если выбран таб gundelik */}
      <section className={`py-6 md:py-12 bg-white ${activeTab !== 'gundelik' ? 'hidden' : ''}`}>
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold text-black">Gündəlik İşlər</h2>
              <a href="/gundelik-isler" className="text-sm md:text-base text-gray-600 hover:text-black transition-colors">
                Hamısına bax →
              </a>
            </div>

            {/* СЕТКА: 2 колонки на мобилке, 3-4 на десктопе */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {shortJobs.map((job) => (
                <ShortJobCard key={job.id} {...job} />
              ))}
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

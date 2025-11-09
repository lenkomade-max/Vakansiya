'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import SearchBar from '@/components/ui/SearchBar'
import JobCard from '@/components/job/JobCard'
import { ShortJobCard, ShortJob } from '@/components/short-jobs/ShortJobCard'
import { BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline'
import { signInWithGoogle, getCurrentUser } from '@/lib/auth'
import { getActiveJobsPaginated, Job as DBJob } from '@/lib/api/jobs'

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'vakansiyalar' | 'gundelik'>('vakansiyalar')
  const [jobs, setJobs] = useState<DBJob[]>([])
  const [shortJobs, setShortJobs] = useState<DBJob[]>([])
  const [vakansiyalarPage, setVakansiyalarPage] = useState(1)
  const [gundelikPage, setGundelikPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const observerTarget = useRef(null)

  // Загружаем initial jobs из БД
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)

    // Загружаем вакансии
    const vakansiyalarResult = await getActiveJobsPaginated({
      jobType: 'vakansiya',
      page: 1,
      limit: 20
    })
    setJobs(vakansiyalarResult.jobs)

    // Загружаем гундалик работы
    const gundelikResult = await getActiveJobsPaginated({
      jobType: 'gundelik',
      page: 1,
      limit: 8
    })
    setShortJobs(gundelikResult.jobs)

    setLoading(false)
  }

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  // Infinite scroll с Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
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
  }, [loading, hasMore, activeTab])

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    if (activeTab === 'vakansiyalar') {
      const nextPage = vakansiyalarPage + 1
      const result = await getActiveJobsPaginated({
        jobType: 'vakansiya',
        page: nextPage,
        limit: 20
      })

      setJobs((prev) => [...prev, ...result.jobs])
      setVakansiyalarPage(nextPage)
      setHasMore(result.hasMore)
    } else {
      const nextPage = gundelikPage + 1
      const result = await getActiveJobsPaginated({
        jobType: 'gundelik',
        page: nextPage,
        limit: 8
      })

      setShortJobs((prev) => [...prev, ...result.jobs])
      setGundelikPage(nextPage)
      setHasMore(result.hasMore)
    }

    setLoading(false)
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
    signInWithGoogle()
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
        isAuthenticated={isAuthenticated}
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
                  id={job.id}
                  title={job.title}
                  company={job.company || ''}
                  location={job.location}
                  salary={job.salary}
                  postedAt={new Date(job.created_at).toLocaleDateString('az-AZ')}
                  category={job.category as any}
                  isRemote={job.location.toLowerCase().includes('distant') || job.location.toLowerCase().includes('uzaqdan')}
                  isVIP={job.is_vip}
                  isUrgent={job.is_urgent}
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
                <ShortJobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  category={job.category as any}
                  location={job.location}
                  salary={job.salary || ''}
                  startDate={job.start_date || ''}
                  duration={job.duration}
                  isVIP={job.is_vip}
                  isUrgent={job.is_urgent}
                />
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
                <li><a href="/post-job">Elan yerləşdir</a></li>
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

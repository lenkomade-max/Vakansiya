'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import ContactModal from '@/components/ui/ContactModal'
import { getJob, Job } from '@/lib/api/jobs'
import { getCurrentUser } from '@/lib/auth'
import { CategoryIcon, CATEGORIES, ShortJobCategory } from '@/components/short-jobs/CategoryIcons'
import {
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarIcon,
  PhoneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { FireIcon } from '@heroicons/react/24/solid'

function ShortJobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      // Check authentication
      const currentUser = await getCurrentUser()
      setIsAuthenticated(!!currentUser)

      // Load job data
      const jobId = params.id as string
      const jobData = await getJob(jobId)

      if (!jobData) {
        // Job not found - redirect to catalog
        router.push('/gundelik-isler')
        return
      }

      setJob(jobData)
      setLoading(false)
    }

    loadData()
  }, [params.id, router])

  const handleLogin = () => {
    router.push('/')
  }

  const handlePostJob = () => {
    router.push('/post-job')
  }

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  const handleBack = () => {
    router.back()
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 24) {
      return `${diffHours} saat əvvəl`
    } else if (diffDays < 7) {
      return `${diffDays} gün əvvəl`
    } else {
      return date.toLocaleDateString('az-AZ')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation
          onLogin={handleLogin}
          onPostJob={handlePostJob}
          isAuthenticated={isAuthenticated}
        />
        <div className="container mx-auto px-4 max-w-4xl py-20 text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  // Job not found
  if (!job) {
    return null
  }

  const categoryConfig = CATEGORIES.find(c => c.id === job.category)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <Navigation
        onLogin={handleLogin}
        onPostJob={handlePostJob}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl py-6 md:py-10">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Geri</span>
        </button>

        {/* Job Card */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Header with Category Icon */}
          <div className="relative bg-gray-50 p-8 flex items-center justify-center border-b border-gray-200">
            <CategoryIcon category={job.category} size="xl" showBackground={true} />

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              {job.is_vip && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded shadow-md flex items-center gap-1">
                  <FireIcon className="w-4 h-4" />
                  VIP
                </span>
              )}

              {job.is_urgent && (
                <span className="px-3 py-1.5 bg-red-500 text-white font-bold rounded shadow-md text-xs whitespace-nowrap flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  TƏCİLİ
                </span>
              )}
            </div>
          </div>

          {/* Job Info */}
          <div className="p-6 md:p-8">
            {/* Title & Category */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 ${categoryConfig?.bgColor} ${categoryConfig?.color} text-sm font-medium rounded-full`}>
                  {categoryConfig?.nameAz}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(job.created_at)}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {job.title}
              </h1>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{job.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <BanknotesIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-black">{job.salary}</span>
                </div>

                {job.start_date && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span>Başlama: <span className="font-medium">{job.start_date}</span></span>
                  </div>
                )}

                {job.duration && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span>Müddət: <span className="font-medium">{job.duration}</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black mb-3">
                İşin təsviri
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
              <span>{job.views_count} baxış</span>
            </div>

            {/* Contact Button */}
            <div className="mt-6">
              <button
                onClick={handleContactClick}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95"
              >
                <PhoneIcon className="w-6 h-6" />
                Əlaqə saxla
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Telefon nömrəsi gizlidir. Düyməyə klikləyin.
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Diqqət:</strong> İşə qəbul zamanı heç bir ödəniş tələb olunmamalıdır.
            Şübhəli elanlarla bağlı bizimlə əlaqə saxlayın.
          </p>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        phoneNumber={job.contact_phone}
        jobTitle={job.title}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 md:py-12 mt-12">
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

export default ShortJobDetailPage

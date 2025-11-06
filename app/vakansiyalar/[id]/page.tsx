'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { getJob, Job } from '@/lib/api/jobs'
import { getCurrentUser } from '@/lib/auth'
import {
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { FireIcon } from '@heroicons/react/24/solid'

export default function VakansiyaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vakansiya, setVakansiya] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
        // Job not found - redirect to 404 or catalog
        router.push('/vakansiyalar')
        return
      }

      setVakansiya(jobData)
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

  const handleApply = () => {
    // В будущем здесь будет модальное окно или переход на страницу отклика
    alert('Müraciət funksiyası tezliklə əlavə olunacaq!')
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
  if (!vakansiya) {
    return null
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {/* Header with Company Logo */}
              <div className="relative bg-gray-50 p-6 flex items-start gap-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {vakansiya.is_vip && (
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded flex items-center gap-1">
                        <FireIcon className="w-3 h-3" />
                        VIP
                      </span>
                    )}
                    {vakansiya.is_urgent && (
                      <span className="px-2 py-1 bg-red-500 text-white font-bold rounded text-xs whitespace-nowrap flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        TƏCİLİ
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {vakansiya.category}
                    </span>
                  </div>

                  <h1 className="text-xl md:text-2xl font-bold text-black mb-2">
                    {vakansiya.title}
                  </h1>

                  <p className="text-base md:text-lg text-gray-700 font-medium mb-3">
                    {vakansiya.company}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatDate(vakansiya.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Key Info */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Yer</p>
                      <p className="text-sm font-semibold text-black">{vakansiya.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BanknotesIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Əmək haqqı</p>
                      <p className="text-sm font-semibold text-black">{vakansiya.salary}</p>
                    </div>
                  </div>

                  {vakansiya.employment_type && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">İş rejimi</p>
                        <p className="text-sm font-semibold text-black">{vakansiya.employment_type}</p>
                      </div>
                    </div>
                  )}

                  {vakansiya.deadline && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    <div>
                      <p className="text-xs text-gray-500">Son tarix</p>
                      <p className="text-sm font-semibold text-black">{vakansiya.deadline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <h2 className="text-lg font-bold text-black mb-4">
                  Vakansiya haqqında
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
                  {vakansiya.description}
                </div>

                {/* Requirements */}
                {vakansiya.requirements && (
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-black mb-3">
                      Tələblər
                    </h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {vakansiya.requirements}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {vakansiya.benefits && (
                  <div>
                    <h3 className="text-base font-bold text-black mb-3">
                      Təklif olunanlar
                    </h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {vakansiya.benefits}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Button */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 sticky top-6">
              <button
                onClick={handleApply}
                className="w-full px-6 py-4 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-all active:scale-95 mb-4"
              >
                Müraciət et
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Baxış sayı</span>
                  <span className="font-semibold text-black">{vakansiya.views_count}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-black mb-4">
                Şirkət haqqında
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-black">{vakansiya.company}</p>
                  <p className="text-sm text-gray-500">İT şirkəti</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Şirkətin digər vakansiyaları
              </button>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Diqqət:</strong> İşə qəbul zamanı heç bir ödəniş tələb olunmamalıdır.
            Şübhəli vakansiyalarla bağlı bizimlə əlaqə saxlayın.
          </p>
        </div>
      </div>

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

'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Navigation from '@/components/ui/Navigation'
import { getJob, Job } from '@/lib/api/jobs'
import { getCurrentUser } from '@/lib/auth'
import { getCategoryImage, getCategoryImageAlt } from '@/lib/utils/category-image'
import {
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { FireIcon } from '@heroicons/react/24/solid'

export default function VakansiyaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showPhone, setShowPhone] = useState(false)
  const jobId = params.id as string

  // Параллельная загрузка auth и job с кешированием
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 минут кеш
  })

  const { data: vakansiya, isLoading: loading, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId, // Загружаем только если есть ID
    staleTime: 5 * 60 * 1000, // 5 минут кеш
  })

  const isAuthenticated = !!currentUser

  // Redirect if job not found
  if (isError || (vakansiya === null && !loading)) {
    router.push('/vakansiyalar')
    return null
  }

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

  // Получаем изображение категории
  const categoryImage = vakansiya.category_name
    ? getCategoryImage({ name: vakansiya.category_name, image_url: (vakansiya as any).category_info?.image_url })
    : null

  const categoryAlt = vakansiya.category_name
    ? getCategoryImageAlt({ name: vakansiya.category_name })
    : 'Vakansiya'

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
              {/* Category Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {categoryImage ? (
                  <Image
                    src={categoryImage}
                    alt={categoryAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <BuildingOfficeIcon className="w-20 h-20 text-gray-300" />
                  </div>
                )}

                {/* Badges on image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {vakansiya.is_vip && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded shadow-md flex items-center gap-1">
                        <FireIcon className="w-4 h-4" />
                        VIP
                      </span>
                    )}
                    {vakansiya.is_urgent && (
                      <span className="px-3 py-1.5 bg-red-500 text-white font-bold rounded shadow-md text-sm whitespace-nowrap flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        TƏCİLİ
                      </span>
                    )}
                  </div>
                </div>

                {/* Salary badge */}
                {vakansiya.salary && (
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 text-black font-bold rounded shadow-md text-sm whitespace-nowrap flex items-center gap-1">
                      <BanknotesIcon className="w-4 h-4" />
                      {vakansiya.salary}
                    </span>
                  </div>
                )}
              </div>

              {/* Header with Company Logo */}
              <div className="relative bg-gray-50 p-6 flex items-start gap-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
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

                  {vakansiya.experience && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Təcrübə</p>
                        <p className="text-sm font-semibold text-black">{vakansiya.experience}</p>
                      </div>
                    </div>
                  )}

                  {vakansiya.education && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Təhsil</p>
                        <p className="text-sm font-semibold text-black">{vakansiya.education}</p>
                      </div>
                    </div>
                  )}

                  {vakansiya.work_address && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">İş ünvanı</p>
                        <p className="text-sm font-semibold text-black">{vakansiya.work_address}</p>
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
                  )}

                  {vakansiya.start_date && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Başlama tarixi</p>
                        <p className="text-sm font-semibold text-black">{vakansiya.start_date}</p>
                      </div>
                    </div>
                  )}

                  {vakansiya.duration && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Müddət</p>
                        <p className="text-sm font-semibold text-black">{vakansiya.duration}</p>
                      </div>
                    </div>
                  )}
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

                {/* Vacancy ID */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500">Elan ID: <span className="font-mono text-gray-600">{vakansiya.id}</span></p>
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
            {/* Category Info */}
            {(vakansiya.parent_category_name || vakansiya.category_name) && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                <h3 className="text-base font-bold text-black mb-4">
                  Kateqoriya
                </h3>

                {vakansiya.parent_category_name && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kateqoriya</p>
                      <p className="text-sm font-semibold text-black">{vakansiya.parent_category_name}</p>
                    </div>
                  </div>
                )}

                {vakansiya.category_name && vakansiya.category_name !== vakansiya.parent_category_name && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Alt kateqoriya</p>
                      <p className="text-sm font-semibold text-black">{vakansiya.category_name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Buttons */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 sticky top-6">
              {vakansiya.contact_name && (
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Əlaqə şəxsi</p>
                  <p className="text-lg font-bold text-black">{vakansiya.contact_name}</p>
                </div>
              )}

              {!showPhone ? (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-all active:scale-95 mb-4"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Əlaqə
                </button>
              ) : (
                <div className="space-y-3 mb-4">
                  <a
                    href={`tel:${vakansiya.contact_phone}`}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-all active:scale-95"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    {vakansiya.contact_phone}
                  </a>
                  <a
                    href={`https://wa.me/${vakansiya.contact_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-700 transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              )}

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

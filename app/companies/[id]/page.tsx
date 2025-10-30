'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import JobCard from '@/components/job/JobCard'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()

  // В реальности данные будут загружаться из API
  const company = {
    id: params.id as string,
    name: 'ABC Tech',
    logo: null,
    industry: 'İT və Texnologiya',
    location: 'Bakı',
    foundedYear: 2018,
    employeesCount: '50-100',
    website: 'https://abctech.az',
    description: `ABC Tech - Azərbaycanda aparıcı texnologiya şirkətlərindən biridir.

Biz müasir texnologiyalar və innovativ həllər təqdim edirik. Komandamız peşəkar mütəxəssislərdən ibarətdir və hər bir layihəyə fərdi yanaşırıq.

Şirkətimiz:
• Web və mobil tətbiqlər hazırlayırıq
• Korporativ həllər təqdim edirik
• Məsləhət və dəstək xidmətləri göstəririk
• Yüksək keyfiyyət standartları ilə işləyirik

Bizim dəyərlərimiz:
• İnnovasiya və texnologiya
• Komanda işi
• Müştəri məmnuniyyəti
• Peşəkar inkişaf`,
    benefits: [
      'Rəqabətli maaş',
      'Distant iş imkanı',
      'Tibbi sığorta',
      'Peşəkar inkişaf',
      'Müasir ofis',
      'Komanda tədbirləri'
    ]
  }

  // Fake вакансии компании
  const companyJobs = [
    {
      id: 'job-1',
      title: 'Frontend Developer',
      company: company.name,
      location: 'Bakı, Nəsimi',
      salary: '1500-2500 AZN',
      postedAt: '2 saat əvvəl',
      category: 'it' as const,
      isRemote: true,
      isVIP: true,
      isUrgent: false
    },
    {
      id: 'job-2',
      title: 'Backend Developer',
      company: company.name,
      location: 'Bakı, Nəsimi',
      salary: '2000-3000 AZN',
      postedAt: '1 gün əvvəl',
      category: 'it' as const,
      isRemote: false,
      isVIP: false,
      isUrgent: true
    },
    {
      id: 'job-3',
      title: 'UI/UX Designer',
      company: company.name,
      location: 'Bakı, Nəsimi',
      salary: '1200-2000 AZN',
      postedAt: '3 gün əvvəl',
      category: 'design' as const,
      isRemote: true,
      isVIP: false,
      isUrgent: false
    }
  ]

  const handleLogin = () => {
    console.log('Вход')
  }

  const handlePostJob = () => {
    router.push('/vakansiyalar/yeni')
  }

  const handleBack = () => {
    router.back()
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

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-6 md:py-10">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Geri</span>
        </button>

        {/* Company Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <BuildingOfficeIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
                {company.name}
              </h1>

              <p className="text-base md:text-lg text-gray-700 mb-4">
                {company.industry}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>{company.employeesCount} işçi</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{companyJobs.length} vakansiya</span>
                </div>

                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GlobeAltIcon className="w-4 h-4" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                      Vebsayt
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                Şirkət haqqında
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {company.description}
              </div>
            </div>

            {/* Open Positions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                Açıq vakansiyalar ({companyJobs.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    {...job}
                    onApply={() => handleApply(job.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-black mb-4">
                İmkanlar
              </h3>

              <ul className="space-y-3">
                {company.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-black mb-4">
                Əlaqə
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Ünvan</p>
                  <p className="text-black font-medium">{company.location}</p>
                </div>

                {company.website && (
                  <div>
                    <p className="text-gray-500 mb-1">Vebsayt</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-medium hover:underline"
                    >
                      {company.website.replace('https://', '')}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-gray-500 mb-1">Quruluş ili</p>
                  <p className="text-black font-medium">{company.foundedYear}</p>
                </div>
              </div>
            </div>
          </div>
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

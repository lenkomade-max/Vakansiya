'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import CompanyCard from '@/components/company/CompanyCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Company {
  id: string
  name: string
  logo?: string
  industry: string
  location: string
  activeJobs: number
  description: string
}

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const observerTarget = useRef(null)

  const industries = [
    'Hamısı',
    'İT və Texnologiya',
    'Maliyyə',
    'Marketinq',
    'Tikinti',
    'Təhsil',
    'Ticarət',
    'Sənaye',
    'Digər'
  ]

  const [selectedIndustry, setSelectedIndustry] = useState('Hamısı')

  // Генерируем fake данные компаний
  const generateCompanies = (startId: number, count: number): Company[] => {
    const companyNames = [
      'ABC Tech',
      'MediaPro MMC',
      'DesignHub',
      'BakıBank',
      'AzTelecom',
      'ModaStyle',
      'TechSolutions',
      'Creative Agency',
      'BuildCo',
      'EduCenter',
      'RetailGroup',
      'IndustryPro'
    ]

    const industriesList = [
      'İT və Texnologiya',
      'Maliyyə',
      'Marketinq',
      'Tikinti',
      'Təhsil',
      'Ticarət',
      'Sənaye'
    ]

    const locations = ['Bakı', 'Sumqayıt', 'Gəncə', 'Mingəçevir', 'Şirvan']

    const descriptions = [
      'Müasir texnologiyalar və innovativ həllər təqdim edən şirkət',
      'Azərbaycanda aparıcı şirkətlərdən biri',
      'Peşəkar komanda və yüksək standartlar',
      'Dinamik inkişaf və karyera imkanları',
      'Müştəri məmnuniyyəti bizim prioritetimizdir'
    ]

    return Array.from({ length: count }, (_, i) => {
      const id = startId + i
      return {
        id: `company-${id}`,
        name: companyNames[id % companyNames.length],
        industry: industriesList[id % industriesList.length],
        location: locations[id % locations.length],
        activeJobs: Math.floor(Math.random() * 20) + 1,
        description: descriptions[id % descriptions.length]
      }
    })
  }

  useEffect(() => {
    setCompanies(generateCompanies(0, 20))
  }, [])

  // Infinite scroll
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
      const newCompanies = generateCompanies(page * 20, 20)
      setCompanies((prev) => [...prev, ...newCompanies])
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

  const handleCompanyClick = (companyId: string) => {
    router.push(`/companies/${companyId}`)
  }

  // Фильтруем компании
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === 'Hamısı' || company.industry === selectedIndustry
    return matchesSearch && matchesIndustry
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
              Şirkətlər
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Azərbaycanda fəaliyyət göstərən şirkətlər
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şirkət axtar..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
            />
          </div>
        </div>
      </section>

      {/* Фильтры по индустрии */}
      <section className="bg-white py-3 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedIndustry === industry
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-black">
              {selectedIndustry === 'Hamısı' ? 'Bütün şirkətlər' : selectedIndustry}
            </h2>
            <span className="text-xs md:text-sm text-gray-600">{filteredCompanies.length} şirkət</span>
          </div>

          {/* Grid: 1 колонка на мобилке, 2-3 на десктопе */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                {...company}
                onClick={() => handleCompanyClick(company.id)}
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
            Şirkətinizi əlavə edin
          </h2>
          <p className="text-sm md:text-xl text-white/80 mb-6 md:mb-8">
            Vakansiyalarınızı yerləşdirin və geniş auditoriyaya çatın
          </p>
          <button
            onClick={handlePostJob}
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all text-sm md:text-base"
          >
            Vakansiya yerləşdir →
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

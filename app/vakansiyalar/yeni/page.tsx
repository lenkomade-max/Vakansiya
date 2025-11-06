'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export default function CreateVakansiyaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: '',
    location: '',
    salary: '',
    employmentType: '',
    experience: '',
    education: '',
    deadline: '',
    description: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    contactPhone: '',
  })

  const handleLogin = () => {
    console.log('Вход')
  }

  const handlePostJob = () => {
    console.log('Разместить вакансию')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Валидация
    if (!formData.title || !formData.company || !formData.category || !formData.location) {
      alert('Zəhmət olmasa bütün mütləq sahələri doldurun')
      setIsSubmitting(false)
      return
    }

    // В реальности здесь будет API запрос
    console.log('Отправка формы:', formData)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Vakansiya uğurla yerləşdirildi!')
      router.push('/vakansiyalar')
    }, 1000)
  }

  const categories = [
    'İT və Texnologiya',
    'Marketinq',
    'Dizayn',
    'Satış',
    'İdarəetmə',
    'Maliyyə',
    'İnsan Resursları',
    'Digər'
  ]

  const cities = [
    'Bakı, Nəsimi',
    'Bakı, Nərimanov',
    'Bakı, Yasamal',
    'Bakı, Xətai',
    'Bakı, Səbail',
    'Bakı, Nizami',
    'Bakı, Binəqədi',
    'Bakı, Sabunçu',
    'Sumqayıt',
    'Gəncə',
  ]

  const employmentTypes = [
    'Tam ştat',
    'Yarım ştat',
    'Distant',
    'Hibrid',
    'Müqavilə əsasında'
  ]

  const experienceLevels = [
    'Təcrübəsiz',
    '1 ilə qədər',
    '1-2 il',
    '2-3 il',
    '3-5 il',
    '5+ il'
  ]

  const educationLevels = [
    'Orta',
    'Orta-ixtisas',
    'Natamam ali',
    'Ali',
    'Magistr',
    'Doktorantura'
  ]

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
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">
              Vakansiya Yerləşdir
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Minlərlə işaxtaran arasından uyğun namizədləri tapın
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            {/* Vakansiya adı */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Vakansiya adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Məs: Frontend Developer"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                required
              />
            </div>

            {/* Şirkət adı */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Şirkət adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Məs: ABC Tech MMC"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                required
              />
            </div>

            {/* Kateqoriya və Şəhər - 2 kolonkada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Kateqoriya */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Kateqoriya <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
                  required
                >
                  <option value="">Kateqoriyanı seçin</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Şəhər */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Şəhər / Rayon <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
                  required
                >
                  <option value="">Şəhəri seçin</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Əmək haqqı və İş rejimi - 2 kolonkada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Əmək haqqı */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Əmək haqqı
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="1500-2500 AZN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Məsələn: 1500-2500 AZN, Razılaşma yolu ilə
                </p>
              </div>

              {/* İş rejimi */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  İş rejimi
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
                >
                  <option value="">İş rejimini seçin</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Təcrübə və Təhsil - 2 kolonkada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Təcrübə */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Təcrübə
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
                >
                  <option value="">Təcrübə səviyyəsini seçin</option>
                  {experienceLevels.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Təhsil */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Təhsil
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
                >
                  <option value="">Təhsil səviyyəsini seçin</option>
                  {educationLevels.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Son tarix */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Müraciət üçün son tarix
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
              />
            </div>

            {/* Təsvir */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Vakansiya təsviri
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Vakansiya haqqında ümumi məlumat"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
              />
            </div>

            {/* Tələblər */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Tələblər
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="Namizədə tələblər (hər sətirdə bir tələb)"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hər tələbi ayrı sətirdə yazın
              </p>
            </div>

            {/* Təklif olunanlar */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Təklif olunanlar
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                placeholder="Şirkətin təklif etdiyi imkanlar (hər sətirdə bir təklif)"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
              />
            </div>

            {/* Əlaqə məlumatları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Əlaqə emaili
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="hr@company.az"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Əlaqə nömrəsi
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="w-6 h-6" />
                    Elan yerləşdir
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                Ləğv et
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Pulsuz elan:</strong> Ayda 1 vakansiya pulsuz yerləşdirə bilərsiniz.
            </p>
            <p className="text-sm text-blue-800">
              <strong>Premium yerləşdirmə:</strong> Daha çox görünmə və üstünlüklər üçün premium paketlərə baxın.
            </p>
          </div>
        </div>
      </section>

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
                <li><a href="/vakansiyalar/yeni">Elan yerləşdir</a></li>
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

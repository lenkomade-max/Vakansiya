'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { CATEGORIES, ShortJobCategory } from '@/components/short-jobs/CategoryIcons'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export default function CreateShortJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    category: '' as ShortJobCategory | '',
    location: '',
    salary: '',
    startDate: '',
    duration: '',
    description: '',
    phoneNumber: '',
  })

  const handleLogin = () => {
    console.log('Вход')
  }

  const handlePostJob = () => {
    console.log('Разместить работу')
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
    if (!formData.title || !formData.category || !formData.location || !formData.salary || !formData.phoneNumber) {
      alert('Zəhmət olmasa bütün mütləq sahələri doldurun')
      setIsSubmitting(false)
      return
    }

    // В реальности здесь будет API запрос
    console.log('Отправка формы:', formData)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('İş elanı uğurla yerləşdirildi!')
      router.push('/gundelik-isler')
    }, 1000)
  }

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

  const durations = [
    '1 gün',
    '2 gün',
    '3 gün',
    '1 həftə',
    '2 həftə',
    '1 ay',
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
              Gündəlik İş Elanı Yerləşdir
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Qısa müddətli işçi axtarışı üçün elan yerləşdirin
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            {/* İş adı */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                İşin adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Məs: Taksi sürücüsü, Ofis təmizliyi"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                required
              />
            </div>

            {/* Kateqoriya */}
            <div className="mb-6">
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
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameAz}
                  </option>
                ))}
              </select>
            </div>

            {/* Şəhər/Rayon */}
            <div className="mb-6">
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

            {/* Əmək haqqı və Başlama tarixi - 2 kolonkada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Əmək haqqı */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Əmək haqqı <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="80 AZN/gün"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Məsələn: 80 AZN/gün, 500 AZN/həftə
                </p>
              </div>

              {/* Başlama tarixi */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Başlama tarixi
                </label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  placeholder="Bu gün, Sabah, 5 Noyabr"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Müddət */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                İş müddəti
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white"
              >
                <option value="">Müddəti seçin (ixtiyari)</option>
                {durations.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>

            {/* Təsvir */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                İşin təsviri
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="İşin təsviri, tələblər, iş şəraiti və s."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maksimum 1000 simvol
              </p>
            </div>

            {/* Telefon */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-black mb-2">
                Əlaqə nömrəsi <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+994 50 123 45 67"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Telefon nömrəsi elanda gizli olacaq
              </p>
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
                    Elanı yerləşdir
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
            <p className="text-sm text-blue-800">
              <strong>Qeyd:</strong> Elan yerləşdirmək pulsuz. Elanınız moderasiyadan keçdikdən sonra yayımlanacaq (adətən 1 saat ərzində).
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
                <li><a href="/">Vakansiyalar</a></li>
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

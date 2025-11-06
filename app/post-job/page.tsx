'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Navigation from '@/components/ui/Navigation'
import { getCurrentUser } from '@/lib/auth'
import { createJob } from '@/lib/api/jobs'
import { CATEGORIES, ShortJobCategory } from '@/components/short-jobs/CategoryIcons'
import { PlusCircleIcon, BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline'

type JobType = 'vakansiya' | 'gundelik'

export default function PostJobPage() {
  const router = useRouter()
  const [jobType, setJobType] = useState<JobType>('vakansiya')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Форма для обычных вакансий
  const [vakansiyaForm, setVakansiyaForm] = useState({
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
    contactPhone: '',
  })

  // Форма для коротких работ
  const [gundelikForm, setGundelikForm] = useState({
    title: '',
    category: '' as ShortJobCategory | '',
    location: '',
    salary: '',
    startDate: '',
    duration: '',
    description: '',
    phoneNumber: '',
  })

  const handleVakansiyaChange = (field: string, value: string) => {
    setVakansiyaForm(prev => ({ ...prev, [field]: value }))
  }

  const handleGundelikChange = (field: string, value: string) => {
    setGundelikForm(prev => ({ ...prev, [field]: value }))
  }

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      setIsAuthenticated(!!currentUser)
      setUser(currentUser)
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check authentication
    if (!user) {
      toast.error('Elan yerləşdirmək üçün daxil olun')
      router.push('/')
      return
    }

    setIsSubmitting(true)

    try {
      if (jobType === 'vakansiya') {
        if (!vakansiyaForm.title || !vakansiyaForm.company || !vakansiyaForm.category || !vakansiyaForm.location) {
          toast.error('Zəhmət olmasa bütün mütləq sahələri doldurun')
          setIsSubmitting(false)
          return
        }
        if (!vakansiyaForm.contactPhone) {
          toast.error('Telefon nömrəsi mütləqdir')
          setIsSubmitting(false)
          return
        }

        const result = await createJob(user.id, {
          job_type: 'vakansiya',
          title: vakansiyaForm.title,
          company: vakansiyaForm.company,
          category: vakansiyaForm.category,
          location: vakansiyaForm.location,
          salary: vakansiyaForm.salary || undefined,
          description: vakansiyaForm.description || undefined,
          employment_type: vakansiyaForm.employmentType || undefined,
          experience: vakansiyaForm.experience || undefined,
          education: vakansiyaForm.education || undefined,
          deadline: vakansiyaForm.deadline || undefined,
          requirements: vakansiyaForm.requirements || undefined,
          benefits: vakansiyaForm.benefits || undefined,
          contact_phone: vakansiyaForm.contactPhone,
        })

        if (!result.success) {
          toast.error(result.error || 'Xəta baş verdi')
          setIsSubmitting(false)
          return
        }

        // Show status message
        if (result.status === 'active') {
          toast.success('Elan avtomatik təsdiqləndi və dərc olundu!')
        } else if (result.status === 'pending_review') {
          toast('Elan yoxlanışa göndərildi. Təsdiq edildikdən sonra dərc olunacaq.', {
            icon: '⏳',
            duration: 5000,
          })
        }

      } else {
        if (!gundelikForm.title || !gundelikForm.category || !gundelikForm.location || !gundelikForm.salary || !gundelikForm.phoneNumber) {
          toast.error('Zəhmət olmasa bütün mütləq sahələri doldurun')
          setIsSubmitting(false)
          return
        }

        const result = await createJob(user.id, {
          job_type: 'gundelik',
          title: gundelikForm.title,
          category: gundelikForm.category,
          location: gundelikForm.location,
          salary: gundelikForm.salary,
          description: gundelikForm.description || undefined,
          start_date: gundelikForm.startDate || undefined,
          duration: gundelikForm.duration || undefined,
          contact_phone: gundelikForm.phoneNumber,
        })

        if (!result.success) {
          toast.error(result.error || 'Xəta baş verdi')
          setIsSubmitting(false)
          return
        }

        // Show status message
        if (result.status === 'active') {
          toast.success('Elan avtomatik təsdiqləndi və dərc olundu!')
        } else if (result.status === 'pending_review') {
          toast('Elan yoxlanışa göndərildi. Təsdiq edildikdən sonra dərc olunacaq.', {
            icon: '⏳',
            duration: 5000,
          })
        }
      }

      router.push('/profile')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Xəta baş verdi')
      setIsSubmitting(false)
    }
  }

  const categories = ['İT və Texnologiya', 'Marketinq', 'Dizayn', 'Satış', 'İdarəetmə', 'Maliyyə', 'İnsan Resursları', 'Digər']
  const cities = ['Bakı, Nəsimi', 'Bakı, Nərimanov', 'Bakı, Yasamal', 'Bakı, Xətai', 'Bakı, Səbail', 'Bakı, Nizami', 'Sumqayıt', 'Gəncə']
  const employmentTypes = ['Tam ştat', 'Yarım ştat', 'Distant', 'Hibrid', 'Müqavilə əsasında']
  const experienceLevels = ['Təcrübəsiz', '1 ilə qədər', '1-2 il', '2-3 il', '3-5 il', '5+ il']
  const educationLevels = ['Orta', 'Orta-ixtisas', 'Natamam ali', 'Ali', 'Magistr', 'Doktorantura']
  const durations = ['1 gün', '2 gün', '3 gün', '1 həftə', '2 həftə', '1 ay']

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onLogin={() => router.push('/')}
        onPostJob={() => router.push('/post-job')}
        isAuthenticated={isAuthenticated}
      />

      {/* Hero Section */}
      <section className="bg-white py-6 md:py-10 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">
              Elan Yerləşdir
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Vakansiya və ya gündəlik iş elanı yerləşdirin
            </p>
          </div>

          {/* Type Switcher - Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl max-w-md mx-auto">
            <button
              onClick={() => setJobType('vakansiya')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                jobType === 'vakansiya'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" />
              Vakansiya
            </button>
            <button
              onClick={() => setJobType('gundelik')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                jobType === 'gundelik'
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

      {/* Form */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            {jobType === 'vakansiya' ? (
              /* ФОРМА ВАКАНСИИ */
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Vakansiya adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vakansiyaForm.title}
                    onChange={(e) => handleVakansiyaChange('title', e.target.value)}
                    placeholder="Məs: Frontend Developer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Şirkət adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vakansiyaForm.company}
                    onChange={(e) => handleVakansiyaChange('company', e.target.value)}
                    placeholder="Məs: ABC Tech MMC"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Kateqoriya <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={vakansiyaForm.category}
                      onChange={(e) => handleVakansiyaChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base bg-white"
                      required
                    >
                      <option value="">Seçin</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Şəhər <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={vakansiyaForm.location}
                      onChange={(e) => handleVakansiyaChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base bg-white"
                      required
                    >
                      <option value="">Seçin</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Əmək haqqı</label>
                    <input
                      type="text"
                      value={vakansiyaForm.salary}
                      onChange={(e) => handleVakansiyaChange('salary', e.target.value)}
                      placeholder="1500-2500 AZN"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">İş rejimi</label>
                    <select
                      value={vakansiyaForm.employmentType}
                      onChange={(e) => handleVakansiyaChange('employmentType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base bg-white"
                    >
                      <option value="">Seçin</option>
                      {employmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">Vakansiya təsviri</label>
                  <textarea
                    value={vakansiyaForm.description}
                    onChange={(e) => handleVakansiyaChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base resize-none"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={vakansiyaForm.contactPhone}
                    onChange={(e) => handleVakansiyaChange('contactPhone', e.target.value)}
                    placeholder="+994 50 123 45 67"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    required
                  />
                </div>
              </>
            ) : (
              /* ФОРМА GÜNDƏLIK İŞLƏR */
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">
                    İşin adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gundelikForm.title}
                    onChange={(e) => handleGundelikChange('title', e.target.value)}
                    placeholder="Məs: Taksi sürücüsü, Ofis təmizliyi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Kateqoriya <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gundelikForm.category}
                    onChange={(e) => handleGundelikChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base bg-white"
                    required
                  >
                    <option value="">Seçin</option>
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.nameAz}</option>)}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Şəhər <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gundelikForm.location}
                    onChange={(e) => handleGundelikChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base bg-white"
                    required
                  >
                    <option value="">Seçin</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Əmək haqqı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={gundelikForm.salary}
                      onChange={(e) => handleGundelikChange('salary', e.target.value)}
                      placeholder="80 AZN/gün"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Başlama</label>
                    <input
                      type="text"
                      value={gundelikForm.startDate}
                      onChange={(e) => handleGundelikChange('startDate', e.target.value)}
                      placeholder="Bu gün, Sabah"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">Müddət</label>
                  <select
                    value={gundelikForm.duration}
                    onChange={(e) => handleGundelikChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base bg-white"
                  >
                    <option value="">Seçin</option>
                    {durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-2">İşin təsviri</label>
                  <textarea
                    value={gundelikForm.description}
                    onChange={(e) => handleGundelikChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base resize-none"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={gundelikForm.phoneNumber}
                    onChange={(e) => handleGundelikChange('phoneNumber', e.target.value)}
                    placeholder="+994 50 123 45 67"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Telefon gizli olacaq</p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
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

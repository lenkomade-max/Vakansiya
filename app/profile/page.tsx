'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { UserIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/')
        return
      }
      setUser(currentUser)
      setFullName(currentUser.user_metadata?.full_name || '')
      setLoading(false)
    }
    loadUser()
  }, [router])

  const handleLogout = async () => {
    await signOut()
  }

  const handleSaveName = () => {
    // TODO: Save name to database
    setIsEditingName(false)
    alert('Ad yadda saxlanıldı')
  }

  const handleSavePhone = () => {
    // Validate phone format: should be 9 digits (XX XXX XX XX)
    const digitsOnly = phone.replace(/\s/g, '')
    if (digitsOnly.length !== 9) {
      alert('Zəhmət olmasa düzgün format daxil edin: XX XXX XX XX')
      return
    }
    // TODO: Save phone to database
    setIsEditingPhone(false)
    alert('Telefon nömrəsi yadda saxlanıldı')
  }

  const formatPhoneInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // Limit to 9 digits
    const limited = digits.slice(0, 9)
    // Format: XX XXX XX XX
    let formatted = ''
    if (limited.length > 0) {
      formatted = limited.slice(0, 2)
      if (limited.length > 2) {
        formatted += ' ' + limited.slice(2, 5)
      }
      if (limited.length > 5) {
        formatted += ' ' + limited.slice(5, 7)
      }
      if (limited.length > 7) {
        formatted += ' ' + limited.slice(7, 9)
      }
    }
    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setPhone(formatted)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation isAuthenticated={true} />
        <div className="container-main py-20 text-center">
          <div className="text-lg text-gray-600">Yüklənir...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} />

      <div className="container-main py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditingName ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="text-3xl font-bold text-black border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                      placeholder="Ad Soyad"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveName}
                        className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Yadda saxla
                      </button>
                      <button
                        onClick={() => {
                          setFullName(user.user_metadata?.full_name || '')
                          setIsEditingName(false)
                        }}
                        className="px-4 py-1.5 bg-white text-black text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ləğv et
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-black">
                        {fullName || 'İstifadəçi'}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Redaktə et
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  {phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon className="w-5 h-5" />
                      <span>+994 {phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-white text-black font-medium border border-black rounded-lg hover:bg-gray-50 transition-colors"
              >
                Çıxış
              </button>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-black mb-6">Əlaqə məlumatları</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon nömrəsi
                </label>
                {isEditingPhone ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-gray-700 bg-gray-100 px-4 py-2.5 rounded-lg border border-gray-300">
                        +994
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="XX XXX XX XX"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Format: 70 123 45 67 (50, 51, 55, 70, 77, 10, 99)
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSavePhone}
                        className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Yadda saxla
                      </button>
                      <button
                        onClick={() => setIsEditingPhone(false)}
                        className="px-6 py-2.5 bg-white text-black font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ləğv et
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {phone ? `+994 ${phone}` : 'Telefon nömrəsi əlavə edilməyib'}
                    </span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {phone ? 'Redaktə et' : 'Əlavə et'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Jobs Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Mənim elanlarım</h2>
              <button
                onClick={() => router.push('/post-job')}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Yeni elan
              </button>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Hələ elanınız yoxdur
              </h3>
              <p className="text-gray-600 mb-6">
                İlk vakansiya və ya gündəlik iş elanınızı yerləşdirin
              </p>
              <button
                onClick={() => router.push('/post-job')}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Elan yerləşdir
              </button>
            </div>

            {/* TODO: Replace with actual user jobs
            <div className="space-y-4">
              {userJobs.map(job => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Navigation from '@/components/ui/Navigation'
import { getCurrentUser } from '@/lib/auth'
import { submitRecruiterApplication } from '@/lib/api/recruiter-application'
import { BriefcaseIcon, BuildingOfficeIcon, PhoneIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function BecomeRecruiterPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        company_name: '',
        recruiter_contact: '',
        role_type: 'recruiter' as 'recruiter' | 'hr' | 'agency',
        reason: '',
    })

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await getCurrentUser()
            if (!currentUser) {
                router.push('/')
                return
            }
            setUser(currentUser)
            setLoading(false)
        }
        loadUser()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error('Daxil olmamısınız')
            return
        }

        // Validation
        if (!formData.company_name.trim()) {
            toast.error('Şirkət/Agentlik adı mütləqdir')
            return
        }
        if (!formData.recruiter_contact.trim()) {
            toast.error('Əlaqə məlumatı mütləqdir')
            return
        }
        if (!formData.reason.trim() || formData.reason.trim().length < 20) {
            toast.error('Səbəb minimum 20 simvol olmalıdır')
            return
        }

        setIsSubmitting(true)

        const result = await submitRecruiterApplication(user.id, formData)

        if (result.success) {
            toast.success('Təbriklər! Siz indi rekrutersiniz')
            setTimeout(() => {
                router.push('/profile')
            }, 1500)
        } else {
            toast.error(result.error || 'Xəta baş verdi')
            setIsSubmitting(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation isAuthenticated={true} onPostJob={() => router.push('/post-job')} />
                <div className="container mx-auto px-4 max-w-3xl py-20 text-center">
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
            <Navigation isAuthenticated={true} onPostJob={() => router.push('/post-job')} />

            {/* Hero Section */}
            <section className="bg-white py-10 md:py-16 border-b border-gray-200">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BriefcaseIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Rekruter ol
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Rekruter kimi qeydiyyatdan keçin və daha çox elan yerləşdirin
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-10 md:py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        {/* Info Alert */}
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex gap-3">
                                <div className="text-blue-600 flex-shrink-0">ℹ️</div>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Rekruter imkanları:</p>
                                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                                        <li>Gündə 30-a qədər elan yerləşdirə bilərsiniz (adi istifadəçilər: 3)</li>
                                        <li>Müxtəlif işəgötürənlər üçün elan yerləşdirə bilərsiniz</li>
                                        <li>İşəgötürənin əlaqə nömrəsini əlavə edə bilərsiniz</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Role Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-3">
                                Rolu seçin <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { value: 'recruiter', label: 'Rekruter', icon: '👤' },
                                    { value: 'hr', label: 'HR', icon: '🎯' },
                                    { value: 'agency', label: 'Agentlik', icon: '🏢' },
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleChange('role_type', option.value)}
                                        className={`px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.role_type === option.value
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="block text-2xl mb-1">{option.icon}</span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Company Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
                                Şirkət / Agentlik adı <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.company_name}
                                onChange={(e) => handleChange('company_name', e.target.value)}
                                placeholder="Məs: ABC Recruitment Agency"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                required
                            />
                        </div>

                        {/* Contact */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                <PhoneIcon className="w-5 h-5 inline mr-2" />
                                Əlaqə (WhatsApp, Instagram, Website) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.recruiter_contact}
                                onChange={(e) => handleChange('recruiter_contact', e.target.value)}
                                placeholder="Məs: @abc_hr, +994501234567, www.abc.az"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                WhatsApp nömrəsi, Instagram profili və ya vebsayt
                            </p>
                        </div>

                        {/* Reason */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-2">
                                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                                Niyə çoxlu elan yerləşdirmək istəyirsiniz? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => handleChange('reason', e.target.value)}
                                rows={4}
                                placeholder="Məs: HR meneceri olaraq müxtəlif vakansiyalar üzrə namizədlər axtarıram..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                Minimum 20 simvol
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <div className="flex gap-3">
                                <div className="text-yellow-600 flex-shrink-0">⚠️</div>
                                <div className="text-sm text-yellow-800">
                                    <p className="font-semibold mb-1">Diqqət!</p>
                                    <p>
                                        Yanlış məlumat daxil etsəniz və ya başqasının nömrəsini icazəsiz istifadə etsəniz,
                                        hesabınız <strong>müddətsiz bloklanacaq</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Göndərilir...
                                </span>
                            ) : (
                                'Ərizə göndər'
                            )}
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 mt-12">
                <div className="container mx-auto px-4 max-w-7xl text-center text-sm text-gray-600">
                    © 2025 Vakansiya.az
                </div>
            </footer>
        </div>
    )
}

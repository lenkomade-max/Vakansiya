'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { checkUserBan } from '@/lib/api/anti-abuse/profile'
import { ShieldExclamationIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function BannedPage() {
    const router = useRouter()
    const [banInfo, setBanInfo] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkBan = async () => {
            const user = await getCurrentUser()
            if (!user) {
                router.push('/')
                return
            }

            const ban = await checkUserBan(user.id)
            if (!ban.isBanned) {
                // Не забанен - редирект на главную
                router.push('/')
                return
            }

            setBanInfo(ban)
            setLoading(false)
        }
        checkBan()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Yüklənir...</div>
            </div>
        )
    }

    if (!banInfo) {
        return null
    }

    const isTemporary = banInfo.until

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                        <ShieldExclamationIcon className="w-14 h-14 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                    {isTemporary ? 'Hesabınız müvəqqəti olaraq bloklanıb' : 'Hesabınız bloklanıb'}
                </h1>

                {/* Reason */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Səbəb:</p>
                    <p className="text-base text-gray-900">{banInfo.reason || 'Qaydaların pozulması'}</p>
                </div>

                {/* Ban Until (for temporary) */}
                {isTemporary && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                        <p className="text-sm font-semibold text-yellow-800 mb-2">Blokun bitməsi:</p>
                        <p className="text-2xl font-bold text-yellow-900">
                            {new Date(banInfo.until).toLocaleDateString('az-AZ', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                )}

                {/* Permanent ban message */}
                {!isTemporary && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                        <p className="text-base font-semibold text-red-800">
                            Bu qərar dəyişdirilə bilməz.
                        </p>
                    </div>
                )}

                {/* Support contact */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-3 text-gray-600">
                        <EnvelopeIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Əlavə məlumat üçün bizimlə əlaqə saxlayın:
                            </p>
                            <a
                                href="mailto:support@vakansiya.az"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                support@vakansiya.az
                            </a>
                        </div>
                    </div>
                </div>

                {/* Logout button */}
                <div className="mt-8">
                    <button
                        onClick={() => {
                            // Sign out and redirect
                            window.location.href = '/api/auth/signout'
                        }}
                        className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Çıxış
                    </button>
                </div>
            </div>
        </div>
    )
}

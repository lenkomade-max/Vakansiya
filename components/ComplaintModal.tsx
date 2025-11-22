'use client'

import React, { useState } from 'react'
import { FlagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { submitComplaint } from '@/lib/api/complaints'
import toast from 'react-hot-toast'

type ComplaintModalProps = {
    jobId: string
    reporterId: string
    onClose: () => void
}

const COMPLAINT_TYPES = [
    { value: 'unauthorized_phone', label: 'İcazəsiz nömrə istifadəsi', icon: '📱' },
    { value: 'fraud', label: 'Fırıldaqçılıq', icon: '⚠️' },
    { value: 'spam', label: 'Spam', icon: '🚫' },
    { value: 'other', label: 'Digər', icon: '❓' },
] as const

export default function ComplaintModal({ jobId, reporterId, onClose }: ComplaintModalProps) {
    const [selectedType, setSelectedType] = useState<typeof COMPLAINT_TYPES[number]['value'] | ''>('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedType) {
            toast.error('Səbəbi seçin')
            return
        }

        if (description.trim().length < 10) {
            toast.error('Təsvir minimum 10 simvol olmalıdır')
            return
        }

        setIsSubmitting(true)

        const result = await submitComplaint({
            job_id: jobId,
            reporter_id: reporterId,
            type: selectedType,
            description: description.trim()
        })

        if (result.success) {
            toast.success('Şikayət göndərildi')
            onClose()
        } else {
            toast.error(result.error || 'Xəta baş verdi')
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <FlagIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">
                                Şikayət et
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Complaint Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-3">
                                Səbəb seçin <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {COMPLAINT_TYPES.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedType === type.value
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="complaint_type"
                                            value={type.value}
                                            checked={selectedType === type.value}
                                            onChange={(e) => setSelectedType(e.target.value as any)}
                                            className="w-5 h-5 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-2xl">{type.icon}</span>
                                        <span className="text-sm font-medium text-gray-900 flex-1">
                                            {type.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                                Təsvir <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Ətraflı izah edin... (minimum 10 simvol)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-base"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                {description.length}/200 simvol
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Yalan şikayət etmək öz hesabınızın bloklanmasına səbəb ola bilər.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Göndərilir...
                                </span>
                            ) : (
                                'Göndər'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

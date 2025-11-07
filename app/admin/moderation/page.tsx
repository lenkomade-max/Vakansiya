'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { getPendingJobs, approveJob, rejectJob, isAdmin } from '@/lib/api/moderation'
import { Job } from '@/lib/api/jobs'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  BanknotesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { FireIcon } from '@heroicons/react/24/solid'

export default function AdminModerationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    checkAdminAndLoadJobs()
  }, [])

  const checkAdminAndLoadJobs = async () => {
    setLoading(true)

    // Проверка админа
    const admin = await isAdmin()
    if (!admin) {
      // Перенаправить на главную если не админ
      router.push('/')
      return
    }

    setIsAdminUser(true)

    // Загрузить задания на модерации
    try {
      const pendingJobs = await getPendingJobs()
      setJobs(pendingJobs)
    } catch (error) {
      console.error('Error loading pending jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (jobId: string) => {
    setProcessing(true)
    try {
      await approveJob(jobId)
      // Обновить список
      setJobs(jobs.filter(j => j.id !== jobId))
      setSelectedJob(null)
      alert('✅ Задание одобрено!')
    } catch (error) {
      console.error('Error approving job:', error)
      alert('❌ Ошибка при одобрении')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (jobId: string) => {
    if (!rejectReason.trim()) {
      alert('Укажите причину отклонения')
      return
    }

    setProcessing(true)
    try {
      await rejectJob(jobId, rejectReason)
      // Обновить список
      setJobs(jobs.filter(j => j.id !== jobId))
      setSelectedJob(null)
      setRejectReason('')
      alert('✅ Задание отклонено')
    } catch (error) {
      console.error('Error rejecting job:', error)
      alert('❌ Ошибка при отклонении')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('az-AZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation
          onLogin={() => {}}
          onPostJob={() => {}}
          isAuthenticated={true}
        />
        <div className="container mx-auto px-4 max-w-7xl py-20 text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yoxlanılır...</p>
        </div>
      </div>
    )
  }

  // Not admin
  if (!isAdminUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onLogin={() => {}}
        onPostJob={() => {}}
        isAuthenticated={true}
      />

      <div className="container mx-auto px-4 max-w-7xl py-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Admin Moderasiya Paneli</h1>
          </div>
          <p className="text-white/90">
            {jobs.length} elan yoxlanılmağı gözləyir
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">
              Hamısı yoxlanıldı!
            </h2>
            <p className="text-gray-600">
              Hazırda moderasiya gözləyən elan yoxdur
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jobs List */}
            <div className="lg:col-span-2 space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? 'border-black shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {job.is_vip && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded flex items-center gap-1">
                            <FireIcon className="w-3 h-3" />
                            VIP
                          </span>
                        )}
                        {job.is_urgent && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            TƏCİLİ
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {job.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-black mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <BanknotesIcon className="w-4 h-4" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprove(job.id)
                      }}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Təsdiq et
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedJob(job)
                      }}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Rədd et
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                {selectedJob ? (
                  <>
                    <h2 className="text-xl font-bold text-black mb-4">
                      Elan detalları
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Başlıq</p>
                        <p className="font-semibold text-black">{selectedJob.title}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Təsvir</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {selectedJob.description}
                        </p>
                      </div>

                      {selectedJob.requirements && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tələblər</p>
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {selectedJob.requirements}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Əlaqə</p>
                        <p className="font-semibold text-black">
                          {selectedJob.contact_phone}
                        </p>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleApprove(selectedJob.id)}
                        disabled={processing}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CheckCircleIcon className="w-6 h-6" />
                        {processing ? 'Yoxlanılır...' : 'Təsdiq et'}
                      </button>

                      <div className="border-t border-gray-200 pt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rədd etmə səbəbi
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Səbəbi qeyd edin..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none mb-2"
                          rows={3}
                        />
                        <button
                          onClick={() => handleReject(selectedJob.id)}
                          disabled={processing || !rejectReason.trim()}
                          className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <XCircleIcon className="w-6 h-6" />
                          Rədd et
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Yoxlamaq üçün elan seçin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

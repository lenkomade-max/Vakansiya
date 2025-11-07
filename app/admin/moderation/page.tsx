'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { getPendingJobs, getAllJobs, approveJob, rejectJob, isAdmin } from '@/lib/api/moderation'
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_review' | 'pending_moderation' | 'rejected'>('all')
  const [retryLoading, setRetryLoading] = useState(false)
  const [retryResult, setRetryResult] = useState<any>(null)

  useEffect(() => {
    checkAdminAndLoadJobs()
  }, [])

  // Перезагрузить при изменении фильтра
  useEffect(() => {
    if (isAdminUser) {
      loadJobs()
    }
  }, [statusFilter, isAdminUser])

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

    // Загрузить задания
    await loadJobs()
    setLoading(false)
  }

  const loadJobs = async () => {
    try {
      const allJobs = await getAllJobs(statusFilter)
      setJobs(allJobs)
    } catch (error) {
      console.error('Error loading jobs:', error)
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

  const handleRetryModeration = async () => {
    if (!confirm('Bütün gözləyən və növbədə olan elanları AI ilə yenidən yoxlamaq istəyirsiniz?')) {
      return
    }

    setRetryLoading(true)
    setRetryResult(null)

    try {
      const response = await fetch('/api/admin/retry-moderation')
      const data = await response.json()

      if (data.success) {
        setRetryResult(data)

        if (data.results?.total === 0) {
          alert('✅ Yoxlanılacaq elan tapılmadı')
        } else {
          alert(`✅ Uğurla tamamlandı!\n\n📊 Nəticələr:\nİşləndi: ${data.results?.total || 0}\n✅ Təsdiqləndi: ${data.results?.approved || 0}\n❌ Rədd edildi: ${data.results?.rejected || 0}\n⏳ Əl ilə yoxlanılmalı: ${data.results?.pending_review || 0}\n❗ Uğursuz: ${data.results?.failed || 0}`)
        }

        // Yenilə
        await loadJobs()
      } else {
        alert(`❌ Xəta: ${data.error || 'Naməlum xəta'}`)
      }
    } catch (error) {
      console.error('Retry moderation error:', error)
      alert('❌ Xəta baş verdi')
    } finally {
      setRetryLoading(false)
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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Admin Moderasiya Paneli</h1>
          </div>
          <p className="text-white/90">
            {jobs.length} elan tapıldı
          </p>
        </div>

        {/* Status Filters + Retry Button */}
        <div className="flex gap-2 mb-6 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                statusFilter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🔄 Hamısı ({jobs.length})
            </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✅ Aktiv
          </button>
          <button
            onClick={() => setStatusFilter('pending_review')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === 'pending_review'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ⏳ Gözləyir
          </button>
          <button
            onClick={() => setStatusFilter('pending_moderation')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === 'pending_moderation'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🔄 Növbədə
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ❌ Rədd edilib
          </button>
          </div>

          {/* Retry Moderation Button */}
          <button
            onClick={handleRetryModeration}
            disabled={retryLoading}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {retryLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Yoxlanılır...
              </>
            ) : (
              <>
                🔄 Yenidən yoxla
              </>
            )}
          </button>
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
                        {/* Status Badge */}
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status === 'active' ? '✓ Aktiv' :
                           job.status === 'pending_review' ? '⏳ Gözləyir' :
                           job.status === 'rejected' ? '✗ Rədd' :
                           job.status}
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

                      {/* AI Moderation Results */}
                      {(selectedJob as any).ai_moderation_result && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span>🤖</span>
                            AI Moderasiya
                          </p>
                          {(() => {
                            const ai = (selectedJob as any).ai_moderation_result
                            return (
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-1 rounded font-bold ${
                                    ai.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {ai.approved ? '✓ Təsdiq' : '✗ Rədd'}
                                  </span>
                                  <span className="text-gray-600">
                                    Əminlik: {(ai.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-gray-700">
                                    <strong>Səbəb:</strong> {ai.reason}
                                  </p>
                                </div>
                                {ai.violations && ai.violations.length > 0 && (
                                  <div>
                                    <strong className="text-red-600">Pozuntular:</strong>
                                    <ul className="list-disc list-inside text-gray-700 ml-2 mt-1">
                                      {ai.violations.map((v: string, i: number) => (
                                        <li key={i}>{v}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <p className="text-gray-600">
                                  <strong>Tövsiyə:</strong> {
                                    ai.recommendation === 'approve' ? '✓ Təsdiq et' :
                                    ai.recommendation === 'reject' ? '✗ Rədd et' :
                                    '⚠ Əl ilə yoxla'
                                  }
                                </p>
                              </div>
                            )
                          })()}
                        </div>
                      )}

                      {/* Rules Moderation Results */}
                      {(selectedJob as any).rules_moderation_result && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span>📋</span>
                            Qaydalar Yoxlaması
                          </p>
                          {(() => {
                            const rules = (selectedJob as any).rules_moderation_result
                            return (
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-1 rounded font-bold ${
                                    rules.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    Xal: {rules.score}/100
                                  </span>
                                  {rules.language && (
                                    <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      Dil: {rules.language.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                {rules.flags && rules.flags.length > 0 && (
                                  <div>
                                    <strong className="text-gray-800">Problemlər ({rules.flags.length}):</strong>
                                    <ul className="space-y-1 mt-1">
                                      {rules.flags.map((flag: any, i: number) => (
                                        <li key={i} className="bg-gray-50 p-2 rounded">
                                          <div className="flex items-start gap-2">
                                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                                              flag.severity === 'critical' ? 'bg-red-500 text-white' :
                                              flag.severity === 'high' ? 'bg-orange-500 text-white' :
                                              flag.severity === 'medium' ? 'bg-yellow-500 text-white' :
                                              'bg-gray-300 text-gray-700'
                                            }`}>
                                              {flag.severity}
                                            </span>
                                            <span className="text-gray-700 text-xs">{flag.message}</span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                      )}
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

/**
 * Moderation API - Server Actions
 * Использует Next.js 15 Server Actions для безопасной модерации
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ModerationLog {
  id: string
  job_id: string
  moderator_id: string
  action: 'approve' | 'reject' | 'flag'
  reason?: string
  ai_result?: any
  created_at: string
}

/**
 * Проверка админ роли
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role === 'admin'
}

/**
 * Получить все задания на модерации
 */
export async function getPendingJobs() {
  const supabase = await createClient()

  // Проверка админа
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Access denied: Admin only')
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending jobs:', error)
    throw error
  }

  return data
}

/**
 * Одобрить задание
 */
export async function approveJob(jobId: string, reason?: string) {
  const supabase = await createClient()

  // Проверка админа
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Access denied: Admin only')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Обновить статус
  const { error: updateError } = await supabase
    .from('jobs')
    .update({
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId)

  if (updateError) {
    console.error('Error approving job:', updateError)
    throw updateError
  }

  // Создать лог
  const { error: logError } = await supabase
    .from('moderation_logs')
    .insert({
      job_id: jobId,
      moderator_id: user.id,
      action: 'approve',
      reason: reason || 'Approved by moderator'
    })

  if (logError) {
    console.error('Error creating moderation log:', logError)
  }

  // Обновить кэш страницы
  revalidatePath('/admin/moderation')

  return { success: true }
}

/**
 * Отклонить задание
 */
export async function rejectJob(jobId: string, reason: string) {
  const supabase = await createClient()

  // Проверка админа
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Access denied: Admin only')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Обновить статус
  const { error: updateError } = await supabase
    .from('jobs')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId)

  if (updateError) {
    console.error('Error rejecting job:', updateError)
    throw updateError
  }

  // Создать лог
  const { error: logError } = await supabase
    .from('moderation_logs')
    .insert({
      job_id: jobId,
      moderator_id: user.id,
      action: 'reject',
      reason: reason
    })

  if (logError) {
    console.error('Error creating moderation log:', logError)
  }

  // Обновить кэш страницы
  revalidatePath('/admin/moderation')

  return { success: true }
}

/**
 * Пометить как требующее внимания
 */
export async function flagJob(jobId: string, reason: string) {
  const supabase = await createClient()

  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Access denied: Admin only')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Создать лог
  const { error } = await supabase
    .from('moderation_logs')
    .insert({
      job_id: jobId,
      moderator_id: user.id,
      action: 'flag',
      reason: reason
    })

  if (error) {
    console.error('Error flagging job:', error)
    throw error
  }

  return { success: true }
}

/**
 * Получить логи модерации для задания
 */
export async function getModerationLogs(jobId: string) {
  const supabase = await createClient()

  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Access denied: Admin only')
  }

  const { data, error } = await supabase
    .from('moderation_logs')
    .select(`
      *,
      moderator:profiles(full_name)
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching moderation logs:', error)
    throw error
  }

  return data
}

'use server'

import { createClient } from '../supabase/server'
import { aiModerationWithFallback } from '../moderation/ai'
import { moderateContent } from '../moderation/rules'
import { revalidatePath } from 'next/cache'

export type JobType = 'vakansiya' | 'gundelik'

export type Job = {
  id: string
  user_id: string
  job_type: JobType
  title: string
  category: string
  location: string
  salary?: string
  description?: string
  company?: string
  employment_type?: string
  experience?: string
  education?: string
  deadline?: string
  requirements?: string
  benefits?: string
  start_date?: string
  duration?: string
  contact_phone: string
  status: 'pending_review' | 'active' | 'inactive' | 'expired' | 'rejected'
  is_vip: boolean
  is_urgent: boolean
  views_count: number
  expires_at: string
  created_at: string
  updated_at: string
}

export type CreateJobData = {
  job_type: JobType
  title: string
  category: string
  location: string
  salary?: string
  description?: string
  company?: string
  employment_type?: string
  experience?: string
  education?: string
  deadline?: string
  requirements?: string
  benefits?: string
  start_date?: string
  duration?: string
  contact_phone: string
}

/**
 * Create a new job/elan with AI moderation
 */
export async function createJob(
  userId: string,
  jobData: CreateJobData
): Promise<{ success: boolean; jobId?: string; error?: string; status?: string }> {
  const supabase = await createClient()

  console.log('[createJob] Starting job creation for user:', userId)
  console.log('[createJob] Job data:', jobData)

  // Prepare job post for moderation
  const jobPost = {
    title: jobData.title,
    description: jobData.description || '',
    company: jobData.company || '',
    salary: jobData.salary || '',
    location: jobData.location,
  }

  console.log('[createJob] Running moderation...')

  // Run rules-based check first
  const moderationResult = await moderateContent(jobPost)

  console.log('[createJob] Moderation result:', moderationResult)

  let finalStatus: 'pending_review' | 'active' | 'rejected' = 'pending_review'
  let aiResult: any = null

  // ===== НОВАЯ ЛОГИКА МОДЕРАЦИИ: 90% авто-решений =====

  // 1. AUTO REJECT: мошенничество, мат, очень низкий score
  if (moderationResult.autoReject) {
    console.log('[createJob] AUTO REJECT by rules:', moderationResult.flags)
    finalStatus = 'rejected'

    // Формируем детальное сообщение с причинами
    const criticalFlags = moderationResult.flags.filter(f => f.severity === 'critical' || f.severity === 'high')
    const reasons = criticalFlags.map(f => f.message).join('\n- ')

    return {
      success: false,
      error: `Elan rədd edildi:\n\nSəbəblər:\n- ${reasons}\n\nZəhmət olmasa, elanınızı yoxlayın və düzgün məlumat daxil edin.`
    }
  }

  // 2. AUTO APPROVE: высокий score, нет критических проблем
  if (moderationResult.approved) {
    console.log('[createJob] AUTO APPROVE by rules (score:', moderationResult.score, ')')
    finalStatus = 'active'
  }

  // 3. AI REVIEW: пограничные случаи (score 30-75)
  else if (moderationResult.needsAIReview) {
    console.log('[createJob] Sending to AI review (score:', moderationResult.score, ')')
    try {
      aiResult = await aiModerationWithFallback(jobPost, moderationResult.flags)
      console.log('[createJob] AI result:', aiResult)

      // Применяем AI улучшения (если есть)
      if (aiResult.suggestedTitle && aiResult.suggestedTitle.trim()) {
        console.log('[createJob] AI suggested better title:', aiResult.suggestedTitle)
        console.log('[createJob] Original title:', jobData.title)
        // Заменяем название на предложенное AI
        jobData.title = aiResult.suggestedTitle.trim()
        jobPost.title = aiResult.suggestedTitle.trim()
      }

      if (aiResult.jobType) {
        console.log('[createJob] AI determined job type:', aiResult.jobType)
        console.log('[createJob] Original job type:', jobData.job_type)
        // Исправляем тип работы если AI определил другой
        if (aiResult.jobType !== jobData.job_type) {
          console.log('[createJob] Correcting job type from', jobData.job_type, 'to', aiResult.jobType)
          jobData.job_type = aiResult.jobType
        }
      }

      // AI approved with confidence >= 0.9 → auto approve
      if (aiResult.approved && aiResult.confidence >= 0.9) {
        console.log('[createJob] AUTO APPROVE by AI (confidence:', aiResult.confidence, ')')
        finalStatus = 'active'
      }
      // AI rejected with confidence >= 0.9 → auto reject
      else if (!aiResult.approved && aiResult.confidence >= 0.9 && aiResult.recommendation === 'reject') {
        console.log('[createJob] AUTO REJECT by AI (confidence:', aiResult.confidence, ')')
        finalStatus = 'rejected'

        // Детальная причина для пользователя
        const rejectionReason = aiResult.violations && aiResult.violations.length > 0
          ? `${aiResult.reason}\n\nAşkar edilən problemlər:\n- ${aiResult.violations.join('\n- ')}`
          : aiResult.reason;

        return {
          success: false,
          error: `Elan rədd edildi:\n${rejectionReason}`
        }
      }
      // Low confidence (< 0.9) → manual review
      else {
        console.log('[createJob] MANUAL REVIEW (AI confidence too low:', aiResult.confidence, ')')
        finalStatus = 'pending_review'
      }
    } catch (error) {
      console.error('[createJob] AI moderation failed, setting to pending_moderation for retry:', error)
      // Если AI упал → pending_moderation (очередь задач обработает позже)
      finalStatus = 'pending_moderation'
    }
  }

  // 4. Fallback: если ничего не сработало → manual review
  else {
    console.log('[createJob] Fallback to MANUAL REVIEW')
    finalStatus = 'pending_review'
  }

  // Insert job with determined status AND moderation results
  console.log('[createJob] Inserting job with status:', finalStatus)

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      user_id: userId,
      ...jobData,
      status: finalStatus,
      rules_moderation_result: moderationResult,
      ai_moderation_result: aiResult,
      ai_checked_at: aiResult ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[createJob] Database error:', error)
    return { success: false, error: error.message }
  }

  console.log('[createJob] Job created successfully:', data.id)

  // Revalidate profile page to show new job
  revalidatePath('/profile')

  return { success: true, jobId: data.id, status: finalStatus }
}

/**
 * Get all jobs for a user
 */
export async function getUserJobs(userId: string): Promise<Job[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user jobs:', error)
    return []
  }

  return data || []
}

/**
 * Get a single job by ID
 */
export async function getJob(jobId: string): Promise<Job | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    console.error('Error fetching job:', error)
    return null
  }

  return data
}

/**
 * Update a job
 */
export async function updateJob(
  jobId: string,
  updates: Partial<CreateJobData>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)

  if (error) {
    console.error('Error updating job:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Delete a job
 */
export async function deleteJob(jobId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)

  if (error) {
    console.error('Error deleting job:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Get all active jobs (public)
 */
export async function getActiveJobs(jobType?: JobType): Promise<Job[]> {
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (jobType) {
    query = query.eq('job_type', jobType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching active jobs:', error)
    return []
  }

  return data || []
}

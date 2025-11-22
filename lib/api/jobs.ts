'use server'

import { createClient } from '../supabase/server'
import { aiModerationWithFallback } from '../moderation/ai'
import { moderateContent } from '../moderation/rules'
import { revalidatePath } from 'next/cache'

// Anti-abuse utilities
import { checkUserBan, checkAndPromoteToRecruiter, getExtendedProfile } from './anti-abuse/profile'
import { checkPostsLimit, checkPhoneLimits, updateRateLimits } from './anti-abuse/rate-limiting'
import { isPhoneBlocked, trackPhoneUsage, validatePhoneFormat, normalizePhone } from './anti-abuse/phone-validation'

export type JobType = 'vakansiya' | 'gundelik'

export type Job = {
  id: string
  user_id: string
  job_type: JobType
  title: string
  category: string // UUID of subcategory
  category_name?: string // Azerbaijani name for display
  parent_category_name?: string // Parent category name for display
  location: string
  work_address?: string
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
  contact_name?: string
  contact_phone: string
  employer_phone?: string // Recruiter's employer contact (anti-abuse)
  status: 'pending_review' | 'pending_moderation' | 'active' | 'inactive' | 'expired' | 'rejected'
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
  work_address?: string
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
  contact_name: string
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

  // ===== PHASE 1: ANTI-ABUSE PROTECTION =====

  // 1. Check if user is banned
  const banCheck = await checkUserBan(userId)
  if (banCheck.isBanned) {
    console.log('[createJob] User is banned:', userId)
    const errorMsg = banCheck.until
      ? `Hesabınız müvəqqəti olaraq bloklanıb.\nSəbəb: ${banCheck.reason}\nBlokun bitməsi: ${new Date(banCheck.until).toLocaleDateString('az-AZ')}`
      : `Hesabınız bloklanıb.\nSəbəb: ${banCheck.reason}`

    return {
      success: false,
      error: errorMsg
    }
  }

  // 2. Check daily post limit
  const postsLimitCheck = await checkPostsLimit(userId)
  if (!postsLimitCheck.allowed) {
    console.log('[createJob] User exceeded posts limit:', userId, postsLimitCheck)
    return {
      success: false,
      error: postsLimitCheck.error || 'Gündəlik limit bitdi'
    }
  }

  // 3. Get user profile to determine role
  const profile = await getExtendedProfile(userId)
  if (!profile) {
    return {
      success: false,
      error: 'Profil tapılmadı'
    }
  }

  // 4. Validate and normalize phone numbers
  let contactPhone = normalizePhone(jobData.contact_phone)
  const phoneFormatCheck = validatePhoneFormat(contactPhone)
  if (!phoneFormatCheck.isValid) {
    return {
      success: false,
      error: phoneFormatCheck.error
    }
  }

  // 5. Check if contact_phone is blocked
  const contactPhoneBlockCheck = await isPhoneBlocked(contactPhone)
  if (contactPhoneBlockCheck.isBlocked) {
    console.log('[createJob] Contact phone is blocked:', contactPhone)
    return {
      success: false,
      error: `Bu nömrə bloklanıb: ${contactPhoneBlockCheck.reason}`
    }
  }

  // 6. For recruiters: validate employer_phone and check limits
  let employerPhone: string | undefined = undefined
  if (profile.role === 'recruiter' && (jobData as any).employer_phone) {
    employerPhone = normalizePhone((jobData as any).employer_phone)

    // Validate format
    const employerPhoneFormatCheck = validatePhoneFormat(employerPhone)
    if (!employerPhoneFormatCheck.isValid) {
      return {
        success: false,
        error: `İşəgötürənin nömrəsi: ${employerPhoneFormatCheck.error}`
      }
    }

    // Check if blocked
    const employerPhoneBlockCheck = await isPhoneBlocked(employerPhone)
    if (employerPhoneBlockCheck.isBlocked) {
      return {
        success: false,
        error: `İşəgötürənin nömrəsi bloklanıb: ${employerPhoneBlockCheck.reason}`
      }
    }

    // Check phone limits (10 new/day, 50 new/month)
    const phoneLimitCheck = await checkPhoneLimits(userId, employerPhone)
    if (!phoneLimitCheck.allowed) {
      console.log('[createJob] Recruiter exceeded phone limits:', userId)
      return {
        success: false,
        error: phoneLimitCheck.error || 'Telefon nömrəsi limiti bitdi'
      }
    }
  }

  // ===== PHASE 2: CONTENT MODERATION (existing logic) =====

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

  let finalStatus: 'pending_review' | 'pending_moderation' | 'active' | 'rejected' = 'pending_review'
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

  // ===== PHASE 3: POST-CREATION TRACKING =====

  // Update rate limits (posts_today counter)
  await updateRateLimits(userId, employerPhone)

  // Track phone number usage
  await trackPhoneUsage(userId, contactPhone, data.id)
  if (employerPhone) {
    await trackPhoneUsage(userId, employerPhone, data.id)
  }

  // Check if user should be auto-promoted to recruiter (10+ posts in 7 days)
  const promoted = await checkAndPromoteToRecruiter(userId)
  if (promoted) {
    console.log('[createJob] User auto-promoted to recruiter:', userId)
  }

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
    .select(`
      *,
      category_info:categories!category (
        id,
        name,
        name_az,
        image_url,
        image_alt,
        parent_id,
        parent_category:categories!parent_id (
          id,
          name_az,
          image_url
        )
      )
    `)
    .eq('id', jobId)
    .single()

  if (error) {
    console.error('Error fetching job:', error)
    return null
  }

  // Transform data to include category names
  const job = {
    ...data,
    category_name: (data as any).category_info?.name_az,
    parent_category_name: (data as any).category_info?.parent_category?.name_az || (data as any).category_info?.name_az,
  }

  return job
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
    .select(`
      *,
      category_info:categories!category (
        id,
        name,
        name_az,
        image_url,
        image_alt,
        parent_id,
        parent_category:categories!parent_id (
          id,
          name_az,
          image_url
        )
      )
    `)
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

  // Transform data to include category names
  const jobs = (data || []).map((job: any) => ({
    ...job,
    category_name: job.category_info?.name_az,
    parent_category_name: job.category_info?.parent_category?.name_az || job.category_info?.name_az,
  }))

  return jobs
}

/**
 * Get active jobs with pagination and filters
 */
export async function getActiveJobsPaginated(params: {
  jobType?: JobType
  category?: string
  location?: string
  employmentType?: string
  experience?: string
  searchQuery?: string
  page?: number
  limit?: number
}): Promise<{ jobs: Job[]; total: number; hasMore: boolean }> {
  const supabase = await createClient()
  const { jobType, category, location, employmentType, experience, searchQuery, page = 1, limit = 20 } = params

  // Calculate offset
  const offset = (page - 1) * limit

  // Build query with category join to get category names
  let query = supabase
    .from('jobs')
    .select(`
      *,
      category_info:categories!category (
        id,
        name,
        name_az,
        image_url,
        image_alt,
        parent_id,
        parent_category:categories!parent_id (
          id,
          name_az,
          image_url
        )
      )
    `, { count: 'exact' })
    .eq('status', 'active')

  // Apply filters
  if (jobType) {
    query = query.eq('job_type', jobType)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (location) {
    query = query.ilike('location', `%${location}%`)
  }
  if (employmentType) {
    query = query.ilike('employment_type', `%${employmentType}%`)
  }
  if (experience) {
    query = query.ilike('experience', `%${experience}%`)
  }
  if (searchQuery) {
    // Полнотекстовый поиск по title, company, description
    query = query.or(`title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  // Add pagination and ordering
  query = query
    .order('is_vip', { ascending: false })
    .order('is_urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching paginated jobs:', error)
    return { jobs: [], total: 0, hasMore: false }
  }

  // Transform data to include category names
  const jobs = (data || []).map((job: any) => ({
    ...job,
    category_name: job.category_info?.name_az,
    parent_category_name: job.category_info?.parent_category?.name_az || job.category_info?.name_az,
  }))

  const total = count || 0
  const hasMore = offset + limit < total

  return { jobs, total, hasMore }
}

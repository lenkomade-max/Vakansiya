import { createClient } from '../supabase/client'
import { aiModerationWithFallback } from '../moderation/ai'
import { moderateContent } from '../moderation/rules'

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
  const supabase = createClient()

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

  // If rules found issues, send to manual review
  if (!moderationResult.approved || moderationResult.flags.length > 0) {
    console.log('Rules found issues, sending to manual review:', moderationResult.flags)
    finalStatus = 'pending_review'
  } else {
    // No rule violations, check with AI
    try {
      aiResult = await aiModerationWithFallback(jobPost, moderationResult.flags)

      console.log('AI moderation result:', aiResult)

      // AI approved with high confidence → auto approve
      if (aiResult.approved && aiResult.confidence >= 0.9) {
        finalStatus = 'active'
      }
      // AI rejected with high confidence → auto reject
      else if (!aiResult.approved && aiResult.confidence >= 0.9 && aiResult.recommendation === 'reject') {
        finalStatus = 'rejected'
        return {
          success: false,
          error: `Elan avtomatik olaraq rədd edildi: ${aiResult.reason}`
        }
      }
      // Low confidence or manual_review → send to review
      else {
        finalStatus = 'pending_review'
      }
    } catch (error) {
      console.error('AI moderation failed, defaulting to manual review:', error)
      finalStatus = 'pending_review'
    }
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
  return { success: true, jobId: data.id, status: finalStatus }
}

/**
 * Get all jobs for a user
 */
export async function getUserJobs(userId: string): Promise<Job[]> {
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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

'use server'

import { createClient } from '../supabase/server'
import { getExtendedProfile } from './anti-abuse/profile'

/**
 * Get user stats for profile page
 */
export async function getUserStats(userId: string): Promise<{
    role: 'user' | 'recruiter'
    trusted_recruiter: boolean
    postsToday: number
    postsLimit: number
    newPhonesToday?: number
    newPhonesLimit?: number
    newPhonesMonth?: number
    newPhonesMonthLimit?: number
} | null> {
    const supabase = await createClient()

    // Get profile with role
    const profile = await getExtendedProfile(userId)
    if (!profile) return null

    // Determine limits based on role
    const postsLimit = profile.trusted_recruiter
        ? -1 // unlimited
        : profile.role === 'recruiter'
            ? 30
            : 3

    // Get posts today from rate_limits table
    const { data: rateLimitData } = await supabase
        .from('rate_limits')
        .select('posts_today, period_start_date')
        .eq('user_id', userId)
        .single()

    let postsToday = 0

    if (rateLimitData) {
        // Check if period is current day
        const periodStart = new Date(rateLimitData.period_start_date)
        const today = new Date()
        periodStart.setHours(0, 0, 0, 0)
        today.setHours(0, 0, 0, 0)

        if (periodStart.getTime() === today.getTime()) {
            postsToday = rateLimitData.posts_today
        }
    }

    const stats: any = {
        role: profile.role,
        trusted_recruiter: profile.trusted_recruiter,
        postsToday,
        postsLimit,
    }

    // For recruiters: get phone usage stats
    if (profile.role === 'recruiter' && !profile.trusted_recruiter) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

        // Count new phones today
        const { count: newPhonesToday } = await supabase
            .from('phone_numbers_usage')
            .select('phone_number', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('first_used_at', today.toISOString())

        // Count new phones this month
        const { count: newPhonesMonth } = await supabase
            .from('phone_numbers_usage')
            .select('phone_number', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('first_used_at', monthStart.toISOString())

        stats.newPhonesToday = newPhonesToday || 0
        stats.newPhonesLimit = 10
        stats.newPhonesMonth = newPhonesMonth || 0
        stats.newPhonesMonthLimit = 50
    }

    return stats
}

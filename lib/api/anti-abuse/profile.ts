'use server'

import { createClient } from '../../supabase/server'

/**
 * Extended Profile type with anti-abuse fields
 */
export type ExtendedProfile = {
    id: string
    full_name: string | null
    phone: string | null

    // Anti-abuse fields
    role: 'user' | 'recruiter'
    trusted_recruiter: boolean
    company_name: string | null
    recruiter_contact: string | null
    posts_count: number
    complaints_count: number
    is_banned: boolean
    ban_type: string | null
    ban_reason: string | null
    banned_until: string | null

    created_at: string
    updated_at: string
}

/**
 * Get extended profile with anti-abuse fields
 */
export async function getExtendedProfile(userId: string): Promise<ExtendedProfile | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching extended profile:', error)
        return null
    }

    return data
}

/**
 * Check if user is banned
 */
export async function checkUserBan(userId: string): Promise<{
    isBanned: boolean
    reason?: string
    until?: string
}> {
    const profile = await getExtendedProfile(userId)

    if (!profile) {
        return { isBanned: false }
    }

    // Проверка временного бана
    if (profile.is_banned && profile.ban_type === 'temporary') {
        if (profile.banned_until) {
            const bannedUntil = new Date(profile.banned_until)
            if (bannedUntil > new Date()) {
                return {
                    isBanned: true,
                    reason: profile.ban_reason || 'Temporary suspension',
                    until: profile.banned_until
                }
            } else {
                // Бан истек - автоматически разбанить
                const supabase = await createClient()
                await supabase
                    .from('profiles')
                    .update({ is_banned: false, ban_type: null })
                    .eq('id', userId)

                return { isBanned: false }
            }
        }
    }

    // Постоянный бан
    if (profile.is_banned && profile.ban_type === 'permanent') {
        return {
            isBanned: true,
            reason: profile.ban_reason || 'Account permanently banned'
        }
    }

    return { isBanned: false }
}

/**
 * Auto-promote user to recruiter if they have 10+ posts in last 7 days
 */
export async function checkAndPromoteToRecruiter(userId: string): Promise<boolean> {
    const supabase = await createClient()

    // Получить профиль
    const profile = await getExtendedProfile(userId)
    if (!profile || profile.role === 'recruiter') {
        return false // Уже рекрутер
    }

    // Подсчитать посты за последние 7 дней
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count, error } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())

    if (error || !count) {
        return false
    }

    // Если 10+ постов за 7 дней → продвинуть в рекрутеры
    if (count >= 10) {
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'recruiter' })
            .eq('id', userId)

        if (!updateError) {
            console.log(`[Auto-Promotion] User ${userId} promoted to recruiter (${count} posts in 7 days)`)
            return true
        }
    }

    return false
}

/**
 * Increment posts_count in profile
 */
export async function incrementPostsCount(userId: string): Promise<void> {
    const supabase = await createClient()

    await supabase.rpc('increment', {
        table_name: 'profiles',
        row_id: userId,
        column_name: 'posts_count'
    })
}

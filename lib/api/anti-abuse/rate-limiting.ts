'use server'

import { createClient } from '../../supabase/server'
import { getExtendedProfile } from './profile'

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
    USER: {
        POSTS_PER_DAY: 3,
    },
    RECRUITER: {
        POSTS_PER_DAY: 30,
        NEW_PHONES_PER_DAY: 10,
        NEW_PHONES_PER_MONTH: 50,
    }
}

/**
 * Check if user has reached daily post limit
 */
export async function checkPostsLimit(userId: string): Promise<{
    allowed: boolean
    limit: number
    current: number
    error?: string
}> {
    const supabase = await createClient()
    const profile = await getExtendedProfile(userId)

    if (!profile) {
        return { allowed: false, limit: 0, current: 0, error: 'Profile not found' }
    }

    // Доверенные рекрутеры без лимитов
    if (profile.trusted_recruiter) {
        return { allowed: true, limit: -1, current: 0 } // -1 = unlimited
    }

    // Определить лимит в зависимости от роли
    const limit = profile.role === 'recruiter'
        ? RATE_LIMITS.RECRUITER.POSTS_PER_DAY
        : RATE_LIMITS.USER.POSTS_PER_DAY

    // Получить rate_limits из БД
    const { data: rateLimitData } = await supabase
        .from('rate_limits')
        .select('posts_today, period_start_date')
        .eq('user_id', userId)
        .single()

    let postsToday = 0

    if (rateLimitData) {
        // Проверить дату - если период истек, счетчик = 0
        const periodStart = new Date(rateLimitData.period_start_date)
        const today = new Date()
        periodStart.setHours(0, 0, 0, 0)
        today.setHours(0, 0, 0, 0)

        if (periodStart.getTime() === today.getTime()) {
            postsToday = rateLimitData.posts_today
        }
        // Если период устарел, будет обновлено при создании поста
    }

    const allowed = postsToday < limit

    return {
        allowed,
        limit,
        current: postsToday,
        error: allowed ? undefined : `Gündəlik limit: ${limit} elan. Siz bu gün ${postsToday} elan yerləşdirmişsiniz.`
    }
}

/**
 * Check if recruiter has reached phone number limits
 */
export async function checkPhoneLimits(
    userId: string,
    phoneNumber: string
): Promise<{
    allowed: boolean
    error?: string
}> {
    const supabase = await createClient()
    const profile = await getExtendedProfile(userId)

    if (!profile) {
        return { allowed: false, error: 'Profile not found' }
    }

    // Только для рекрутеров
    if (profile.role !== 'recruiter') {
        return { allowed: true } // Обычные users используют только profile phone
    }

    // Доверенные рекрутеры без лимитов
    if (profile.trusted_recruiter) {
        return { allowed: true }
    }

    // Проверить, новый ли это номер
    const { data: existingUsage } = await supabase
        .from('phone_numbers_usage')
        .select('id')
        .eq('user_id', userId)
        .eq('phone_number', phoneNumber)
        .single()

    // Если номер уже использовался - ok
    if (existingUsage) {
        return { allowed: true }
    }

    // Это новый номер - проверить лимиты
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    // Подсчитать новые номера за сегодня
    const { count: newPhonesToday } = await supabase
        .from('phone_numbers_usage')
        .select('phone_number', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('first_used_at', today.toISOString())

    if (newPhonesToday && newPhonesToday >= RATE_LIMITS.RECRUITER.NEW_PHONES_PER_DAY) {
        return {
            allowed: false,
            error: `Gündəlik limit: maksimum ${RATE_LIMITS.RECRUITER.NEW_PHONES_PER_DAY} yeni nömrə. Siz bu gün ${newPhonesToday} yeni nömrə əlavə etmisiniz.`
        }
    }

    // Подсчитать новые номера за месяц
    const { count: newPhonesMonth } = await supabase
        .from('phone_numbers_usage')
        .select('phone_number', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('first_used_at', monthStart.toISOString())

    if (newPhonesMonth && newPhonesMonth >= RATE_LIMITS.RECRUITER.NEW_PHONES_PER_MONTH) {
        return {
            allowed: false,
            error: `Aylıq limit: maksimum ${RATE_LIMITS.RECRUITER.NEW_PHONES_PER_MONTH} yeni nömrə. Siz bu ay ${newPhonesMonth} yeni nömrə əlavə etmisiniz.`
        }
    }

    return { allowed: true }
}

/**
 * Update rate limits after successful post creation
 */
export async function updateRateLimits(
    userId: string,
    phoneNumber?: string
): Promise<void> {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Upsert rate_limits
    const { data: existing } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (existing) {
        // Проверить дату - если период сменился, сбросить счетчики
        const periodStart = new Date(existing.period_start_date)
        periodStart.setHours(0, 0, 0, 0)

        const updates: any = {
            posts_today: periodStart.getTime() === today.getTime()
                ? existing.posts_today + 1
                : 1,
            period_start_date: today.toISOString().split('T')[0],
            last_post_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        await supabase
            .from('rate_limits')
            .update(updates)
            .eq('user_id', userId)
    } else {
        // Создать новую запись
        await supabase
            .from('rate_limits')
            .insert({
                user_id: userId,
                posts_today: 1,
                new_phones_today: 0,
                new_phones_month: 0,
                last_post_at: new Date().toISOString(),
                period_start_date: today.toISOString().split('T')[0],
            })
    }
}

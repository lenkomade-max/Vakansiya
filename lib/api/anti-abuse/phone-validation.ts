import { createClient } from '../../supabase/server'

/**
 * Check if phone number is blocked
 */
export async function isPhoneBlocked(phoneNumber: string): Promise<{
    isBlocked: boolean
    reason?: string
}> {
    const supabase = await createClient()

    const { data } = await supabase
        .from('blocked_phones')
        .select('reason, is_permanent, unblocked_at')
        .eq('phone_number', phoneNumber)
        .single()

    if (!data) {
        return { isBlocked: false }
    }

    // Постоянная блокировка
    if (data.is_permanent) {
        return {
            isBlocked: true,
            reason: data.reason || 'This phone number has been blocked'
        }
    }

    // Временная блокировка
    if (data.unblocked_at) {
        const unblockDate = new Date(data.unblocked_at)
        if (unblockDate > new Date()) {
            return {
                isBlocked: true,
                reason: data.reason || 'This phone number is temporarily blocked'
            }
        }
    }

    return { isBlocked: false }
}

/**
 * Track phone number usage
 */
export async function trackPhoneUsage(
    userId: string,
    phoneNumber: string,
    jobId: string
): Promise<void> {
    const supabase = await createClient()

    // Проверить существует ли уже запись
    const { data: existing } = await supabase
        .from('phone_numbers_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('phone_number', phoneNumber)
        .single()

    if (existing) {
        // Обновить существующую запись
        await supabase
            .from('phone_numbers_usage')
            .update({
                job_id: jobId,
                last_used_at: new Date().toISOString(),
                usage_count: existing.usage_count + 1,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('phone_number', phoneNumber)
    } else {
        // Создать новую запись
        await supabase
            .from('phone_numbers_usage')
            .insert({
                user_id: userId,
                phone_number: phoneNumber,
                job_id: jobId,
                usage_count: 1,
            })
    }
}

/**
 * Validate phone number format (Azerbaijan)
 */
export function validatePhoneFormat(phone: string): {
    isValid: boolean
    error?: string
} {
    // Убрать пробелы и специальные символы
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')

    // Проверка формата: +994XXXXXXXXX или 0XXXXXXXXX
    const azPattern = /^(\+994|0)[0-9]{9}$/

    if (!azPattern.test(cleaned)) {
        return {
            isValid: false,
            error: 'Telefon nömrəsi düzgün deyil. Format: +994XXXXXXXXX və ya 0XXXXXXXXX'
        }
    }

    return { isValid: true }
}

/**
 * Normalize phone number (remove spaces, add +994)
 */
export function normalizePhone(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')

    // Если начинается с 0, заменить на +994
    if (cleaned.startsWith('0')) {
        return '+994' + cleaned.substring(1)
    }

    // Если нет +, добавить +994
    if (!cleaned.startsWith('+')) {
        return '+994' + cleaned
    }

    return cleaned
}

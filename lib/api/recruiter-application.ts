'use server'

import { createClient } from '../supabase/server'

/**
 * Submit recruiter application
 */
export async function submitRecruiterApplication(
    userId: string,
    data: {
        company_name: string
        recruiter_contact: string
        role_type: 'recruiter' | 'hr' | 'agency'
        reason: string
    }
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        // Update profile with recruiter role
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                role: 'recruiter',
                company_name: data.company_name,
                recruiter_contact: data.recruiter_contact,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)

        if (updateError) {
            console.error('[submitRecruiterApplication] Error:', updateError)
            return {
                success: false,
                error: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'
            }
        }

        console.log(`[submitRecruiterApplication] User ${userId} became recruiter (${data.role_type})`)

        return { success: true }
    } catch (error) {
        console.error('[submitRecruiterApplication] Unexpected error:', error)
        return {
            success: false,
            error: 'Gözlənilməz xəta baş verdi.'
        }
    }
}

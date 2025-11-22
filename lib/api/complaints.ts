'use server'

import { createClient } from '../supabase/server'

/**
 * Submit a complaint about a job posting
 */
export async function submitComplaint(data: {
    job_id: string
    reporter_id: string
    type: 'unauthorized_phone' | 'fraud' | 'spam' | 'other'
    description: string
}): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        console.log('[submitComplaint] Creating complaint:', data)

        // 1. Validate inputs
        if (!data.job_id || !data.reporter_id || !data.type) {
            return {
                success: false,
                error: 'Bütün xanaları doldurun'
            }
        }

        if (data.description.length < 10) {
            return {
                success: false,
                error: 'Təsvir minimum 10 simvol olmalıdır'
            }
        }

        // 2. Get job to find owner
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('user_id')
            .eq('id', data.job_id)
            .single()

        if (jobError || !job) {
            console.error('[submitComplaint] Job not found:', jobError)
            return {
                success: false,
                error: 'Elan tapılmadı'
            }
        }

        // 3. Prevent self-complaints
        if (job.user_id === data.reporter_id) {
            return {
                success: false,
                error: 'Öz elanınıza şikayət edə bilməzsiniz'
            }
        }

        // 4. Check if already complained
        const { data: existingComplaint } = await supabase
            .from('complaints')
            .select('id')
            .eq('job_id', data.job_id)
            .eq('reporter_id', data.reporter_id)
            .single()

        if (existingComplaint) {
            return {
                success: false,
                error: 'Artıq bu elan üçün şikayət göndərmisiniz'
            }
        }

        // 5. Insert complaint
        const { error: insertError } = await supabase
            .from('complaints')
            .insert({
                job_id: data.job_id,
                reported_user_id: job.user_id,
                reporter_id: data.reporter_id,
                complaint_type: data.type,
                description: data.description,
                status: 'pending'
            })

        if (insertError) {
            console.error('[submitComplaint] Insert error:', insertError)
            return {
                success: false,
                error: 'Xəta baş verdi. Yenidən cəhd edin.'
            }
        }

        // 6. Increment complaints_count for job owner
        const { error: updateError } = await supabase.rpc('increment_complaints_count', {
            user_id: job.user_id
        })

        if (updateError) {
            console.error('[submitComplaint] Update complaints count error:', updateError)
            // Don't fail - complaint is already created
        }

        // 7. Check complaints count and auto-ban if needed
        const { data: profile } = await supabase
            .from('profiles')
            .select('complaints_count, full_name')
            .eq('id', job.user_id)
            .single()

        if (profile) {
            console.log(`[submitComplaint] User ${job.user_id} has ${profile.complaints_count} complaints`)

            if (profile.complaints_count >= 4) {
                // Permanent ban
                console.log('[submitComplaint] Auto-banning user permanently (4+ complaints)')
                await supabase
                    .from('profiles')
                    .update({
                        is_banned: true,
                        ban_type: 'permanent',
                        banned_at: new Date().toISOString(),
                        ban_reason: '4+ şikayət - qaydaların davamlı pozulması'
                    })
                    .eq('id', job.user_id)

                console.log('[submitComplaint] User permanently banned')
            } else if (profile.complaints_count >= 2) {
                // Temporary ban (7 days)
                const bannedUntil = new Date()
                bannedUntil.setDate(bannedUntil.getDate() + 7)

                console.log(`[submitComplaint] Auto-banning user temporarily (${profile.complaints_count} complaints)`)
                await supabase
                    .from('profiles')
                    .update({
                        is_banned: true,
                        ban_type: 'temporary',
                        banned_at: new Date().toISOString(),
                        banned_until: bannedUntil.toISOString(),
                        ban_reason: `${profile.complaints_count} şikayət - müvəqqəti blok (7 gün)`
                    })
                    .eq('id', job.user_id)

                console.log('[submitComplaint] User temporarily banned until:', bannedUntil)
            }
        }

        console.log('[submitComplaint] Complaint created successfully')
        return { success: true }

    } catch (error) {
        console.error('[submitComplaint] Unexpected error:', error)
        return {
            success: false,
            error: 'Gözlənilməz xəta baş verdi'
        }
    }
}

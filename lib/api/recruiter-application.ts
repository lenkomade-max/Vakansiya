'use server'

import { createClient } from '../supabase/server'
import Anthropic from '@anthropic-ai/sdk'

/**
 * AI moderation for recruiter applications
 */
async function moderateRecruiterApplication(data: {
    company_name: string
    recruiter_contact: string
    role_type: string
    reason: string
}): Promise<{ approved: boolean; reason?: string }> {
    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const prompt = `Analyze this recruiter application for legitimacy:

Company: ${data.company_name}
Contact: ${data.recruiter_contact}
Role: ${data.role_type}
Reason: ${data.reason}

Determine if this is a legitimate recruiter/HR/agency application or spam/fake.

RED FLAGS:
- Generic/fake company names (e.g., "Test", "ABC", "123")
- No real contact info
- Suspicious/spammy reason
- Too short reason (meaningful should be 30+ chars)

Return JSON:
{
  "approved": boolean,
  "confidence": 0-1,
  "reason": "Brief explanation in Azerbaijani"
}`

    try {
        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            temperature: 0,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })

        const content = response.content[0]
        if (content.type !== 'text') {
            return { approved: true } // Fallback: approve if can't parse
        }

        const jsonMatch = content.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            return { approved: true }
        }

        const result = JSON.parse(jsonMatch[0])

        // Auto-approve if high confidence
        if (result.approved && result.confidence >= 0.8) {
            return { approved: true }
        }

        // Auto-reject if low confidence spam
        if (!result.approved && result.confidence >= 0.8) {
            return {
                approved: false,
                reason: result.reason || 'Ərizə təsdiq edilmədi'
            }
        }

        // Medium confidence: approve (benefit of doubt)
        return { approved: true }

    } catch (error) {
        console.error('[AI Moderation] Error:', error)
        // Fallback: approve on AI error
        return { approved: true }
    }
}

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
        // AI Moderation check
        console.log('[submitRecruiterApplication] Moderating application for user:', userId)
        const moderation = await moderateRecruiterApplication(data)

        if (!moderation.approved) {
            console.log('[submitRecruiterApplication] Application rejected:', moderation.reason)
            return {
                success: false,
                error: moderation.reason || 'Ərizə təsdiq edilmədi. Zəhmət olmasa real məlumat daxil edin.'
            }
        }

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
            console.error('[submitRecruiterApplication] Database error:', updateError)
            return {
                success: false,
                error: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'
            }
        }

        console.log(`[submitRecruiterApplication] User ${userId} became recruiter (${data.role_type}) - AI approved`)

        return { success: true }
    } catch (error) {
        console.error('[submitRecruiterApplication] Unexpected error:', error)
        return {
            success: false,
            error: 'Gözlənilməz xəta baş verdi.'
        }
    }
}

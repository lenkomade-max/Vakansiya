'use server'

import { createClient } from '../supabase/server'

/**
 * AI moderation for recruiter applications (using OpenRouter)
 */
async function moderateRecruiterApplication(data: {
    company_name: string
    recruiter_contact: string
    role_type: string
    reason: string
}): Promise<{ approved: boolean; reason?: string }> {
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
        console.warn('[Recruiter AI] No OPENROUTER_API_KEY, auto-approving')
        return { approved: true }
    }

    const prompt = `Analyze this recruiter application for legitimacy:

Company: ${data.company_name}
Contact: ${data.recruiter_contact}
Role: ${data.role_type}
Reason: ${data.reason}

Determine if this is a legitimate recruiter/HR/agency application or spam/fake.

RED FLAGS:
- Generic/fake company names (e.g., "Test", "ABC", "123", "test test")
- No real contact info
- Suspicious/spammy reason
- Too short or meaningless reason
- Clear spam patterns

Return JSON ONLY:
{
  "approved": true/false,
  "confidence": 0.0-1.0,
  "reason": "Brief explanation in Azerbaijani if rejected"
}`

    try {
        console.log('[Recruiter AI] Sending to OpenRouter (deepseek-chat)...')

        const headers: Record<string, string> = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (siteUrl) {
            headers['HTTP-Referer'] = siteUrl
        }
        headers['X-Title'] = 'Vakansiya.az'

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a content moderator. Respond only with valid JSON.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 300,
            }),
        })

        console.log('[Recruiter AI] Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Recruiter AI] API error:', response.status, errorText)
            // Fallback: approve on error
            return { approved: true }
        }

        const responseData = await response.json()

        if (!responseData.choices || !responseData.choices[0]?.message?.content) {
            console.error('[Recruiter AI] Invalid response structure')
            return { approved: true }
        }

        const content = responseData.choices[0].message.content
        console.log('[Recruiter AI] AI response:', content)

        // Parse JSON (может быть в markdown wrapper)
        let jsonText = content
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
            jsonText = jsonMatch[1]
        }

        const result = JSON.parse(jsonText)

        // Auto-approve if high confidence approval
        if (result.approved && result.confidence >= 0.7) {
            console.log('[Recruiter AI] Auto-approved (confidence:', result.confidence, ')')
            return { approved: true }
        }

        // Auto-reject if high confidence spam
        if (!result.approved && result.confidence >= 0.8) {
            console.log('[Recruiter AI] Auto-rejected (confidence:', result.confidence, ')')
            return {
                approved: false,
                reason: result.reason || 'Ərizə təsdiq edilmədi. Zəhmət olmasa real məlumat daxil edin.'
            }
        }

        // Medium confidence: approve (benefit of doubt)
        console.log('[Recruiter AI] Medium confidence, approving by default')
        return { approved: true }

    } catch (error) {
        console.error('[Recruiter AI] Error:', error)
        // Fallback: approve on error
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
        const updateData = {
            role: 'recruiter' as const,
            company_name: data.company_name,
            recruiter_contact: data.recruiter_contact,
            updated_at: new Date().toISOString(),
        }

        console.log('[submitRecruiterApplication] Updating profile with data:', updateData)

        const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)

        if (updateError) {
            console.error('[submitRecruiterApplication] Database error:', updateError)
            console.error('[submitRecruiterApplication] Error code:', updateError.code)
            console.error('[submitRecruiterApplication] Error message:', updateError.message)
            console.error('[submitRecruiterApplication] Error details:', updateError.details)
            return {
                success: false,
                error: `Xəta: ${updateError.message}`
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

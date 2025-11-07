/**
 * AI модерация через OpenRouter (10% проверок)
 * Используется только для сложных/подозрительных случаев
 */

import type { JobPost, ModerationFlag } from './rules';

export type AIReviewResult = {
  approved: boolean;
  confidence: number; // 0-1
  reason: string;
  violations: string[];
  recommendation: 'approve' | 'reject' | 'manual_review';
};

/**
 * Проверить контент через AI (OpenRouter)
 */
export async function aiModerationReview(
  jobPost: JobPost,
  rulesFlags: ModerationFlag[]
): Promise<AIReviewResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log('[AI Moderation] Starting primary AI review...')
  console.log('[AI Moderation] API key exists:', !!apiKey)
  console.log('[AI Moderation] API key length:', apiKey?.length || 0)

  // Если нет API ключа, возвращаем ручную проверку
  if (!apiKey) {
    console.warn('[AI Moderation] OPENROUTER_API_KEY not set, skipping AI review');
    return {
      approved: false,
      confidence: 0,
      reason: 'AI review unavailable - no API key',
      violations: [],
      recommendation: 'manual_review',
    };
  }

  // Подготовка промпта для AI
  const prompt = `You are a content moderator for Vakansiya.az, a job portal in Azerbaijan.

Analyze this job posting for:
1. Spam or fraudulent content
2. Pyramid schemes or MLM scams
3. Prepayment scams (asking money upfront before hiring)
4. Unrealistic promises or salary
5. Inappropriate or offensive content

Job Posting:
---
Title: ${jobPost.title}
Company: ${jobPost.company}
Description: ${jobPost.description}
${jobPost.salary ? `Salary: ${jobPost.salary}` : ''}
${jobPost.location ? `Location: ${jobPost.location}` : ''}
---

Our rules-based system detected these issues:
${rulesFlags.length > 0 ? JSON.stringify(rulesFlags, null, 2) : 'No issues detected'}

Respond in JSON format ONLY:
{
  "approved": true/false,
  "confidence": 0.0-1.0,
  "reason": "brief explanation in English",
  "violations": ["list", "of", "violations"],
  "recommendation": "approve" | "reject" | "manual_review"
}`;

  try {
    console.log('[AI Moderation] Sending request to OpenRouter...')
    console.log('[AI Moderation] Model: deepseek/deepseek-r1:free')
    console.log('[AI Moderation] API Key (first 10 chars):', apiKey.substring(0, 10) + '...')
    console.log('[AI Moderation] Prompt length:', prompt.length)

    // Формируем headers правильно
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // Добавляем опциональные headers только если есть значения
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
      headers['HTTP-Referer'] = siteUrl;
    }
    headers['X-Title'] = 'Vakansiya.az';

    console.log('[AI Moderation] Request headers:', Object.keys(headers));

    const requestBody = {
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'system',
          content: 'You are a content moderator for a job portal. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    };

    console.log('[AI Moderation] Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log('[AI Moderation] Response status:', response.status)
    console.log('[AI Moderation] Response ok:', response.ok)
    console.log('[AI Moderation] Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Moderation] ❌ OpenRouter API ERROR');
      console.error('[AI Moderation] Status:', response.status);
      console.error('[AI Moderation] Status Text:', response.statusText);
      console.error('[AI Moderation] Error Body:', errorText);

      // Пытаемся распарсить JSON error
      try {
        const errorJson = JSON.parse(errorText);
        console.error('[AI Moderation] Parsed Error:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error('[AI Moderation] Could not parse error as JSON');
      }

      // Если лимит исчерпан, отправляем на ручную проверку
      if (response.status === 429) {
        console.warn('[AI Moderation] Rate limit reached (429)')
        return {
          approved: false,
          confidence: 0,
          reason: 'AI rate limit reached',
          violations: [],
          recommendation: 'manual_review',
        };
      }

      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[AI Moderation] Response data:', JSON.stringify(data, null, 2))

    // Проверяем структуру ответа
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('[AI Moderation] Invalid response structure: no choices array')
      throw new Error('Invalid OpenRouter response: no choices');
    }

    const content = data.choices[0].message?.content;
    if (!content) {
      console.error('[AI Moderation] Invalid response structure: no content in message')
      throw new Error('Invalid OpenRouter response: no content');
    }

    console.log('[AI Moderation] AI response content:', content)

    // Парсим JSON ответ
    try {
      const result: AIReviewResult = JSON.parse(content);
      console.log('[AI Moderation] Parsed result:', result)
      return result;
    } catch (parseError) {
      console.error('[AI Moderation] Failed to parse JSON response:', parseError)
      console.error('[AI Moderation] Content was:', content)
      throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
    }
  } catch (error) {
    console.error('[AI Moderation] Primary AI moderation error:', error);

    // В случае ошибки, отправляем на ручную проверку
    return {
      approved: false,
      confidence: 0,
      reason: `AI moderation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      violations: [],
      recommendation: 'manual_review',
    };
  }
}

/**
 * Альтернативная модель (если основная недоступна)
 */
export async function aiModerationReviewFallback(
  jobPost: JobPost,
  rulesFlags: ModerationFlag[]
): Promise<AIReviewResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log('[AI Moderation Fallback] Starting fallback AI review...')

  if (!apiKey) {
    console.warn('[AI Moderation Fallback] No API key')
    return {
      approved: false,
      confidence: 0,
      reason: 'AI review unavailable - no API key',
      violations: [],
      recommendation: 'manual_review',
    };
  }

  try {
    console.log('[AI Moderation Fallback] Using model: deepseek/deepseek-chat-v3.1:free')

    // Формируем headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
      headers['HTTP-Referer'] = siteUrl;
    }
    headers['X-Title'] = 'Vakansiya.az';

    // Используем DeepSeek Chat V3.1 как fallback
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free', // Fallback модель
        messages: [
          {
            role: 'system',
            content: 'You are a content moderator. Respond only with valid JSON.',
          },
          {
            role: 'user',
            content: `Moderate this job post: ${JSON.stringify(jobPost)}. Detected issues: ${JSON.stringify(rulesFlags)}. Return JSON: {"approved": bool, "confidence": 0-1, "reason": "text", "violations": [], "recommendation": "approve/reject/manual_review"}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    console.log('[AI Moderation Fallback] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Moderation Fallback] API error:', response.status, errorText);
      throw new Error(`OpenRouter fallback API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[AI Moderation Fallback] Response data:', JSON.stringify(data, null, 2))

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('[AI Moderation Fallback] Invalid response: no choices')
      throw new Error('Invalid fallback response: no choices');
    }

    const content = data.choices[0].message?.content;
    if (!content) {
      console.error('[AI Moderation Fallback] Invalid response: no content')
      throw new Error('Invalid fallback response: no content');
    }

    console.log('[AI Moderation Fallback] Content:', content)

    try {
      const result: AIReviewResult = JSON.parse(content);
      console.log('[AI Moderation Fallback] Parsed result:', result)
      return result;
    } catch (parseError) {
      console.error('[AI Moderation Fallback] JSON parse error:', parseError)
      console.error('[AI Moderation Fallback] Content was:', content)
      throw new Error(`Failed to parse fallback response: ${parseError}`);
    }
  } catch (error) {
    console.error('[AI Moderation Fallback] Fallback moderation error:', error);
    return {
      approved: false,
      confidence: 0,
      reason: 'AI moderation failed (both primary and fallback)',
      violations: [],
      recommendation: 'manual_review',
    };
  }
}

/**
 * AI проверка с автоматическим fallback
 */
export async function aiModerationWithFallback(
  jobPost: JobPost,
  rulesFlags: ModerationFlag[]
): Promise<AIReviewResult> {
  console.log('[AI Moderation] Starting AI moderation with fallback...')
  console.log('[AI Moderation] Job post:', { title: jobPost.title, company: jobPost.company })
  console.log('[AI Moderation] Rules flags count:', rulesFlags.length)

  try {
    // Пробуем основную модель
    const result = await aiModerationReview(jobPost, rulesFlags);

    console.log('[AI Moderation] Primary model result:', result)

    // Если получили результат с confidence > 0, возвращаем
    if (result.confidence > 0) {
      console.log('[AI Moderation] Primary model succeeded with confidence:', result.confidence)
      return result;
    }

    // Иначе пробуем fallback
    console.log('[AI Moderation] Primary model returned confidence 0, trying fallback...');
    const fallbackResult = await aiModerationReviewFallback(jobPost, rulesFlags);
    console.log('[AI Moderation] Fallback result:', fallbackResult)
    return fallbackResult;
  } catch (error) {
    console.error('[AI Moderation] AI moderation with fallback failed:', error);
    return {
      approved: false,
      confidence: 0,
      reason: 'All AI models failed',
      violations: [],
      recommendation: 'manual_review',
    };
  }
}

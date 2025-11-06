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

  // Если нет API ключа, возвращаем ручную проверку
  if (!apiKey) {
    console.warn('OPENROUTER_API_KEY not set, skipping AI review');
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
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Vakansiya.az Content Moderation',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free', // Бесплатная модель
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
        temperature: 0.3, // Низкая температура для консистентности
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);

      // Если лимит исчерпан, отправляем на ручную проверку
      if (response.status === 429) {
        return {
          approved: false,
          confidence: 0,
          reason: 'AI rate limit reached',
          violations: [],
          recommendation: 'manual_review',
        };
      }

      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Парсим JSON ответ
    const result: AIReviewResult = JSON.parse(content);

    return result;
  } catch (error) {
    console.error('AI moderation error:', error);

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

  if (!apiKey) {
    return {
      approved: false,
      confidence: 0,
      reason: 'AI review unavailable - no API key',
      violations: [],
      recommendation: 'manual_review',
    };
  }

  try {
    // Используем Qwen QwQ 32B как fallback
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Vakansiya.az Content Moderation',
      },
      body: JSON.stringify({
        model: 'qwen/qwq-32b:free', // Fallback модель
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

    if (!response.ok) {
      throw new Error(`OpenRouter fallback API error: ${response.status}`);
    }

    const data = await response.json();
    const result: AIReviewResult = JSON.parse(data.choices[0].message.content);

    return result;
  } catch (error) {
    console.error('AI fallback moderation error:', error);
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
  try {
    // Пробуем основную модель
    const result = await aiModerationReview(jobPost, rulesFlags);

    // Если получили результат с confidence > 0, возвращаем
    if (result.confidence > 0) {
      return result;
    }

    // Иначе пробуем fallback
    console.log('Primary AI model failed, trying fallback...');
    return await aiModerationReviewFallback(jobPost, rulesFlags);
  } catch (error) {
    console.error('AI moderation with fallback failed:', error);
    return {
      approved: false,
      confidence: 0,
      reason: 'All AI models failed',
      violations: [],
      recommendation: 'manual_review',
    };
  }
}

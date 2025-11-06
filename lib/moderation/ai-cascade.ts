/**
 * Каскадная AI модерация с 5 уровнями
 * 1-3: Бесплатные модели (ротация)
 * 4-5: Платные топовые (только если бесплатные не справились)
 */

import type { JobPost, ModerationFlag } from './rules';

export type AIModel = {
  id: string;
  name: string;
  tier: 'free' | 'paid';
  cost: string;
  languages: string[];
  contextWindow: string;
};

export type AIReviewResult = {
  approved: boolean;
  confidence: number; // 0-1
  reason: string;
  violations: string[];
  recommendation: 'approve' | 'reject' | 'manual_review';
  modelUsed?: string;
  attemptedModels?: string[];
};

// ===== КОНФИГУРАЦИЯ МОДЕЛЕЙ =====

export const AI_MODELS: AIModel[] = [
  // TIER 1-3: БЕСПЛАТНЫЕ (ротация между собой)
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat V3',
    tier: 'free',
    cost: 'FREE',
    languages: ['multilingual', 'ru', 'en'],
    contextWindow: '64K',
  },
  {
    id: 'qwen/qwen3-235b-a22b:free',
    name: 'Qwen3 235B',
    tier: 'free',
    cost: 'FREE',
    languages: ['119 languages', 'ru', 'az', 'tr'],
    contextWindow: '128K',
  },
  {
    id: 'mistralai/mistral-small-3.1-24b-instruct:free',
    name: 'Mistral Small 3.1',
    tier: 'free',
    cost: 'FREE',
    languages: ['multilingual', 'ru', 'en'],
    contextWindow: '128K',
  },

  // TIER 4-5: ПЛАТНЫЕ (только если бесплатные не справились)
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    tier: 'paid',
    cost: '$0.10/M input, $0.40/M output',
    languages: ['100+ languages', 'ru', 'az', 'tr'],
    contextWindow: '1M',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    tier: 'paid',
    cost: '$0.15/M input, $0.60/M output',
    languages: ['50+ languages', 'ru', 'tr'],
    contextWindow: '128K',
  },
];

// ===== ОСНОВНАЯ ФУНКЦИЯ МОДЕРАЦИИ =====

/**
 * Попытка модерации с одной моделью
 */
async function tryModelModeration(
  model: AIModel,
  jobPost: JobPost,
  rulesFlags: ModerationFlag[]
): Promise<AIReviewResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn('❌ OPENROUTER_API_KEY not set');
    return null;
  }

  const prompt = `You are a content moderator for Vakansiya.az, a job portal in Azerbaijan.

Analyze this job posting for:
1. Spam or fraudulent content
2. Pyramid schemes or MLM scams
3. Prepayment scams (asking money before hiring)
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

Rules-based system detected: ${rulesFlags.length > 0 ? JSON.stringify(rulesFlags.map(f => f.type), null, 2) : 'No issues'}

Respond ONLY with valid JSON:
{
  "approved": true/false,
  "confidence": 0.0-1.0,
  "reason": "brief explanation",
  "violations": ["list"],
  "recommendation": "approve" | "reject" | "manual_review"
}`;

  try {
    console.log(`🤖 Trying model: ${model.name} (${model.tier})`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Vakansiya.az Moderation',
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          {
            role: 'system',
            content: 'You are a content moderator. Respond ONLY with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`⚠️ ${model.name} failed: ${response.status} - ${errorText.substring(0, 100)}`);

      // 429 = rate limit, 503 = unavailable
      if (response.status === 429 || response.status === 503) {
        return null; // Попробуем следующую модель
      }

      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Парсим JSON ответ
    const result: AIReviewResult = JSON.parse(content);
    result.modelUsed = model.name;

    console.log(`✅ ${model.name} responded: confidence=${result.confidence}, approved=${result.approved}`);

    return result;
  } catch (error) {
    console.error(`❌ ${model.name} error:`, error);
    return null;
  }
}

/**
 * Каскадная модерация: пробуем модели по очереди
 */
export async function cascadingAIModeration(
  jobPost: JobPost,
  rulesFlags: ModerationFlag[]
): Promise<AIReviewResult> {
  const attemptedModels: string[] = [];

  // ЭТАП 1: Пробуем бесплатные модели (1-3)
  console.log('🔄 Stage 1: Trying FREE models...');

  for (let i = 0; i < 3; i++) {
    const model = AI_MODELS[i];
    attemptedModels.push(model.name);

    const result = await tryModelModeration(model, jobPost, rulesFlags);

    // Если получили результат с хорошей уверенностью, возвращаем
    if (result && result.confidence >= 0.7) {
      result.attemptedModels = attemptedModels;
      return result;
    }

    // Если модель ответила, но не уверена, пробуем следующую
    if (result && result.confidence < 0.7) {
      console.log(`⚠️ ${model.name} low confidence (${result.confidence}), trying next...`);
      continue;
    }

    // Если модель не ответила (rate limit / error), пробуем следующую
    console.log(`❌ ${model.name} unavailable, trying next...`);
  }

  // ЭТАП 2: Если бесплатные не справились, используем платные (4-5)
  console.log('💰 Stage 2: Trying PAID models...');

  for (let i = 3; i < 5; i++) {
    const model = AI_MODELS[i];
    attemptedModels.push(model.name);

    const result = await tryModelModeration(model, jobPost, rulesFlags);

    // Платные модели более надежные, принимаем результат с confidence >= 0.6
    if (result && result.confidence >= 0.6) {
      result.attemptedModels = attemptedModels;
      return result;
    }

    if (result && result.confidence < 0.6) {
      console.log(`⚠️ ${model.name} low confidence (${result.confidence}), trying next...`);
      continue;
    }

    console.log(`❌ ${model.name} unavailable, trying next...`);
  }

  // ЭТАП 3: Все модели не справились - отправляем на ручную проверку
  console.error('❌ All AI models failed or returned low confidence');

  return {
    approved: false,
    confidence: 0,
    reason: 'All AI models unavailable or uncertain',
    violations: [],
    recommendation: 'manual_review',
    modelUsed: 'none',
    attemptedModels,
  };
}

/**
 * Упрощенная версия: пробует только бесплатные модели
 */
export async function freeOnlyAIModeration(
  jobPost: JobPost,
  rulesFlags: ModerationFlag[]
): Promise<AIReviewResult> {
  const attemptedModels: string[] = [];

  // Пробуем только первые 3 бесплатные модели
  for (let i = 0; i < 3; i++) {
    const model = AI_MODELS[i];
    attemptedModels.push(model.name);

    const result = await tryModelModeration(model, jobPost, rulesFlags);

    if (result && result.confidence >= 0.7) {
      result.attemptedModels = attemptedModels;
      return result;
    }
  }

  // Если бесплатные не справились, сразу на ручную проверку
  return {
    approved: false,
    confidence: 0,
    reason: 'Free AI models unavailable or uncertain',
    violations: [],
    recommendation: 'manual_review',
    modelUsed: 'none',
    attemptedModels,
  };
}

/**
 * Выбрать стратегию модерации на основе настроек
 */
export async function smartAIModeration(
  jobPost: JobPost,
  rulesFlags: ModerationFlag[],
  options: {
    allowPaidModels?: boolean; // Разрешить платные модели
    minConfidence?: number;     // Минимальная уверенность
  } = {}
): Promise<AIReviewResult> {
  const {
    allowPaidModels = true,  // По умолчанию используем платные если нужно
    minConfidence = 0.7,
  } = options;

  if (allowPaidModels) {
    return cascadingAIModeration(jobPost, rulesFlags);
  } else {
    return freeOnlyAIModeration(jobPost, rulesFlags);
  }
}

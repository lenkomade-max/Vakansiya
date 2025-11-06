/**
 * API endpoint для модерации контента
 * POST /api/moderate
 */

import { NextRequest, NextResponse } from 'next/server';
import { moderateContent, type JobPost } from '@/lib/moderation/rules';
import { smartAIModeration } from '@/lib/moderation/ai-cascade';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация входных данных
    const { title, company, description, salary, location, category, recentPosts } = body;

    if (!title || !company || !description) {
      return NextResponse.json(
        {
          error: 'Missing required fields: title, company, description',
        },
        { status: 400 }
      );
    }

    const jobPost: JobPost = {
      title,
      company,
      description,
      salary,
      location,
      category,
    };

    // Этап 1: Правила-based модерация (90%)
    console.log('🔍 Starting rules-based moderation...');
    const rulesResult = await moderateContent(jobPost, recentPosts || []);

    console.log(`📊 Rules result: score=${rulesResult.score}, approved=${rulesResult.approved}, needsAI=${rulesResult.needsAIReview}`);

    // Если автоматически одобрено (score >= 80, нет critical флагов)
    if (rulesResult.approved) {
      return NextResponse.json({
        status: 'APPROVED',
        method: 'auto',
        score: rulesResult.score,
        flags: rulesResult.flags,
        language: rulesResult.language,
        message: 'Контент одобрен автоматически',
      });
    }

    // Если низкий score (< 50) или есть critical флаги, автоматически отклоняем
    const hasCriticalFlags = rulesResult.flags.some(f => f.severity === 'critical');

    if (rulesResult.score < 50 || hasCriticalFlags) {
      return NextResponse.json({
        status: 'REJECTED',
        method: 'auto',
        score: rulesResult.score,
        flags: rulesResult.flags,
        language: rulesResult.language,
        message: 'Контент отклонен автоматически',
        reason: hasCriticalFlags
          ? 'Обнаружены критические нарушения'
          : 'Низкий рейтинг качества',
      });
    }

    // Этап 2: AI проверка с каскадом (10% сложных случаев)
    if (rulesResult.needsAIReview) {
      console.log('🤖 Starting cascading AI review...');

      // Используем каскадную систему: 3 бесплатные → 2 платные
      const aiResult = await smartAIModeration(jobPost, rulesResult.flags, {
        allowPaidModels: true, // Разрешить платные если бесплатные не справились
        minConfidence: 0.7,
      });

      console.log(`🤖 AI result: model=${aiResult.modelUsed}, confidence=${aiResult.confidence}, approved=${aiResult.approved}`);

      // Если AI уверена (confidence > 0.7)
      if (aiResult.confidence > 0.7) {
        return NextResponse.json({
          status: aiResult.approved ? 'APPROVED' : 'REJECTED',
          method: 'ai',
          score: rulesResult.score,
          flags: rulesResult.flags,
          language: rulesResult.language,
          aiAnalysis: {
            confidence: aiResult.confidence,
            reason: aiResult.reason,
            violations: aiResult.violations,
            modelUsed: aiResult.modelUsed,
            attemptedModels: aiResult.attemptedModels,
          },
          message: aiResult.approved
            ? 'Контент одобрен AI модератором'
            : 'Контент отклонен AI модератором',
        });
      }

      // Если AI не уверена, отправляем на ручную проверку
      return NextResponse.json({
        status: 'PENDING_MANUAL_REVIEW',
        method: 'flagged',
        score: rulesResult.score,
        flags: rulesResult.flags,
        language: rulesResult.language,
        aiAnalysis: {
          confidence: aiResult.confidence,
          reason: aiResult.reason,
          violations: aiResult.violations,
          recommendation: aiResult.recommendation,
          modelUsed: aiResult.modelUsed,
          attemptedModels: aiResult.attemptedModels,
        },
        message: 'Требуется ручная проверка модератора',
      });
    }

    // Не должно дойти сюда, но на всякий случай
    return NextResponse.json({
      status: 'PENDING_MANUAL_REVIEW',
      method: 'flagged',
      score: rulesResult.score,
      flags: rulesResult.flags,
      language: rulesResult.language,
      message: 'Требуется ручная проверка',
    });
  } catch (error) {
    console.error('Moderation API error:', error);

    return NextResponse.json(
      {
        error: 'Internal moderation error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Опционально: GET endpoint для проверки статуса
export async function GET() {
  return NextResponse.json({
    service: 'Vakansiya.az Content Moderation API',
    version: '1.0',
    endpoints: {
      POST: '/api/moderate - Moderate job posting',
    },
    status: 'operational',
  });
}

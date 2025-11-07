/**
 * API endpoint для повторной модерации объявлений
 * Находит все pending_moderation И pending_review объявления и запускает AI модерацию
 *
 * Используется:
 * 1. Vercel Cron Job (автоматически каждую ночь)
 * 2. Кнопка в админ панели (вручную)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moderateContent } from '@/lib/moderation/rules';
import { aiModerationWithFallback } from '@/lib/moderation/ai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/admin/retry-moderation
export async function GET() {
  console.log('[Retry Moderation] Starting retry moderation job...');

  try {
    const supabase = await createClient();

    // 1. Найти все объявления со статусом 'pending_moderation' ИЛИ 'pending_review'
    const { data: pendingJobs, error } = await supabase
      .from('jobs')
      .select('*')
      .in('status', ['pending_moderation', 'pending_review'])
      .order('created_at', { ascending: true })
      .limit(50); // Обрабатываем максимум 50 за раз

    if (error) {
      console.error('[Retry Moderation] Error fetching pending jobs:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pending jobs' },
        { status: 500 }
      );
    }

    if (!pendingJobs || pendingJobs.length === 0) {
      console.log('[Retry Moderation] No pending jobs found');
      return NextResponse.json({
        success: true,
        message: 'No pending jobs to process',
        processed: 0,
      });
    }

    console.log(`[Retry Moderation] Found ${pendingJobs.length} pending jobs`);

    // 2. Обработать каждое объявление
    const results = {
      total: pendingJobs.length,
      approved: 0,
      rejected: 0,
      pending_review: 0,
      failed: 0,
    };

    for (const job of pendingJobs) {
      console.log(`[Retry Moderation] Processing job ${job.id}...`);

      try {
        // Запускаем модерацию
        const moderationResult = await moderateContent({
          title: job.title,
          company: job.company,
          description: job.description,
          salary: job.salary,
          location: job.location,
          category: job.category,
        });

        let finalStatus = 'pending_review';
        let aiResult = null;

        // Если есть критические флаги → auto reject
        if (moderationResult.autoReject) {
          finalStatus = 'rejected';
          console.log(`[Retry Moderation] Job ${job.id} auto-rejected by rules`);
        }
        // Если нужна AI проверка
        else if (moderationResult.needsAIReview) {
          try {
            aiResult = await aiModerationWithFallback(
              {
                title: job.title,
                company: job.company,
                description: job.description,
                salary: job.salary,
                location: job.location,
              },
              moderationResult.flags
            );

            // AI approved with high confidence
            if (aiResult.approved && aiResult.confidence >= 0.9) {
              finalStatus = 'active';
              console.log(`[Retry Moderation] Job ${job.id} approved by AI (confidence: ${aiResult.confidence})`);
            }
            // AI rejected with high confidence
            else if (!aiResult.approved && aiResult.confidence >= 0.9 && aiResult.recommendation === 'reject') {
              finalStatus = 'rejected';
              console.log(`[Retry Moderation] Job ${job.id} rejected by AI (confidence: ${aiResult.confidence})`);
            }
            // Low confidence → manual review
            else {
              finalStatus = 'pending_review';
              console.log(`[Retry Moderation] Job ${job.id} needs manual review (AI confidence: ${aiResult.confidence})`);
            }
          } catch (aiError) {
            console.error(`[Retry Moderation] AI failed for job ${job.id}, keeping as pending_moderation:`, aiError);
            // Оставляем как pending_moderation для следующего retry
            continue;
          }
        }

        // Обновляем объявление в БД (с AI улучшениями если есть)
        const updateData: any = {
          status: finalStatus,
          rules_moderation_result: moderationResult,
          ai_moderation_result: aiResult,
          ai_checked_at: aiResult ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };

        // Применяем AI улучшения (title, job_type)
        if (aiResult) {
          if (aiResult.suggestedTitle && aiResult.suggestedTitle.trim()) {
            updateData.title = aiResult.suggestedTitle.trim();
          }
          if (aiResult.jobType && aiResult.jobType !== job.job_type) {
            updateData.job_type = aiResult.jobType;
          }
        }

        const { error: updateError } = await supabase
          .from('jobs')
          .update(updateData)
          .eq('id', job.id);

        if (updateError) {
          console.error(`[Retry Moderation] Failed to update job ${job.id}:`, updateError);
          results.failed++;
        } else {
          // Считаем статистику
          if (finalStatus === 'active') results.approved++;
          else if (finalStatus === 'rejected') results.rejected++;
          else if (finalStatus === 'pending_review') results.pending_review++;
        }
      } catch (jobError) {
        console.error(`[Retry Moderation] Error processing job ${job.id}:`, jobError);
        results.failed++;
      }
    }

    console.log('[Retry Moderation] Completed. Results:', results);

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} jobs`,
      results,
    });
  } catch (error) {
    console.error('[Retry Moderation] Fatal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

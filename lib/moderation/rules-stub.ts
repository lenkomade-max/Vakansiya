/**
 * Stub for moderation - real implementation uses ESM modules that don't work in build
 */

export type ModerationFlag = {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
};

export type ModerationResult = {
  approved: boolean;
  flags: ModerationFlag[];
  language: string | null;
  score: number;
  needsAIReview: boolean;
};

export type JobPost = {
  title: string;
  company: string;
  description: string;
  salary?: string;
  location?: string;
  category?: string;
};

export async function moderateJobPost(jobPost: JobPost): Promise<ModerationResult> {
  // Stub implementation - always approve for now
  return {
    approved: true,
    flags: [],
    language: 'az',
    score: 100,
    needsAIReview: false
  };
}

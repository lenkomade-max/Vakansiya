/**
 * Правила модерации контента (90% проверок)
 * Работает локально, без API вызовов
 */

const eld = require('eld');
import comparison from 'string-comparison';
import {
  spamKeywordsAZ,
  spamKeywordsRU,
  fraudKeywordsAZ,
  fraudKeywordsRU,
  profanityAZ,
  profanityRU,
  containsKeywords,
  findContacts,
  containsProfanity,
} from './keywords';

// ===== ТИПЫ =====

export type ModerationFlag = {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
};

export type ModerationResult = {
  approved: boolean;
  autoReject: boolean; // Automatically reject without manual review
  flags: ModerationFlag[];
  language: string | null;
  score: number; // 0-100, где 100 = чистый контент
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

// ===== ЭТАП 1: БАЗОВАЯ ВАЛИДАЦИЯ =====

function stage1_basicValidation(jobPost: JobPost): ModerationFlag[] {
  const flags: ModerationFlag[] = [];

  // 1. Проверка обязательных полей
  if (!jobPost.title?.trim()) {
    flags.push({
      type: 'MISSING_TITLE',
      severity: 'critical',
      message: 'Название вакансии обязательно',
    });
  }

  if (!jobPost.company?.trim()) {
    flags.push({
      type: 'MISSING_COMPANY',
      severity: 'critical',
      message: 'Название компании обязательно',
    });
  }

  if (!jobPost.description?.trim()) {
    flags.push({
      type: 'MISSING_DESCRIPTION',
      severity: 'critical',
      message: 'Описание вакансии обязательно',
    });
  }

  // 2. Проверка минимальной длины
  if (jobPost.description && jobPost.description.length < 50) {
    flags.push({
      type: 'DESCRIPTION_TOO_SHORT',
      severity: 'high',
      message: 'Описание слишком короткое (минимум 50 символов)',
      details: { length: jobPost.description.length },
    });
  }

  // 3. Проверка на чрезмерное использование CAPS
  if (jobPost.title) {
    const capsCount = (jobPost.title.match(/[A-ZА-ЯӘÖÜÇĞŞ]/g) || []).length;
    const capsRatio = capsCount / jobPost.title.length;

    if (capsRatio > 0.7 && jobPost.title.length > 5) {
      flags.push({
        type: 'EXCESSIVE_CAPS',
        severity: 'medium',
        message: 'Слишком много заглавных букв в названии',
        details: { ratio: capsRatio },
      });
    }
  }

  // 4. Определение языка
  let language = null;
  if (jobPost.description && jobPost.description.length > 20) {
    try {
      language = eld.detect(jobPost.description).language;
      if (!['az', 'ru'].includes(language)) {
        flags.push({
          type: 'UNSUPPORTED_LANGUAGE',
          severity: 'medium',
          message: `Обнаружен неподдерживаемый язык: ${language}`,
          details: { detected: language },
        });
      }
    } catch (e) {
      // Если не удалось определить язык, продолжаем
      console.warn('Language detection failed:', e);
    }
  }

  return flags;
}

// ===== ЭТАП 2: СПАМ И ПАТТЕРНЫ =====

function stage2_spamDetection(jobPost: JobPost, language: string | null): ModerationFlag[] {
  const flags: ModerationFlag[] = [];
  const fullText = `${jobPost.title} ${jobPost.description}`.toLowerCase();

  // 1. Проверка спам-ключевых слов
  const spamKeywords = language === 'az' ? spamKeywordsAZ : spamKeywordsRU;
  const foundSpam = containsKeywords(fullText, spamKeywords);

  if (foundSpam.length > 0) {
    flags.push({
      type: 'SPAM_KEYWORDS',
      severity: foundSpam.length >= 3 ? 'high' : 'medium',
      message: `Обнаружены спам-слова: ${foundSpam.join(', ')}`,
      details: { keywords: foundSpam },
    });
  }

  // 2. Проверка контактов в тексте
  const contacts = findContacts(jobPost.description);

  if (contacts.phones.length > 2) {
    flags.push({
      type: 'EXCESSIVE_PHONE_NUMBERS',
      severity: 'medium',
      message: `Слишком много телефонов в описании (${contacts.phones.length})`,
      details: { count: contacts.phones.length },
    });
  }

  if (contacts.emails.length > 1) {
    flags.push({
      type: 'EXCESSIVE_EMAILS',
      severity: 'low',
      message: `Несколько email в описании`,
      details: { count: contacts.emails.length },
    });
  }

  if (contacts.urls.length > 1) {
    flags.push({
      type: 'EXCESSIVE_URLS',
      severity: 'medium',
      message: `Несколько ссылок в описании`,
      details: { count: contacts.urls.length },
    });
  }

  // 3. Повторяющиеся символы (!!!, ???, etc)
  const repeatingChars = fullText.match(/(.)\1{4,}/g);
  if (repeatingChars && repeatingChars.length > 0) {
    flags.push({
      type: 'REPEATING_CHARACTERS',
      severity: 'low',
      message: 'Обнаружены повторяющиеся символы',
      details: { patterns: repeatingChars },
    });
  }

  return flags;
}

// ===== ЭТАП 3: МОШЕННИЧЕСТВО =====

function stage3_fraudDetection(jobPost: JobPost, language: string | null): ModerationFlag[] {
  const flags: ModerationFlag[] = [];
  const fullText = `${jobPost.title} ${jobPost.description}`.toLowerCase();

  // 1. Проверка ключевых слов мошенничества
  const fraudKeywords = language === 'az' ? fraudKeywordsAZ : fraudKeywordsRU;
  const foundFraud = containsKeywords(fullText, fraudKeywords);

  if (foundFraud.length > 0) {
    flags.push({
      type: 'FRAUD_KEYWORDS',
      severity: 'critical',
      message: `Обнаружены признаки мошенничества: ${foundFraud.join(', ')}`,
      details: { keywords: foundFraud },
    });
  }

  // 2. Нереально высокая зарплата
  const salaryMatch = fullText.match(/(\d+)[\s-]*(azn|manat|usd)/i);
  if (salaryMatch) {
    const salary = parseInt(salaryMatch[1]);
    if (salary > 10000) {
      flags.push({
        type: 'UNREALISTIC_SALARY',
        severity: 'high',
        message: `Подозрительно высокая зарплата: ${salary} ${salaryMatch[2]}`,
        details: { salary, currency: salaryMatch[2] },
      });
    }
  }

  // 3. Пирамида/MLM индикаторы (несколько ключевых слов одновременно)
  const pyramidIndicators = [
    'komanda qur',
    'dostlarını dəvət',
    'построй команду',
    'пригласи друзей',
    'referal',
    'реферальный',
    'komissiya',
    'комиссия',
  ];
  const foundPyramid = containsKeywords(fullText, pyramidIndicators);

  if (foundPyramid.length >= 2) {
    flags.push({
      type: 'PYRAMID_SCHEME',
      severity: 'critical',
      message: 'Признаки сетевого маркетинга/пирамиды',
      details: { indicators: foundPyramid },
    });
  }

  return flags;
}

// ===== ЭТАП 4: НЕЦЕНЗУРНАЯ ЛЕКСИКА =====

function stage4_profanityCheck(jobPost: JobPost, language: string | null): ModerationFlag[] {
  const flags: ModerationFlag[] = [];
  const fullText = `${jobPost.title} ${jobPost.description}`;

  const profanityResult = containsProfanity(
    fullText,
    language === 'az' ? 'az' : language === 'ru' ? 'ru' : 'both'
  );

  if (profanityResult.found) {
    flags.push({
      type: 'PROFANITY_DETECTED',
      severity: 'critical',
      message: `Обнаружена нецензурная лексика: ${profanityResult.words.join(', ')}`,
      details: { words: profanityResult.words },
    });
  }

  return flags;
}

// ===== ЭТАП 5: ДУБЛИКАТЫ =====

export async function stage5_duplicateCheck(
  jobPost: JobPost,
  recentPosts: JobPost[]
): Promise<ModerationFlag[]> {
  const flags: ModerationFlag[] = [];

  if (!recentPosts || recentPosts.length === 0) {
    return flags;
  }

  const currentText = `${jobPost.title} ${jobPost.description}`.toLowerCase();

  for (const existingPost of recentPosts) {
    const existingText = `${existingPost.title} ${existingPost.description}`.toLowerCase();

    // Используем Dice Coefficient для сравнения
    const dice = new comparison.diceCoefficient();
    const similarity = dice.similarity(currentText, existingText);

    if (similarity > 0.85) {
      flags.push({
        type: 'POTENTIAL_DUPLICATE',
        severity: 'high',
        message: `Возможный дубликат (схожесть: ${(similarity * 100).toFixed(0)}%)`,
        details: {
          similarity,
          similarTo: existingPost.title,
        },
      });
      break; // Нашли дубликат, дальше не проверяем
    }
  }

  return flags;
}

// ===== ОСНОВНАЯ ФУНКЦИЯ МОДЕРАЦИИ =====

export async function moderateContent(
  jobPost: JobPost,
  recentPosts: JobPost[] = []
): Promise<ModerationResult> {
  const allFlags: ModerationFlag[] = [];

  // Этап 1: Базовая валидация
  const validationFlags = stage1_basicValidation(jobPost);
  allFlags.push(...validationFlags);

  // Определяем язык
  let language: string | null = null;
  try {
    language = eld.detect(jobPost.description).language;
  } catch (e) {
    console.warn('Language detection failed');
  }

  // Если есть критические ошибки валидации, останавливаемся
  const hasCritical = allFlags.some(f => f.severity === 'critical');
  if (hasCritical) {
    return {
      approved: false,
      autoReject: true, // Критические ошибки валидации → авто-отклонение
      flags: allFlags,
      language,
      score: 0,
      needsAIReview: false,
    };
  }

  // Этап 2: Спам
  const spamFlags = stage2_spamDetection(jobPost, language);
  allFlags.push(...spamFlags);

  // Этап 3: Мошенничество
  const fraudFlags = stage3_fraudDetection(jobPost, language);
  allFlags.push(...fraudFlags);

  // Этап 4: Мат
  const profanityFlags = stage4_profanityCheck(jobPost, language);
  allFlags.push(...profanityFlags);

  // Этап 5: Дубликаты
  const duplicateFlags = await stage5_duplicateCheck(jobPost, recentPosts);
  allFlags.push(...duplicateFlags);

  // ===== РАСЧЕТ SCORE И РЕШЕНИЕ =====

  // Подсчитываем score (100 = чисто, 0 = много нарушений)
  let score = 100;

  for (const flag of allFlags) {
    switch (flag.severity) {
      case 'critical':
        score -= 50;
        break;
      case 'high':
        score -= 25;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  }

  score = Math.max(0, score);

  // ===== НОВАЯ ЛОГИКА: 90% авто-решений, 10% manual review =====

  // Критические флаги, требующие авто-отклонения
  const autoRejectFlags = ['FRAUD_KEYWORDS', 'PROFANITY_DETECTED', 'PYRAMID_SCHEME'];
  const hasAutoRejectFlag = allFlags.some(f => autoRejectFlags.includes(f.type));

  // Есть ли любые критические флаги
  const hasCriticalFlags = allFlags.some(f => f.severity === 'critical');

  // Решение о модерации:
  // 1. score >= 75 и нет критических → AUTO APPROVE (60-70% случаев)
  // 2. score < 30 ИЛИ есть флаги мошенничества/мата → AUTO REJECT (10-20% случаев)
  // 3. score 30-75 и нет авто-отклонения → AI REVIEW (15-25% случаев)
  //    - AI с высокой уверенностью → авто-решение
  //    - AI с низкой уверенностью → manual review (~10% от всех)

  let approved = false;
  let autoReject = false;
  let needsAIReview = false;

  if (hasAutoRejectFlag || score < 30) {
    // AUTO REJECT: мошенничество, мат, очень низкий score
    autoReject = true;
  } else if (score >= 75 && !hasCriticalFlags) {
    // AUTO APPROVE: высокий score, нет критических проблем
    approved = true;
  } else {
    // AI REVIEW: пограничные случаи (score 30-75)
    needsAIReview = true;
  }

  return {
    approved,
    autoReject,
    flags: allFlags,
    language,
    score,
    needsAIReview,
  };
}

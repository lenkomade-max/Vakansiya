/**
 * Ключевые слова для модерации контента
 * Azerbaijani (AZ) + Russian (RU)
 */

// ===== СПАМ КЛЮЧЕВЫЕ СЛОВА =====

export const spamKeywordsAZ = [
  // Быстрые деньги
  'tez pul qazan',
  'asan qazanc',
  'pulsuz əldə et',
  'heç bir təcrübə tələb olunmur',
  'evdən işlə',
  'zəhmət tələb etməyən',
  'pasiv gəlir',
  'işləmədən pul qazan',

  // Сетевой маркетинг
  'şəbəkə marketinq',
  'MLM',
  'dostlarını dəvət et',
  'komanda qur',
  'referal bonus',

  // Подозрительные фразы
  'garantiyalı gəlir',
  'risk yoxdur',
  'investisiya lazım deyil',
];

export const spamKeywordsRU = [
  // Быстрые деньги
  'быстрые деньги',
  'легкий заработок',
  'без опыта работы',
  'работа на дому',
  'без усилий',
  'пассивный доход',
  'зарабатывай не работая',

  // Сетевой маркетинг
  'сетевой маркетинг',
  'МЛМ',
  'пригласи друзей',
  'построй команду',
  'реферальный бонус',

  // Подозрительные фразы
  'гарантированный доход',
  'без риска',
  'инвестиции не нужны',
];

// ===== МОШЕННИЧЕСТВО =====

export const fraudKeywordsAZ = [
  // Предоплата
  'əvvəlcədən ödəniş',
  'qeydiyyat haqqı',
  'qeydiyyat üçün ödəniş',
  'qeydiyyat üçün pul',
  'təlim haqqı',
  'sertifikat haqqı',
  'material haqqı',
  'forma haqqı',
  'işə başlamazdan əvvəl ödəmə',
  'pul köçür',
  'Western Union',
  'MoneyGram',
  'ödəniş lazımdır',
  'pul göndər',

  // Пирамиды
  'işçi yox, tərəfdaş axtarırıq',
  'yalnız komissiya',
  'satışdan faiz',
  'hər satışdan qazanc',
  'dostlarını gətir',
  'bonus alarsan',
  'referal',

  // Нереальные обещания
  'günün 2 saatı',
  'heç nə etmə',
  'avtomatik gəlir',
  'günə 200 AZN',
  'günə 100 AZN',
  'ilk ödəniş dərhal',
  // УБРАЛ 'təcrübə lazım deyil' - может быть легитимная работа с обучением
  // AI проверит контекст
];

export const fraudKeywordsRU = [
  // Предоплата
  'предоплата',
  'оплата заранее',
  'регистрационный взнос',
  'оплата обучения',
  'стоимость сертификата',
  'оплата материалов',
  'оплата формы',
  'оплата до начала работы',
  'переведи деньги',
  'Вестерн Юнион',
  'МаниГрам',

  // Пирамиды
  'ищем не работников а партнеров',
  'только комиссионные',
  'процент с продаж',
  'доход с каждой продажи',

  // Нереальные обещания
  '2 часа в день',
  'ничего не делай',
  'автоматический доход',
];

// ===== НЕЦЕНЗУРНАЯ ЛЕКСИКА =====

// Азербайджанские матерные слова (базовый список)
export const profanityAZ = [
  // Добавьте азербайджанские матерные слова
  // Источник: youswear.com, ручная компиляция
  'sik',
  'sikdir',
  'göt',
  'amcıq',
  'orospu',
  'fahişə',
  'piç',
  'it',
  'kəs',
  'yıxıl',
  // Добавьте больше по необходимости
];

// Русские матерные слова (базовый список)
export const profanityRU = [
  // Трехбуквенные
  'бля',
  'хер',
  'хуй',
  'пиз',
  'еба',
  'ёба',
  'муд',

  // Производные
  'блять',
  'блядь',
  'ебать',
  'ёбаный',
  'пизда',
  'пиздец',
  'хуеть',
  'сука',
  'мудак',
  'гандон',
  'уебок',
  'дебил',
  'даун',

  // Оскорбления
  'идиот',
  'кретин',
  'долбоёб',
  'еблан',

  // Добавьте больше по необходимости
];

// ===== ПАТТЕРНЫ =====

// Паттерны для поиска контактов в тексте
export const contactPatterns = {
  // Телефоны: +994, 050, 051, 055, 070, 077, 099
  phone: /(\+?994|0)?(50|51|55|70|77|99)\d{7}/gi,

  // Email
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // Telegram
  telegram: /@[a-zA-Z0-9_]{5,}/gi,

  // WhatsApp (обычно пишут явно)
  whatsapp: /whatsapp|wp|вотсап|вацап/gi,

  // URLs
  url: /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi,
};

// ===== УТИЛИТЫ =====

/**
 * Проверить текст на наличие ключевых слов
 */
export function containsKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
}

/**
 * Найти контакты в тексте
 */
export function findContacts(text: string) {
  return {
    phones: text.match(contactPatterns.phone) || [],
    emails: text.match(contactPatterns.email) || [],
    telegram: text.match(contactPatterns.telegram) || [],
    whatsapp: text.match(contactPatterns.whatsapp) || [],
    urls: text.match(contactPatterns.url) || [],
  };
}

/**
 * Проверить на мат (азербайджанский + русский)
 */
export function containsProfanity(text: string, language: 'az' | 'ru' | 'both' = 'both'): {
  found: boolean;
  words: string[];
  language: 'az' | 'ru' | 'both';
} {
  const lowerText = text.toLowerCase();
  const foundWords: string[] = [];

  if (language === 'az' || language === 'both') {
    const azWords = profanityAZ.filter(word =>
      lowerText.includes(word.toLowerCase())
    );
    foundWords.push(...azWords.map(w => `[AZ] ${w}`));
  }

  if (language === 'ru' || language === 'both') {
    const ruWords = profanityRU.filter(word =>
      lowerText.includes(word.toLowerCase())
    );
    foundWords.push(...ruWords.map(w => `[RU] ${w}`));
  }

  return {
    found: foundWords.length > 0,
    words: foundWords,
    language,
  };
}

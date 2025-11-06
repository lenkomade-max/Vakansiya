# Промпт для исследования модерации (Gemini / ChatGPT-5)

## Копируйте этот промпт целиком:

---

You are an expert content moderator and linguist specializing in Azerbaijani (Azərbaycan dili) and Russian languages for job portal moderation.

I need you to create a comprehensive moderation database for **Vakansiya.az** - a job portal in Azerbaijan. The database should cover:

## Task 1: Azerbaijani Profanity & Offensive Words

Create a comprehensive list of:
- **Profane words** (curse words, vulgar language)
- **Offensive terms** (ethnic slurs, discriminatory language)
- **Sexual content** (inappropriate sexual references)
- **Variations and misspellings** (including Latin/Cyrillic variations)

For each category, provide:
1. The word/phrase in Azerbaijani
2. Severity level: `low`, `medium`, `high`, `critical`
3. Brief explanation (in English) of what it means
4. Common variations (if any)

## Task 2: Russian Profanity & Offensive Words

Same structure as Task 1, but for Russian language commonly used in Azerbaijan.

## Task 3: Spam Keywords (Azerbaijani)

Identify phrases commonly used in spam job postings:
- "Quick money" schemes
- "Work from home" scams
- "No experience needed" (when suspicious)
- MLM/pyramid scheme indicators
- Unrealistic promises

Format:
- Phrase in Azerbaijani
- Why it's suspicious
- Severity: `low`, `medium`, `high`

## Task 4: Fraud Keywords (Azerbaijani)

Identify phrases indicating fraud or scams:
- Prepayment requests ("qeydiyyat haqqı", "əvvəlcədən ödəniş")
- Pyramid/MLM schemes
- Investment scams
- Fake job offers
- Money transfer requests

Format:
- Phrase in Azerbaijani
- Type of fraud
- Severity: `critical`, `high`, `medium`

## Task 5: Spam Keywords (Russian)

Same as Task 3, but for Russian language.

## Task 6: Fraud Keywords (Russian)

Same as Task 4, but for Russian language.

## Task 7: Cultural Context

Provide culturally-specific red flags for Azerbaijan job market:
- Common scam tactics specific to Azerbaijan
- Cultural norms violated in job postings
- Regional variations in language
- Mixing of Azerbaijani/Russian/Turkish that indicates spam

## Task 8: Phone Number Patterns

Identify suspicious patterns:
- Multiple phone numbers in one posting
- International numbers (non-Azerbaijan)
- Premium rate numbers
- Patterns indicating spam (e.g., WhatsApp-only contact)

Azerbaijan phone format:
- Mobile: +994 50/51/55/70/77/99 XXX XX XX
- Landline: +994 12 XXX XX XX (Baku)

## Task 9: Salary Red Flags

For Azerbaijan job market:
- Typical salary ranges by industry
- Unrealistically high salaries indicating scam
- Suspicious salary phrases ("unlimited income", "as much as you want")

## Task 10: Job Title Red Flags

Common spam job titles in Azerbaijani/Russian:
- Titles that are too generic
- Titles with suspicious promises
- MLM/pyramid scheme job titles

---

## Output Format

Please provide your response in **TypeScript/JavaScript format** ready to be inserted into our codebase:

```typescript
// AZERBAIJANI PROFANITY
export const profanityAZ = [
  { word: 'example', severity: 'critical', meaning: 'explanation', variations: ['var1', 'var2'] },
  // ...
];

// RUSSIAN PROFANITY
export const profanityRU = [
  { word: 'пример', severity: 'critical', meaning: 'explanation', variations: ['вар1', 'вар2'] },
  // ...
];

// AZERBAIJANI SPAM
export const spamKeywordsAZ = [
  { phrase: 'tez pul qazan', severity: 'high', reason: 'Quick money scheme' },
  // ...
];

// AZERBAIJANI FRAUD
export const fraudKeywordsAZ = [
  { phrase: 'əvvəlcədən ödəniş', severity: 'critical', type: 'prepayment_scam' },
  // ...
];

// RUSSIAN SPAM
export const spamKeywordsRU = [
  { phrase: 'быстрые деньги', severity: 'high', reason: 'Quick money scheme' },
  // ...
];

// RUSSIAN FRAUD
export const fraudKeywordsRU = [
  { phrase: 'предоплата', severity: 'critical', type: 'prepayment_scam' },
  // ...
];

// CULTURAL CONTEXT
export const culturalRedFlags = [
  { pattern: 'description', severity: 'medium', explanation: 'why suspicious' },
  // ...
];

// PHONE PATTERNS
export const suspiciousPhonePatterns = [
  { pattern: /regex/, reason: 'explanation' },
  // ...
];

// SALARY RANGES (AZN)
export const salaryRanges = {
  it: { min: 800, max: 5000, suspicious: 10000 },
  sales: { min: 500, max: 3000, suspicious: 8000 },
  // ...
};

// SPAM JOB TITLES
export const spamJobTitles = [
  { title: 'example', severity: 'high', reason: 'why spam' },
  // ...
];
```

---

## Requirements

1. **Be comprehensive**: Include at least 50-100 items per category
2. **Be culturally accurate**: Focus on Azerbaijan-specific context
3. **Include variations**: Latin script, Cyrillic, common typos
4. **Be practical**: Focus on what would actually appear in job postings
5. **Provide context**: Explain WHY something is a red flag
6. **Consider regional variations**: Baku vs regions, different dialects

---

## Important Notes

- **Prioritize Azerbaijan job market context** (not general Turkish/Russian)
- Include both formal and informal language
- Consider that many Azerbaijanis mix Latin and Cyrillic alphabets
- Include Russian terms commonly used by Azerbaijanis
- Focus on 2024-2025 scam trends

---

## Example of Expected Depth

For "əvvəlcədən ödəniş" (prepayment):

```typescript
{
  phrase: 'əvvəlcədən ödəniş',
  severity: 'critical',
  type: 'prepayment_scam',
  variations: [
    'evvelceden odemish',
    'əvvəlcə ödəniş',
    'avvalcadan ödəniş',
    'заранее оплата', // Russian equivalent
  ],
  context: 'Legitimate employers in Azerbaijan NEVER ask for payment before hiring. This is a major red flag for fraud.',
  relatedPhrases: [
    'qeydiyyat haqqı',
    'təlim haqqı',
    'material haqqı',
    'forma haqqı',
  ]
}
```

---

## Begin Research

Please provide the most comprehensive moderation database possible for the Azerbaijan job market. Focus on quality, cultural accuracy, and practical applicability.

If you need clarification on any specific aspect of Azerbaijan job market or language, please ask before providing your final response.

---

**Start your research now.**

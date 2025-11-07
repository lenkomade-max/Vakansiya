# ПЛАН ТЕСТИРОВАНИЯ МОДЕРАЦИИ

## КРИТИЧНО: AI должен проверять ВЕСЬ текст описания!

Даже если описание длинное (200+ символов), AI ОБЯЗАН найти скам/мошенничество внутри текста.

---

## 🧪 ТЕСТ 1: ИДЕАЛЬНОЕ объявление (AUTO APPROVE)

**Описание:** Полное, качественное объявление без проблем

```
Название: Frontend Developer
Компания: ABC Tech MMC
Категория: İT və Texnologiya
Город: Bakı, Nəsimi
Зарплата: 2000-3000 AZN
Режим: Tam ştat
Описание: Bakı şəhərində yerləşən ABC Tech MMC şirkəti öz komandası üçün təcrübəli Frontend Developer axtarır. İş React, TypeScript və Next.js texnologiyaları ilə aparılacaq. Komandamızda artıq 15 nəfər developer var və biz yeni üzvlər axtarırıq. Ofis Nəsimi rayonunda yerləşir, rahat nəqliyyat əlaqəsi var. İşə qəbul üçün minimum 2 il təcrübə tələb olunur.
Телефон: +994 50 123 45 67
```

**Ожидаемый результат:**
- ✅ Score: 90-100
- ✅ Status: `active` (AUTO APPROVE)
- ✅ AI НЕ вызывается (score >= 90, 0 флагов)
- ✅ Toast: "Elan avtomatik təsdiqləndi və dərc olundu!"

**Проверка в админке:**
- Объявление должно быть в фильтре "Aktiv"
- rules_moderation_result: approved=true, score=100
- ai_moderation_result: null (не вызывался)

---

## 🧪 ТЕСТ 2: КОРОТКОЕ описание (AI REVIEW)

**Описание:** Слишком короткое, не хватает информации

```
Название: Ofis işçisi
Компания: Test Company
Категория: Digər
Город: Bakı, Yasamal
Зарплата: 1000 AZN
Описание: Ofis işi, əmək haqqı yaxşıdır, iş şəraiti rahatdır.
Телефон: +994 55 222 33 44
```

**Ожидаемый результат:**
- ⚠️ Score: 85-95 (штраф за короткое описание)
- 🤖 AI REVIEW вызывается (score < 90 или есть флаги)
- Логи должны показать:
  ```
  [createJob] Sending to AI review (score: 85)
  [AI Moderation] Starting AI review...
  [AI Moderation] Response status: 200
  [AI Moderation] AI result: { approved: true/false, confidence: X }
  ```
- Если AI confidence < 0.9 → `pending_review`
- Если AI confidence >= 0.9 → `active` или `rejected`

**Проверка в админке:**
- Объявление в фильтре "Gözləyir" (если AI не уверен)
- ai_moderation_result: должен быть заполнен!
- Смотри reason и confidence от AI

---

## 🧪 ТЕСТ 3: ДЛИННЫЙ ТЕКСТ СО СКАМОМ (КРИТИЧНЫЙ ТЕСТ!)

**Описание:** Много текста, но внутри спрятан скам. AI ОБЯЗАН найти!

```
Название: İş imkanı
Компания: Super Şirkət
Категория: Satış
Город: Bakı, Nəsimi
Зарплата: 200 AZN/gün
Описание: Salam dostlar! Əla iş imkanı təqdim edirik. İşləmək üçün heç bir təcrübə lazım deyil. Sadəcə telefonunuzla evdən işləyə bilərsiniz. Günə 200 AZN qazanmaq mümkündür! İlk ödəniş dərhal olur. Heç bir riskə girməyəcəksiniz. Sadəcə bizə qoşulun və pul qazanmağa başlayın. Dostlarınızı da gətirin, hər dost üçün 50 AZN bonus! Qeydiyyat üçün 20 AZN ödəniş lazımdır. Əlaqə nömrəmiz var.
Телефон: +994 50 777 88 99
```

**Ожидаемый результат:**
- 🚨 Rules могут найти: UNREALISTIC_SALARY, FRAUD_KEYWORDS
- 🤖 AI ОБЯЗАН вызваться
- 🤖 AI должен найти скам индикаторы:
  - "Heç bir təcrübə lazım deyil"
  - "Günə 200 AZN" (нереально)
  - "Qeydiyyat üçün 20 AZN ödəniş" (prepayment scam!)
  - "Dostlarınızı gətirin, bonus" (pyramid scheme)

**AI должен вернуть:**
```json
{
  "approved": false,
  "confidence": 0.95+,
  "reason": "Potential financial scam detected",
  "violations": [
    "Prepayment requirement (registration fee)",
    "Unrealistic salary promises",
    "Referral/pyramid scheme indicators"
  ],
  "recommendation": "reject"
}
```

**Результат:**
- ❌ Status: `rejected` (AUTO REJECT by AI)
- ❌ Error message показывает ДЕТАЛИ:
  ```
  Elan rədd edildi:

  Potential financial scam detected

  Aşkar edilən problemlər:
  - Prepayment requirement (registration fee)
  - Unrealistic salary promises
  - Referral/pyramid scheme indicators
  ```

---

## 🧪 ТЕСТ 4: ПИРАМИДА (AUTO REJECT)

```
Название: Biznes imkanı
Компания: MLM Şirkət
Категория: Satış
Город: Bakı
Зарплата: Limitsiz
Описание: Öz komandanızı qurun! Hər yeni üzv üçün komissiya qazanın. Dostlarınızı dəvət edin və passiv gəlir əldə edin. Referal sistemi ilə işləyirik. 5 nəfər gətirin, onlar da 5 nəfər gətirsin.
Телефон: +994 51 111 22 33
```

**Ожидаемый результат:**
- 🚨 Rules сразу находит: PYRAMID_SCHEME, FRAUD_KEYWORDS
- ❌ AUTO REJECT by rules (не доходит до AI)
- ❌ Error message:
  ```
  Elan rədd edildi:

  Səbəblər:
  - Признаки сетевого маркетинга/пирамиды
  - Обнаружены признаки мошенничества: komanda qur, referal, komissiya
  ```

**Проверка в админке:**
- Объявление в фильтре "Rədd edilib"
- rules_moderation_result: autoReject=true, флаги PYRAMID_SCHEME
- ai_moderation_result: null (не дошло до AI)

---

## 🧪 ТЕСТ 5: МАТ (AUTO REJECT)

```
Название: Satış meneceri
Компания: Bad Company
Описание: (добавить мат на азербайджанском - проверить profanityAZ массив)
```

**Ожидаемый результат:**
- 🚨 Rules находит: PROFANITY_DETECTED
- ❌ AUTO REJECT by rules
- ❌ Error: "Обнаружена нецензурная лексика: [слова]"

---

## 📊 ЧТО ПРОВЕРЯТЬ В ЛОГАХ VERCEL

После деплоя, при создании объявления смотри в Runtime Logs:

### Успешный AUTO APPROVE (score 90+):
```
[createJob] Running moderation...
[createJob] Moderation result: { approved: true, score: 100, flags: [] }
[createJob] AUTO APPROVE by rules (score: 100)
[createJob] Job created successfully: xxx
```
✅ AI НЕ вызывался (экономим API credits)

### AI REVIEW (score 40-90):
```
[createJob] Running moderation...
[createJob] Moderation result: { needsAIReview: true, score: 75 }
[createJob] Sending to AI review (score: 75)
[AI Moderation] Starting AI review...
[AI Moderation] API key exists: true
[AI Moderation] Sending request to OpenRouter...
[AI Moderation] Response status: 200
[AI Moderation] AI response content: {"approved":true,"confidence":0.88,...}
[createJob] MANUAL REVIEW (AI confidence too low: 0.88)
[createJob] Job created with status: pending_review
```
✅ AI вызвался и проанализировал
⚠️ Низкая уверенность → manual review

### AUTO REJECT by AI (скам найден):
```
[createJob] Sending to AI review (score: 60)
[AI Moderation] AI response: {"approved":false,"confidence":0.95,"reason":"Scam detected",...}
[createJob] AUTO REJECT by AI (confidence: 0.95)
```
❌ AI нашел скам с высокой уверенностью

### AUTO REJECT by Rules (мошенничество/мат):
```
[createJob] Moderation result: { autoReject: true, flags: [FRAUD_KEYWORDS] }
[createJob] AUTO REJECT by rules
```
❌ Rules сразу отклонил, AI не вызывался

---

## 🔍 АДМИН ПАНЕЛЬ: ЧТО ПРОВЕРИТЬ

1. **Фильтры работают:**
   - Hamısı → показывает ВСЕ объявления
   - Aktiv → только active
   - Gözləyir → только pending_review
   - Rədd edilib → только rejected

2. **Status badges отображаются:**
   - ✓ Aktiv (зеленый)
   - ⏳ Gözləyir (желтый)
   - ✗ Rədd (красный)

3. **Детали модерации видны:**
   - Rules Moderasiya (score, language, flags)
   - AI Moderasiya (approved, confidence, reason, violations)
   - ai_checked_at (timestamp когда AI проверял)

---

## ⚠️ КРИТИЧНЫЕ ПРОВЕРКИ

### 1. AI ОБЯЗАН ПРОВЕРЯТЬ ДЛИННЫЕ ТЕКСТЫ!
Даже если описание 500 символов, но внутри есть "qeydiyyat üçün pul ödəyin" - AI ДОЛЖЕН найти!

### 2. Confidence порог = 0.9
Только высокая уверенность AI приводит к авто-решению. Всё остальное → manual review.

### 3. Score система работает правильно:
- 100 = идеал
- 90+ = авто-одобрение (БЕЗ AI)
- 40-90 = AI review
- <40 = авто-отклонение

### 4. Детальные причины отклонения
Пользователь ВСЕГДА видит ПОЧЕМУ отклонили:
- Список критических флагов от rules
- Reason + violations от AI

---

## 🎯 ИТОГО: ЧТО ДОЛЖНО РАБОТАТЬ

✅ 90%+ объявлений проходят модерацию (approve или reject автоматом)
✅ Только ~10% идут на manual review (низкая уверенность AI)
✅ AI вызывается для ВСЕХ сомнительных случаев
✅ AI находит скам даже в длинных текстах
✅ Пользователь видит детальную причину отклонения
✅ Админ видит ВСЕ объявления с полными логами модерации

---

## 🚀 КАК ТЕСТИРОВАТЬ

1. **Зайди на деплой** (Vercel автоматически задеплоит feature/supabase-auth)
2. **Создай тестовые объявления** по каждому сценарию выше
3. **Смотри Runtime Logs в Vercel** - там будут все детали работы AI
4. **Проверь админ панель** - все объявления должны быть видны с логами
5. **Проверь что пользователь видит причины** отклонения

Если AI не вызывается или не находит скам в длинных текстах - это БАГ!

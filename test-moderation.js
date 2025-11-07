/**
 * Тестирование системы модерации
 * Проверяет rules-based и AI модерацию
 */

const { moderateContent } = require('./lib/moderation/rules.ts');

// Тестовые кейсы
const testCases = [
  {
    name: 'ИДЕАЛЬНОЕ объявление - должно пройти автоматически',
    jobPost: {
      title: 'Frontend Developer',
      company: 'ABC Tech MMC',
      description: 'Bakı şəhərində yerləşən ABC Tech MMC şirkəti öz komandası üçün təcrübəli Frontend Developer axtarır. İş React, TypeScript və Next.js texnologiyaları ilə aparılacaq. Komandamızda artıq 15 nəfər developer var və biz yeni üzvlər axtarırıq. Ofis Nəsimi rayonunda yerləşir, rahat nəqliyyat əlaqəsi var.',
      salary: '2000-3000 AZN',
      location: 'Bakı, Nəsimi'
    },
    expectedScore: '> 90',
    expectedStatus: 'auto_approve'
  },
  {
    name: 'Короткое описание - должно пойти на AI проверку',
    jobPost: {
      title: 'Ofis işçisi',
      company: 'Test Company',
      description: 'Ofis işi, əmək haqqı yaxşıdır, iş şəraiti rahatdır',
      salary: '1000 AZN',
      location: 'Bakı'
    },
    expectedScore: '< 90',
    expectedStatus: 'ai_review'
  },
  {
    name: 'МАТ - должно авто-отклониться',
    jobPost: {
      title: 'Satış meneceri',
      company: 'Bad Company',
      description: 'Gəl işlə pul qazan, çox pis şərait yoxdur. Amma problem ola bilər.',
      salary: '500 AZN',
      location: 'Bakı'
    },
    expectedScore: 'any',
    expectedStatus: 'auto_reject_if_profanity'
  },
  {
    name: 'СКАМ в длинном тексте - AI должен поймать',
    jobPost: {
      title: 'İş imkanı',
      company: 'Super Şirkət',
      description: 'Salam dostlar! Əla iş imkanı təqdim edirik. İşləmək üçün heç bir təcrübə lazım deyil. Sadəcə telefonunuzla evdən işləyə bilərsiniz. Günə 200 AZN qazanmaq mümkündür! İlk ödəniş dərhal olur. Heç bir riskə girməyəcəksiniz. Sadəcə bizə qoşulun və pul qazanmağa başlayın. Dostlarınızı da gətirin, hər dost üçün 50 AZN bonus! Qeydiyyat üçün 20 AZN ödəniş lazımdır. Əlaqə: +994501234567',
      salary: '200 AZN/gün',
      location: 'Uzaqdan'
    },
    expectedScore: '< 50',
    expectedStatus: 'ai_should_catch_scam'
  },
  {
    name: 'ПИРАМИДА схема - должно авто-отклониться',
    jobPost: {
      title: 'Biznes imkanı',
      company: 'MLM Şirkət',
      description: 'Öz komandanızı qurun! Hər yeni üzv üçün komissiya qazanın. Dostlarınızı dəvət edin və passiv gəlir əldə edin. Referal sistemi ilə işləyirik. 5 nəfər gətirin, onlar da 5 nəfər gətirsin. Siz hamısından faiz alaraq pul qazanırsınız!',
      salary: 'Limitsiz',
      location: 'Bakı'
    },
    expectedScore: 'any',
    expectedStatus: 'auto_reject_pyramid'
  },
  {
    name: 'Подозрительная зарплата - AI review',
    jobPost: {
      title: 'Çox asan iş',
      company: 'Şirkət',
      description: 'Heç bir təcrübə tələb olunmur. Günə 2-3 saat işləyin və aylıq 5000 AZN qazanın. İş çox sadədir, hər kəs edə bilər. Təcrübə lazım deyil. Təhsil lazım deyil. Sadəcə telefon olmalıdır.',
      salary: '5000 AZN',
      location: 'Bakı'
    },
    expectedScore: '< 70',
    expectedStatus: 'ai_review'
  }
];

console.log('🧪 BAŞLANĞIC: Moderasiya sisteminin testi\n');
console.log('=' .repeat(80));

async function runTests() {
  for (const testCase of testCases) {
    console.log(`\n📝 TEST: ${testCase.name}`);
    console.log('-'.repeat(80));
    console.log(`Başlıq: ${testCase.jobPost.title}`);
    console.log(`Şirkət: ${testCase.jobPost.company}`);
    console.log(`Təsvir: ${testCase.jobPost.description.substring(0, 100)}...`);
    console.log(`Əmək haqqı: ${testCase.jobPost.salary}`);

    try {
      const result = await moderateContent(testCase.jobPost);

      console.log(`\n📊 Nəticə:`);
      console.log(`   Score: ${result.score}/100`);
      console.log(`   Approved: ${result.approved}`);
      console.log(`   Auto Reject: ${result.autoReject}`);
      console.log(`   Needs AI Review: ${result.needsAIReview}`);
      console.log(`   Dil: ${result.language}`);
      console.log(`   Bayraklar sayı: ${result.flags.length}`);

      if (result.flags.length > 0) {
        console.log(`\n   🚩 Aşkar edilən problemlər:`);
        result.flags.forEach(flag => {
          console.log(`      - [${flag.severity.toUpperCase()}] ${flag.message}`);
        });
      }

      // Проверка ожидаемого результата
      let status = 'UNKNOWN';
      if (result.autoReject) {
        status = 'AUTO_REJECT ❌';
      } else if (result.approved) {
        status = 'AUTO_APPROVE ✅';
      } else if (result.needsAIReview) {
        status = 'AI_REVIEW 🤖';
      }

      console.log(`\n   ✅ Status: ${status}`);
      console.log(`   📌 Gözlənilən: ${testCase.expectedStatus}`);

    } catch (error) {
      console.error(`   ❌ XƏTA: ${error.message}`);
    }

    console.log('='.repeat(80));
  }

  console.log('\n✅ Bütün testlər tamamlandı!\n');
}

runTests().catch(console.error);

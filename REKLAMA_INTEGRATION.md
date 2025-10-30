# Интеграция Google AdSense на Vakansiya.az

## Обзор

Нативная реклама Google AdSense интегрирована в сетку вакансий и коротких работ. Рекламные блоки визуально похожи на обычные карточки вакансий и **не содержат пометки "Reklam"** для более органичной интеграции.

## Компоненты

### AdCard
**Путь:** `/components/ads/AdCard.tsx`

Компонент нативной рекламы, который:
- Визуально идентичен JobCard
- Адаптивный (работает на мобилке и десктопе)
- Без пометки "Reklam"
- Использует Google AdSense responsive ads

### Функция injectAds
Утилита для автоматической вставки рекламы в массив вакансий.

**Позиции рекламы:** 7, 15, 23, 31, 39, 47, 55, 63...
(каждая 8-я позиция после 7-й)

## Использование

### 1. Настройка Google AdSense

Перед использованием получите:
- **Publisher ID** (ca-pub-XXXXXXXXXXXXXXXX)
- **Ad Slot ID** для каждого типа страницы

Добавьте в `.env.local`:
```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_VAKANSIYALAR=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_GUNDELIK=0987654321
```

### 2. Добавить AdSense скрипт в layout

В `/app/layout.tsx` добавьте скрипт Google AdSense:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Интеграция в каталог вакансий

В `/app/vakansiyalar/page.tsx`:

```tsx
import { injectAds } from '@/components/ads/AdCard'

export default function VakansiyalarPage() {
  const [jobs, setJobs] = useState([...])

  // Вставляем рекламу в массив вакансий
  const jobsWithAds = injectAds(
    jobs,
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_VAKANSIYALAR
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {jobsWithAds.map((item, index) => {
        // Если это React элемент (реклама) - рендерим напрямую
        if (React.isValidElement(item)) {
          return <React.Fragment key={`ad-${index}`}>{item}</React.Fragment>
        }

        // Иначе это вакансия
        return <JobCard key={item.id} {...item} />
      })}
    </div>
  )
}
```

### 4. Интеграция в Gündəlik İşlər

В `/app/gundelik-isler/page.tsx` - аналогично, но с другим Ad Slot:

```tsx
const jobsWithAds = injectAds(
  jobs,
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUNDELIK
)
```

## Позиции рекламы

```
Позиция 1:  Vakansiya
Позиция 2:  Vakansiya
Позиция 3:  Vakansiya
Позиция 4:  Vakansiya
Позиция 5:  Vakansiya
Позиция 6:  Vakansiya
Позиция 7:  Vakansiya
Позиция 8:  REKLAM ← первая реклама
Позиция 9:  Vakansiya
Позиция 10: Vakansiya
...
Позиция 15: Vakansiya
Позиция 16: REKLAM ← вторая реклама
Позиция 17: Vakansiya
...
Позиция 23: Vakansiya
Позиция 24: REKLAM ← третья реклама
```

## Типы рекламы AdSense

### 1. In-Feed Ads (рекомендуется)
- Наиболее нативный вид
- Автоматически адаптируется к стилю сайта
- Работает с `data-ad-format="fluid"`

### 2. Display Ads
- Классические баннеры
- Для десктопа: 336x280, 300x250
- Для мобилки: 320x100, 300x250

### 3. Responsive Ads
- Автоматически подстраиваются под размер контейнера
- Используем `data-full-width-responsive="true"`

## Монетизация

### Прогнозы дохода (примерные)

**Дано:**
- 1000 посетителей в день
- 5 страниц на посетителя = 5000 просмотров страниц
- 3 рекламных блока на странице = 15000 показов рекламы
- CTR = 1% (клик на 100 показов)
- CPC = $0.20 (средняя цена клика в Азербайджане)

**Расчет:**
- Клики в день: 15000 * 0.01 = 150 кликов
- Доход в день: 150 * $0.20 = $30
- Доход в месяц: $30 * 30 = $900

## Правила Google AdSense

### ✅ Разрешено:
- Нативная интеграция в сетку контента
- До 3 рекламных блоков на странице
- Реклама в каталогах и списках
- Адаптивные блоки

### ❌ Запрещено:
- Клики по собственной рекламе
- Накрутка кликов
- Обманчивое размещение (например, кнопка под рекламой)
- Призывы "Нажмите на рекламу"
- Реклама на пустых страницах

## Оптимизация

### 1. A/B тестирование позиций
Протестируйте разные позиции:
- Каждая 6-я
- Каждая 8-я (текущая)
- Каждая 10-я

### 2. Типы рекламы
Протестируйте:
- In-Feed Ads
- Display Ads
- Text Ads

### 3. Размеры
Для десктопа:
- 336x280 (Large Rectangle) - лучший CTR
- 300x250 (Medium Rectangle)
- 728x90 (Leaderboard)

Для мобилки:
- 320x100 (Large Mobile Banner)
- 300x250 (Medium Rectangle)

## Альтернативы AdSense

Если AdSense не подойдет:
1. **Media.net** - альтернатива от Yahoo/Bing
2. **PropellerAds** - pop-under реклама
3. **AdThrive** - требует минимум 100k посетителей/месяц
4. **Yandex Advertising** - для русскоязычной аудитории

## Следующие шаги

1. ✅ Установлен пакет `react-google-adsense`
2. ✅ Создан компонент `AdCard`
3. ✅ Создана функция `injectAds`
4. ⏳ Зарегистрироваться в Google AdSense
5. ⏳ Получить Publisher ID и Ad Slot IDs
6. ⏳ Добавить переменные окружения
7. ⏳ Добавить AdSense скрипт в layout
8. ⏳ Интегрировать в `/vakansiyalar`
9. ⏳ Интегрировать в `/gundelik-isler`
10. ⏳ Протестировать на production

## Ссылки

- [Google AdSense](https://www.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Ad Placement Guide](https://support.google.com/adsense/answer/1354736)
- [AdSense Best Practices](https://support.google.com/adsense/answer/17957)

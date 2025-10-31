## Нативная реклама (текущее состояние)

База на `REKLAMA_INTEGRATION.md`. В коде есть:
- `components/ads/AdCard.tsx`
- утилита `injectAds` для вставки рекламы через каждые N элементов

Осталось подключить:
- переменные окружения (`NEXT_PUBLIC_ADSENSE_CLIENT`, слоты)
- `<Script>` в `app/layout.tsx`
- использование на страницах каталогов

Подробности: см. корневой `REKLAMA_INTEGRATION.md`.

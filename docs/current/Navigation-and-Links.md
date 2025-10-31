## Навигация и правила ссылок

Единые правила, чтобы не было расхождений между страницами.

### Хедер
- "Gündəlik işlər" → `/gundelik-isler`
- Логотип кликабелен → `/`
- Кнопка "Elan yerləşdir" → `/post-job`

### Футер
- "Vakansiyalar" → `/vakansiyalar`
- "Elan yerləşdir" → `/post-job`
- Ссылка на `/pricing` использовать только если страница создана. Сейчас страницы нет.

### Известные несоответствия (из `SUMMARY_PROBLEMY.md`)
- В `Navigation.tsx`: заменить `/short-jobs` на `/gundelik-isler`; обернуть логотип в ссылку `/`
- На ряде страниц `handlePostJob` должен вести на `/post-job` вместо логов/`/vakansiyalar/yeni`
- Привести footer-ссылки к правилам выше

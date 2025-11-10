# Parser Fix: Random Subcategory Selection

## Проблема
Парсер `tapaz-scraper` сейчас присваивает всем вакансиям **родительские категории** (например "ITVacancyMain"), из-за чего все вакансии показывают одну и ту же фотку-placeholder.

Нужно: парсер должен выбирать **случайную подкатегорию** из родительской (например: FrontendDev, BackendDev, QA, DevOps вместо ITVacancyMain).

---

## Контекст

### Структура базы данных
Таблица `categories` имеет иерархию:
- **Parent categories** (parent_id = NULL): "İT və texnologiya", "Satış", "Marketinq və reklam" и т.д.
- **Subcategories** (parent_id = UUID родителя): "FrontendDev", "BackendDev", "RetailSales", "SMM" и т.д.

### Текущая логика парсера

**Файл:** `supabase_client_v2.py`
```python
def _load_categories(self):
    # Загружает ТОЛЬКО parent категории (parent_id IS NULL)
    response = self.client.table('categories') \
        .select('id, name_az, type') \
        .is_('parent_id', 'null') \    # ← Проблема: только родители!
        .eq('is_active', True) \
        .execute()

    # Кеш: {'İT və texnologiya': {'vacancy': 'uuid-parent', 'short_job': 'uuid-parent'}, ...}
```

**Файл:** `transformer_v2.py`
```python
def _get_category_uuid(self, tapaz_category, job_type):
    parent_name = TAPAZ_TO_PARENT_CATEGORY.get(tapaz_category)
    uuid = self.category_cache[parent_name][type_key]  # ← Возвращает UUID родителя
    return uuid
```

---

## Решение

### 1. Изменить `supabase_client_v2.py` - функцию `_load_categories()`

**Задача:** Загружать ВСЕ категории (parent + subcategories) и группировать их

```python
def _load_categories(self):
    """Загружает ВСЕ категории из БД в кеш"""
    if not self.enabled or not self.client:
        logger.warning("⚠️  Supabase не включен, категории не загружены")
        return

    try:
        # Загружаем ВСЕ АКТИВНЫЕ категории
        response = self.client.table('categories') \
            .select('id, name, name_az, type, parent_id') \
            .eq('is_active', True) \
            .execute()

        if hasattr(response, 'data') and response.data:
            parent_categories = {}
            child_categories = {}

            # Разделяем на parent и children
            for cat in response.data:
                cat_id = cat.get('id')
                cat_name = cat.get('name')
                cat_type = cat.get('type')
                parent_id = cat.get('parent_id')

                if parent_id is None:
                    # Родительская категория
                    name_az = cat.get('name_az')
                    if name_az not in parent_categories:
                        parent_categories[name_az] = {
                            'id': cat_id,
                            'type': cat_type,
                            'children': []
                        }
                else:
                    # Подкатегория
                    if parent_id not in child_categories:
                        child_categories[parent_id] = []
                    child_categories[parent_id].append({
                        'id': cat_id,
                        'name': cat_name,
                        'type': cat_type
                    })

            # Связываем parent с children
            for parent_az, parent_info in parent_categories.items():
                parent_id = parent_info['id']
                parent_info['children'] = child_categories.get(parent_id, [])

            self.category_cache = parent_categories

            logger.info(f"✅ Загружено {len(self.category_cache)} parent категорий с подкатегориями")

        else:
            logger.warning("⚠️  Нет категорий в БД")

    except Exception as e:
        logger.error(f"❌ Ошибка загрузки категорий: {e}")
```

**Результат:** Кеш теперь содержит:
```python
{
  'İT və texnologiya': {
    'id': 'uuid-parent',
    'type': 'vacancy',
    'children': [
      {'id': 'uuid-1', 'name': 'FrontendDev', 'type': 'vacancy'},
      {'id': 'uuid-2', 'name': 'BackendDev', 'type': 'vacancy'},
      ...
    ]
  },
  ...
}
```

---

### 2. Изменить `transformer_v2.py` - функцию `_get_category_uuid()`

**Задача:** Выбирать случайную подкатегорию вместо родителя

**Добавить импорт в начало файла:**
```python
import random
```

**Заменить функцию `_get_category_uuid()`:**
```python
def _get_category_uuid(self, tapaz_category: Optional[str], job_type: str) -> Optional[str]:
    """
    Получает UUID случайной ПОДКАТЕГОРИИ из кеша

    Args:
        tapaz_category: Название категории с tap.az
        job_type: Тип работы ('vakansiya' или 'gundelik')

    Returns:
        UUID подкатегории или None
    """
    if not tapaz_category:
        return None

    # Получаем имя родительской категории
    parent_name = TAPAZ_TO_PARENT_CATEGORY.get(tapaz_category)

    if not parent_name:
        logger.warning(f"⚠️  No mapping for Tapaz category: '{tapaz_category}'")
        return None

    # Ищем parent в кеше
    if parent_name not in self.category_cache:
        logger.warning(f"⚠️  Parent category not in cache: {parent_name}")
        return None

    parent_info = self.category_cache[parent_name]
    type_key = 'short_job' if job_type == 'gundelik' else 'vacancy'

    # Фильтруем подкатегории по типу
    matching_children = [
        child for child in parent_info.get('children', [])
        if child['type'] == type_key
    ]

    if not matching_children:
        # Если нет подкатегорий, возвращаем UUID родителя (fallback)
        logger.warning(f"⚠️  No subcategories for {parent_name} ({type_key}), using parent")
        return parent_info['id']

    # Выбираем СЛУЧАЙНУЮ подкатегорию
    selected_child = random.choice(matching_children)
    uuid = selected_child['id']

    logger.debug(f"✓ Selected random subcategory: {parent_name} → {selected_child['name']} (UUID: {uuid})")

    return uuid
```

---

## Результат

После изменений:
- ✅ Пользовательские вакансии (созданные вручную) - работают как прежде
- ✅ Парсер tap.az - выбирает случайную подкатегорию для каждой вакансии
- ✅ Все 43 уникальные фотографии категорий используются корректно
- ✅ Разнообразие: разные IT вакансии показывают разные фотки (Frontend, Backend, QA и т.д.)

---

## Файлы для изменения

1. `/root/tapaz-scraper/supabase_client_v2.py` - функция `_load_categories()`
2. `/root/tapaz-scraper/transformer_v2.py` - функция `_get_category_uuid()` + добавить `import random`

---

## Важно
После изменений нужно **перезапустить парсер**, чтобы кеш категорий обновился с новой структурой.

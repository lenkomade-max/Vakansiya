#!/usr/bin/env python3
import requests
import time
import json

SUPABASE_URL = "https://giunonajbfrlasaxqvoi.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdW5vbmFqYmZybGFzYXhxdm9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNjEzNCwiZXhwIjoyMDc4MDEyMTM0fQ.1xTnRao_I4nB9zTVog9ZrVytCjpa3hZ9l_LrIBhVW9s"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "count=exact"
}

print("🔍 Проверка базы данных Supabase...\n")

# 1. Проверяем количество записей
print("📈 Статистика таблицы jobs:")
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/jobs",
    headers={**headers, "Prefer": "count=exact"},
    params={"select": "id", "limit": 0}
)
total_count = response.headers.get("Content-Range", "0").split("/")[-1]
print(f"   Всего записей: {total_count}")

# Активные вакансии
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/jobs",
    headers={**headers, "Prefer": "count=exact"},
    params={"select": "id", "status": "eq.active", "job_type": "eq.vakansiya", "limit": 0}
)
active_count = response.headers.get("Content-Range", "0").split("/")[-1]
print(f"   Активных вакансий: {active_count}")

# Активные gündəlik
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/jobs",
    headers={**headers, "Prefer": "count=exact"},
    params={"select": "id", "status": "eq.active", "job_type": "eq.gundelik", "limit": 0}
)
gundelik_count = response.headers.get("Content-Range", "0").split("/")[-1]
print(f"   Активных gündəlik: {gundelik_count}")

# 2. Тест производительности - простой запрос
print("\n⏱️  Тест 1: Простой запрос (без JOIN):")
start_time = time.time()

response = requests.get(
    f"{SUPABASE_URL}/rest/v1/jobs",
    headers=headers,
    params={
        "select": "*",
        "status": "eq.active",
        "job_type": "eq.vakansiya",
        "order": "created_at.desc",
        "limit": 15
    }
)

end_time = time.time()
query_time_1 = int((end_time - start_time) * 1000)

if response.status_code == 200:
    jobs = response.json()
    print(f"   ⏱️  Время выполнения: {query_time_1}ms")
    print(f"   📦 Получено записей: {len(jobs)}")
else:
    print(f"   ❌ Ошибка: {response.status_code}")

# 3. Тест производительности - запрос с JOIN (как на главной)
print("\n⏱️  Тест 2: Запрос с JOIN категорий (как на главной):")
start_time = time.time()

response = requests.get(
    f"{SUPABASE_URL}/rest/v1/jobs",
    headers=headers,
    params={
        "select": "*,category_info:categories!category(id,name,name_az,image_url,parent_id)",
        "status": "eq.active",
        "job_type": "eq.vakansiya",
        "order": "is_vip.desc,is_urgent.desc,created_at.desc",
        "limit": 15
    }
)

end_time = time.time()
query_time_2 = int((end_time - start_time) * 1000)

if response.status_code == 200:
    jobs = response.json()
    print(f"   ⏱️  Время выполнения: {query_time_2}ms")
    print(f"   📦 Получено записей: {len(jobs)}")
else:
    print(f"   ❌ Ошибка: {response.status_code}")

# 4. Проверяем категории
print("\n📊 Проверка таблицы categories:")
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/categories",
    headers={**headers, "Prefer": "count=exact"},
    params={"select": "id", "limit": 0}
)
categories_count = response.headers.get("Content-Range", "0").split("/")[-1]
print(f"   Всего категорий: {categories_count}")

# 5. Итоговый анализ
print("\n" + "="*60)
print("📊 ИТОГОВЫЙ АНАЛИЗ:")
print("="*60)

avg_time = (query_time_1 + query_time_2) / 2

if avg_time > 500:
    print("❌ ПРОБЛЕМА: Запросы очень медленные (>500ms)")
    print("💡 РЕШЕНИЕ: Добавить индексы в Supabase")
    print("📝 SQL для индексов находится в ANALYSIS.md")
    print(f"\n   Простой запрос: {query_time_1}ms")
    print(f"   Запрос с JOIN: {query_time_2}ms")
    print(f"   Среднее время: {int(avg_time)}ms")
elif avg_time > 200:
    print("⚡ Запросы приемлемые, но есть место для улучшения")
    print("💡 Рекомендация: Добавить индексы для еще большей скорости")
    print(f"\n   Простой запрос: {query_time_1}ms")
    print(f"   Запрос с JOIN: {query_time_2}ms")
    print(f"   Среднее время: {int(avg_time)}ms")
else:
    print("✅ Запросы быстрые! Индексы, скорее всего, уже есть.")
    print(f"\n   Простой запрос: {query_time_1}ms")
    print(f"   Запрос с JOIN: {query_time_2}ms")
    print(f"   Среднее время: {int(avg_time)}ms")

print("\n✅ Проверка завершена!")

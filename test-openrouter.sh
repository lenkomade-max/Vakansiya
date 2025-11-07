#!/bin/bash

# Тестирование OpenRouter API напрямую

API_KEY="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"

echo "🧪 Тестирование OpenRouter API"
echo "================================"
echo ""
echo "📝 API Key (первые 20 символов): ${API_KEY:0:20}..."
echo ""

# Тест 1: DeepSeek R1 (primary модель)
echo "🤖 ТЕСТ 1: DeepSeek R1 (primary)"
echo "--------------------------------"

RESPONSE=$(curl -s -w "\n%{http_code}" https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "deepseek/deepseek-r1:free",
    "messages": [
      {
        "role": "system",
        "content": "You are a content moderator. Respond only with valid JSON."
      },
      {
        "role": "user",
        "content": "Analyze this job post: \"Günə 200 AZN qazanmaq mümkündür! Qeydiyyat üçün 20 AZN ödəniş lazımdır.\" Return JSON: {\"approved\": false, \"confidence\": 0.95, \"reason\": \"Prepayment scam\", \"violations\": [\"Payment required before work\"], \"recommendation\": \"reject\"}"
      }
    ],
    "temperature": 0.3,
    "max_tokens": 500
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo ""
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""
echo "================================"
echo ""

# Тест 2: DeepSeek Chat V3.1 (fallback)
echo "🤖 ТЕСТ 2: DeepSeek Chat V3.1 (fallback)"
echo "--------------------------------"

RESPONSE2=$(curl -s -w "\n%{http_code}" https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "deepseek/deepseek-chat-v3.1:free",
    "messages": [
      {
        "role": "system",
        "content": "You are a content moderator. Respond only with valid JSON."
      },
      {
        "role": "user",
        "content": "Is this job legitimate: \"Frontend Developer at ABC Tech, 2000 AZN salary\"? Return JSON: {\"approved\": true, \"confidence\": 0.9, \"reason\": \"Legitimate job posting\", \"violations\": [], \"recommendation\": \"approve\"}"
      }
    ],
    "temperature": 0.3,
    "max_tokens": 500
  }')

HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
BODY2=$(echo "$RESPONSE2" | sed '$d')

echo "HTTP Status: $HTTP_CODE2"
echo ""
echo "Response Body:"
echo "$BODY2" | jq '.' 2>/dev/null || echo "$BODY2"
echo ""
echo "================================"

# Результаты
echo ""
echo "✅ РЕЗУЛЬТАТЫ:"
echo ""
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Primary модель (DeepSeek R1) работает!"
else
  echo "❌ Primary модель FAILED (HTTP $HTTP_CODE)"
fi

if [ "$HTTP_CODE2" = "200" ]; then
  echo "✅ Fallback модель (DeepSeek Chat V3.1) работает!"
else
  echo "❌ Fallback модель FAILED (HTTP $HTTP_CODE2)"
fi
echo ""

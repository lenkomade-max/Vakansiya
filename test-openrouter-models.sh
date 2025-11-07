#!/bin/bash

API_KEY="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"

echo "🧪 Тестирование разных free моделей OpenRouter"
echo "================================================"
echo ""

# Список free моделей для теста
MODELS=(
  "google/gemini-flash-1.5:free"
  "qwen/qwen-2.5-7b-instruct:free"
  "meta-llama/llama-3.1-8b-instruct:free"
  "mistralai/mistral-7b-instruct:free"
)

for MODEL in "${MODELS[@]}"; do
  echo "🤖 Тестирую модель: $MODEL"
  echo "----------------------------"
  
  RESPONSE=$(curl -s -w "\n%{http_code}" https://openrouter.ai/api/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"model\": \"$MODEL\",
      \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],
      \"max_tokens\": 50
    }" 2>&1)
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  echo "HTTP Status: $HTTP_CODE"
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ РАБОТАЕТ!"
    echo ""
    echo "$RESPONSE" | sed '$d' | jq -r '.choices[0].message.content' 2>/dev/null || echo "Response OK"
  else
    echo "❌ ОШИБКА"
    echo "$RESPONSE" | sed '$d' | jq -r '.error.message' 2>/dev/null || echo "Unknown error"
  fi
  
  echo ""
  echo "================================================"
  echo ""
done

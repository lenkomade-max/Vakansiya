#!/bin/bash

API_KEY="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"

echo "🧪 Тестирование ПЛАТНЫХ DeepSeek моделей"
echo "========================================"
echo ""

# Платные DeepSeek модели
MODELS=(
  "deepseek/deepseek-chat"
  "deepseek/deepseek-r1"
  "deepseek/deepseek-chat-v3.1"
)

for MODEL in "${MODELS[@]}"; do
  echo "🤖 Тестирую: $MODEL"
  echo "----------------------------"
  
  RESPONSE=$(curl -s -w "\n%{http_code}" https://openrouter.ai/api/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"model\": \"$MODEL\",
      \"messages\": [
        {\"role\": \"system\", \"content\": \"You are a content moderator. Respond with JSON only.\"},
        {\"role\": \"user\", \"content\": \"Analyze: \\\"Günə 200 AZN! Qeydiyyat üçün 20 AZN ödə.\\\" Return JSON: {\\\"approved\\\": false, \\\"confidence\\\": 0.95, \\\"reason\\\": \\\"Scam\\\", \\\"violations\\\": [\\\"Prepayment\\\"], \\\"recommendation\\\": \\\"reject\\\"}\"}
      ],
      \"temperature\": 0.3,
      \"max_tokens\": 500
    }" 2>&1)
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  echo "HTTP Status: $HTTP_CODE"
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ РАБОТАЕТ!"
    echo ""
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    echo "❌ ОШИБКА"
    echo "$BODY" | jq -r '.error.message' 2>/dev/null || echo "$BODY"
  fi
  
  echo ""
  echo "========================================"
  echo ""
done

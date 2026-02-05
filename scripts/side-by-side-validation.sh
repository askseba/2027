#!/bin/bash

echo "=== CONTENT COMPARISON: Old vs New Routes ==="
echo ""

# Function to safely count pattern matches in a file
safe_count() {
  local file=$1
  local pattern=$2
  if [ -f "$file" ]; then
    grep -c "$pattern" "$file" 2>/dev/null || echo "0"
  else
    echo "N/A"
  fi
}

##
## Task 1.1: Count elements in key pages
##

# Home Page Sections
echo "📄 HOME PAGE:"
OLD_HOME_SECTIONS=$(safe_count "src/app/page.tsx" "Section")
NEW_HOME_SECTIONS=$(safe_count "src/app/[locale]/page.tsx" "Section")
echo "  Sections: $OLD_HOME_SECTIONS → $NEW_HOME_SECTIONS"
if [ "$NEW_HOME_SECTIONS" != "N/A" ] && [ "$OLD_HOME_SECTIONS" != "N/A" ] && [ "$NEW_HOME_SECTIONS" -ge "$OLD_HOME_SECTIONS" ]; then
  echo "  ✅ OK"
else
  echo "  ⚠️ Check manually"
fi

echo ""
echo "📄 ABOUT PAGE:"
if [ -f "src/app/about/page.tsx" ]; then
  OLD_ABOUT_LINES=$(wc -l < src/app/about/page.tsx)
  NEW_ABOUT_LINES=$(wc -l < src/app/[locale]/about/page.tsx)
  echo "  Lines: $OLD_ABOUT_LINES → $NEW_ABOUT_LINES"

  DIFF=$((NEW_ABOUT_LINES - OLD_ABOUT_LINES))
  DIFF_ABS=${DIFF#-}

  if [ "$DIFF_ABS" -lt 30 ]; then
    echo "  ✅ OK (±$DIFF lines)"
  else
    echo "  ⚠️ Significant change: $DIFF lines"
  fi
else
  echo "  ℹ️ No old about page found (may have been driven purely by content.json)"
fi

echo ""
echo "📄 FAQ PAGE:"
echo "  Checking question count..."

# Old FAQ questions from src/content/content.json (legacy content)
if [ -f "src/content/content.json" ]; then
  OLD_FAQ_Q=$(node -e "
    try {
      const c = require('./src/content/content.json');
      let total = 0;
      if (c.faq && Array.isArray(c.faq.categories)) {
        for (const cat of c.faq.categories) {
          if (Array.isArray(cat.questions)) total += cat.questions.length;
        }
      }
      console.log(total);
    } catch (e) { console.log('0'); }
  " 2>/dev/null || echo "0")
else
  OLD_FAQ_Q="N/A"
fi

# New FAQ questions from messages/ar.json
NEW_FAQ_Q=$(node -e "
  try {
    const m = require('./messages/ar.json');
    let total = 0;
    if (m.faq && Array.isArray(m.faq.categories)) {
      for (const cat of m.faq.categories) {
        if (Array.isArray(cat.questions)) {
          total += cat.questions.length;
        }
      }
    }
    console.log(total);
  } catch (e) { console.log('0'); }
" 2>/dev/null || echo "0")

echo "  Questions: $OLD_FAQ_Q → $NEW_FAQ_Q"
if [ "$OLD_FAQ_Q" != "N/A" ] && [ "$NEW_FAQ_Q" != "0" ] 2>/dev/null && [ "$NEW_FAQ_Q" -ge "$OLD_FAQ_Q" ] 2>/dev/null; then
  echo "  ✅ OK"
else
  echo "  ⚠️ Check manually"
fi

echo ""
echo "📄 QUIZ PAGES:"
for step in "step1-favorites" "step2-disliked" "step3-allergy"; do
  if [ -f "src/app/quiz/$step/page.tsx" ]; then
    OLD_LINES=$(wc -l < "src/app/quiz/$step/page.tsx")
    NEW_LINES=$(wc -l < "src/app/[locale]/quiz/$step/page.tsx")
    echo "  $step: $OLD_LINES → $NEW_LINES lines"
  fi
done

echo ""
echo "📄 AUTH PAGES:"
for page in "login" "register"; do
  if [ -f "src/app/$page/page.tsx" ]; then
    OLD_LINES=$(wc -l < "src/app/$page/page.tsx")
    NEW_LINES=$(wc -l < "src/app/[locale]/$page/page.tsx")
    DIFF=$((NEW_LINES - OLD_LINES))
    echo "  $page: $OLD_LINES → $NEW_LINES (diff: $DIFF)"
  fi
done

echo ""
echo "=== COMPONENT PRESERVATION CHECK ==="

echo "Home page components:"
if [ -f "src/app/page.tsx" ]; then
  echo "  Old imports:"
  grep "^import.*@/components" src/app/page.tsx | head -5 || echo "    (none)"

  echo "  New imports:"
  grep "^import.*@/components" src/app/[locale]/page.tsx | head -5 || echo "    (none)"
fi

echo ""
echo "Animation components (MotionDiv, motion.):"
OLD_MOTION=$(find src/app -name "page.tsx" -exec grep -l "MotionDiv\|motion\." {} \; 2>/dev/null | wc -l)
NEW_MOTION=$(find src/app/\[locale\] -name "page.tsx" -exec grep -l "MotionDiv\|motion\." {} \; 2>/dev/null | wc -l)
echo "  Old pages with motion: $OLD_MOTION"
echo "  New pages with motion: $NEW_MOTION"

echo ""
echo "=== BUILD OUTPUT COMPARISON ==="

rm -rf .next
npm run build 2>&1 | tee build-output.txt

echo ""
echo "Checking for locale routes in build:"
grep -E "ƒ.*\\[locale\\]" build-output.txt | head -15 || echo "  (no explicit [locale] routes found in build output listing)"

echo ""
echo "Checking build size:"
du -sh .next 2>/dev/null || echo "  (du not available)"

echo ""
echo "Checking for build warnings:"
grep -i "warning" build-output.txt | head -10 || echo "  (no warnings found or grep not available)"

echo ""
echo "=== ROUTE AVAILABILITY TEST ==="

# Start dev server in background
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 10

echo "Testing routes (both old and new)..."

ROUTES=(
  "http://localhost:3000/ar"
  "http://localhost:3000/en"
  "http://localhost:3000/ar/about"
  "http://localhost:3000/en/about"
  "http://localhost:3000/ar/faq"
  "http://localhost:3000/ar/quiz/step1-favorites"
  "http://localhost:3000/ar/login"
)

for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$route" || echo "000")
  if [ "$STATUS" = "200" ]; then
    echo "✅ $route"
  else
    echo "❌ $route (Status: $STATUS)"
  fi
done

echo ""
echo "Checking if old routes still respond (should redirect or 404):"
OLD_ROUTES=(
  "http://localhost:3000/about"
  "http://localhost:3000/faq"
  "http://localhost:3000/quiz/step1-favorites"
)

for route in "${OLD_ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$route" || echo "000")
  echo "  $route → Status: $STATUS"
  if [ "$STATUS" = "200" ]; then
    echo "    ℹ️ Old route still works (will be archived in PROMPT #9)"
  fi
done

kill $SERVER_PID 2>/dev/null || true

echo ""
echo "=== ROUTE TEST COMPLETE ==="


# Fragrance Fingerprint Enhancement — Execution Plan (Final)

> **تاريخ:** فبراير 2026  
> **المصدر الوحيد للحقيقة:** `merged_files.md` — كل مسار ملف تم التحقق من وجوده  
> **القاعدة المطلقة:** لا يُحذف أي عطر بسبب الحساسية — أبداً  

---

## السياسة الثابتة (لا تُخترق في أي commit)

| الحالة | السلوك |
|--------|--------|
| عطر في `dislikedPerfumeIds` | **يُحذف كلياً** قبل دخول pipeline — لا يظهر أبداً |
| عطر يحتوي مكوّناً محظوراً (safety=0) | **يظهر** في النتائج مع badge أحمر 🔴 |
| عطر يُحفّز أعراضاً (safety=50) | **يظهر** في النتائج مع badge أصفر 🟡 |
| عطر نظيف (safety=100) | **يظهر** بدون أي badge |

---

## الملفات الموجودة فعلاً (مُتحقّق منها)

```
✅ src/components/quiz/Step3Allergy.tsx          (سطر 2075)
✅ src/data/symptom-mappings.ts                  (سطر 4239)
✅ src/lib/matching.ts                           (سطر 4845)
✅ src/app/api/match/route.ts                    (سطر 1860)
✅ src/contexts/QuizContext.tsx                   (سطر 4085)
✅ src/components/ui/PerfumeCard.tsx              (سطر 3387)
✅ src/components/ui/RadarGauge.tsx               (سطر 3590)
✅ src/components/results/ResultsContent.tsx      (سطر 2830)
✅ src/components/results/MatchSheet.tsx          (سطر 2618)
✅ src/components/results/IngredientsSheet.tsx    (سطر 2359)
✅ src/components/results/ResultsGrid.tsx         (سطر 3245)
✅ src/content/index.ts                          (سطر 3854)
✅ src/lib/services/perfume-bridge.service.ts     (سطر 5133)
✅ src/app/[locale]/quiz/step2-disliked/page.tsx  (سطر 1576)
✅ src/hooks/useQuizStepGuard.ts                  (سطر 4783)
✅ messages/ar.json                               (سطر 47)
✅ messages/en.json                               (سطر 829)
✅ src/components/quiz/QuizLandingContent.tsx      (مذكور في سطر 5694)
❌ src/app/[locale]/quiz/page.tsx                 — غير موجود (404)
❌ src/components/SafetyWarnings.tsx              — موجود لكن orphan (لا يُستورد)
```

---

# 🔴 المرحلة صفر — إصلاحات حرجة (3 commits)

---

## commit 01 — `fix(step3): rash → redness`

**MODIFY:** `src/components/quiz/Step3Allergy.tsx`

**السبب:** معرّف `rash` غير موجود في `symptom-mappings.ts`. المفتاح الصحيح هو `redness` (سطر 4270). فلتر السلامة معطّل كلياً لهذا العرض.

**التغيير الوحيد — في مصفوفة `symptoms` (سطر ~2111):**

```typescript
// قبل:
{ id: 'rash', icon: '🔴', title: 'احمرار أو حكة', desc: 'بشرتي تتحسس من بعض المكونات' },

// بعد:
{ id: 'redness', icon: '🔴', title: 'احمرار أو حكة', desc: 'بشرتي تتحسس من بعض المكونات' },
```

**Acceptance Criteria:**
- [ ] اختيار "احمرار أو حكة" ينتج `allergyProfile.symptoms` يحتوي `'redness'`
- [ ] `symptom-mappings.ts` يحتوي `symptom: "redness"` (سطر 4270) → المكونات المرتبطة (`Cinnamal`, `Hydroxycitronellal`, إلخ) تؤثر في `safetyScore`
- [ ] باقي المعرّفات (`sneeze`, `headache`, `nausea`) موجودة في `symptom-mappings.ts` ولا تحتاج تعديل

---

## commit 02 — `feat(quiz): create /quiz landing page`

**CREATE:** `src/app/[locale]/quiz/page.tsx`

**السبب:** `BackButton` في Step1 يُشير إلى `/quiz` → 404. المكوّن `QuizLandingContent` موجود فعلاً (سطر 5694).

**⚠️ قبل كتابة الـimport — تحقق من نوع التصدير:**
```bash
grep -n "export" src/components/quiz/QuizLandingContent.tsx | head -5
```
- إذا كان `export function QuizLandingContent` → استخدم `{ QuizLandingContent }`
- إذا كان `export default` → استخدم `QuizLandingContent` بدون أقواس

```typescript
// الاحتمال الأرجح (named export — مؤكد من سطر 5704):
import { QuizLandingContent } from '@/components/quiz/QuizLandingContent'
// أو إذا كان default export:
// import QuizLandingContent from '@/components/quiz/QuizLandingContent'

export default function QuizLandingPage() {
  return <QuizLandingContent />
}
```

**Acceptance Criteria:**
- [ ] `GET /ar/quiz` → 200 (لا 404)
- [ ] `GET /en/quiz` → 200
- [ ] الصفحة تعرض شاشة بداية الاختبار (زر "ابدأ الاختبار" يُوجّه لـ `/quiz/step1-favorites`)
- [ ] BackButton من Step1 → `/quiz` يعمل بدون reload

---

## commit 03 — `feat(i18n): move Step3 hardcoded Arabic to messages/*.json`

**MODIFY:**
1. `src/components/quiz/Step3Allergy.tsx`
2. `messages/ar.json`
3. `messages/en.json`

### 3A — إضافة مفاتيح i18n في `messages/ar.json`

أضف داخل `"quiz"."step3"` (الكائن الموجود في سطر ~510) المفاتيح التالية:

```json
{
  "quiz": {
    "step3": {
      "metadata": { "...الموجود..." },
      "title": "3",
      "description": "اختر الأعراض التي تعاني منها",
      "level1Question": "هل سبق وسبب لك عطر أي من هذه الأعراض؟",
      "level2Question": "من أي نوع عطور تزعجك؟",
      "level3Question": "ما هي المكونات التي تسبب لك حساسية؟",
      "level3Description": "اختر المكونات التي تعرف أنها تزعجك",
      "level1Title": "1. الأعراض",
      "level2Title": "2. العائلات",
      "level3Title": "3. المكونات",
      "saveButton": "حفظ بصمتي",
      "transitioning": "جاري الانتقال...",
      "gateway": {
        "question": "هل سبق أن سبب لك عطر تهيجاً أو أعراضاً؟",
        "yes": "نعم",
        "no": "لا، أكمل مباشرة"
      },
      "symptoms": {
        "sneeze": "عطاس أو احتقان",
        "sneezeDesc": "عطور قوية تسبب لي عطاس",
        "redness": "احمرار أو حكة",
        "rednessDesc": "بشرتي تتحسس من بعض المكونات",
        "headache": "صداع أو دوخة",
        "headacheDesc": "روائح معينة تصيبني بالصداع",
        "nausea": "غثيان أو ضيق تنفس",
        "nauseaDesc": "عطور ثقيلة تضايقني",
        "none": "لا أعاني من شيء",
        "noneDesc": "أنا بخير تماماً"
      },
      "families": {
        "floral": "زهرية",
        "floralExamples": "ياسمين، ورد",
        "citrus": "حمضية",
        "citrusExamples": "ليمون، برتقال",
        "woody": "خشبية",
        "woodyExamples": "عود، صندل",
        "spicy": "حارة",
        "spicyExamples": "قرفة، فلفل",
        "gourmand": "حلوة",
        "gourmandExamples": "فانيليا، كراميل",
        "leather": "جلدية",
        "leatherExamples": "جلد، تبغ"
      },
      "ingredients": {
        "jasmine": "ياسمين",
        "rose": "ورد",
        "oud": "عود",
        "sandalwood": "صندل",
        "vanilla": "فانيليا",
        "musk": "مسك",
        "amber": "عنبر",
        "patchouli": "باتشولي",
        "lavender": "لافندر",
        "bergamot": "برغموت",
        "pepper": "فلفل",
        "leather": "جلد"
      }
    }
  }
}
```

### 3B — نفس المفاتيح في `messages/en.json` (بالإنجليزية)

```json
{
  "quiz": {
    "step3": {
      "gateway": {
        "question": "Have fragrances ever caused you irritation or symptoms?",
        "yes": "Yes",
        "no": "No, continue directly"
      },
      "symptoms": {
        "sneeze": "Sneezing or congestion",
        "sneezeDesc": "Strong perfumes cause me to sneeze",
        "redness": "Redness or itching",
        "rednessDesc": "My skin reacts to some ingredients",
        "headache": "Headache or dizziness",
        "headacheDesc": "Certain scents give me headaches",
        "nausea": "Nausea or breathing difficulty",
        "nauseaDesc": "Heavy perfumes bother me",
        "none": "I don't have any symptoms",
        "noneDesc": "I'm perfectly fine"
      },
      "families": {
        "floral": "Floral",
        "floralExamples": "Jasmine, Rose",
        "citrus": "Citrus",
        "citrusExamples": "Lemon, Orange",
        "woody": "Woody",
        "woodyExamples": "Oud, Sandalwood",
        "spicy": "Spicy",
        "spicyExamples": "Cinnamon, Pepper",
        "gourmand": "Gourmand",
        "gourmandExamples": "Vanilla, Caramel",
        "leather": "Leather",
        "leatherExamples": "Leather, Tobacco"
      },
      "ingredients": {
        "jasmine": "Jasmine",
        "rose": "Rose",
        "oud": "Oud",
        "sandalwood": "Sandalwood",
        "vanilla": "Vanilla",
        "musk": "Musk",
        "amber": "Amber",
        "patchouli": "Patchouli",
        "lavender": "Lavender",
        "bergamot": "Bergamot",
        "pepper": "Pepper",
        "leather": "Leather"
      }
    }
  }
}
```

### 3C — تعديل `Step3Allergy.tsx`

استبدل النصوص المكتوبة مباشرة بمفاتيح i18n. **التغييرات المحددة:**

**1. أعلى الملف — تغيير `useTranslations`:**
```typescript
// قبل (سطر ~2106):
const t = useTranslations('common')

// بعد:
const t = useTranslations('quiz.step3')
const tCommon = useTranslations('common')
```

**2. مصفوفة `symptoms` (سطر ~2110):**
```typescript
// قبل:
const symptoms = [
  { id: 'sneeze', icon: '🤧', title: 'عطاس أو احتقان', desc: 'عطور قوية تسبب لي عطاس' },
  { id: 'redness', icon: '🔴', title: 'احمرار أو حكة', desc: 'بشرتي تتحسس من بعض المكونات' },
  { id: 'headache', icon: '🤕', title: 'صداع أو دوخة', desc: 'روائح معينة تصيبني بالصداع' },
  { id: 'nausea', icon: '😖', title: 'غثيان أو ضيق تنفس', desc: 'عطور ثقيلة تضايقني' },
  { id: 'none', icon: '✅', title: 'لا أعاني من شيء', desc: 'أنا بخير تماماً' }
]

// بعد:
const symptoms = [
  { id: 'sneeze',   icon: '🤧', title: t('symptoms.sneeze'),   desc: t('symptoms.sneezeDesc') },
  { id: 'redness',  icon: '🔴', title: t('symptoms.redness'),  desc: t('symptoms.rednessDesc') },
  { id: 'headache', icon: '🤕', title: t('symptoms.headache'), desc: t('symptoms.headacheDesc') },
  { id: 'nausea',   icon: '😖', title: t('symptoms.nausea'),   desc: t('symptoms.nauseaDesc') },
  { id: 'none',     icon: '✅', title: t('symptoms.none'),     desc: t('symptoms.noneDesc') }
]
```

**3. مصفوفة `families` (سطر ~2119):**
```typescript
// قبل:
const families = [
  { id: 'floral', icon: '🌸', name: 'زهرية', examples: 'ياسمين، ورد' },
  { id: 'citrus', icon: '🍋', name: 'حمضية', examples: 'ليمون، برتقال' },
  { id: 'woody', icon: '🪵', name: 'خشبية', examples: 'عود، صندل' },
  { id: 'spicy', icon: '🌶️', name: 'حارة', examples: 'قرفة، فلفل' },
  { id: 'gourmand', icon: '🍰', name: 'حلوة', examples: 'فانيليا، كراميل' },
  { id: 'leather', icon: '🧥', name: 'جلدية', examples: 'جلد، تبغ' }
]

// بعد:
const families = [
  { id: 'floral',   icon: '🌸',  name: t('families.floral'),   examples: t('families.floralExamples') },
  { id: 'citrus',   icon: '🍋',  name: t('families.citrus'),   examples: t('families.citrusExamples') },
  { id: 'woody',    icon: '🪵',  name: t('families.woody'),    examples: t('families.woodyExamples') },
  { id: 'spicy',    icon: '🌶️', name: t('families.spicy'),    examples: t('families.spicyExamples') },
  { id: 'gourmand', icon: '🍰',  name: t('families.gourmand'), examples: t('families.gourmandExamples') },
  { id: 'leather',  icon: '🧥',  name: t('families.leather'),  examples: t('families.leatherExamples') }
]
```

**4. مصفوفة `ingredients` (سطر ~2129):**
```typescript
// قبل:
const ingredients = [
  { id: 'jasmine', name: 'ياسمين', icon: '🌸' },
  { id: 'rose', name: 'ورد', icon: '🌹' },
  // ... إلخ
]

// بعد:
const ingredients = [
  { id: 'jasmine',    name: t('ingredients.jasmine'),    icon: '🌸' },
  { id: 'rose',       name: t('ingredients.rose'),       icon: '🌹' },
  { id: 'oud',        name: t('ingredients.oud'),        icon: '🪵' },
  { id: 'sandalwood', name: t('ingredients.sandalwood'), icon: '🪵' },
  { id: 'vanilla',    name: t('ingredients.vanilla'),    icon: '🍦' },
  { id: 'musk',       name: t('ingredients.musk'),       icon: '💫' },
  { id: 'amber',      name: t('ingredients.amber'),      icon: '🟡' },
  { id: 'patchouli',  name: t('ingredients.patchouli'),  icon: '🍃' },
  { id: 'lavender',   name: t('ingredients.lavender'),   icon: '💜' },
  { id: 'bergamot',   name: t('ingredients.bergamot'),   icon: '🍋' },
  { id: 'pepper',     name: t('ingredients.pepper'),     icon: '🌶️' },
  { id: 'leather',    name: t('ingredients.leather'),    icon: '🧥' }
]
```

**5. عناوين المستويات في JSX:**

استبدل كل `{content.quiz.step3.level1Question}` → `{t('level1Question')}` وهكذا لكل مفتاح يبدأ بـ `content.quiz.step3.*`.

**6. إزالة import `content`:**
```typescript
// احذف هذا السطر (سطر ~2086):
import content from '@/content'
```

**7. أي استدعاء لـ `t('...')` كان يُشير لـ `common`:**

استبدله بـ `tCommon('...')`. مثال: زر "التالي" إذا كان `t('next')` → `tCommon('next')`.

**Acceptance Criteria:**
- [ ] `grep -rn "احمرار\|عطاس\|صداع\|غثيان\|ياسمين\|زهرية" src/components/quiz/Step3Allergy.tsx` → **صفر** نتائج
- [ ] `grep -rn "import content from" src/components/quiz/Step3Allergy.tsx` → **صفر** نتائج
- [ ] Step3 يُصيّر بالعربية كما كان — لا `undefined` في الواجهة
- [ ] التبديل للإنجليزية يعرض النصوص الإنجليزية

---

# 🔵 المرحلة الأولى — تحسين الخوارزمية (6 commits)

**ترتيب إلزامي:** `04 → 05 → 06 → 06.5 → 07 → 08`

---

## commit 04 — `feat(safety): create safety-display.ts`

**CREATE:** `src/lib/safety-display.ts`

```typescript
// src/lib/safety-display.ts
// المصدر الوحيد لمنطق عرض السلامة — لا ملف UI يُكرر هذا المنطق

export type SafetySeverity = 'low' | 'medium' | 'high'

export interface SafetyDisplay {
  color: string       // hex
  label: string       // النص العربي الافتراضي
  labelEn: string     // النص الإنجليزي
  badge: string       // الأيقونة
  showWarning: boolean
}

const config: Record<SafetySeverity, SafetyDisplay> = {
  low:    { color: '#22c55e', label: 'آمن',   labelEn: 'Safe',    badge: '✓', showWarning: false },
  medium: { color: '#f59e0b', label: 'تنبيه', labelEn: 'Caution', badge: '⚠', showWarning: true  },
  high:   { color: '#ef4444', label: 'تحذير', labelEn: 'Warning', badge: '✕', showWarning: true  },
}

export function getSafetyDisplay(severity: SafetySeverity): SafetyDisplay {
  return config[severity]
}

export function severityFromScore(score: 0 | 50 | 100): SafetySeverity {
  if (score === 0) return 'high'
  if (score === 50) return 'medium'
  return 'low'
}
```

**Acceptance Criteria:**
- [ ] `getSafetyDisplay('low').showWarning === false`
- [ ] `getSafetyDisplay('high').color === '#ef4444'`
- [ ] `severityFromScore(50) === 'medium'`

---

## commit 05 — `feat(types): update matching types`

**MODIFY:** `src/lib/matching.ts`

**التغييرات في قسم TYPE DEFINITIONS (سطر ~4856):**

**1. `UserPreferenceForMatching` — أضف `likedPerfumes`:**
```typescript
// قبل (سطر ~4877):
export interface UserPreferenceForMatching {
  likedPerfumesFamilies: string[]
  dislikedPerfumeIds: string[]
  allergyProfile: {
    symptoms: string[]
    families: string[]
    ingredients: string[]
  }
}

// بعد:
export interface UserPreferenceForMatching {
  likedPerfumesFamilies: string[]
  likedPerfumes?: PerfumeForMatching[]  // ← جديد: للنوتات
  dislikedPerfumeIds: string[]
  allergyProfile: {
    symptoms: string[]
    families: string[]    // يُجمع لكن لا يُستخدم للحذف — مُعلّق للمستقبل
    ingredients: string[]
  }
}
```

**2. `ScoredPerfume` — أضف `safetySeverity` و `safetyReason`:**
```typescript
// قبل (سطر ~4887):
export interface ScoredPerfume extends PerfumeForMatching {
  finalScore: number
  tasteScore: number
  safetyScore: number
  isExcluded: boolean
  exclusionReason: string | null
  ifraScore?: number
  ifraWarnings?: string[]
  source?: string
  fragellaId?: string
}

// بعد:
export interface ScoredPerfume extends PerfumeForMatching {
  finalScore: number
  tasteScore: number
  safetyScore: 0 | 50 | 100               // ← كان number
  safetySeverity: 'low' | 'medium' | 'high' // ← جديد
  safetyReason: string | null               // ← جديد: سبب التحذير
  isExcluded: boolean                        // true فقط للمكروهات
  exclusionReason: string | null             // "disliked" فقط — لا علاقة بالسلامة
  ifraScore?: number
  ifraWarnings?: string[]
  source?: string
  fragellaId?: string
}
```

**Acceptance Criteria:**
- [ ] `npx tsc --noEmit` → يُظهر أخطاء في الملفات التي تستخدم `safetyScore: number` (متوقع — سيُصلح في commits لاحقة)
- [ ] الحقول الجديدة مُعرّفة بوضوح

---

## commit 06 — `feat(matching): new TasteScore Family60% + Notes40%`

**MODIFY:** `src/lib/matching.ts`

**1. دالة جديدة — أضفها بعد `buildUserScentDNA` (سطر ~5011):**

```typescript
/**
 * Builds the user's preferred notes set from liked perfumes' scent pyramids.
 */
export function buildUserPreferredNotes(
  likedPerfumes: PerfumeForMatching[]
): Set<string> {
  const notes = new Set<string>()
  for (const p of likedPerfumes) {
    if (p.scentPyramid) {
      const allNotes = [
        ...(p.scentPyramid.top ?? []),
        ...(p.scentPyramid.heart ?? []),
        ...(p.scentPyramid.base ?? []),
      ]
      for (const n of allNotes) {
        notes.add(n.toLowerCase())
      }
    }
  }
  return notes
}
```

**2. استبدل `calculateTasteScore` (سطر ~4936):**

```typescript
// قبل:
export function calculateTasteScore(
  perfumeFamilies: string[],
  userScentDNA: Set<string>
): number {
  if (userScentDNA.size === 0) return 50
  const perfumeSet = new Set(perfumeFamilies.map(f => f.toLowerCase()))
  const userSet = new Set([...userScentDNA].map(f => f.toLowerCase()))
  const similarity = jaccardSimilarity(perfumeSet, userSet)
  return Math.round(similarity * 100)
}

// بعد:
export function calculateTasteScore(
  perfumeFamilies: string[],
  userScentDNA: Set<string>,
  perfumeScentPyramid: PerfumeForMatching['scentPyramid'],
  userPreferredNotes: Set<string>
): number {
  if (userScentDNA.size === 0 && userPreferredNotes.size === 0) return 50

  // Family Similarity (60%)
  const familyScore = jaccardSimilarity(
    new Set(perfumeFamilies.map(f => f.toLowerCase())),
    userScentDNA
  )

  // Notes Similarity (40%)
  let notesScore = 0
  if (perfumeScentPyramid && userPreferredNotes.size > 0) {
    const perfumeNotes = new Set([
      ...(perfumeScentPyramid.top ?? []),
      ...(perfumeScentPyramid.heart ?? []),
      ...(perfumeScentPyramid.base ?? []),
    ].map(n => n.toLowerCase()))
    notesScore = jaccardSimilarity(perfumeNotes, userPreferredNotes)
  }

  return Math.round(((familyScore * 0.60) + (notesScore * 0.40)) * 100)
}
```

**Acceptance Criteria:**
- [ ] `calculateTasteScore([], new Set(), null, new Set()) === 50`
- [ ] `buildUserPreferredNotes([]) → Set {}` (فارغة)
- [ ] عطر بلا `scentPyramid` → `notesScore = 0` → النتيجة = `familyScore × 0.60 × 100`

---

## commit 06.5 — `test(matching): unit tests`

**CREATE:** `src/lib/matching.test.ts`

```typescript
// src/lib/matching.test.ts
import { describe, it, expect } from 'vitest' // أو jest — حسب المشروع
import {
  jaccardSimilarity,
  calculateTasteScore,
  calculateSafetyScore,
  calculateFinalMatchScore,
  buildUserScentDNA,
  buildUserPreferredNotes,
} from './matching'
import type { PerfumeForMatching } from './matching'

// ──────────────────────────────────
// TasteScore
// ──────────────────────────────────

describe('calculateTasteScore', () => {
  it('returns 50 when both DNA and notes are empty', () => {
    expect(calculateTasteScore([], new Set(), null, new Set())).toBe(50)
  })

  it('uses family only when scentPyramid is null', () => {
    const userDNA = new Set(['woody', 'spicy'])
    const score = calculateTasteScore(['Woody', 'Floral'], userDNA, null, new Set())
    // Family Jaccard: {woody} ∩ {woody,spicy} = 1, union = 3 → 1/3 ≈ 0.333
    // TasteScore = 0.333 * 0.60 * 100 = 20
    expect(score).toBe(20)
  })

  it('combines Family*0.60 + Notes*0.40 correctly', () => {
    const userDNA = new Set(['woody'])
    const userNotes = new Set(['oud', 'sandalwood'])
    const pyramid = { top: ['Bergamot'], heart: ['Oud'], base: ['Sandalwood'] }
    const score = calculateTasteScore(['Woody'], userDNA, pyramid, userNotes)
    // Family Jaccard: {woody}/{woody} = 1.0
    // Notes Jaccard: {bergamot,oud,sandalwood} ∩ {oud,sandalwood} = 2/3 ≈ 0.667
    // TasteScore = (1.0*0.60 + 0.667*0.40) * 100 = (0.60 + 0.267) * 100 = 87
    expect(score).toBe(87)
  })
})

// ──────────────────────────────────
// SafetyScore (3-tier)
// ──────────────────────────────────

describe('calculateSafetyScore', () => {
  const allergy = {
    symptoms: ['redness'],
    families: ['floral'],  // لا يُستخدم في الحساب
    ingredients: ['Limonene']
  }

  it('returns 0 + high for blocked ingredient', () => {
    const result = calculateSafetyScore(['Limonene', 'Linalool'], [], allergy)
    expect(result.score).toBe(0)
    expect(result.severity).toBe('high')
    expect(result.reason).toContain('Limonene')
  })

  it('returns 50 + medium for symptom trigger', () => {
    const result = calculateSafetyScore(['Linalool'], ['redness'], allergy)
    expect(result.score).toBe(50)
    expect(result.severity).toBe('medium')
  })

  it('returns 100 + low for clean perfume', () => {
    const result = calculateSafetyScore(['Linalool'], ['headache'], allergy)
    expect(result.score).toBe(100)
    expect(result.severity).toBe('low')
    expect(result.reason).toBeNull()
  })

  it('prioritizes 0 over 50 when both match', () => {
    const result = calculateSafetyScore(['Limonene'], ['redness'], allergy)
    expect(result.score).toBe(0) // ingredient match → 0 يفوز
  })
})

// ──────────────────────────────────
// FinalScore
// ──────────────────────────────────

describe('calculateFinalMatchScore', () => {
  it('equals 0.70 * taste + 0.30 * safety', () => {
    expect(calculateFinalMatchScore(80, 100)).toBe(86) // 56 + 30
    expect(calculateFinalMatchScore(80, 0)).toBe(56)   // 56 + 0
    expect(calculateFinalMatchScore(80, 50)).toBe(71)  // 56 + 15
  })
})

// ──────────────────────────────────
// buildUserPreferredNotes
// ──────────────────────────────────

describe('buildUserPreferredNotes', () => {
  it('returns empty set for empty array', () => {
    expect(buildUserPreferredNotes([]).size).toBe(0)
  })

  it('extracts and lowercases all notes from pyramids', () => {
    const perfumes: PerfumeForMatching[] = [{
      id: '1', name: 'Test', brand: 'Test', image: '', description: null,
      price: null, families: [], ingredients: [], symptomTriggers: [],
      isSafe: true, status: 'safe', variant: null,
      scentPyramid: { top: ['Bergamot'], heart: ['Rose'], base: ['OUD'] }
    }]
    const notes = buildUserPreferredNotes(perfumes)
    expect(notes.has('bergamot')).toBe(true)
    expect(notes.has('rose')).toBe(true)
    expect(notes.has('oud')).toBe(true)
    expect(notes.has('OUD')).toBe(false) // lowercase
  })
})
```

**Acceptance Criteria:**
- [ ] `npm test -- src/lib/matching.test.ts` → صفر failures
- [ ] جميع الاختبارات الثمانية تمر

---

## commit 07 — `feat(matching): 3-tier safety + rewrite calculateMatchScores`

**MODIFY:** `src/lib/matching.ts`

### 7A — استبدل `calculateSafetyScore` (سطر ~4961):

```typescript
// قبل:
export function calculateSafetyScore(
  perfumeIngredients: string[],
  perfumeSymptomTriggers: string[],
  userAllergies: {
    symptoms: string[]
    families: string[]
    ingredients: string[]
  }
): { score: number; reason: string | null } {
  const perfumeIngredientsSet = new Set(perfumeIngredients.map(i => i.toLowerCase()))
  const perfumeTriggersSet = new Set(perfumeSymptomTriggers.map(t => t.toLowerCase()))
  
  for (const symptom of userAllergies.symptoms) {
    if (perfumeTriggersSet.has(symptom.toLowerCase())) {
      return { score: 0, reason: `يسبب ${symptom}` }
    }
  }
  
  for (const ingredient of userAllergies.ingredients) {
    if (perfumeIngredientsSet.has(ingredient.toLowerCase())) {
      return { score: 0, reason: `يحتوي على ${ingredient}` }
    }
  }
  
  return { score: 100, reason: null }
}

// بعد:
export function calculateSafetyScore(
  perfumeIngredients: string[],
  perfumeSymptomTriggers: string[],
  userAllergies: {
    symptoms: string[]
    families: string[]
    ingredients: string[]
  }
): { score: 0 | 50 | 100; reason: string | null; severity: 'high' | 'medium' | 'low' } {
  const ingredientsSet = new Set(perfumeIngredients.map(i => i.toLowerCase()))
  const triggersSet = new Set(perfumeSymptomTriggers.map(t => t.toLowerCase()))

  // أولوية 1: مكوّن محظور → 0 (high)
  const blockedMatch = userAllergies.ingredients.find(
    ing => ingredientsSet.has(ing.toLowerCase())
  )
  if (blockedMatch) {
    return { score: 0, severity: 'high', reason: `يحتوي: ${blockedMatch}` }
  }

  // أولوية 2: مُحفّز أعراض → 50 (medium)
  const triggerMatch = userAllergies.symptoms.find(
    sym => triggersSet.has(sym.toLowerCase())
  )
  if (triggerMatch) {
    return { score: 50, severity: 'medium', reason: `قد يسبب: ${triggerMatch}` }
  }

  // allergyProfile.families لا يُستخدم في الحساب
  // (كان يُستخدم للحذف في v1 — مُزال كلياً وفق السياسة)

  return { score: 100, severity: 'low', reason: null }
}
```

### 7B — استبدل `calculateMatchScores` بالكامل (سطر ~5024):

```typescript
// بعد (الاستبدال الكامل):
export function calculateMatchScores(
  perfumes: PerfumeForMatching[],
  userPreference: UserPreferenceForMatching
): ScoredPerfume[] {
  // ① بناء Sets مرة واحدة خارج الحلقة
  const userScentDNA = buildUserScentDNA(userPreference.likedPerfumesFamilies)
  const userPreferredNotes = userPreference.likedPerfumes
    ? buildUserPreferredNotes(userPreference.likedPerfumes)
    : new Set<string>()

  // ② فلتر المكروهات فقط — الحذف الوحيد المسموح
  const candidates = perfumes.filter(
    p => !userPreference.dislikedPerfumeIds.includes(p.id)
  )

  // ③ حساب scores — لا حذف إضافي
  const scored: ScoredPerfume[] = candidates.map(perfume => {
    // TasteScore: Family 60% + Notes 40%
    const tasteScore = calculateTasteScore(
      perfume.families,
      userScentDNA,
      perfume.scentPyramid ?? null,
      userPreferredNotes
    )

    // SafetyScore: 3-tier (0/50/100)
    const { score: safetyScore, severity: safetySeverity, reason: safetyReason } =
      calculateSafetyScore(
        perfume.ingredients ?? [],
        perfume.symptomTriggers ?? [],
        userPreference.allergyProfile
      )

    // FinalScore: Taste 70% + Safety 30%
    const finalScore = calculateFinalMatchScore(tasteScore, safetyScore)

    return {
      ...perfume,
      finalScore,
      tasteScore,
      safetyScore: safetyScore as 0 | 50 | 100,
      safetySeverity,
      safetyReason,
      isExcluded: false,       // المكروهات فُلتِرت ولم تصل هنا
      exclusionReason: null,
    }
  })

  // ④ ترتيب تنازلي — لا فلترة إضافية
  return scored.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore
    if (b.tasteScore !== a.tasteScore) return b.tasteScore - a.tasteScore
    return a.name.localeCompare(b.name, 'ar')
  })
}
```

**ما تم حذفه من v1:**
- فلترة `allergyProfile.families` (الأسطر 5046-5060) — **محذوفة كلياً**
- فلترة `.filter(p => !p.isExcluded)` في النهاية (سطر 5099) — **محذوفة** لأن لا عطر يُستبعد بسبب السلامة
- `isExcluded: true` بسبب `allergyProfile.families` — **محذوفة**

**Acceptance Criteria:**
- [ ] `matching.test.ts` يمر كاملاً
- [ ] اختيار عائلة في Step3 Level2 → عطور تلك العائلة **تظهر** في النتائج (لا تُحذف)
- [ ] اختيار مكوّن محظور → العطور المحتوية عليه تحصل على `safetyScore=0` وتظهر في النتائج
- [ ] عدد النتائج بعد اختيار حساسيات = عدد النتائج بدون حساسيات (مطروحاً منها المكروهات فقط)

---

## commit 08 — `feat(api): scentPyramid + likedPerfumes pipeline`

**MODIFY:**
1. `src/app/api/match/route.ts` ← **الملف الرئيسي** (يحتوي `toPerfumeForMatching`)
2. `src/lib/services/perfume-bridge.service.ts` ← **لا تعديل مطلوب حالياً** (احتياطي فقط إذا كان bridge يحتوي نسخة أخرى)

### 8A — `route.ts` — تعديل `toPerfumeForMatching`

> **ملاحظة:** هذه الدالة معرّفة داخل `route.ts` (سطر ~1888) وليس في `bridge.service.ts`.

في دالة `toPerfumeForMatching` (سطر ~1888 في route.ts):

```typescript
// في route.ts — عدّل toPerfumeForMatching الموجودة (سطر ~1888):
function toPerfumeForMatching(p: {
  id: string
  name: string
  brand: string
  image: string
  description?: string
  price?: number
  families?: string[]
  ingredients?: string[]
  symptomTriggers?: string[]
  isSafe?: boolean
  status?: string
  variant?: string
  scentPyramid?: any  // ← أضف
}): PerfumeForMatching {
  const families = (p.families ?? []).map(f => f.toLowerCase().trim())
  const ingredients = typeof p.ingredients === 'string'
    ? JSON.parse(p.ingredients)
    : (p.ingredients ?? [])
  const symptomTriggers = p.symptomTriggers ?? []

  // scentPyramid — JSON.parse guard
  let scentPyramid: PerfumeForMatching['scentPyramid'] = null
  try {
    const raw = p.scentPyramid
    if (typeof raw === 'string' && raw.trim()) {
      scentPyramid = JSON.parse(raw)
    } else if (raw && typeof raw === 'object' && ('top' in raw || 'heart' in raw || 'base' in raw)) {
      scentPyramid = raw
    }
  } catch {
    console.warn(`[toPerfumeForMatching] Invalid scentPyramid for ${p.id}`)
    scentPyramid = null
  }

  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image,
    description: p.description ?? null,
    price: p.price ?? null,
    families,
    ingredients,
    symptomTriggers,
    isSafe: p.isSafe ?? true,
    status: p.status ?? 'safe',
    variant: p.variant ?? null,
    scentPyramid,
  }
}
```

### 8B — `route.ts` — مرّر `likedPerfumes`

استبدل بناء `userPreference` (سطر ~2009):

```typescript
// قبل (سطر ~2002-2013):
const likedIds = prefs.likedPerfumeIds ?? []
const likedPerfumesFamilies: string[] = []
for (const id of likedIds) {
  const p = allPerfumes.find((x) => x.id === id)
  if (p?.families?.length) likedPerfumesFamilies.push(...p.families)
}

const userPreference = {
  likedPerfumesFamilies,
  dislikedPerfumeIds: prefs.dislikedPerfumeIds ?? [],
  allergyProfile
}

// بعد:
const likedIds = prefs.likedPerfumeIds ?? []
const likedPerfumesFamilies: string[] = []
const likedPerfumes: PerfumeForMatching[] = []
for (const id of likedIds) {
  const p = allPerfumes.find((x) => x.id === id)
  if (p) {
    likedPerfumes.push(p as PerfumeForMatching)
    if (p.families?.length) likedPerfumesFamilies.push(...p.families)
  }
}

const userPreference: UserPreferenceForMatching = {
  likedPerfumesFamilies,
  likedPerfumes,                         // ← جديد
  dislikedPerfumeIds: prefs.dislikedPerfumeIds ?? [],
  allergyProfile
}
```

أضف import `UserPreferenceForMatching` إذا لم يكن موجوداً:
```typescript
import type { PerfumeForMatching, ScoredPerfume, UserPreferenceForMatching } from '@/lib/matching'
```

**Acceptance Criteria:**
- [ ] عطر بـ`scentPyramid` كـJSON string في DB → `p.scentPyramid.top` يُعيد array
- [ ] `likedPerfumes` يصل لـ`calculateMatchScores` بكائنات كاملة
- [ ] `families` دائماً lowercase بعد `toPerfumeForMatching`

---

# 🟢 المرحلة الثانية — تحسين UI + UX (7 commits)

**ترتيب إلزامي:** `09 → 10 → 11 → 12 → 13 → 14 → 15`

---

## commit 09 — `feat(card): safety pill on PerfumeCard`

**MODIFY:** `src/components/ui/PerfumeCard.tsx`

**1. أضف imports وprops:**

```typescript
// أضف import (بعد سطر 3398):
import { getSafetyDisplay, severityFromScore } from '@/lib/safety-display'

// أضف في PerfumeCardProps (بعد سطر ~3428):
  safetySeverity?: 'low' | 'medium' | 'high'
```

**2. أضف في destructuring (سطر ~3457):**
```typescript
  safetySeverity,
```

**3. أضف safety pill في JSX — بعد badge "أفضل تطابق" (بعد سطر ~3518):**

```typescript
        {/* Safety pill */}
        {(() => {
          const severity = safetySeverity ?? severityFromScore(
            (safetyScore === 100 ? 100 : safetyScore === 50 ? 50 : 0) as 0 | 50 | 100
          )
          const display = getSafetyDisplay(severity)
          if (!display.showWarning) return null
          return (
            <div className="absolute top-14 end-3 z-10">
              <span
                style={{ backgroundColor: display.color }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
              >
                {display.badge} {display.label}
              </span>
            </div>
          )
        })()}
```

**Acceptance Criteria:**
- [ ] عطر `safetyScore=100` → لا pill
- [ ] عطر `safetyScore=50` → pill أصفر "⚠ تنبيه"
- [ ] عطر `safetyScore=0` → pill أحمر "✕ تحذير"
- [ ] pill لا تتزاحم مع badge "أفضل تطابق" (`start-3` vs `end-3`)

---

## commit 10 — `feat(radar): 3-tier safety in RadarGauge`

**MODIFY:** `src/components/ui/RadarGauge.tsx`

**استبدل شريط الأمان في `showBreakdown` (سطر ~3789-3807):**

```typescript
          {/* الأمان — 3-tier */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-secondary dark:text-text-muted">
              {labels.safety}:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-2 bg-cream-bg dark:bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    safetyScore === 100
                      ? "bg-safe-green"
                      : safetyScore === 50
                        ? "bg-amber-400"
                        : "bg-danger-red"
                  )}
                  style={{ width: `${safetyScore}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-black min-w-[35px] text-left",
                  safetyScore === 100
                    ? "text-safe-green"
                    : safetyScore === 50
                      ? "text-amber-500"
                      : "text-danger-red"
                )}
              >
                {safetyScore === 100 ? "🟢" : safetyScore === 50 ? "🟡" : "🔴"} {safetyScore}%
              </span>
            </div>
          </div>
```

**Acceptance Criteria:**
- [ ] RadarGauge `size="sm"` → لا تغيير
- [ ] RadarGauge `size="lg"` + `safetyScore=50` → شريط أصفر + "🟡 50%"
- [ ] RadarGauge `size="lg"` + `safetyScore=0` → شريط أحمر + "🔴 0%"

---

## commit 11 — `feat(results): update MatchSheet + IngredientsSheet for 3-tier`

**MODIFY:**
1. `src/components/results/MatchSheet.tsx`
2. `src/components/results/IngredientsSheet.tsx`

### 11A — MatchSheet

**استبدل شريط الأمان (سطر ~2762-2770):**

```typescript
              {/* الأمان (30%) — 3-tier */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary dark:text-text-muted">
                    {t("safetyLabel")} (30%)
                  </span>
                  <span className="text-sm font-bold text-text-primary dark:text-text-primary">
                    {perfume.safetyScore}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      perfume.safetyScore === 100 ? "bg-safe-green"
                        : perfume.safetyScore === 50 ? "bg-amber-400"
                        : "bg-red-500"
                    )}
                    style={{ width: `${perfume.safetyScore}%` }}
                  />
                </div>
              </div>
```

**استبدل قسم `exclusionReason` (سطر ~2812-2819) بعرض `safetyReason`:**

```typescript
            {/* سبب التحذير الأمني */}
            {perfume.safetyReason && (
              <div className={cn(
                "mx-6 mt-4 mb-6 p-4 rounded-2xl border",
                perfume.safetyScore === 0
                  ? "bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20"
                  : "bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20"
              )}>
                <p className={cn(
                  "text-sm font-medium",
                  perfume.safetyScore === 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
                )}>
                  {perfume.safetyScore === 0 ? '🔴' : '🟡'} {perfume.safetyReason}
                </p>
              </div>
            )}
```

### 11B — IngredientsSheet

**استبدل قسم "حالة الأمان" (سطر ~2562-2564):**

```typescript
                    <p className="text-sm font-medium text-text-primary dark:text-text-primary">
                      {perfume.safetyScore === 100 ? t("safeLabel")
                        : perfume.safetyScore === 50 ? t("cautionLabel")
                        : t("warningLabel")}
                    </p>
```

> **ملاحظة:** أضف مفتاح `"cautionLabel": "تنبيه"` في `messages/ar.json` تحت `results.ingredients` و `"cautionLabel": "Caution"` في `en.json`.

**Acceptance Criteria:**
- [ ] MatchSheet: عطر `safetyScore=50` → شريط أصفر + "🟡 قد يسبب: ..."
- [ ] MatchSheet: عطر `safetyScore=0` → شريط أحمر + "🔴 يحتوي: ..."
- [ ] IngredientsSheet: 3 حالات عرض (آمن / تنبيه / تحذير)

---

## commit 12 — `feat(context): add new fields to QuizContext`

**MODIFY:** `src/contexts/QuizContext.tsx`

### 12A — تحديث `QuizData` interface (سطر ~4093):

```typescript
// قبل:
interface QuizData {
  step1_liked: string[]
  step2_disliked: string[]
  step3_allergy: {
    symptoms: string[]
    families: string[]
    ingredients: string[]
  }
}

// بعد:
interface QuizData {
  step1_liked: string[]
  step2_disliked: string[]
  step3_allergy: {
    symptoms: string[]
    families: string[]
    ingredients: string[]
  }
  // حقول جديدة:
  step1_reference_perfume_id: string | null
  step2_dislike_reasons: Record<string, 'heavy' | 'chemical' | 'personal'>
  step3_has_reaction: boolean | null
  context: {
    climate: 'hot_dry' | 'hot_humid' | 'moderate' | 'cold' | null
    purpose: 'daily' | 'events' | 'sports' | 'versatile' | null
  }
}
```

### 12B — تحديث `defaultData` (سطر ~4113):

```typescript
const defaultData: QuizData = {
  step1_liked: [],
  step2_disliked: [],
  step3_allergy: {
    symptoms: [],
    families: [],
    ingredients: []
  },
  step1_reference_perfume_id: null,
  step2_dislike_reasons: {},
  step3_has_reaction: null,
  context: { climate: null, purpose: null },
}
```

### 12C — تحديث deserialization في `useEffect` (سطر ~4136):

```typescript
          next = {
            step1_liked: parsed.step1_liked || [],
            step2_disliked: parsed.step2_disliked || [],
            step3_allergy: parsed.step3_allergy || {
              symptoms: [],
              families: [],
              ingredients: []
            },
            step1_reference_perfume_id: parsed.step1_reference_perfume_id ?? null,
            step2_dislike_reasons: parsed.step2_dislike_reasons ?? {},
            step3_has_reaction: parsed.step3_has_reaction ?? null,
            context: parsed.context ?? { climate: null, purpose: null },
          }
```

### 12D — تحديث `isComplete` (سطر ~4206):

**لا تعديل** — `isComplete` يبقى كما هو لأنه يعتمد على step1/step2/step3 فقط.

**Acceptance Criteria:**
- [ ] `npx tsc --noEmit` بدون errors جديدة
- [ ] القيم الافتراضية الجديدة تُحفظ في sessionStorage
- [ ] الرجوع بعد اختيار context → القيم محفوظة

---

## commit 13 — `feat(step3): allergy gateway`

**MODIFY:** `src/components/quiz/Step3Allergy.tsx`

**أضف منطق البوابة في بداية الدالة (بعد `const [currentLevel, setCurrentLevel]`):**

```typescript
  // ← بوابة الحساسية
  const { data: quizData, setStep } = useQuiz()
  const router = useRouter()
  const [hasReaction, setHasReaction] = useState<boolean | null>(
    quizData.step3_has_reaction  // استعادة الحالة إذا عاد المستخدم
  )

  // إذا لم يُجب بعد → اعرض البوابة
  if (hasReaction === null) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <h2 className="text-3xl font-bold text-text-dark dark:text-slate-100">
          {t('gateway.question')}
        </h2>
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <button
            onClick={() => {
              setHasReaction(true)
              setStep('step3_has_reaction', true)
            }}
            className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/20 border-2 border-danger-red text-lg font-bold text-text-dark dark:text-slate-100"
          >
            {t('gateway.yes')}
          </button>
          <button
            onClick={() => {
              setStep('step3_has_reaction', false)
              onNext()  // ← ينتقل للنتائج مباشرة
            }}
            className="p-6 rounded-3xl bg-green-50 dark:bg-green-900/20 border-2 border-green-400 text-lg font-bold text-text-dark dark:text-slate-100"
          >
            {t('gateway.no')}
          </button>
        </div>
      </div>
    )
  }

  // إذا أجاب "لا" سابقاً → لا تعرض Step3
  if (hasReaction === false) {
    // المستخدم رجع بعد "لا" → أعرض زر متابعة
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <p className="text-lg text-text-dark dark:text-slate-100">{t('gateway.question')}</p>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-primary text-white rounded-2xl text-lg font-bold"
        >
          {t('saveButton')}
        </button>
      </div>
    )
  }

  // hasReaction === true → أعرض Step3 الكامل ↓
```

> **⚠️ شرط إلزامي:** هذا الـcommit **يجب** أن يُنفَّذ بعد commit 12 (إضافة الحقول لـQuizData). بعد commit 12، `setStep('step3_has_reaction', ...)` يعمل مباشرة بدون `as any` لأن `step3_has_reaction` أصبح مفتاحاً صالحاً في `QuizData`.
```

**أضف imports المطلوبة أعلى الملف:**
```typescript
import { useQuiz } from '@/contexts/QuizContext'
import { useRouter } from '@/i18n/routing'
```

**Acceptance Criteria:**
- [ ] أول زيارة لـStep3 → تظهر البوابة
- [ ] اختيار "لا" → `onNext()` يُستدعى → ينتقل للنتائج
- [ ] اختيار "نعم" → تظهر شاشة Step3 الكاملة
- [ ] الرجوع بعد "لا" → البوابة لا تظهر مجدداً (لأن `step3_has_reaction=false` محفوظ)
- [ ] `npx tsc --noEmit` → صفر errors في Step3Allergy.tsx (يُثبت أن `setStep` يقبل `step3_has_reaction` بعد commit 12)

---

## commit 14 — `feat(step2): dislike reason bottom sheet`

**MODIFY:** `src/app/[locale]/quiz/step2-disliked/page.tsx`

### 14A — أضف state (بعد سطر ~1611):
```typescript
  const [pendingDislike, setPendingDislike] = useState<LocalPerfume | null>(null)
  const { data: quizData, setStep: setQuizStep } = useQuiz()
```

### 14B — عدّل `handleAddPerfume` (سطر ~1688):
```typescript
  const handleAddPerfume = (perfume: LocalPerfume) => {
    if (selectedPerfumes.length >= MAX_SELECTIONS) {
      setShowMaxWarning(true)
      setTimeout(() => setShowMaxWarning(false), 3000)
      toast.error(t('step1.maxError'))
      return
    }
    if (selectedPerfumes.find(p => p.id === perfume.id)) {
      toast.info(t('step1.alreadyAdded'))
      return
    }
    // ← بدلاً من الإضافة المباشرة، افتح Sheet
    setPendingDislike(perfume)
    setSearchTerm('')
    setSearchResults([])
  }
```

### 14C — أضف handlers:
```typescript
  const handleReasonSelect = (reason: 'heavy' | 'chemical' | 'personal') => {
    if (!pendingDislike) return
    setSelectedPerfumes(prev => [...prev, pendingDislike])
    // حفظ السبب في QuizContext
    setQuizStep('step2_dislike_reasons', {
      ...(quizData.step2_dislike_reasons ?? {}),
      [pendingDislike.id]: reason
    })
    setPendingDislike(null)
  }

  const handleCancelDislike = () => {
    setPendingDislike(null)
  }
```

### 14D — أضف DislikeReasonSheet component (في نهاية الملف):

```typescript
import { AnimatePresence, motion } from 'framer-motion'

function DislikeReasonSheet({
  perfume,
  onSelect,
  onCancel,
  locale
}: {
  perfume: LocalPerfume
  onSelect: (reason: 'heavy' | 'chemical' | 'personal') => void
  onCancel: () => void
  locale: string
}) {
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  const reasons = [
    { id: 'heavy' as const,    icon: '💨', label: locale === 'ar' ? 'رائحته ثقيلة / مكثفة' : 'Too heavy / intense' },
    { id: 'chemical' as const, icon: '🧪', label: locale === 'ar' ? 'حادة / كيماوية' : 'Sharp / chemical' },
    { id: 'personal' as const, icon: '👤', label: locale === 'ar' ? 'لا تناسبني شخصياً' : 'Not for me personally' },
  ]

  // Escape handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onCancel])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white dark:bg-surface-elevated rounded-t-3xl p-6 pb-10 shadow-elevation-3"
        dir={direction}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2 text-center">
          {locale === 'ar' ? `لماذا لا يعجبك ${perfume.name}؟` : `Why don't you like ${perfume.name}?`}
        </h3>

        <div className="space-y-3 mt-6">
          {reasons.map((reason, i) => (
            <button
              key={reason.id}
              onClick={() => onSelect(reason.id)}
              autoFocus={i === 0}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-border-subtle
                hover:border-primary dark:hover:border-amber-500
                bg-white dark:bg-surface text-start
                flex items-center gap-3 transition-all touch-manipulation min-h-[56px]"
            >
              <span className="text-2xl">{reason.icon}</span>
              <span className="text-base font-medium text-text-primary dark:text-text-primary">
                {reason.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
```

### 14E — أضف في JSX الرئيسي (قبل `</ErrorBoundary>`):

```typescript
      <AnimatePresence>
        {pendingDislike && (
          <DislikeReasonSheet
            key={pendingDislike.id}
            perfume={pendingDislike}
            onSelect={handleReasonSelect}
            onCancel={handleCancelDislike}
            locale={locale}
          />
        )}
      </AnimatePresence>
```

أضف import `useEffect` إذا لم يكن موجوداً (موجود فعلاً سطر 1581).

**Acceptance Criteria:**
- [ ] اختيار عطر → Sheet يفتح مع 3 أسباب
- [ ] اختيار سبب → العطر يُضاف + Sheet يُغلق
- [ ] Escape → Sheet يُغلق → العطر **لم** يُضَف
- [ ] Click خارج Sheet → نفس Escape
- [ ] scroll الصفحة الخلفية ممنوع أثناء فتح Sheet

---

## commit 15 — `feat(results): send new fields in payload`

**MODIFY:** `src/components/results/ResultsContent.tsx`

**استبدل `payload` في `fetchResults` (سطر ~2886):**

```typescript
// قبل:
const payload = {
  preferences: {
    likedPerfumeIds: quizData?.step1_liked ?? [],
    dislikedPerfumeIds: quizData?.step2_disliked ?? [],
    allergyProfile: quizData?.step3_allergy ?? {}
  }
}

// بعد (commit 12 يجب أن يكون مُطبّقاً — الحقول موجودة في QuizData):
const payload = {
  preferences: {
    likedPerfumeIds: quizData?.step1_liked ?? [],
    dislikedPerfumeIds: quizData?.step2_disliked ?? [],
    allergyProfile: quizData?.step3_allergy ?? {}
  },
  // حقول جديدة — badge فقط، لا تدخل المعادلة:
  referencePerfumeId: quizData?.step1_reference_perfume_id ?? null,
  dislikeReasons: quizData?.step2_dislike_reasons ?? {},
  hasReaction: quizData?.step3_has_reaction ?? null,
  context: quizData?.context ?? { climate: null, purpose: null },
}
```

**Acceptance Criteria:**
- [ ] فحص network request في DevTools → body يحتوي `referencePerfumeId`, `dislikeReasons`, `hasReaction`, `context`
- [ ] حقول `null` لا تُسبب errors في `/api/match`
- [ ] النتائج لم تتغير (الحقول الجديدة لا تدخل المعادلة)
- [ ] **لا `as any` في الكود** — إذا ظهر خطأ TypeScript، تأكد أن commit 12 مُطبّق أولاً

---

# 📋 ملخص الترتيب والاعتمادات

```
المرحلة صفر (مستقلة — لا اعتمادات):
  01  fix(step3): rash → redness
  02  feat(quiz): create /quiz page              ← CREATE
  03  feat(i18n): Step3 → messages/*.json

المرحلة الأولى (تسلسلية):
  04  feat(safety): create safety-display.ts      ← CREATE
  05  feat(types): update matching types           يعتمد على: 04
  06  feat(matching): TasteScore Family+Notes      يعتمد على: 05
  06.5 test(matching): unit tests                  يعتمد على: 06  ← CREATE
  07  feat(matching): 3-tier safety + rewrite      يعتمد على: 06.5
  08  feat(api): scentPyramid pipeline             يعتمد على: 07

المرحلة الثانية (تسلسلية):
  09  feat(card): safety pill                      يعتمد على: 04, 08
  10  feat(radar): 3-tier breakdown                يعتمد على: 08
  11  feat(ui): MatchSheet + IngredientsSheet      يعتمد على: 08
  12  feat(context): QuizContext new fields         مستقل
  13  feat(step3): allergy gateway                 يعتمد على: 03, 12
  14  feat(step2): dislike reason sheet             يعتمد على: 12
  15  feat(results): payload new fields             يعتمد على: 12
```

---

# ⚠️ ملاحظات حرجة

1. **`allergyProfile.families`** — يُجمع من المستخدم لكن **لا يُستخدم** لا للحذف ولا للـscoring. يبقى في البيانات للمستقبل.

2. **`src/content/index.ts`** — المفاتيح القديمة لـStep3 (`level1Question`, `level2Question`, إلخ) تبقى مؤقتاً. أضف تعليق `// DEPRECATED: use messages/*.json quiz.step3.* instead` فوق القسم.

3. **`scentPyramid` في DB** — إذا كانت `null` لأغلب العطور، `NotesSimilarity=0` دائماً والقيمة الفعلية للمعادلة محدودة. تحقق: `SELECT COUNT(*) FROM perfumes WHERE "scentPyramid" IS NOT NULL`.

4. **`SafetyWarnings.tsx`** (`src/components/SafetyWarnings.tsx`) — **orphan، لا يُستخدم في هذه الخطة**. commit 09 يحلّ المشكلة عملياً بإضافة safety pill مباشرة في `PerfumeCard.tsx`. إذا أردت استخدام `SafetyWarnings.tsx` مستقبلاً: افحص محتواه أولاً (`cat src/components/SafetyWarnings.tsx`) ثم قرر دمجه في `MatchSheet` أو `IngredientsSheet`. حتى ذلك الحين، **لا تلمسه ولا تستورده**.

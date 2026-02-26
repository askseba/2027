# File Impact Analysis — Fragrance Quiz Planned Changes

This document lists **CREATE / MODIFY / READ** per change, **complexity**, **shared types**, **QuizContext** additions, **components affected by Safety badges**, and the **data flow** from QuizContext → API → matching → Results.

---

## Data flow (reference)

```
QuizContext (data)
  → ResultsContent.fetchResults() builds payload
  → POST /api/match { preferences: { likedPerfumeIds, dislikedPerfumeIds, allergyProfile } }
  → src/app/api/match/route.ts
      - Gets perfumes (searchUnified or fallback perfumes.ts)
      - enrichWithIFRA(perfume, userSymptoms)
      - toPerfumeForMatching() → PerfumeForMatching (scentPyramid: null today)
      - Builds likedPerfumesFamilies from liked perfumes (families only today)
      - userPreference = { likedPerfumesFamilies, dislikedPerfumeIds, allergyProfile }
  → calculateMatchScores(allPerfumes, userPreference) in src/lib/matching.ts
      - buildUserScentDNA(likedPerfumesFamilies)
      - calculateTasteScore(perfume.families, userScentDNA)  // families only
      - calculateSafetyScore(..., userPreference.allergyProfile)  // 0 or 100
      - calculateFinalMatchScore(taste, safety)
  → Response: { perfumes: ScoredPerfume[], blurredItems, tier }
  → ResultsContent / ResultsGrid
  → PerfumeCard, MatchSheet, IngredientsSheet, RadarGauge, SafetyWarnings
     (consume finalScore, tasteScore, safetyScore, exclusionReason, ifraScore)
```

---

## Phase 0 — Bug fixes

### 1. Fix symptom ID mismatch: `rash` (Step3 UI) vs `redness`/`itching` (symptom-mappings)

- **Problem:** Step3 Level 1 uses `id: 'rash'`; `symptom-mappings.ts` and IFRA/symptom.service use `redness` and `itching`. Stored value `rash` never matches mapping/DB.
- **CREATE:** None.
- **MODIFY:**
  - `src/components/quiz/Step3Allergy.tsx` — Either change the single symptom option to two options with ids `redness` and `itching`, or keep one UI option but store both ids when “احمرار أو حكة” is selected (e.g. map `rash` → `['redness','itching']` when saving to context).
  - **Recommended:** Replace the single `rash` option with two options: `redness` (احمرار) and `itching` (حكة), so stored symptoms align with `symptom-mappings` and IFRA.
- **READ:**
  - `src/data/symptom-mappings.ts` (symptom ids: redness, itching, etc.)
  - `src/app/[locale]/quiz/step3-allergy/page.tsx` (symptoms → step3_allergy.symptoms)
  - `src/lib/matching.ts` (calculateSafetyScore uses allergyProfile.symptoms)
  - `src/lib/services/symptom.service.ts`, `src/lib/data/ifra/eu-allergens-2023.ts` (symptom ids)
- **Complexity:** Low (localized change; ensure no other code assumes `rash`).

---

### 2. Create missing `/[locale]/quiz/page.tsx` (Back from Step1 → 404)

- **Problem:** Step1 uses `<BackButton href="/quiz" ... />` but there is no `src/app/[locale]/quiz/page.tsx`, so Back leads to 404.
- **CREATE:**
  - `src/app/[locale]/quiz/page.tsx` — Quiz intro/landing (e.g. “Start quiz” → step1-favorites). Can be minimal (title + CTA) or reuse existing quiz intro content if present elsewhere.
- **MODIFY:** None required for the route to exist; optionally update BackButton href to a named route if you add one.
- **READ:**
  - `src/app/[locale]/quiz/step1-favorites/page.tsx` (BackButton href="/quiz")
  - `src/i18n/routing.ts` (locale prefix)
- **Complexity:** Low.

---

### 3. Move hardcoded Arabic strings in Step3Allergy.tsx to i18n keys

- **Problem:** Step3Allergy has hardcoded Arabic in the `symptoms`, `families`, and `ingredients` arrays (titles, descriptions, names, examples).
- **CREATE:** None (use existing content/i18n).
- **MODIFY:**
  - `src/components/quiz/Step3Allergy.tsx` — Replace hardcoded strings with `useTranslations('quiz.step3')` (or content) keys for: symptom title/desc, family name/examples, ingredient name. Keep `id` values as-is for logic.
  - `src/content/index.ts` — Add keys for step3 symptoms (by id), families (by id), ingredients (by id), e.g. `step3.symptoms.sneeze.title`, `step3.symptoms.sneeze.desc`, `step3.families.floral.name`, `step3.ingredients.jasmine.name`. If the app uses `messages/ar.json` and `messages/en.json` for next-intl, add same keys there instead of or in addition to content.
- **READ:**
  - `src/components/quiz/Step3Allergy.tsx` (all inline Arabic)
  - `src/content/index.ts` (quiz.step3 shape)
  - `messages/ar.json`, `messages/en.json` (if used for quiz)
- **Complexity:** Medium (many strings; ensure keys exist for all ids and both locales).

---

## Phase 1 — Algorithm (matching.ts)

### 4. Taste score: Family 60% + Notes from scentPyramid 40% (instead of families only)

- **CREATE:** None.
- **MODIFY:**
  - `src/lib/matching.ts` — Change taste scoring:
    - Extend `UserPreferenceForMatching` (or build an internal structure) to include “liked notes” (from liked perfumes’ `scentPyramid.top/heart/base`).
    - New `calculateTasteScore(perfume, userScentDNA, userLikedNotes?)` (or two sub-scores): family part 60%, note part 40% (e.g. Jaccard on notes). Keep `buildUserScentDNA` for family set; add a “liked notes” set from liked perfumes’ pyramids.
  - `src/app/api/match/route.ts` — When building `userPreference`, pass “liked notes” from liked perfumes’ `scentPyramid` (once pipeline provides it; see #6).
- **READ:**
  - `src/lib/matching.ts` (calculateTasteScore, buildUserScentDNA, calculateMatchScores)
  - `src/types/matching.ts` (if you add types for note-based preference)
- **Complexity:** Medium (formula change + wiring liked notes from API into matching).

---

### 5. Safety score: 3-tier (0 / 50 / 100) instead of binary (0 / 100)

- **CREATE:** None.
- **MODIFY:**
  - `src/lib/matching.ts` — In `calculateSafetyScore`, return three tiers, e.g. 100 (no trigger), 50 (low risk / partial match), 0 (clear trigger). Define rules (e.g. ingredient match → 0, symptom trigger match → 50 or 0 by severity). Update `calculateFinalMatchScore` if weights stay 0.7/0.3 (no signature change needed).
  - **UI that shows safety:** Treat 50 as “caution” so badges/bars show three states.
- **READ:**
  - `src/lib/matching.ts` (calculateSafetyScore, calculateFinalMatchScore, ScoredPerfume)
  - All consumers of `safetyScore` (see “Components consuming matching results” below).
- **Complexity:** Medium (algorithm + all safety UIs).

---

### 6. Pass scentPyramid notes from liked perfumes through the match API pipeline

- **CREATE:** None.
- **MODIFY:**
  - `src/app/api/match/route.ts` — In `toPerfumeForMatching`, set `scentPyramid` from enriched perfume when available (e.g. `enriched.scentPyramid ?? null`). When building `userPreference`, collect all notes from liked perfumes’ `scentPyramid` (top/heart/base) into a list/set and pass to matching (for change #4).
  - `src/lib/services/perfume-bridge.service.ts` (or `.ts.fixed` / restored service) — Ensure `searchUnified` / `enrichWithIFRA` (or the shape returned to the route) expose `scentPyramid: { top, heart, base }` per perfume where available (Fragella/DB).
  - `src/lib/matching.ts` — Accept “liked notes” in preference and use in taste score (see #4).
- **READ:**
  - `src/app/api/match/route.ts` (toPerfumeForMatching, building userPreference)
  - `src/lib/matching.ts` (UserPreferenceForMatching, calculateTasteScore)
  - Perfume data source (perfume.service, perfume-bridge, Fragella, prisma) for scentPyramid shape.
- **Complexity:** High (data must flow from source → route → matching; bridge is currently deleted, restore or use .fixed).

---

## Phase 2 — UX

### 7. Allergy gateway at start of Step3: “Have you ever had a reaction to perfume?”

- **CREATE:** None (or a small sub-component for the gateway screen).
- **MODIFY:**
  - `src/components/quiz/Step3Allergy.tsx` — Add an initial “gateway” step (e.g. Level 0): one question “هل سبق وأصابتك ردة فعل من عطر؟” with Yes / No. If No, skip Level 1–3 and call `onNext()` with empty allergy; if Yes, show current Level 1–3 flow. Optionally store the answer in context for analytics/conditional logic.
  - `src/contexts/QuizContext.tsx` — Optionally add `step3_allergy.hasReaction?: boolean` (or keep gateway only in UI and derive “skipped” from empty symptoms/families/ingredients).
  - `src/app/[locale]/quiz/step3-allergy/page.tsx` — No change if gateway is inside Step3Allergy; if you persist gateway answer, pass it to/from context.
  - i18n/content: add gateway question and Yes/No labels.
- **READ:**
  - `src/components/quiz/Step3Allergy.tsx` (level flow, onNext)
  - `src/contexts/QuizContext.tsx` (step3_allergy shape)
- **Complexity:** Low–Medium (one extra step and optional context field).

---

### 8. Make dislike reason mandatory in Step2 (3 options: heavy / chemical / personal)

- **CREATE:** None.
- **MODIFY:**
  - `src/contexts/QuizContext.tsx` — Extend `step2_disliked` to store reason per disliked perfume, e.g. `step2_disliked: string[]` plus `step2_dislike_reasons?: Record<string, 'heavy'|'chemical'|'personal'>` or `step2_entries: { id: string, reason: string }[]`. Update `isComplete` and any code that only checks `step2_disliked` length.
  - `src/app/[locale]/quiz/step2-disliked/page.tsx` — When user adds a perfume to “disliked”, show 3 quick options (heavy/chemical/personal); require one before “Next” (or before counting that perfume). Persist reasons in context; keep sending `dislikedPerfumeIds` to API (reasons can be used later for analytics or filtering).
  - `src/app/api/match/route.ts` — No change for now (reasons “display only”); later you could send `dislikeReasons` in body if you use them in matching.
  - i18n: add keys for the three options and any “select a reason” message.
- **READ:**
  - `src/app/[locale]/quiz/step2-disliked/page.tsx` (state, sessionStorage, setStep)
  - `src/contexts/QuizContext.tsx` (QuizData, setStep, isComplete)
  - `src/components/results/ResultsContent.tsx` (payload uses step2_disliked only)
- **Complexity:** Medium (context shape change + UI for reasons + validation).

---

### 9. Reference perfume selection after Step1 (badge only, not in formula yet)

- **CREATE:** None.
- **MODIFY:**
  - `src/contexts/QuizContext.tsx` — Add e.g. `step1_reference_perfume_id: string | null` (one reference perfume). Set when user selects “reference” on one of the liked perfumes (or a separate picker after Step1).
  - `src/app/[locale]/quiz/step1-favorites/page.tsx` (or a “post–Step1” screen) — Add UI to choose “reference perfume” from the list (or from a dropdown); save to context. Show badge on results or profile: “Reference: [Name].”
  - Results or profile component — Display badge only; do not send to `/api/match` yet.
- **READ:**
  - `src/contexts/QuizContext.tsx` (QuizData)
  - `src/app/[locale]/quiz/step1-favorites/page.tsx` (selected perfumes, navigation)
- **Complexity:** Low (context + UI + badge; no algorithm change).

---

### 10. Context questions before Step1: climate + purpose (badge only, not in formula)

- **CREATE:**
  - `src/app/[locale]/quiz/context/page.tsx` (or `step0-context/page.tsx`) — New page: “Climate” and “Purpose” (e.g. daily/evening/sport), display-only for now. Navigate to Step1 on submit.
  - Optional: `src/components/quiz/ContextQuestions.tsx` — Reusable form for climate + purpose.
- **MODIFY:**
  - `src/contexts/QuizContext.tsx` — Add e.g. `context: { climate?: string, purpose?: string }` to QuizData and defaultData.
  - Entry point to quiz — Link “Start quiz” to context page first, then context page links to `/quiz/step1-favorites`. Alternatively add context at top of Step1.
  - Results or header — Show badges for climate and purpose (no API change).
- **READ:**
  - `src/app/[locale]/quiz/step1-favorites/page.tsx` (or main quiz entry)
  - `src/contexts/QuizContext.tsx` (QuizData)
  - Routing: `src/app/[locale]/quiz/*`, `src/i18n/routing.ts`
- **Complexity:** Medium (new route, context shape, navigation flow, badges).

---

## Shared types / interfaces

- **`src/types/matching.ts`**  
  - Currently defines a different `PerfumeForMatching` (with `stages`, `source`) than `src/lib/matching.ts` (which has `scentPyramid`, `ingredients`, `symptomTriggers`). The API and `ResultsContent` use the type from `src/lib/matching.ts`. Recommendation: align or re-export from one place; add `likedNotes?: string[]` (or similar) to the preference type when you implement #4 and #6.
- **`src/lib/matching.ts`**  
  - `UserPreferenceForMatching`: add optional `likedNotes?: string[]` (or `likedNoteIds?: string[]`) for taste-by-notes.
  - `ScoredPerfume`: already has `safetyScore`; ensure 3-tier (0/50/100) is documented; UI may add a `safetyTier?: 'safe'|'caution'|'unsafe'` for convenience.
- **`QuizData` (QuizContext)**  
  - Add: `step1_reference_perfume_id?: string | null`, `step2_dislike_reasons?: Record<string, 'heavy'|'chemical'|'personal'>` (or array of { id, reason }), `context?: { climate?: string, purpose?: string }`, and optionally `step3_allergy.hasReaction?: boolean`.

---

## Components that consume matching results (Safety / score)

These need to support **3-tier safety** (0 / 50 / 100) and possibly new labels:

| File | What it uses | Change for 3-tier safety |
|------|----------------|---------------------------|
| `src/components/ui/RadarGauge.tsx` | `safetyScore` (0 or 100), comment says "0 أو 100" | Support 0/50/100; bar color: e.g. green 100, yellow 50, red 0. |
| `src/components/ui/PerfumeCard.tsx` | `perfumeData?.safetyScore`, passes to RadarGauge | No logic change; RadarGauge handles display. |
| `src/components/results/MatchSheet.tsx` | `perfume.safetyScore`, bar and label “الأمان (30%)” | Use three colors/labels for 100 / 50 / 0 (e.g. آمن / حذر / غير موصى). |
| `src/components/results/IngredientsSheet.tsx` | `ifraScore` (IFRA), not algorithm safetyScore | Optional: show algorithm safetyScore as well or keep IFRA only. |
| `src/components/SafetyWarnings.tsx` | `ifraScore`, warnings | If you surface algorithm safety here, add branch for 50 (caution). |
| `src/components/ResultsGrid.tsx` | `isSafe` from `(perfume.safetyScore ?? …) >= 70` | Update threshold: e.g. safe = 100, caution = 50, unsafe = 0. |

---

## QuizContext — new fields summary

| Field | Phase | Purpose |
|-------|--------|---------|
| `step3_allergy.hasReaction` | 7 | Optional; gateway “ever had a reaction” (Yes/No). |
| `step2_dislike_reasons` | 8 | Mandatory reason per disliked perfume: heavy / chemical / personal. |
| `step1_reference_perfume_id` | 9 | One reference perfume; badge only. |
| `context` | 10 | `{ climate?, purpose? }`; badge only. |

Existing: `step1_liked`, `step2_disliked`, `step3_allergy: { symptoms, families, ingredients }`. SessionStorage merge in `QuizContext` must be updated for any new keys so hydration and “resume quiz” stay correct.

---

## Complexity summary

| # | Change | Complexity |
|---|--------|------------|
| 1 | Symptom ID mismatch (rash → redness/itching) | Low |
| 2 | Create `[locale]/quiz/page.tsx` | Low |
| 3 | Step3Allergy Arabic → i18n | Medium |
| 4 | Taste: Family 60% + Notes 40% | Medium |
| 5 | Safety 3-tier 0/50/100 | Medium |
| 6 | scentPyramid through match pipeline | High |
| 7 | Allergy gateway question | Low–Medium |
| 8 | Dislike reason mandatory (3 options) | Medium |
| 9 | Reference perfume (badge only) | Low |
| 10 | Context questions climate + purpose (badge only) | Medium |

---

*Generated from the current project structure; paths and imports are from the workspace root.*

# Fragrance Quiz System — Complete Audit

**Date:** 2026-02-23  
**Scope:** Next.js fragrance quiz flow from "Start Quiz" to Results. Documentation only — no code changes.

---

## A. USER FLOW MAP

| Screen | Route/URL | Component file path | What the user sees and does | Data collected | Transition to next |
|--------|-----------|---------------------|-----------------------------|----------------|--------------------|
| **Entry: Start Quiz** | Home: `/[locale]` (e.g. `/ar`) | `src/components/landing/CTASection.tsx` | CTA button (e.g. "ابدأ الاختبار"). On click: `router.push('/quiz/step1-favorites')`. | None | Click → navigate to Step 1. |
| **Quiz intro (landing)** | `/[locale]/quiz` | **NOT FOUND IN CODE.** Only `src/app/_archived/pages/quiz/page.tsx` exists (renders `QuizLandingContent`). Active app has no `[locale]/quiz/page.tsx`. | N/A in active app. BackButton on Step 1 links to `/quiz` — that route has no page in active app (likely 404). | N/A | N/A |
| **Step 1 — Favorites** | `/[locale]/quiz/step1-favorites` | `src/app/[locale]/quiz/step1-favorites/page.tsx` | Title/description (i18n `quiz.step1`), search bar (min 2 chars), voice search (if enabled), selected perfumes list (3–12). Next disabled until ≥3 selected. | `selectedPerfumes` (id, name, brand, image). Persisted: `sessionStorage['quiz-step1']` (full objects), QuizContext `step1_liked` (IDs only). | Click "Next" with ≥3 → `router.push('/quiz/step2-disliked')`. |
| **Step 2 — Disliked** | `/[locale]/quiz/step2-disliked` | `src/app/[locale]/quiz/step2-disliked/page.tsx` | Title/description (i18n `quiz.step2`), search bar, disliked list (0 or 3–12). Can skip. | `selectedPerfumes` (same shape). Persisted: `sessionStorage['quiz-step2-data']`, `sessionStorage['quiz_step2']` (IDs), QuizContext `step2_disliked` (IDs). | Next (≥3 or 0) or Skip → `router.push('/quiz/step3-allergy')`. Back → `router.push('/[locale]/quiz/step1-favorites')`. |
| **Step 3 — Allergy** | `/[locale]/quiz/step3-allergy` | `src/app/[locale]/quiz/step3-allergy/page.tsx` → `Step3Allergy` from `src/components/quiz/Step3Allergy.tsx` | Three levels: (1) Symptoms (sneeze, rash, headache, nausea, none), (2) Families (floral, citrus, woody, spicy, gourmand, leather), (3) Ingredients (jasmine, rose, oud, etc.). Level titles from `content.quiz.step3`. "Save" / Next goes to results. | Level1 → `symptoms`, Level2 → `families`, Level3 → `ingredients`. Stored in QuizContext `step3_allergy: { symptoms, families, ingredients }`. | Next (any selection or empty) → `router.push('/results')`. Back → `router.push('/quiz/step2-disliked')`. |
| **Results** | `/[locale]/results` | `src/app/[locale]/results/page.tsx` → `ResultsContent` from `src/components/results/ResultsContent.tsx` | Hero (badge, title, summary counts by score bands, source label), grid of `PerfumeCard`s, compare bar, CompareBottomSheet, IngredientsSheet, MatchSheet, UpsellCard (if not PREMIUM). | None (consumes quiz state from context). | Data comes from POST `/api/match` with `quizData` from QuizContext. |

**Notes:**

- Step 1 and Step 2 search call `GET /api/perfumes/search?q=...` (or POST with body). Results come from `searchUnified()` (local + Fragella when API key set).
- Step 3 options (symptoms, families, ingredients) are **hardcoded in Arabic** in `Step3Allergy.tsx` (e.g. `symptoms`, `families`, `ingredients` arrays). No i18n for option labels; only headings use `content.quiz.step3`.
- Quiz step guard: `useQuizStepGuard(3)` on Step 3 page redirects to step1 if `step1_liked.length < 3`, or to step2 if step2 is "incomplete" (1–2 disliked). Step 2 "done" = 0 or ≥3 disliked.

---

## B. DATA SCHEMA

**Fragrance record in database (Prisma `Perfume` model) — as defined in code:**

| Field | Type | In schema | Populated in practice |
|-------|------|-----------|------------------------|
| id | string (cuid) | ✓ | ✓ |
| name | string | ✓ | ✓ |
| brand | string | ✓ | ✓ |
| image | string | ✓ | ✓ |
| description | string? | ✓ | Optional |
| price | float? | ✓ | Optional |
| baseScore | int (default 50) | ✓ | ✓ |
| scentPyramid | string? (JSON) | ✓ | Not used in quiz/match flow in code — EMPTY/unused ✗ |
| families | string (default "[]") | ✓ | JSON array string; used in matching ✓ |
| ingredients | string (default "[]") | ✓ | JSON array string; used ✓ |
| symptomTriggers | string (default "[]") | ✓ | JSON array; used for safety ✓ |
| isSafe | boolean (default true) | ✓ | ✓ |
| status | string (default "safe") | ✓ | ✓ |
| variant | string? | ✓ | Optional |
| createdAt / updatedAt | DateTime | ✓ | ✓ |

**In-memory / API shapes used by quiz:**

- **Local perfumes** (`src/lib/data/perfumes.ts`): Same logical fields; `families`, `ingredients`, `symptomTriggers` as arrays; no Prisma. IDs are string digits ('1'–'19').
- **Unified / match pipeline**: `PerfumeForMatching` in `src/lib/matching.ts` includes `scentPyramid: { top, heart, base } | null`; API builds this from enriched perfumes. `family_vector` — NOT FOUND IN CODE. No `ifra_allergens` array on Perfume model; IFRA data lives in `IfraMaterial` and `PerfumeIngredient` (separate tables).

**Fragella-related:**

- `FragellaPerfume`: id, fragellaId, name, brandName, payloadJson, fetchedAt, expiresAt. Fragrance payload is in `payloadJson` (not mapped field-by-field in schema).
- `FragellaCache`: key, data (JSON), expiresAt — used for search result caching.

---

## C. ALGORITHM AUDIT

**Location:** `src/lib/matching.ts` (and types in `src/types/matching.ts`; match API uses `src/lib/matching.ts`).

**Inputs:**

- `perfumes`: array of `PerfumeForMatching` (id, name, brand, image, description, price, families[], ingredients[], symptomTriggers[], isSafe, status, variant, scentPyramid).
- `userPreference`: `{ likedPerfumesFamilies: string[], dislikedPerfumeIds: string[], allergyProfile: { symptoms, families, ingredients } }`.

**User profile ("Scent DNA"):**

- **Formula:** Set of family strings from all liked perfumes.  
- **Code:** `buildUserScentDNA(userPreference.likedPerfumesFamilies)` (line 163) → `new Set(likedPerfumesFamilies.map(f => f.toLowerCase()))`.  
- **Where:** `src/lib/matching.ts` lines 163–165.  
- No explicit "profile vector"; the profile is this set of family names.

**Matching / scoring:**

1. **Disliked exclusion** (lines 186–195): If `perfume.id` is in `dislikedPerfumeIds` → return score 0, `isExcluded: true`, reason "في قائمة العطور غير المفضلة". Excluded items are **removed** from final list (filter at line 251).
2. **Family allergy exclusion** (lines 198–212): If perfume’s `families` (lowercased) intersect with `allergyProfile.families` (lowercased) → score 0, `isExcluded: true`, reason "ينتمي لعائلة X المسببة للحساسية". Excluded items removed.
3. **Taste score** (lines 88–102, 214): `calculateTasteScore(perfume.families, userScentDNA)` = Jaccard similarity (intersection/union) of family sets × 100; if user set empty, returns 50. **Code:** `jaccardSimilarity(perfumeSet, userSet)` in `src/lib/matching.ts` lines 71–78.
4. **Safety score** (lines 113–139, 217–222): `calculateSafetyScore(perfume.ingredients, perfume.symptomTriggers, userAllergies)`:
   - If any `userAllergies.symptoms` appears in `perfumeSymptomTriggers` (lowercased) → 0, reason "يسبب {symptom}".
   - If any `userAllergies.ingredients` appears in `perfumeIngredients` (lowercased) → 0, reason "يحتوي على {ingredient}".
   - Else 100.
   - When safety is 0: perfume is **not** excluded; it gets `finalScore = tasteScore * 0.7`, `isExcluded: false`, `exclusionReason: safetyReason` (shown with warning).
5. **Final score** (lines 145–154, 236): `(tasteScore * 0.7) + (safetyScore * 0.3)`, rounded.  
   **Formula:** Taste 70%, Safety 30%.

**Output:**

- Array of `ScoredPerfume` (perfume fields + finalScore, tasteScore, safetyScore, isExcluded, exclusionReason; optionally ifraScore, symptomTriggers, ifraWarnings, source, fragellaId).
- Sorted by `finalScore` descending, then `name` (localeCompare 'ar'). Excluded perfumes filtered out (line 251).

**Where each step runs:**

- Build Scent DNA: `src/lib/matching.ts` ~181, 163–165.  
- Dislike/family checks: 186–212.  
- Taste: 214, 88–102, 71–78.  
- Safety: 217–222, 113–139.  
- Final score: 236, 145–154.  
- Sort/filter: 250–256.  
- Match API calls this from `src/app/api/match/route.ts` (line 148: `calculateMatchScores(allPerfumes, userPreference)`).

---

## D. FARGELA INTEGRATION

**What data is pulled from Fargela:**

- **Search:** `GET https://api.fragella.com/api/v1/fragrances?search={query}&limit={limit}`. Returns list of fragrance objects (name, brand, image fields, notes/pyramid, main_accords, etc.).
- **Single perfume:** `GET https://api.fragella.com/api/v1/fragrances/{fragellaId}`. Fetched when resolving a `fragella-{id}` in bridge; result cached in DB (`FragellaPerfume`).

**When it is pulled:**

- **Runtime:**  
  - Quiz Step 1/2 search: `/api/perfumes/search` → `searchUnified()` → `searchPerfumesWithCache(query, limit)` in `perfume.service.ts`. If `FRAGELLA_API_KEY` set, Fragella is queried; results cached in `FragellaCache` (key `search:{query}:{limit}`, 24h).  
  - Match API: when `FRAGELLA_API_KEY` is set, `searchUnified(poolQuery || '', { includeFragella: true, includeLocal: true, limit: 2000 })` is called (empty query uses "perfume" or "popular"). So Fragella data is pulled at **request time** for match, not build time.
- **Manual import:** Not present; no seed/script for bulk Fragella import found.

**Where it is stored:**

- Search results: in-memory for the request; also `FragellaCache` (key, data JSON, expiresAt).
- Single fragrance: `FragellaPerfume` (fragellaId, name, brandName, payloadJson, fetchedAt, expiresAt). TTL 30 days in `perfume.service.ts`.

**How it maps to internal schema:**

- `convertFragellaToUnified()` in `perfume-bridge.service.ts` (lines 204–282): builds `UnifiedPerfume` with `id: 'fragella-{id}'`, fragellaId, name, brand, image (multiple possible API field names), price, families (from main_accords / Main Accords / olfactive_family), ingredients (from pyramid notes via `getIngredientsForNote()` from `note-to-ingredient-map.ts`), symptomTriggers [] (filled later by IFRA), stages/pyramid from top/middle/base notes. No direct mapping from Prisma `Perfume`; unified type extends `Perfume` from `perfumes.ts` and adds source, fragellaId, ifraScore, ifraWarnings, etc.

---

## E. IFRA INTEGRATION

**What IFRA data exists:**

- **Schema:** `IfraMaterial` (name, nameAr, casNumber, maxConcentration, unit, category, euRegulation, amendmentVersion, productCategory, symptoms [JSON], description). `SymptomIngredientMapping` (symptom, symptomAr, ingredient, confidence, severity, evidenceLevel, source). `PerfumeIngredient` (fragellaId, ingredientName, detectedFrom, isAllergen, relation to IfraMaterial).
- **Static logic:** `calculateIngredientsSafetyScore()` in `src/lib/services/ifra.service.ts` (lines 269–316): synchronous; uses **hardcoded** lists `knownAllergens` and `knownSensitizers` (no DB query). Score = 100 − (allergenCount×5 + sensitizerCount×10 + restricted×15), clamped 0–100. Warnings are Arabic strings (e.g. "مادة مسببة للحساسية").
- **Async DB service:** `IFRAService` in same file (checkSafety, getMaterialByName, getSymptomMappings, etc.) exists but is **not** used in the match/quiz path. Match pipeline uses only `calculateIngredientsSafetyScore` (and symptom.service for Fragella).

**Is it used for hard exclusions in the algorithm?**  
**NO.** The matching algorithm in `matching.ts` does **not** use IFRA or DB allergens for exclusion. It uses only:
- `dislikedPerfumeIds` (hard exclude),
- `allergyProfile.families` (hard exclude),
- `allergyProfile.symptoms` and `allergyProfile.ingredients` vs perfume’s `symptomTriggers` and `ingredients` (safety score 0 but perfume still shown with warning).

So IFRA data is used for **enrichment** (ifraScore, ifraWarnings) and display, not for removing perfumes from results.

**Where allergen/safety checking happens:**

- **Match API** (`src/app/api/match/route.ts`): For each perfume, `enrichWithIFRA(perfume, userSymptoms)` is called (lines 98–119). User symptoms come from `prefs.allergyProfile.symptoms`.
- **enrichWithIFRA** (`perfume-bridge.service.ts` lines 284–324): For local perfumes: `calculateIngredientsSafetyScore(perfume.ingredients)` → ifraScore, ifraWarnings. For Fragella: same + `calculateSymptomMatchScore(ingredients, userSymptoms)` from `symptom.service.ts` to set `symptomTriggers`.
- **calculateSafetyScore** (`matching.ts` 113–139): Compares `userAllergies.symptoms` to `perfume.symptomTriggers` and `userAllergies.ingredients` to `perfume.ingredients`. So allergen checking in the **algorithm** is based on quiz inputs (symptoms/ingredients/families) and the perfume’s enriched ingredients/triggers, not on IfraMaterial DB table.

**When user selects an allergen — exact code path:**

1. User selects Step 3 options (symptoms, families, ingredients) in `Step3Allergy.tsx` → `updateAllergy()` → `setStep('step3_allergy', { symptoms, families, ingredients })` (page.tsx 59–64). Stored in QuizContext and sessionStorage `quizData`.
2. Results: `ResultsContent` sends `quizData.step3_allergy` as `allergyProfile` in POST `/api/match` (lines 52–57).
3. Match route (69–72): `allergyProfile = { symptoms, families, ingredients }`.
4. Route builds `userPreference` (142–146) with this `allergyProfile`.
5. `calculateMatchScores(allPerfumes, userPreference)` (148):  
   - Family: any perfume whose `families` include an allergy family → excluded (0, not in list).  
   - Safety: `calculateSafetyScore(perfume.ingredients, perfume.symptomTriggers, userPreference.allergyProfile)` — if user symptom in perfume’s symptomTriggers or user ingredient in perfume’s ingredients → safety 0, reason set; perfume still included with reduced score and reason.  
6. Enrichment: `enrichWithIFRA(perfume, userSymptoms)` uses `allergyProfile.symptoms` to compute `symptomTriggers` for Fragella perfumes and passes ingredients through `calculateIngredientsSafetyScore` for ifraScore/ifraWarnings.

**Step 3 option IDs:** Step 3 uses IDs like `sneeze`, `rash`, `headache`, `nausea`, `none` for symptoms; `floral`, `citrus`, etc. for families; `jasmine`, `rose`, etc. for ingredients. `symptom-mappings.ts` has entries for `sneeze`, `headache`, `nausea` (and others). Family/ingredient IDs are compared case-insensitively in matching (families and ingredients arrays). So the path is consistent.

---

## F. BILINGUAL IMPLEMENTATION

**i18n library/approach:**  
`next-intl`. Routing: `src/i18n/routing.ts` (locales `ar`, `en`, default `ar`, localePrefix `always`). Translation keys from namespaces (e.g. `quiz`, `quiz.step1`, `results`). No separate "Fargela" i18n; Fragella is a data source label.

**Which fields in the fragrance schema have Arabic versions:**  
- Prisma `Perfume`: no nameAr/brandAr.  
- `IfraMaterial`: has `nameAr`.  
- `SymptomIngredientMapping`: has `symptomAr`.  
- Local perfumes in `perfumes.ts`: `description` is Arabic in data; name/brand are English.  
- Fragella payload: name/brand as returned by API (often English); no schema-level Arabic field.

**Fragrance family names translated?**  
No. Matching uses raw family strings (e.g. from Fragella main_accords or local `families`). Step 3 **family** options are hardcoded Arabic in `Step3Allergy.tsx` (e.g. "زهرية", "حمضية"). No translation key for these; English locale still shows Arabic labels for step 3 options.

**Note names translated?**  
Not in schema. Pyramid/notes from Fragella are used as-is. Note-to-ingredient map uses English keys. Display of notes in UI (e.g. IngredientsSheet) shows whatever is in the perfume object (often English).

**What is NOT translated that might be expected:**  
- Step 3 options: symptoms (عطاس أو احتقان, etc.), families (زهرية, حمضية, etc.), ingredients (ياسمين, ورد, etc.) — all hardcoded Arabic; no English variant.  
- Match labels in `getMatchStatus()` in `matching.ts`: "ممتاز", "جيد جداً", "مقبول", "ضعيف" — hardcoded Arabic.  
- Results hero source line: "🟢 Fragella + IFRA (5K+ عطور)" / "🟡 Demo Mode (19 عطر)" — hardcoded.  
- Various aria-labels and button labels in Step3Allergy (e.g. "حفظ بصمة العطر") — hardcoded Arabic.  
- `content` in `src/content/index.ts`: single object in Arabic; no locale switch. So quiz titles, step titles, buttons come from this one object; English UI would still get Arabic strings unless next-intl keys override elsewhere.  
- Results card/compare/ingredients use `useTranslations('results...')` so those can be bilingual if messages are defined for `en`.

---

## G. STATE MANAGEMENT

**Where state is initialized:**  
- **QuizContext** (`src/contexts/QuizContext.tsx`): Default `QuizData`: `step1_liked: []`, `step2_disliked: []`, `step3_allergy: { symptoms: [], families: [], ingredients: [] }`. On mount (useEffect), state is restored from `sessionStorage.getItem('quizData')` and merged with legacy keys `quiz-step1`, `quiz_step2`, `quiz-step2-data`.  
- Step 1 page: local `selectedPerfumes` also initialized from `sessionStorage['quiz-step1']` (full objects).  
- Step 2 page: local `selectedPerfumes` from `sessionStorage['quiz-step2-data']`.  
- Step 3 page: local `allergy` state initialized from `data.step3_allergy` (QuizContext).

**What is stored after each step:**  
- **After Step 1:** QuizContext `step1_liked` = array of perfume IDs. sessionStorage: `quizData` (full object), `quiz-step1` (array of { id, name, brand, image }).  
- **After Step 2:** QuizContext `step2_disliked` = array of IDs. sessionStorage: `quizData`, `quiz-step2-data` (objects), `quiz_step2` (IDs).  
- **After Step 3:** QuizContext `step3_allergy` = { symptoms, families, ingredients }. sessionStorage: `quizData` only (no separate key for step3).

**How state reaches results calculation:**  
Results page renders `ResultsContent`. It reads `useQuiz().data` (quizData). On load, `fetchResults()` runs: POST `/api/match` with body `{ preferences: { likedPerfumeIds: quizData.step1_liked, dislikedPerfumeIds: quizData.step2_disliked, allergyProfile: quizData.step3_allergy } }`. No server component passing; all client-side from context.

**What state is lost on refresh:**  
- **Lost:** In-memory React state (e.g. selectedPerfumes arrays on step pages) is re-initialized from sessionStorage on mount, so if sessionStorage is intact, step selections are restored.  
- **Lost if sessionStorage cleared or new tab:** Full quiz state (quizData) is only in sessionStorage and context. No persistence to DB for guests. So refresh in same tab keeps state; new tab or cleared storage loses it.  
- **Not sent to server** until "See results" (navigate to results and call match API). No intermediate save of quiz progress to backend.

---

## H. RESULTS PAGE

**What the results page displays and source of each:**

| Element | Source | Hardcoded vs dynamic |
|--------|--------|----------------------|
| Back link (backToDashboard) | `t('backToDashboard')`, href `/[locale]/dashboard` | i18n, dynamic locale |
| Hero badge | `t('hero.badge')` | i18n |
| Hero title | `t('hero.title')` | i18n |
| Summary strip (excellent/good/fair counts) | Counts of `scoredPerfumes` by bands (≥80, 60–79, 40–59); labels `t('heroExcellent')`, `t('heroGood')`, `t('heroFair')` | Dynamic from API; labels i18n |
| Source indicator | "🟢 Fragella + IFRA (5K+ عطور)" if fragellaCount>0 or total>19, else "🟡 Demo Mode (19 عطر)" | Hardcoded Arabic text; logic from `scoredPerfumes` and `fragellaCount` |
| Hero description | `t('hero.description')` | i18n |
| Result cards | Each item in `scoredPerfumes` → `PerfumeCard` with id, name, brand, image, finalScore, tasteScore, safetyScore, ifraScore, symptomTriggers, ifraWarnings, source, etc. | All from API/match response |
| "Poor match" label on card (finalScore < 40) | `t('poorMatch')` | i18n |
| Compare bar | Shown when `compareIds.length > 0`; title/subtitle from `t('compare.title')`, `t('compare.count', { count })`; cancel/action buttons | i18n |
| Compare bottom sheet | CompareBottomSheet with comparePerfumes or price-hub perfume; tier; MOCKSTORES for price hub | Perfume data from state; store list hardcoded in CompareBottomSheet |
| Ingredients sheet | IngredientsSheet(ingredientsPerfume); shows perfume.ingredients, ifraWarnings, etc. | From scored perfume object |
| Match sheet | MatchSheet(matchPerfume); getMatchStatus(perfume.finalScore) for label/status | finalScore from API; labels from getMatchStatus (hardcoded Arabic) |
| Upsell (mid-grid, index 3) | When tier === 'FREE'; UpsellCard with remainingCount, averageMatch from blurredItems | Tier and blurredItems from API |
| Upsell (bottom) | When tier !== 'PREMIUM'; UpsellCard with blurredItems.length and average match | Same |
| Locked/blurred count | `blurredItems.length`; visible count = `scoredPerfumes.length`; limit from gating (GUEST 3, FREE 5, PREMIUM 12) | From API (tier, perfumes, blurredItems) and gating.ts |

**Exact source of key values:**  
- `scoredPerfumes`, `blurredItems`, `tier`: POST `/api/match` response (`data.perfumes`, `data.blurredItems`, `data.tier`).  
- Limits: `getResultsLimit(tier)` and `getBlurredCount(tier)` in `gating.ts` (GUEST 3+9 blurred, FREE 5+7, PREMIUM 12+0).  
- Score breakdown (taste/safety): from `ScoredPerfume.tasteScore`, `safetyScore`, `finalScore` computed in `calculateMatchScores`.  
- IFRA on card: `ifraScore`, `ifraWarnings`, `symptomTriggers` attached in match route after `enrichWithIFRA`.

---

## STEP 3 — GAP ANALYSIS

| Component | Current State | Required State | Severity |
|-----------|---------------|----------------|----------|
| Quiz landing page (`/[locale]/quiz`) | No page in active app; only in _archived. BackButton on Step 1 links to `/quiz` → 404. | Dedicated quiz intro page rendering QuizLandingContent at `[locale]/quiz`. | **IMPORTANT** |
| Step 1 – search empty query | GET /api/perfumes/search returns empty array when q empty (no pool). | Optional: return popular/demo list when query empty for discovery. | MINOR |
| Step 3 – option labels i18n | Symptoms, families, ingredients labels hardcoded Arabic in Step3Allergy. | Keys in messages (ar/en) and useTranslations for option labels. | **IMPORTANT** |
| Step 3 – symptom/family/ingredient IDs vs IFRA | Step 3 uses simple IDs (sneeze, floral, jasmine). Matching uses them; symptom.service uses symptom-mappings (sneeze, headache, etc.). | Align Step 3 IDs with symptom-mappings and ingredient lists used in safety so no mismatch. | MINOR (already aligned for main cases) |
| Match algorithm – IFRA hard exclusion | Algorithm does not exclude by IFRA/DB allergens; only by user allergy profile vs perfume ingredients/triggers. | If product requirement is "hard exclude IFRA allergens", add exclusion step using IfraMaterial/PerfumeIngredient or equivalent. | **CRITICAL** only if business requires it |
| IFRA – synchronous safety score | calculateIngredientsSafetyScore uses hardcoded allergen/sensitizer lists; no DB. | Use IFRAService.checkSafety (DB) for accurate IFRA-based scoring if data is seeded. | **IMPORTANT** |
| Fragella – when pulled for match | Match API calls Fragella at request time (searchUnified with high limit). | Consider build-time or periodic sync if scale/cost requires. | MINOR |
| Results – match status labels | getMatchStatus returns Arabic only ("ممتاز", "جيد جداً", etc.). | i18n keys for match status by locale. | **IMPORTANT** |
| Results – source indicator text | "Fragella + IFRA (5K+ عطور)" / "Demo Mode (19 عطر)" hardcoded. | i18n and dynamic numbers. | MINOR |
| Quiz state persistence | Only sessionStorage; no server save for guests. | If "resume quiz" or cross-device is required: save to session/DB. | **IMPORTANT** if required |
| Perfume schema – scentPyramid | Present in Prisma as string; not used in match. Unified type has scentPyramid in PerfumeForMatching. | Clarify if pyramid should affect scoring or only display. | MINOR |
| family_vector / ifra_allergens on Perfume | Not in schema. | Add only if design specifies (e.g. vector search or stored allergen list). | MINOR |
| Content object vs next-intl | Single `content` object (Arabic) used by QuizLandingContent and Step3 headings. | Migrate to next-intl namespaces so quiz and step3 are locale-aware. | **IMPORTANT** |
| Step 2 – MIN_SELECTIONS | Next disabled when 1–2 disliked (must be 0 or ≥3). useQuizStepGuard allows 0 or ≥3. | Documented; consistent. No gap. | — |
| Gating – tier for match API | Tier from auth + getUserTierInfo; GUEST when not logged in. Limits applied correctly. | As implemented. No gap. | — |

---

**End of audit. No code was changed; all statements reflect current codebase.**

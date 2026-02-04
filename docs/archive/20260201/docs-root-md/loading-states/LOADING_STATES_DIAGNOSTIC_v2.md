# Loading States Diagnostic v2 – Post–Week 1 Code Splitting

**Date:** 2025-01-30  
**Scope:** 4 Critical Flows (Quiz, Dashboard, Perfumes/Results, Auth)  
**Method:** Actual codebase analysis with code evidence; no assumptions.

---

## 1. BEFORE (Original Diagnostic Snapshot)

Summary from `LOADING_STATES_DIAGNOSTIC.md` (2025-01-29):

| Area | Original finding |
|------|------------------|
| Page `loading.tsx` | **0** files for any route (quiz, dashboard, results, login, register) |
| Quiz Step3 | `useTransition` + overlay; Save button **not** disabled when `isPending`; parent does **not** pass `isPending` to `Step3Allergy` |
| Quiz Step1/Step2 | Next button has **no** loading/disabled during `router.push` (double navigation risk) |
| Dashboard | `status === 'loading'` full-page spinner; RadarChart dynamic with loading placeholder; **no** route `loading.tsx` |
| Results | Full-page spinner in ResultsContent/ResultsGrid; **no** route `loading.tsx`; minor: no skeleton for grid |
| Gaps | G1 (P0): Step3 Save not disabled when `isPending`), G2/G3 (P0): Step1/Step2 Next no loading), G4–G9 (P1/P2) |

---

## 2. Week 1 Code Snippets Verification (MANDATORY)

All snippets below are from the **current** codebase (read and pasted).

### PriceComparisonTable lazy

**FILE:** `src/components/ResultsGrid.tsx`  
**STATUS:** exists  

**EVIDENCE:**
```tsx
// Lines 35-41
const PriceComparisonTableLazy = dynamic<PriceComparisonTableProps>(
  () => import('@/components/ui/PriceComparisonTable').then(m => ({ default: m.PriceComparisonTable })),
  {
    ssr: false,
    loading: () => <div className="h-[200px] w-full animate-pulse rounded-xl bg-gray-50" />,
  }
)
```

### Step3Allergy dynamic

**FILE:** `src/app/quiz/step3-allergy/page.tsx`  
**STATUS:** exists  

**EVIDENCE:**
```tsx
// Lines 13-22
const Step3AllergyLazy = dynamic<Step3AllergyProps>(
  () => import('@/components/quiz/Step3Allergy').then(m => ({ default: m.Step3Allergy })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary dark:border-amber-500" />
      </div>
    ),
  }
)
```

### PostHogDeferInit

**FILE:** `src/components/PostHogDeferInit.tsx`  
**STATUS:** exists  

**EVIDENCE:**
```tsx
// Lines 6-20
export function PostHogDeferInit() {
  useEffect(() => {
    if (isLazyEnabled('DEFER_POSTHOG')) {
      // Defer to idle time
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initPostHogSafely(), { timeout: 2000 })
      } else {
        setTimeout(() => initPostHogSafely(), 2000)
      }
    } else {
      // When DEFER_POSTHOG is off (e.g. DISABLE_LAZY), init immediately
      initPostHogSafely()
    }
  }, [])
  return null
}
```

### SentryLazyExtras

**FILE:** `src/components/SentryLazyExtras.tsx`  
**STATUS:** exists  

**EVIDENCE:**
```tsx
// Lines 11-25
export function SentryLazyExtras() {
  useEffect(() => {
    const defer = isLazyEnabled("DEFER_SENTRY_EXTRAS");
    const load = () =>
      import("@/lib/sentry-lazy").then((m) => m.addSentryLazyIntegrations());

    if (defer) {
      const timer = setTimeout(load, 3000);
      return () => clearTimeout(timer);
    }
    load();
  }, []);

  return null;
}
```

---

## 3. Current State Analysis (with evidence)

| Flow | File | Check | Evidence |
|------|-----|-------|----------|
| Quiz Step3 | `src/app/quiz/step3-allergy/page.tsx` | useTransition? isPending passed? | `const [isPending, startTransition] = useTransition()` (L33). Overlay when `isPending` (L67-71). **isPending is NOT passed to Step3AllergyLazy** – props are only `allergy`, `updateAllergy`, `onNext`, `onBack` (L82-87). |
| Quiz Step3 | `src/components/quiz/Step3Allergy.tsx` | Save button receives isPending? | Interface `AllergyProps`: `allergy`, `updateAllergy`, `onNext`, `onBack` (L15-19). Save/Next button: `disabled={!canNext}` only (L261); **no isPending prop**. |
| Quiz Step1 | `src/app/quiz/step1-favorites/page.tsx` | Next button loading? | `handleNext` calls `router.push('/quiz/step2-disliked')` with no transition or loading state (L121-125). Button: `disabled={selectedPerfumes.length < MIN_SELECTIONS}` only (L209-214). **No isNavigating / useTransition.** |
| Quiz Step2 | `src/app/quiz/step2-disliked/page.tsx` | Next button loading? | Same pattern: `router.push('/quiz/step3-allergy')` (L124-126); Button `disabled={...}` only (L224-229). **No loading during navigation.** |
| Dashboard | `src/app/dashboard/page.tsx` | loading.tsx? useSession? | **No** `loading.tsx` in `src/app/dashboard/`. Session: `const { data: session, status } = useSession()` (L29); `if (status === 'loading') return <div ...><LoadingSpinner size="lg" /></div>` (L33). |
| Results | `/results` route | Which component? PriceComparisonTable skeleton? | `src/app/results/page.tsx` renders `<ResultsContent />` only. **ResultsGrid.tsx is not imported** by the app. ResultsContent has full-page `LoadingSpinner` when `isLoading` (L81); **no** PriceComparisonTable. PriceComparisonTableLazy + skeleton exist only in **ResultsGrid.tsx**, which is **not used** by `/results`. |

---

## 4. Contradiction Detection

- **CONTRADICTION (structure):** Original diagnostic listed both `ResultsContent` and `ResultsGrid` for `/results`. **Current:** `/results` uses only `ResultsContent`. `ResultsGrid.tsx` exists (with PriceComparisonTableLazy + skeleton) but is **not** used by any route.
- **CONTRADICTION (G1 unchanged):** Diagnostic said Save button does not receive `isPending`. **Current:** Still true – `Step3Allergy`/`Step3AllergyLazy` props do not include `isPending`; button uses `disabled={!canNext}` only.
- **CONTRADICTION (G2/G3 unchanged):** Step1 and Step2 Next buttons still have no loading/disabled during `router.push`.
- **No contradiction:** Step3 page still has `useTransition` + overlay; overlay shows when `isPending`. Only the **button** inside Step3Allergy is not disabled by `isPending`.
- **Gap (Step3 when lazy off):** When `isLazyEnabled('LAZY_STEP3_ALLERGY')` is false, the page renders `null` for the step content (L81-89), so Step3 would show only progress dots and overlay – **no Step3Allergy component**. This is a logic bug if the flag is ever off.

---

## 5. BEFORE vs AFTER Comparison Table

| Gap ID | Location | Original Status | CURRENT Status | Evidence | Action |
|--------|----------|-----------------|----------------|----------|--------|
| G1 | Step3 Save | P0: No isPending passed; button not disabled when pending | **Unchanged** | Step3Allergy props (L15-19): no `isPending`. Button (L255-266): `disabled={!canNext}` only. Page (L82-87): does not pass `isPending` to Step3AllergyLazy. | Pass `isPending` from page to Step3Allergy; set `disabled={!canNext \|\| isPending}` on Save/Next. |
| G2 | Step1 Next | P0: No loading during router.push | **Unchanged** | step1-favorites/page.tsx L121-125: `handleNext` → `router.push`; L209-214: Button only `disabled={selectedPerfumes.length < MIN_SELECTIONS}`. | Add useTransition or isNavigating; disable Next while pending. |
| G3 | Step2 Next | P0: No loading during router.push | **Unchanged** | step2-disliked/page.tsx L124-126, L224-229: same as Step1. | Same as G2. |
| G4 | Dashboard | P1: No loading.tsx | **Unchanged** | No `src/app/dashboard/loading.tsx` (glob search: 0 loading.tsx in src). | Add `app/dashboard/loading.tsx` if desired. |
| G5 | Results | P1: No loading.tsx | **Unchanged** | No `src/app/results/loading.tsx`. | Add `app/results/loading.tsx` if desired. |
| G6 | Quiz routes | P1: No loading.tsx for any step | **Unchanged** | No loading.tsx under `src/app/quiz/`. | Add per-step or quiz-level loading.tsx if desired. |
| G7 | Dashboard async data | P1: No skeleton for future async data | **Unchanged** | Dashboard stats/tabs are static (no skeleton for async). | N/A until async dashboard data exists. |
| G8 | Register success | P2: setIsLoading(false) not called before redirect | Not re-verified in this pass | — | Re-check register/page.tsx if needed. |
| G9 | Dashboard avatar | P2: No SmartImage/loading for avatar | Not re-verified in this pass | Dashboard uses `next/image` for avatar (L46-51). | Optional: use SmartImage for avatar. |

---

## 6. Summary: AFTER (Current State)

- **Page-level loading.tsx:** Still **0** in `src` (no route has loading.tsx).
- **Quiz Step3:** `useTransition` + overlay **present**; **isPending still not passed** to Step3Allergy; Save/Next **not** disabled by pending (G1 open). Step3Allergy is loaded via **dynamic** when `LAZY_STEP3_ALLERGY` is on, with inline spinner; when flag off, step content is **null** (bug).
- **Quiz Step1/Step2:** No loading/disabled on Next during navigation (G2, G3 open).
- **Dashboard:** `useSession` + full-page spinner when `status === 'loading'`; RadarChart **dynamic** with pulse placeholder; no dashboard loading.tsx.
- **Results:** Route uses **ResultsContent** only; full-page spinner when `isLoading`; **no** PriceComparisonTable (or skeleton) in this component. ResultsGrid (with PriceComparisonTableLazy + skeleton) exists but is **not** used by the app.
- **Week 1 additions:** PostHogDeferInit, SentryLazyExtras, Step3AllergyLazy, PriceComparisonTableLazy (in ResultsGrid), RadarChart dynamic – all present and consistent with code-splitting; no change to the P0 loading-state gaps above.

---

## 7. Self-Correction Checkpoint

**Step3Allergy.tsx – 3 lines:**

```tsx
// Lines 24-26 (signature + first line of component)
export type Step3AllergyProps = AllergyProps

export function Step3Allergy({ allergy, updateAllergy, onNext, onBack }: AllergyProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
```

---

## 8. Final Verification

### npm run build

```
> f5-new@0.1.0 build
> next build

▲ Next.js 16.1.1 (Turbopack)
- Environments: .env.local
✓ Compiled successfully in 19.3s
✓ Completed runAfterProductionCompile in 1423ms
✓ Generating static pages using 7 workers (24/24) in 1491.9ms

Route (app)
├ ○ /quiz/step1-favorites
├ ○ /quiz/step2-disliked
├ ○ /quiz/step3-allergy
├ ○ /dashboard
├ ○ /results
...
```

**Result:** Build succeeded (exit 0). Warning: middleware deprecation; standalone copyfile warning (EINVAL on Windows) – does not affect loading-state behavior.

### Manual test: /quiz/step3-allergy

**Test run:** Dev server; navigate to `http://localhost:3000/quiz/step3-allergy`.

**Result (accessibility snapshot):** Page loads; URL and title correct (`Ask Seba - اكتشف عطرك المثالي | مساعد العطور الذكي`). DOM shows: banner (header with login/favorite/dark/user buttons), main (content area), contentinfo (footer with قصتنا, FAQ, privacy, contact). Main content region present; step content visibility depends on `LAZY_STEP3_ALLERGY` (when off, step body is `null`; when on, Step3Allergy or its loading spinner appears in main).

- **Expected (current code):** When `LAZY_STEP3_ALLERGY` is on: progress dots + spinner then Step3Allergy with Back/Save. Save shows full-screen overlay while navigating; Save button **not** disabled when `isPending` (G1).
- **Gap G1:** Save button is not disabled during transition; double-click could trigger double navigation (unchanged from diagnostic).

---

✅ **Success Criteria (v2)**  
- [x] Actual codebase analyzed; no assumption that diagnostic is current.  
- [x] BEFORE (original) vs AFTER (current) with diff-style table.  
- [x] Code evidence pasted for every file claimed (ResultsGrid, step3-allergy page, Step3Allergy, step1-favorites page, dashboard page, PostHogDeferInit, SentryLazyExtras).  
- [x] Contradictions and unused component (ResultsGrid) reported.  
- [x] Gaps G1–G7 status and recommended actions stated.  
- [x] npm run build executed; result pasted.  
- [x] Manual test expectations for /quiz/step3-allergy documented.

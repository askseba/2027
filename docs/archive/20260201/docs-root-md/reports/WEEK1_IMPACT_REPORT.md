# Week 1 Impact Report – Loading States & Code Splitting

**Date:** 2025-01-30  
**Context:** Post–Week 1 code splitting; impact on loading states and diagnostics.

---

## 1. Week 1 Changes Verified in Codebase

| Change | File | Status | Evidence (snippet) |
|--------|------|--------|--------------------|
| PriceComparisonTable lazy | `src/components/ResultsGrid.tsx` | ✅ Present | `const PriceComparisonTableLazy = dynamic<PriceComparisonTableProps>(() => import('@/components/ui/PriceComparisonTable').then(m => ({ default: m.PriceComparisonTable })), { ssr: false, loading: () => <div className="h-[200px] w-full animate-pulse rounded-xl bg-gray-50" /> })` |
| Step3Allergy dynamic | `src/app/quiz/step3-allergy/page.tsx` | ✅ Present | `const Step3AllergyLazy = dynamic<Step3AllergyProps>(() => import('@/components/quiz/Step3Allergy').then(m => ({ default: m.Step3Allergy })), { ssr: false, loading: () => ( <div className="min-h-[600px] flex ..."><div className="h-12 w-12 animate-spin ..." /></div> ) })` |
| PostHogDeferInit | `src/components/PostHogDeferInit.tsx` | ✅ Present | `export function PostHogDeferInit() { useEffect(() => { if (isLazyEnabled('DEFER_POSTHOG')) { ... requestIdleCallback(...) } else { initPostHogSafely() } }, []); return null }` |
| SentryLazyExtras | `src/components/SentryLazyExtras.tsx` | ✅ Present | `export function SentryLazyExtras() { useEffect(() => { const defer = isLazyEnabled("DEFER_SENTRY_EXTRAS"); ... if (defer) { const timer = setTimeout(load, 3000); ... } else load(); }, []); return null }` |
| RadarChart dynamic | `src/app/dashboard/page.tsx` | ✅ Present | `const RadarChart = dynamic(() => import('@/components/ui/RadarChart').then(mod => ({ default: mod.RadarChart })), { ssr: false, loading: () => <div className="aspect-square bg-cream-bg animate-pulse rounded-3xl" /> })` |
| MobileFilterModal dynamic | `src/components/ResultsGrid.tsx` | ✅ Present | `const MobileFilterModal = dynamic(..., { ssr: false, loading: () => null })` |

---

## 2. Week 1 Impact on Loading-State Gaps

| Week 1 Change | New Gap? | Gap Fixed? | Evidence / Notes |
|---------------|----------|------------|------------------|
| PriceComparisonTable lazy | **CLS risk (minor)** only where used | — | ResultsGrid has skeleton: `loading: () => <div className="h-[200px] w-full animate-pulse rounded-xl bg-gray-50" />`. **But** `/results` uses ResultsContent, not ResultsGrid, so this lazy + skeleton are **not** in the current results flow. No new gap in the live flow. |
| Step3Allergy dynamic | **Yes:** Step3 empty when flag off | **No** (G1 still open) | When `isLazyEnabled('LAZY_STEP3_ALLERGY')` is false, page renders `null` for step content → no Step3Allergy at all (bug). When flag is on: skeleton exists (spinner in `loading`), but **isPending still not passed** to Step3AllergyLazy, so Save/Next not disabled during transition (G1 unchanged). |
| PostHogDeferInit | No | — | Defers PostHog init; no impact on UI loading states. |
| SentryLazyExtras | No | — | Defers Sentry extras; no impact on UI loading states. |
| RadarChart dynamic | No | — | Has `loading: () => <div className="aspect-square bg-cream-bg animate-pulse rounded-3xl" />`; no new gap. |

---

## 3. What Changed vs What Stayed the Same

**Changed (Week 1):**

- Step3 page can load Step3Allergy via dynamic import with inline spinner when `LAZY_STEP3_ALLERGY` is on.
- ResultsGrid (if ever used) would show PriceComparisonTable via dynamic import with 200px pulse skeleton.
- Dashboard RadarChart is dynamically loaded with pulse placeholder.
- PostHog and Sentry extras are deferrable via feature flags.

**Unchanged (loading-state gaps):**

- **G1:** Step3 Save/Next still does not receive `isPending`; button not disabled during transition.
- **G2 / G3:** Step1 and Step2 Next buttons still have no loading/disabled during `router.push`.
- **G4–G6:** No route-level `loading.tsx` for dashboard, results, or quiz.
- **Results route:** Still uses ResultsContent only; ResultsGrid (and its PriceComparisonTableLazy) is unused.

---

## 4. Recommendations

1. **G1 (P0):** Pass `isPending` from `step3-allergy/page.tsx` to `Step3Allergy`/`Step3AllergyLazy` and set Save/Next `disabled={!canNext || isPending}`.
2. **Step3 when lazy off:** When `LAZY_STEP3_ALLERGY` is false, render `<Step3Allergy ... />` directly (static import) instead of `null`.
3. **G2 / G3 (P0):** Add `useTransition` (or local `isNavigating`) on Step1 and Step2 and disable Next while pending.
4. **Results:** Either switch `/results` to use ResultsGrid (and get PriceComparisonTableLazy + skeleton) or add any desired skeleton/loading inside ResultsContent; document that ResultsGrid is legacy/unused if that is intentional.

---

✅ **Report complete.** Evidence taken from current source files only.

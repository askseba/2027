# Loading States Diagnostic – Ask Seba

**Date:** 2025-01-29  
**Time spent:** ~38 min  
**Scope:** 4 Critical Flows (Quiz, Dashboard, Perfumes/Results, Auth)

---

## 1. Existing Loading Inventory

| Type | File | Route | Pattern | Status |
|------|------|-------|---------|--------|
| Page | *(none)* | `/quiz` | `loading.tsx` | ❌ Missing |
| Page | *(none)* | `/quiz/step1-favorites` | `loading.tsx` | ❌ Missing |
| Page | *(none)* | `/quiz/step2-disliked` | `loading.tsx` | ❌ Missing |
| Page | *(none)* | `/quiz/step3-allergy` | `loading.tsx` | ❌ Missing |
| Page | *(none)* | `/dashboard` | `loading.tsx` | ❌ Missing |
| Page | *(none)* | `/results` | `loading.tsx` | ❌ Missing |
| Page | *(none)* | `/login`, `/register` | `loading.tsx` | ❌ Missing |
| Error | `app/error.tsx` | Global | `error.tsx` (App Router) | ✅ Active |
| Not Found | `app/not-found.tsx` | Global | `not-found.tsx` | ✅ Active |
| Button | `components/ui/button.tsx` | Global | `isLoading` prop + `disabled={isLoading or props.disabled}` | ✅ Active (functional) |
| Button | `app/login/page.tsx` | `/login` | `isLoading` + `disabled` on inputs/buttons + `Button isLoading={isLoading}` | ✅ Active |
| Button | `app/register/page.tsx` | `/register` | `isLoading` + `disabled` on inputs + `Button isLoading={isLoading}` | ✅ Active (success path never calls `setIsLoading(false)` before redirect) |
| Form | `components/FeedbackModal.tsx` | Global | `isSubmitting` + `disabled={isSubmitting \|\| ...}` | ✅ Active |
| Data | `app/quiz/step1-favorites/page.tsx` | `/quiz/step1-favorites` | Client `fetch` + `isSearching` (search only) | ⚠️ Partial (no loading on Next) |
| Data | `app/quiz/step2-disliked/page.tsx` | `/quiz/step2-disliked` | Client `fetch` + `isSearching` (search only) | ⚠️ Partial (no loading on Next) |
| Data | `app/quiz/step3-allergy/page.tsx` | `/quiz/step3-allergy` | `useTransition` + `isPending` + overlay | ⚠️ Partial (Save button not disabled when `isPending`) |
| Data | `components/results/ResultsContent.tsx` | `/results` | `isLoading` + full-page `LoadingSpinner` | ✅ Active |
| Data | `components/ResultsGrid.tsx` | *(results view)* | `isLoading` + full-page spinner | ✅ Active |
| Data | `app/dashboard/page.tsx` | `/dashboard` | `status === 'loading'` (useSession) + full-page spinner; RadarChart `dynamic(..., { loading: () => pulse })` | ✅ Active |
| Data | `hooks/useFavorites.ts` | Global | `isLoading`, `isFetching` (useState, not React Query) | ✅ Active |
| Data | `components/TestHistory.tsx` | — | `isLoading` + conditional render | ✅ Active |
| Image | `components/ui/SmartImage.tsx` | Global | `isLoading` + pulse placeholder | ✅ Active |
| CTA | `components/landing/CTASection.tsx` | Landing | `disabled={isClicked}` + `disabled:opacity-70` | ✅ Active (functional) |
| Suspense | `app/login/page.tsx` | `/login` | `Suspense fallback={...}` (SearchParams) | ✅ Active |
| Suspense | `app/pricing/page.tsx` | `/pricing` | `Suspense fallback={...}` | ✅ Active |
| Suspense | `app/pricing/success/page.tsx` | `/pricing/success` | `Suspense fallback={...}` | ✅ Active |
| React Query | *(none)* | — | `useQuery` / `useMutation` | ❌ Not used (0 hooks) |

---

## 2. Flow Analysis

### Quiz (`/quiz`, `/quiz/step1-favorites`, `/quiz/step2-disliked`, `/quiz/step3-allergy`)

- **Data:** Step1/Step2: client `fetch` to `/api/perfumes/search` with debounce; `isSearching` for search UI only. Step3: no data fetch; context already in memory.
- **Interactions:** Step1/Step2: Next button uses `disabled` only for min selections; no loading/disabled during `router.push`, so double-click can trigger double navigation. Step3: `useTransition` + overlay; Save/Next in `Step3Allergy` has `disabled={!canNext}` but does **not** receive `isPending` from parent — button stays clickable during transition (double submission risk).
- **Error:** `ErrorBoundary` wraps quiz steps; no route-level `error.tsx` per step.

**Loading Coverage:** Partial  
**Error Handling:** Exists (ErrorBoundary)  
**Critical Gap:** Step3 Save button not disabled when `isPending`; Step1/Step2 Next buttons not disabled during navigation (double navigation / double submit risk).

---

### Dashboard (`/dashboard`)

- **Heavy components:** RadarChart (dynamic import with `loading: () => pulse`), stats cards (static copy), tabs (overview/favorites/history).
- **Strategy:** Session loading via `status === 'loading'` full-page spinner; no Suspense for streaming; RadarChart has its own loading placeholder.
- **Gaps:** No route-level `loading.tsx` (blank/blocked until client and session resolve); stats and tab content are static — no skeleton for async data; empty states exist for favorites.

**Loading Coverage:** Partial  
**Error Handling:** Exists (ErrorBoundary)  
**Critical Gap:** No `loading.tsx` for `/dashboard`; no skeleton for future async dashboard data (e.g. recommendations).

---

### Perfumes / Results (`/results`, perfume search in quiz steps)

- **List:** Results: client POST `/api/match` with full-page `LoadingSpinner` in `ResultsContent` and `ResultsGrid`; pagination buttons use `disabled` for prev/next. No dedicated `/perfumes` or `/perfumes/[slug]` route — “Perfumes” flow = quiz search + results grid.
- **Details:** Perfume cards use images; `SmartImage` provides per-image loading (pulse). No standalone detail page scanned.

**Loading Coverage:** Full (for results list and images)  
**Error Handling:** Exists (error state in ResultsContent/ResultsGrid; ErrorBoundary where used)  
**Critical Gap:** No `loading.tsx` for `/results`; minor: no skeleton for results grid (full-page spinner only).

---

### Auth (Login / Register / Save)

- **Submit:** Login: `isLoading` + `disabled` on Google and credentials submit; `Button` with `isLoading={isLoading}` (functional). Register: same pattern; success path redirects without calling `setIsLoading(false)` (button may stay in loading state until unmount).
- **Validation:** No inline async validation (e.g. username check) observed.

**Loading Coverage:** Full  
**Error Handling:** Exists (inline error message, API errors)  
**Critical Gap:** Register success path never calls `setIsLoading(false)` (cosmetic only; redirect unmounts).

---

## 3. Prioritized Gaps

| ID | Priority | Flow | Location | Issue | Risk |
|----|----------|------|----------|-------|------|
| G1 | P0 | Quiz | `components/quiz/Step3Allergy.tsx` + `app/quiz/step3-allergy/page.tsx` | Save button not disabled when `isPending`; parent does not pass `isPending` to child | Double submission / double navigation to `/results` |
| G2 | P0 | Quiz | `app/quiz/step1-favorites/page.tsx` (Next button) | Next button has no loading/disabled during `router.push` | Double navigation to step2 |
| G3 | P0 | Quiz | `app/quiz/step2-disliked/page.tsx` (Next button) | Next button has no loading/disabled during `router.push` | Double navigation to step3 |
| G4 | P1 | Dashboard | `/dashboard` (no file) | No `loading.tsx` for route | Blank or blocked first paint until client + session |
| G5 | P1 | Results | `/results` (no file) | No `loading.tsx` for route | Blank until client; layout shift risk |
| G6 | P1 | Quiz | `/quiz`, `/quiz/step1-favorites`, `/quiz/step2-disliked`, `/quiz/step3-allergy` | No `loading.tsx` for any quiz route | Blank/layout shift on first load or slow nav |
| G7 | P1 | Dashboard | Dashboard stats / recommendations | No skeleton for future async dashboard data | Layout shift or empty flash if data is later fetched |
| G8 | P2 | Auth | `app/register/page.tsx` | Success path does not call `setIsLoading(false)` before redirect | Button may show loading until unmount (cosmetic) |
| G9 | P2 | Dashboard | Dashboard header avatar | Avatar uses `next/image` only; no `SmartImage` or loading state | Minor visual polish for slow image load |

---

## 4. Baseline Metrics (Before Implementation)

| Metric | Count | Notes |
|--------|-------|-------|
| Page-level loading (`loading.tsx`) | **0** files | No routes have `loading.tsx` (quiz, dashboard, results, login, register, etc.) |
| Component loading states (buttons/forms) | **8** components | Button (global), Login, Register, FeedbackModal, PriceAlertButton, Step3Allergy (disabled by `canNext` only), CTASection, FeedbackCard; header `status === 'loading'` |
| Suspense boundaries | **3** | `app/login/page.tsx`, `app/pricing/page.tsx`, `app/pricing/success/page.tsx` |
| React Query `isLoading` / `isFetching` / `isPending` usages | **0** | No `useQuery` or `useMutation` in project |
| `useTransition` / `isPending` | **1** | `app/quiz/step3-allergy/page.tsx` only |
| Error boundaries (App Router `error.tsx`) | **1** | `app/error.tsx` (global) |
| **Total Critical Flows** | **4** | Quiz, Dashboard, Perfumes/Results, Auth |
| **Flows with adequate loading** | **2/4** | Perfumes/Results (full); Auth (full). Quiz and Dashboard are partial (gaps above). |
| **Total Gaps identified** | **9** | P0: 3, P1: 4, P2: 2 |

**Goal for Next Phase:**  
- Move from **0** route-level loading files → add `loading.tsx` for critical routes (quiz, dashboard, results).  
- Cover all **P0** gaps first (3 items): Step3 Save disabled when `isPending`, Step1/Step2 Next disabled during navigation.

---

## 5. Top 3 Priority Actions (High-level only)

1. **P0:** Add button loading/disabled to Quiz Step3 Save (e.g. pass `isPending` from page to `Step3Allergy` and disable Save while pending) to prevent double submit.
2. **P0:** Add loading/disabled state to Quiz Step1 and Step2 Next buttons during navigation (e.g. local `isNavigating` or `useTransition` + disable) to prevent double navigation.
3. **P1:** Add route-level `loading.tsx` for `/dashboard` and `/results` (and optionally quiz steps) to improve first paint and reduce layout shift.

No implementation details here.

---

✅ **Success Criteria (Check before submitting)**  
- [x] لم يتم تعديل أي ملف .ts أو .tsx  
- [x] تم مسح loading.tsx, error.tsx files (إن وجدت) — لا يوجد أي `loading.tsx`؛ تم توثيق `error.tsx` و `not-found.tsx`  
- [x] تم فحص useQuery hooks (isFetching vs isLoading) — لا يوجد React Query في المشروع  
- [x] تم فحص disabled classes في Tailwind (button.tsx, Step3Allergy, CTASection, ResultsGrid, pricing, classnames.ts)  
- [x] جميع الـ 4 Flows محللة  
- [x] الأرقام في Step 4 quantified  
- [x] Gaps مصنفة P0/P1/P2 حسب المعايير أعلاه  
- [x] التقرير محفوظ في `LOADING_STATES_DIAGNOSTIC.md`

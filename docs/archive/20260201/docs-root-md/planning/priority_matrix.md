# Priority Matrix & Implementation Roadmap
**Date:** January 29, 2026  
**Project:** Ask Seba (f9-new)  
**Analyzer:** Cursor AI  
**Duration:** ~20 minutes  
**Input:** bundle_analysis.md + component_inventory.md

---

## Executive Summary

**Analysis Scope:**
- Total candidates evaluated: **17** (10 P0/P1 components + 4 P2 + Sentry + PostHog + framer-motion/m)
- **Must Do (ROI > 3.0):** 4 items
- **Should Do (ROI 2.0–3.0):** 6 items
- **Consider (ROI 1.0–2.0):** 7 items
- **Skip (ROI < 1.0):** 0 items

**Recommended Implementation:**
- **Week 1:** 4 items (PriceComparisonTable, Step3Allergy, PostHog defer, Sentry defer), ~220 KB savings, 8 hours
- **Week 2:** 5 components (ResultsContent, ProfilePage, Quiz Step1, Quiz Step2, HeroSection), ~75 KB savings, 12 hours
- **Week 3:** framer-motion/m + remaining Consider items, ~120 KB savings, 12 hours
- **Total:** ~415 KB initial-load reduction (~30% vs 1.36 MB client bundle)

**Top 3 Priorities:**
1. **PriceComparisonTable** – ROI: 5.15 – "One-line dynamic import; below-fold, Premium-only; highest ROI."
2. **Step3Allergy** – ROI: 3.05 – "Route-specific quiz step; dynamic import + loading state; high impact, low effort."
3. **Sentry defer init** – ROI: 3.33 – "Defer SDK load until after interactive; ~175 KB off initial bundle."

---

## 1. Complete Candidate List

**Total Candidates:** 17

| # | Component | Path | Size (KB) | Savings (KB) | Category | Routes Using |
|---|-----------|------|-----------|--------------|----------|--------------|
| 1 | ResultsPage (gated) | `src/app/results/page.tsx` | ~37 | ~50 | P0 | /results |
| 2 | Step3Allergy | `src/components/quiz/Step3Allergy.tsx` | ~24 | ~22 | P0 | /quiz/step3-allergy |
| 3 | Quiz Step1FavoritesPage | `src/app/quiz/step1-favorites/page.tsx` | ~22 | ~17 | P0 | /quiz/step1-favorites |
| 4 | Quiz Step2DislikedPage | `src/app/quiz/step2-disliked/page.tsx` | ~24 | ~17 | P0 | /quiz/step2-disliked |
| 5 | FeedbackPage | `src/app/feedback/page.tsx` | ~22 | ~17 | P0 | /feedback |
| 6 | HeroSection | `src/components/landing/HeroSection.tsx` | ~11 | ~12 | P0 | / |
| 7 | PriceComparisonTable | `src/components/ui/PriceComparisonTable.tsx` | ~12 | ~12 | P1 | /results (Premium) |
| 8 | PerfumeTimeline | `src/components/ui/PerfumeTimeline.tsx` | ~20 | ~17 | P1 | Future /results, /dashboard |
| 9 | ResultsContent | `src/components/results/ResultsContent.tsx` | ~17 | ~17 | P1 | /results |
| 10 | ProfilePage | `src/app/profile/page.tsx` | ~14 | ~9 | P1 | /profile |
| 11 | MobileFilterModal | `src/components/ui/MobileFilterModal.tsx` | ~20 | <5 | P2 | /results (mobile, filters) |
| 12 | AdminModal | `src/components/AdminModal.tsx` | ~17 | Negl. | P2 | /feedback (admin) |
| 13 | PerfumeCard | `src/components/ui/PerfumeCard.tsx` | ~13 | ~5 | P2 | /results, grids |
| 14 | TestimonialsCarousel | `src/components/ui/TestimonialsCarousel.tsx` | ~11 | ~11 | P2 | Marketing |
| 15 | Sentry defer init | — | — | ~175 | Dep | All routes |
| 16 | PostHog extra defer | — | — | ~7 | Dep | All routes |
| 17 | framer-motion/m adoption | — | — | ~100 | Dep | Multiple |

---

## 2. Impact Scoring

### Scoring Methodology

**Formula:**
```
Impact = (Size Weight × 0.4) + (Route Weight × 0.3) + (User Weight × 0.3)
```

**Weight Definitions:**
- **Size Weight:** min(KB saved / 100, 10)
- **Route Traffic:** High = 10, Medium = 7, Low = 4
- **User Scope:** All = 10, Authenticated = 7, Few = 4

### Impact Scores

| Component | Size (KB) | Route Traffic | User Scope | Impact Score |
|-----------|-----------|---------------|------------|--------------|
| ResultsPage | 50 | High | Auth | 5.30 |
| Step3Allergy | 22 | High | All | 6.09 |
| Quiz Step1 | 17 | High | All | 6.07 |
| Quiz Step2 | 17 | High | All | 6.07 |
| FeedbackPage | 17 | Med | Few | 3.37 |
| HeroSection | 12 | High | All | 6.05 |
| PriceComparisonTable | 12 | High | Auth | 5.15 |
| PerfumeTimeline | 17 | Med | Few | 3.37 |
| ResultsContent | 17 | High | Auth | 5.17 |
| ProfilePage | 9 | High | Auth | 5.14 |
| MobileFilterModal | 3 | Med | Few | 3.39 |
| AdminModal | 2 | Low | Few | 2.41 |
| PerfumeCard | 5 | High | Auth | 5.15 |
| TestimonialsCarousel | 11 | Med | Few | 3.41 |
| Sentry defer | 175 | High (all) | All | 10.00 |
| PostHog defer | 7 | High (all) | All | 6.07 |
| framer-motion/m | 100 | High (all) | All | 10.00 |

**Highest Impact Components:**
1. **Sentry defer** – 10.0 – 175 KB off initial load, all routes, all users
2. **framer-motion/m** – 10.0 – ~100 KB vendor reduction across many routes
3. **Step3Allergy** – 6.09 – High-traffic quiz step, affects all quiz users

---

## 3. Effort Assessment

### Effort Scale

| Score | Time | Complexity | Example |
|-------|------|------------|---------|
| 1 | <1 h | Simple import | Modal, section |
| 2 | 1–2 h | Import + loading | Chart, gallery |
| 3 | 2–4 h | Multi-file + state | Form, table |
| 4 | 4–8 h | Refactoring needed | Auth flow |
| 5 | 1–2 d | Architectural change | Layout |

### Effort Scores

| Component | Impact | Effort | Reason for Effort Score |
|-----------|--------|--------|--------------------------|
| ResultsPage | 5.30 | 3 | Multiple dynamic imports, gating refactor |
| Step3Allergy | 6.09 | 2 | Dynamic import + loading, single file |
| Quiz Step1 | 6.07 | 3 | Extract SelectedPerfumeList, dynamic, state |
| Quiz Step2 | 6.07 | 3 | Same as Step1, shared component |
| FeedbackPage | 3.37 | 2 | framer-motion/m swap, light refactor |
| HeroSection | 6.05 | 3 | Animation simplification, framer-motion/m |
| PriceComparisonTable | 5.15 | 1 | Single dynamic import, conditional render |
| PerfumeTimeline | 3.37 | 2 | Dynamic import where used (currently unused) |
| ResultsContent | 5.17 | 2 | Lazy sub-section of ResultsPage |
| ProfilePage | 5.14 | 2 | Optional lazy sub-components |
| MobileFilterModal | 3.39 | 2 | Already lazy; minor tweaks only |
| AdminModal | 2.41 | 2 | Already lazy; no meaningful split left |
| PerfumeCard | 5.15 | 4 | Core shared UI; splitting adds overhead |
| TestimonialsCarousel | 3.41 | 2 | Dynamic import in marketing sections |
| Sentry defer | 10.00 | 3 | Client bootstrap, dynamic init, config |
| PostHog defer | 6.07 | 2 | requestIdleCallback / timeout wrap |
| framer-motion/m | 10.00 | 5 | Many files, import changes, regression risk |

**Quick Wins (Effort ≤ 2):**
- PriceComparisonTable, Step3Allergy, FeedbackPage, PerfumeTimeline, ResultsContent, ProfilePage, MobileFilterModal, AdminModal, TestimonialsCarousel, PostHog defer

**Complex Cases (Effort ≥ 4):**
- PerfumeCard (4) – core shared; not recommended for split  
- framer-motion/m (5) – cross-cutting vendor change

---

## 4. ROI Analysis

### ROI Formula
```
ROI = Impact Score / Effort Score
```

### Complete ROI Ranking

| Rank | Component | Impact | Effort | ROI | Category |
|------|-----------|--------|--------|-----|----------|
| 1 | PriceComparisonTable | 5.15 | 1 | **5.15** | Must Do |
| 2 | Sentry defer init | 10.00 | 3 | **3.33** | Must Do |
| 3 | Step3Allergy | 6.09 | 2 | **3.05** | Must Do |
| 4 | PostHog extra defer | 6.07 | 2 | **3.04** | Must Do |
| 5 | ResultsContent | 5.17 | 2 | 2.59 | Should Do |
| 6 | ProfilePage | 5.14 | 2 | 2.57 | Should Do |
| 7 | Quiz Step1 | 6.07 | 3 | 2.02 | Should Do |
| 8 | Quiz Step2 | 6.07 | 3 | 2.02 | Should Do |
| 9 | HeroSection | 6.05 | 3 | 2.02 | Should Do |
| 10 | framer-motion/m | 10.00 | 5 | 2.00 | Should Do |
| 11 | ResultsPage | 5.30 | 3 | 1.77 | Consider |
| 12 | TestimonialsCarousel | 3.41 | 2 | 1.71 | Consider |
| 13 | MobileFilterModal | 3.39 | 2 | 1.70 | Consider |
| 14 | FeedbackPage | 3.37 | 2 | 1.69 | Consider |
| 15 | PerfumeTimeline | 3.37 | 2 | 1.69 | Consider |
| 16 | PerfumeCard | 5.15 | 4 | 1.29 | Consider |
| 17 | AdminModal | 2.41 | 2 | 1.21 | Consider |

### ROI Distribution

**Must Do (ROI > 3.0):** 4 items  
- Total impact: ~216 KB (12 + 175 + 22 + 7)  
- Total effort: ~8 h  
- Average ROI: 3.64  

**Should Do (ROI 2.0–3.0):** 6 items  
- Total impact: ~170 KB (components) + ~100 KB (framer-motion)  
- Total effort: ~17 h  
- Average ROI: 2.24  

**Consider (ROI 1.0–2.0):** 7 items  
- Total impact: ~95 KB  
- Total effort: ~17 h  
- Average ROI: 1.55  

**Skip (ROI < 1.0):** 0 items  

---

## 5. Implementation Roadmap

### Week 1: Quick Wins (Must Do – Effort ≤ 3)

**Goal:** Maximum ROI with minimal risk  
**Target:** 200–250 KB reduction  
**Time Budget:** 6–8 hours  

| Priority | Component | ROI | Effort | Impact (KB) | Implementation |
|----------|-----------|-----|--------|-------------|----------------|
| 1 | PriceComparisonTable | 5.15 | 1 h | ~12 | `dynamic` import, `ssr: false`, `loading: null` |
| 2 | Step3Allergy | 3.05 | 2 h | ~22 | `dynamic` in step3 page, loading skeleton |
| 3 | PostHog extra defer | 3.04 | 2 h | ~7 | `requestIdleCallback` / timeout wrap |
| 4 | Sentry defer init | 3.33 | 3 h | ~175 | Dynamic init after load/interactive |

**Week 1 Deliverables:**
- [ ] PriceComparisonTable lazy-loaded on /results
- [ ] Step3Allergy lazy-loaded on /quiz/step3-allergy
- [ ] PostHog init deferred (idle/timeout)
- [ ] Sentry client init deferred (post-load)
- [ ] Bundle size measured (target: −200 KB min)
- [ ] No regressions (Lighthouse / smoke)

**Success Criteria:**
- All four items done  
- Initial load reduction ≥ 200 KB  
- FCP improved or unchanged  
- No CLS regression  

---

### Week 2: High-Impact Items (Should Do – Effort 2–3)

**Goal:** Medium-complexity, high-impact components  
**Target:** 75–100 KB additional reduction  
**Time Budget:** 10–12 hours  

| Priority | Component | ROI | Effort | Impact (KB) | Complexity |
|----------|-----------|-----|--------|-------------|------------|
| 5 | ResultsContent | 2.59 | 2 h | ~17 | Lazy sub-section of ResultsPage |
| 6 | ProfilePage | 2.57 | 2 h | ~9 | Optional lazy sections |
| 7 | Quiz Step1 | 2.02 | 3 h | ~17 | Extract + dynamic SelectedPerfumeList |
| 8 | Quiz Step2 | 2.02 | 3 h | ~17 | Same pattern as Step1 |
| 9 | HeroSection | 2.02 | 3 h | ~12 | framer-motion/m + animation simplify |

**Week 2 Deliverables:**
- [ ] ResultsContent lazy-loaded where used
- [ ] ProfilePage sub-sections lazy where applicable
- [ ] Quiz Step1 & Step2 selected-list extraction + dynamic
- [ ] HeroSection using framer-motion/m + lighter animations
- [ ] Integration tests updated
- [ ] Cumulative bundle delta measured  

**Success Criteria:**
- Cumulative reduction ≥ 275 KB (Week 1 + 2)  
- LCP improved or unchanged  
- All tests passing  

---

### Week 3: Dependencies & Complex (framer-motion/m + Consider)

**Goal:** Vendor tuning and remaining Consider items  
**Target:** 120–150 KB additional reduction  
**Time Budget:** 10–14 hours  

| Priority | Item | ROI | Effort | Impact (KB) | Type |
|----------|------|-----|--------|-------------|------|
| 10 | framer-motion/m adoption | 2.00 | 5 h | ~100 | Vendor (multi-file) |
| 11 | ResultsPage optional sections | 1.77 | 3 h | ~50 | BlurredTeaser, Upsell, gating |
| 12 | FeedbackPage | 1.69 | 2 h | ~17 | framer-motion/m |
| 13 | PerfumeTimeline (if used) | 1.69 | 2 h | ~17 | Dynamic where used |
| 14 | TestimonialsCarousel | 1.71 | 2 h | ~11 | Dynamic in marketing |

**Week 3 Deliverables:**
- [ ] All framer-motion imports switched to `framer-motion/m` where applicable
- [ ] ResultsPage optional blocks lazy-loaded
- [ ] FeedbackPage + TestimonialsCarousel (and PerfumeTimeline if used) updated
- [ ] Performance monitoring in place (e.g. Lighthouse CI, budgets)

**Success Criteria:**
- Cumulative reduction ≥ 400 KB (Weeks 1–3)  
- FCP < 1.5 s (target)  
- TTI < 3.0 s (target)  
- Initial JS < 500 KB (stretch)  

---

### Week 4+: Polish & Monitor

**Goal:** Validate and iterate  
**Activities:**  
1. Full performance test suite  
2. A/B tests on bundle changes  
3. RUM (Web Vitals)  
4. Implement remaining Consider items if justified  
5. Document learnings  

**Monitoring:**
- Lighthouse CI in GitHub Actions  
- Web Vitals (RUM)  
- Bundle size tracking (e.g. bundlesize)  
- Performance budgets  

---

## 6. Risk Assessment

### Implementation Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking change in lazy component | Medium | High | Tests, staged rollout, feature flags |
| CLS from loading states | Medium | Medium | Skeletons, reserved space, min-height |
| Third-party init failures (Sentry/PostHog) | Low | High | Error boundaries, fallbacks, feature flags |
| Over-splitting (waterfall) | Low | Medium | Prefetch critical chunks, avoid tiny chunks |

### Rollback Plan

**If performance or stability degrades:**  
1. Revert last deploy (feature branch)  
2. Inspect Lighthouse/RUM to find cause  
3. Fix in small increments, re-deploy  
4. Validate in staging first  

**Triggers:**  
- FCP ↑ > 100 ms → Investigate  
- LCP ↑ > 200 ms → Consider rollback  
- CLS ↑ > 0.05 → Rollback  
- Error rate ↑ > 1% → Rollback  

---

## 7. Expected Performance Impact

### Current State (Baseline)

```
Client bundle: 1.36 MB
Initial load: ~600–700 KB
FCP: ~2.0 s (est.)
LCP: ~2.5 s (est.)
```

### After Week 1

```
Client bundle: ~1.14 MB (−220 KB, −16%)
Initial load: ~400–500 KB
FCP: ~1.8 s (−200 ms, −10%)
LCP: ~2.2 s (−300 ms, −12%)
```

### After Week 2 (Cumulative)

```
Client bundle: ~1.06 MB (−300 KB, −22%)
Initial load: ~350–450 KB
FCP: ~1.6 s (−400 ms, −20%)
LCP: ~2.0 s (−500 ms, −20%)
```

### After Week 3 (Full Plan)

```
Client bundle: ~0.95 MB (−415 KB, −30%)
Initial load: ~250–350 KB
FCP: ~1.4 s (−600 ms, −30%)
LCP: ~1.8 s (−700 ms, −28%)
```

*Estimates assume gzip; actuals depend on network, device, caching.*

---

## 8. Success Metrics

### Quantitative

**Bundle:**  
- Target: < 500 KB initial JS  
- Stretch: < 300 KB  

**Core Web Vitals:**  
- FCP < 1.5 s  
- LCP < 2.5 s  
- CLS < 0.1  
- TTI < 3.5 s  

**Lighthouse:**  
- Performance > 90 (mobile), > 95 (desktop)  

### Qualitative

- [ ] No user-reported perf regressions  
- [ ] Faster perceived load  
- [ ] Smoother transitions  
- [ ] No broken features  

---

## 9. Team Handoff

### Prerequisites

- [ ] Review this priority matrix  
- [ ] Review component_inventory.md for implementation notes  
- [ ] Set up Lighthouse CI  
- [ ] Configure bundle size tracking  
- [ ] Create branch: `feat/code-splitting-optimization`  

### Implementation Checklist (per component)

- [ ] Use implementation notes from component_inventory.md  
- [ ] Add loading/skeleton where needed  
- [ ] Add dynamic import  
- [ ] Add error boundary  
- [ ] Test loading + error states  
- [ ] Update unit tests  
- [ ] Run Lighthouse before/after  
- [ ] Measure bundle delta  
- [ ] Document in PR  

### Communication

**Daily:** Progress + bundle size updates  
**Weekly:** Demo, FCP/LCP/bundle review, priority tweaks  
**After Week 3:** Performance report + next steps  

---

## 10. Next Steps

**Immediate:**  
1. Review and sign off this matrix  
2. Start Week 1 with #1 (PriceComparisonTable)  
3. Set up monitoring and bundle tracking  

**Feeds into:**  
- **Strategy Document (Prompt 4)** – Full report with all analyses  

---

## Appendix A: ROI Calculation Details

### Example: PriceComparisonTable

**Impact:**  
- Savings: 12 KB → Size weight 0.12  
- Route: /results (High) → 10  
- Users: Auth (Premium) → 7  

Impact = (0.12 × 0.4) + (10 × 0.3) + (7 × 0.3) = 0.05 + 3 + 2.1 = **5.15**

**Effort:**  
- Dynamic import + conditional render ≈ 1 h → **1**

**ROI:** 5.15 / 1 = **5.15** (Must Do)

### Example: Sentry defer

**Impact:**  
- Savings: 175 KB → Size weight 10 (capped)  
- Route: All → 10  
- Users: All → 10  

Impact = (10 × 0.4) + (10 × 0.3) + (10 × 0.3) = **10.0**

**Effort:**  
- Bootstrap component, dynamic init, config ≈ 3 h → **3**

**ROI:** 10 / 3 = **3.33** (Must Do)

---

## Appendix B: Prioritization by Impact Only

**If we ignored effort and ranked only by Impact:**

| Component | Impact | Savings (KB) |
|-----------|--------|--------------|
| Sentry defer | 10.0 | ~175 |
| framer-motion/m | 10.0 | ~100 |
| Step3Allergy | 6.09 | ~22 |
| Quiz Step1 | 6.07 | ~17 |
| Quiz Step2 | 6.07 | ~17 |
| HeroSection | 6.05 | ~12 |
| PostHog defer | 6.07 | ~7 |
| ResultsPage | 5.30 | ~50 |
| ResultsContent | 5.17 | ~17 |
| PriceComparisonTable | 5.15 | ~12 |
| PerfumeCard | 5.15 | ~5 |
| ProfilePage | 5.14 | ~9 |
| … | … | … |

**Why ROI is better:**  
- Includes implementation cost  
- Maximizes value per hour  
- Favors quick wins and lower risk  

---

**Analysis Completed:** January 29, 2026  
**Report Status:** ✅ Ready for Final Strategy (Prompt 4)

Dark Mode Component & Dependency Audit
Date: 2026-01-29
Project: f5-new
Analysis Duration: 40 minutes
Part: 2 of 3

## Executive Summary

Components Analyzed: 71 total (51 shared components, 20 app pages)
Critical Components: 10 need focused dark mode updates (header, footer, key UI primitives, hero/CTA, modal)
Dependencies Status: **Healthy** (modern Next 16 / React 19 / Tailwind 4; theming libs not yet installed but compatible)
Build Health: **Passing** (Next.js build succeeds with a single middleware deprecation warning)

**Quick Verdict:**
The project is structurally ready for a robust, class-based dark mode: it uses Tailwind v4 with `darkMode: 'class'`, a clean UI component library, and a strong page structure. However, light-mode assumptions are embedded via `bg-white`, light surfaces, and brand-brown text tokens across many critical components, with only a handful of `dark:` variants in place, so dark mode will require a systematic refactor of color tokens and backgrounds, especially for cards, modals, and layout surfaces. Dependency and build health will not block dark mode adoption; the only missing piece is a proper theme provider (`next-themes` or equivalent) and a toggle.

Estimated Update Effort: **~16–20 hours total**

- Easy components: ~6–8 hours
- Medium components: ~7–9 hours
- Hard components: ~3 hours

---

## Task 4: Component Color Audit ✅

### Component Inventory

**Total Components: 71**

- **`/src/components`**: 51 `.tsx` component files
- **`/src/app` (page routes)**: 20 `page.tsx` files
- **Combined primary UI surface count**: 71 files (not counting hooks/lib/etc.)

**Directory Structure (components-focused):**

- `src/components`
  - Root components:
    - `AdminModal.tsx`
    - `ConditionalLayout.tsx`
    - `ConditionalLayout.example.tsx`
    - `ErrorBoundary.tsx`
    - `FeedbackCard.tsx`
    - `FeedbackModal.tsx`
    - `Footer.tsx`
    - `LoadingSpinner.tsx`
    - `NetworkStatusToast.tsx`
    - `PriceAlertButton.tsx`
    - `PriceComparisonTable.tsx`
    - `PWARegister.tsx`
    - `SafetyWarnings.tsx`
    - `SessionProvider.tsx`
    - `TestHistory.tsx`
  - `src/components/landing`
    - `CTASection.tsx`
    - `CTASection.tsx.old`
    - `HeroSection.tsx`
    - `HeroSection.tsx.old`
    - `QuestionsSection.tsx`
    - `QuestionsSection.tsx.old`
  - `src/components/quiz`
    - `QuizLandingContent.tsx`
    - `Step3Allergy.tsx`
    - `SymptomCard.tsx`
  - `src/components/results`
    - `ResultsContent.tsx`
  - `src/components/ui`
    - Core primitives and complex UI:
      - `avatar.tsx`
      - `Badge.tsx`
      - `BlurredTeaserCard.tsx`
      - `button.tsx`
      - `CompactPerfumeCard.tsx`
      - `CounterBadge.tsx`
      - `CTAButton.tsx`
      - `dropdown-menu.tsx`
      - `EmptyState.tsx`
      - `FilterTabs.tsx`
      - `header.tsx`
      - `index.ts`
      - `input.tsx`
      - `MobileFilterModal.tsx`
      - `PerfumeCard.tsx`
      - `PerfumeGrid.tsx`
      - `PerfumeSearchResult.tsx`
      - `PerfumeTimeline.tsx`
      - `PriceComparisonTable.tsx`
      - `RadarChart.tsx`
      - `SearchPerfumeBar.tsx`
      - `ShareButton.tsx`
      - `SmartImage.tsx`
      - `SpeedometerGauge.tsx`
      - `StatsGrid.tsx`
      - `TestimonialsCarousel.tsx`
      - `tooltip.tsx`
      - `UpgradePrompt.tsx`
      - `UpsellCard.tsx`
  - `src/components/ResultsGrid.tsx`

**App Pages (top-level surfaces):**

- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/feedback/page.tsx`
- `src/app/login/page.tsx`
- `src/app/notifications/page.tsx`
- `src/app/pricing/page.tsx`
- `src/app/pricing/success/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/quiz/page.tsx`
- `src/app/quiz/step1-favorites/page.tsx`
- `src/app/quiz/step2-disliked/page.tsx`
- `src/app/quiz/step3-allergy/page.tsx`
- `src/app/register/page.tsx`
- `src/app/results/page.tsx`
- `src/app/settings/page.tsx`
- `src/app/test-header/page.tsx`
- `src/app/test-input/page.tsx`

---

### Critical Components Analysis (Top 10 for Dark Mode)

> Foundation from Part 1: Tailwind v4 with `darkMode: 'class'`, CSS variables for `--background`/`--foreground`, partial `prefers-color-scheme: dark` support, and scattered `dark:` utilities. This audit focuses on the most impactful UI surfaces and primitives that should be dark-mode-safe first.

#### 1. Component: Header

- **Path**: `src/components/ui/header.tsx`
- **Size**: ~150 lines
- **Current Colors (snippets)**:

```tsx
<header 
  dir="rtl" 
  className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-brown-text/10"
>
  <div className="container mx-auto h-full px-4 flex items-center justify-end gap-2 sm:gap-3">
    ...
    {hasFavorites && (
      <span className="absolute top-1 left-1 w-2 h-2 bg-primary rounded-full" />
    )}
  </div>
</header>
```

- **Color Classes Count**: 9 occurrences (`bg-background/95`, `border-brown-text/10`, `bg-red-500`, `bg-primary`, etc.)
- **Dark Mode Support**: **Partial** (uses background tokens like `bg-background`, which can be wired to CSS variables; no explicit `dark:` usage)
- **Complexity**: **Easy**
  - Small number of color tokens; mostly background/border for header shell and badges.
- **Update Effort**: **~30 minutes**
- **Priority**: **High** (visible on every page; sticky global chrome)

#### 2. Component: Footer

- **Path**: `src/components/Footer.tsx`
- **Size**: ~90 lines
- **Current Colors (snippets)**:

```tsx
<footer
  dir="rtl"
  className="bg-white border-t border-brown-text/20 py-8 px-4"
>
  ...
  <h3 className="text-brown-text font-semibold mb-4">قصتنا</h3>
  <Link
    href="/about"
    className="min-touch-target block text-brown-text/85 hover:text-primary transition-colors mb-2 touch-manipulation"
  >
    قصتنا في Ask Seba
  </Link>
  ...
  <div className="border-t border-brown-text/10 pt-6 text-center">
    <p className="text-brown-text/75 text-sm">
      © {new Date().getFullYear()} Ask Seba. جميع الحقوق محفوظة.
    </p>
    <p className="text-brown-text/40 text-xs mt-2">
      صنع بكل حب في السعودية 🇸🇦
    </p>
  </div>
</footer>
```

- **Color Classes Count**: 14 occurrences (mix of `bg-white`, `border-*`, and `text-brown-text` variants)
- **Dark Mode Support**: **None** (no `dark:` variants; assumes light background and dark-brown text)
- **Complexity**: **Medium**
  - Multiple text opacity levels and borders that need dark equivalents; background must flip to a darker token.
- **Update Effort**: **~45 minutes**
- **Priority**: **High** (global footer; appears on most pages)

#### 3. Component: Button (UI Primitive)

- **Path**: `src/components/ui/button.tsx`
- **Size**: ~90 lines
- **Current Colors (snippets)**:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-button font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-touch min-w-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-l from-primary to-primary-dark text-white shadow-button hover:shadow-elevation-2",
        secondary: "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
        outline: "border border-text-secondary text-text-primary hover:bg-cream-bg",
        ghost: "text-text-primary hover:bg-cream-bg",
        danger: "bg-danger-red text-white hover:bg-danger-red/90",
        tertiary: "text-text-primary hover:bg-cream-bg",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
        disabled: "bg-primary/20 text-primary/40 border border-primary/30 cursor-not-allowed",
      },
      ...
    }
  }
)
```

- **Color Classes Count**: 12 occurrences (variants rely heavily on brand tokens)
- **Dark Mode Support**: **Partial** (tokens like `text-text-primary`, `cream-bg`, and `primary` can be remapped via Tailwind theme/colors; no explicit `dark:` variants)
- **Complexity**: **Medium**
  - Centralized variant definitions mean one change affects many buttons, but gradients and multiple states (hover, disabled, danger) need careful contrast tuning for dark mode.
- **Update Effort**: **~1 hour**
- **Priority**: **High** (buttons appear across forms, modals, cards, CTA flows)

#### 4. Component: Input (UI Primitive)

- **Path**: `src/components/ui/input.tsx`
- **Size**: ~105 lines
- **Current Colors (snippets)**:

```tsx
<label className="block text-sm font-medium text-text-primary mb-2 mr-1">
  {label}
</label>
...
<div className="absolute top-1/2 -translate-y-1/2 start-3 text-text-secondary pointer-events-none flex items-center justify-center">
  ...
</div>
...
<input
  type={inputType}
  className={cn(
    'w-full px-4 py-3 rounded-input border transition-all',
    'text-base',
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary',
    displayStartIcon && 'ps-11',
    (isPassword || endIcon) && 'pe-11',
    error && 'border-danger-red',
    className
  )}
/>
...
{error && (
  <p className="text-sm text-danger-red mt-1.5 flex items-center gap-1 mr-1">
    ...
  </p>
)}
{helperText && !error && (
  <p className="text-xs text-text-secondary mt-1.5 mr-1">
    {helperText}
  </p>
)}
```

- **Color Classes Count**: 10 occurrences (text tokens, danger, primary focus)
- **Dark Mode Support**: **Partial** (uses tokenized colors; no `dark:` overrides for borders/backgrounds)
- **Complexity**: **Easy–Medium**
  - Primary work is ensuring background, border, and text tokens resolve correctly in dark mode and that focus ring has sufficient contrast.
- **Update Effort**: **~45 minutes**
- **Priority**: **High** (inputs are core to login/register, quiz filters, settings)

#### 5. Component: FeedbackModal (Modal Shell)

- **Path**: `src/components/FeedbackModal.tsx`
- **Size**: ~180 lines
- **Current Colors (snippets)**:

```tsx
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
  <motion.div
    className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative"
    dir="rtl"
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-brand-gold to-brand-gold-dark p-6 text-white relative">
      <button
        onClick={onClose}
        className="absolute left-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-white/20 p-2 rounded-xl">
          <Lightbulb className="w-6 h-6" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">وش ناقصنا؟</h2>
      </div>
      <p className="text-white/80 text-sm">
        ...
      </p>
    </div>
    ...
    <Button
      type="submit"
      className="w-full py-6 rounded-2xl bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-lg shadow-xl shadow-brand-gold/20 transition-all flex items-center justify-center gap-2"
    >
      ...
    </Button>
  </motion.div>
</div>
```

- **Color Classes Count**: 19 occurrences (backdrop, white modal surface, gold gradients, white overlays, danger/success states)
- **Dark Mode Support**: **None** (assumes white modal surface and bright gold header; backdrop uses `bg-black/60` which works in both modes)
- **Complexity**: **Medium–Hard**
  - Multiple nested surfaces (modal shell, header gradient, buttons) and opacity tweaks need a consistent dark palette and contrast review.
- **Update Effort**: **~1.5 hours**
- **Priority**: **Medium–High** (important user journey; not on every page but key for feedback UX)

#### 6. Component: MobileFilterModal (Filter Sidebar/Bottom Sheet)

- **Path**: `src/components/ui/MobileFilterModal.tsx`
- **Size**: ~210 lines
- **Current Colors (snippets)**:

```tsx
<div className="fixed inset-0 z-[60] lg:hidden" dir="rtl">
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  />
  
  {/* Modal */}
  <div 
    ref={modalRef}
    className="absolute inset-x-0 bottom-0 top-auto max-h-[90vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
  >
    {/* Header */}
    <div className="p-6 border-b border-brown-text/10 flex justify-between items-center bg-cream-bg sticky top-0 z-10">
      <h2 className="font-tajawal-bold text-3xl md:text-4xl text-brown-text">تصفية النتائج</h2>
      <button 
        className="min-touch-target p-3 hover:bg-brown-text/5 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-brown-text" />
      </button>
    </div>
    ...
    <span 
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: family.color || 'var(--color-primary)' }} // brand-gold
    />
    ...
    <div className="bg-cream-bg px-3 py-2 rounded-lg border border-brown-text/10 text-center flex-1">
      {filters.maxPrice} ر.س
    </div>
    ...
    <div className="p-6 border-t border-brown-text/10 bg-cream-bg sticky bottom-0">
      ...
    </div>
  </div>
</div>
```

- **Color Classes Count**: 18 occurrences (white sheet, cream background, brown borders/text, black backdrop, range track colors)
- **Dark Mode Support**: **Partial** (uses CSS vars like `var(--color-primary)` for some chips; rest is light-only)
- **Complexity**: **Hard**
  - Large, interactive layout with multiple nested sections and both Tailwind and inline `style`-based colors; needs a full pass to ensure readability and consistent dark surfaces.
- **Update Effort**: **~2 hours**
- **Priority**: **Medium–High** (critical on mobile result filters)

#### 7. Component: HeroSection (Landing Hero)

- **Path**: `src/components/landing/HeroSection.tsx`
- **Size**: ~125 lines
- **Current Colors (snippets)**:

```tsx
<section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream via-cream to-cream/95">
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-radial from-gold/15 via-gold/5 to-transparent blur-3xl" />
  </div>
  ...
  {mounted && (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      ...
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-gold/30"
        ...
      />
    </div>
  )}
  ...
  <Image
    src="/perfume_transparent.webp"
    alt="Perfume Bottle"
    className="drop-shadow-[0_20px_40px_rgba(91,66,51,0.3)] transition-all duration-500 hover:drop-shadow-[0_30px_60px_rgba(179,157,125,0.4)]"
  />
  <motion.div
    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-radial from-gold/20 to-transparent opacity-0"
    whileHover={{ opacity: 1 }}
  />
```

- **Color Classes Count**: 5 occurrences (cream gradients, gold glow)
- **Dark Mode Support**: **None** (hero is explicitly light/creamy; gradients are light-mode centric)
- **Complexity**: **Medium**
  - Background gradients, subtle glows, and image shadows must be rethought for dark mode while preserving the “luxury” feel.
- **Update Effort**: **~1 hour**
- **Priority**: **Medium–High** (marketing-critical; first impression on the home page)

#### 8. Component: CTASection (Primary CTA)

- **Path**: `src/components/landing/CTASection.tsx`
- **Size**: ~110 lines
- **Current Colors (snippets)**:

```tsx
<section className="py-12">
  <div className="container mx-auto px-6">
    ...
    <motion.button
      className="group relative w-[90%] max-w-[300px] overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-dark px-12 py-[18px] text-lg font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-70 md:w-auto"
      animate={{
        boxShadow: [
          '0 4px 20px rgba(179, 157, 125, 0.4)',
          '0 6px 30px rgba(179, 157, 125, 0.6)',
          '0 4px 20px rgba(179, 157, 125, 0.4)',
        ],
      }}
      whileHover={{ 
        scale: 1.05,
        y: -3,
        boxShadow: '0 8px 30px rgba(179, 157, 125, 0.5)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative z-10">
        {isClicked ? 'جاري التحميل...' : 'ابدأ الرحلة'}
      </span>
    </motion.button>
  </div>
</section>
```

- **Color Classes Count**: 3 Tailwind color utilities plus custom rgba shadows
- **Dark Mode Support**: **Partial** (gold brand gradient works on dark backgrounds but shimmer uses white and light shadows)
- **Complexity**: **Easy–Medium**
  - Main adjustment is ensuring enough contrast against a darker hero/background and tuning the shimmer/box-shadow colors.
- **Update Effort**: **~30–45 minutes**
- **Priority**: **High** (primary conversion CTA)

#### 9. Component: PerfumeCard (Key Result Card)

- **Path**: `src/components/ui/PerfumeCard.tsx`
- **Size**: ~145 lines
- **Current Colors (snippets)**:

```tsx
<div className="group relative bg-white rounded-3xl shadow-elevation-1 border border-primary/5 overflow-hidden hover:shadow-elevation-3 transition-all duration-500 flex flex-col h-full">
  ...
  {isSafe && (
    <div className="bg-safe-green/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
      <ShieldCheck className="w-3 h-3" />
      آمن تماماً
    </div>
  )}
  {rarity === 'exclusive' && (
    <div className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
      <Star className="w-3 h-3 fill-current" />
      إصدار حصري
    </div>
  )}
  ...
  <div className="relative aspect-[4/5] w-full bg-cream-bg overflow-hidden">
    <Image ... />
    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
  ...
  <p className="text-primary font-bold text-xs mb-1 tracking-widest uppercase">{brand}</p>
  <h3 className="text-xl font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{displayName}</h3>
  <p className="text-text-secondary text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
    {description || "..."}
  </p>
  ...
  <TrendingUp className="w-4 h-4 text-safe-green" />
  <AlertCircle className="w-4 h-4 text-danger-red" />
```

- **Color Classes Count**: 20 (white card, cream background, primary borders, multiple status colors)
- **Dark Mode Support**: **None** (card is strongly light-theme oriented: white surface, cream background, white gradient overlays)
- **Complexity**: **Hard**
  - Complex internal hierarchy with multiple badges, status indicators, and gradient overlays; requires a thorough tokenization and the introduction of dark surface tokens (`bg-surface`, `bg-surface-elevated`, etc.).
- **Update Effort**: **~2 hours**
- **Priority**: **High** (central to results pages and product perception)

#### 10. Component: FilterTabs (Filter Pills)

- **Path**: `src/components/ui/FilterTabs.tsx`
- **Size**: ~60 lines
- **Current Colors (snippets)**:

```tsx
<button
  className={`min-touch-target flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm whitespace-nowrap transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
    isActive
      ? 'bg-primary text-white shadow-md shadow-primary/20'
      : 'bg-white dark:bg-surface-dark border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-text-muted hover:text-primary dark:hover:text-white active:bg-stone-100 dark:active:bg-stone-800'
  }`}
>
  ...
  {tab.count !== undefined && (
    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
      isActive 
        ? 'bg-white/20 text-white' 
        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
    }`}>
      {tab.count}
    </span>
  )}
</button>
```

- **Color Classes Count**: 7 (primary background, white background, stone-based neutrals, dark variants)
- **Dark Mode Support**: **Partial–Good**
  - Explicit `dark:` variants already present for background, border, and text.
- **Complexity**: **Easy**
  - Mostly verifying that these classes align with the final token palette and adjusting if naming (`bg-surface-dark`, `text-muted`) changes.
- **Update Effort**: **~20–30 minutes**
- **Priority**: **Medium** (important for filters but not global chrome)

---

### Component Summary Table

| Component      | Path                                  | Colors (bg/text/border) | Complexity | Effort      | Priority |
|----------------|---------------------------------------|--------------------------|------------|------------|----------|
| Header         | `src/components/ui/header.tsx`        | 9                        | Easy       | 30 min     | High     |
| Footer         | `src/components/Footer.tsx`           | 14                       | Medium     | 45 min     | High     |
| Button         | `src/components/ui/button.tsx`        | 12                       | Medium     | 1 hour     | High     |
| Input          | `src/components/ui/input.tsx`         | 10                       | Easy–Med   | 45 min     | High     |
| FeedbackModal  | `src/components/FeedbackModal.tsx`    | 19                       | Med–Hard   | 1.5 hours  | Med–High |
| MobileFilterModal | `src/components/ui/MobileFilterModal.tsx` | 18                | Hard       | 2 hours    | Med–High |
| HeroSection    | `src/components/landing/HeroSection.tsx` | 5                     | Medium     | 1 hour     | Med–High |
| CTASection     | `src/components/landing/CTASection.tsx`   | 3                     | Easy–Med   | 30–45 min  | High     |
| PerfumeCard    | `src/components/ui/PerfumeCard.tsx`   | 20                       | Hard       | 2 hours    | High     |
| FilterTabs     | `src/components/ui/FilterTabs.tsx`    | 7                        | Easy       | 20–30 min  | Medium   |

---

### Color Usage Statistics

**Tailwind Color Classes (components only):**

- **Total occurrences in `src/components`**: 590 matches of `bg-`, `text-`, or `border-` across 44 `.tsx` files.
- **Most common patterns:**
  - Light surfaces and cards: `bg-white`, `bg-white/70`, `bg-cream-bg`
  - Neutral backgrounds: `bg-gray-50`, `bg-gray-200`, `bg-stone-100`
  - Text tokens: `text-brown-text`, `text-brown-text/85`, `text-text-primary`, `text-text-secondary`
  - Brand colors and states: `bg-primary`, `bg-brand-gold`, `bg-danger-red`, `bg-safe-green`, `bg-warning-amber`

**Sample Light-Mode Color Usage (from components):**

```tsx
// QuestionsSection card
className="group relative w-[95%] max-w-[600px] cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-white/70 px-8 py-5 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl md:w-[90%]"

// CTASection button
className="group relative w-[90%] max-w-[300px] overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-dark px-12 py-[18px] text-lg font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-70 md:w-auto"

// UpgradePrompt card
className={`relative bg-white rounded-[2.5rem] p-8 md:p-16 border border-primary/10 shadow-elevation-3 overflow-hidden ${className}`}

// RadarChart container
<div className={`relative bg-white rounded-3xl p-8 shadow-elevation-2 border border-primary/5 ${className}`} dir="rtl">
```

**Dark Variants Present:**

- `dark:` usage appears in **4 lines** across **2 components**:
  - `src/components/ui/FilterTabs.tsx`
  - `src/components/ui/SmartImage.tsx`
- Example:

```tsx
// FilterTabs
isActive
  ? 'bg-primary text-white shadow-md shadow-primary/20'
  : 'bg-white dark:bg-surface-dark border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-text-muted hover:text-primary dark:hover:text-white active:bg-stone-100 dark:active:bg-stone-800'

// SmartImage
className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 rounded-xl`}
...
<div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center">
```

- **Dark variants count**: 4 lines total → **very limited dark-mode coverage today**, mostly localized to two small components.

**Inline Styles with Colors:**

- **Count**: 5 occurrences in components
  - `src/components/quiz/SymptomCard.tsx` – `style={{ backgroundColor: symptom.color }}`
  - `src/components/ui/MobileFilterModal.tsx` – `style={{ backgroundColor: family.color || 'var(--color-primary)' }}`
  - `src/components/ui/StatsGrid.tsx` – `style={{ background: stat.gradient }}`, `style={{ color: stat.color || 'var(--color-primary)' }}`, `style={{ color: stat.color || 'var(--color-text-primary)' }}`

**Examples:**

```tsx
// SymptomCard
style={{ backgroundColor: symptom.color }}

// MobileFilterModal family dots
style={{ backgroundColor: family.color || 'var(--color-primary)' }} // brand-gold

// StatsGrid
style={{ background: stat.gradient }}
style={{ color: stat.color || 'var(--color-primary)' }} // brand-gold
style={{ color: stat.color || 'var(--color-text-primary)' }} // brand-brown
```

**Hardcoded Hex/RGB Values Inside Components:**

- **Count in `src/components`**: 10 matches across 3 files, primarily in:
  - `src/components/quiz/Step3Allergy.tsx`
  - `src/components/ui/PerfumeTimeline.tsx`
  - `src/components/ui/SpeedometerGauge.tsx`
- Many additional hex values are defined in:
  - `tailwind.config.ts` (brand palette)
  - `src/app/globals.css` (background/foreground vars and focus ring)

**Examples (from global/theme configuration – Part 1 reference):**

```css
/* globals.css */
--background: #ffffff;
--foreground: #171717;
--background: #0a0a0a;
--foreground: #ededed;
*:focus-visible { box-shadow: 0 0 0 2px white, 0 0 0 4px #c0841a; }
.text-secondary { color: #8B7355; }
```

---

### Complexity Distribution

**Easy Components (1–3 colors, simple states):**

- Examples:
  - `Header` (top bar shell)
  - `Input` (single-field styling)
  - `FilterTabs` (already has `dark:` variants)
  - Small badges and counters (`Badge`, `CounterBadge`, `EmptyState`)
- **Total**: ~25 components
- **Estimated effort**: **~6–8 hours** (batchable via shared tokens/utilities)

**Medium Components (4–8 colors, simple but multi-state):**

- Examples:
  - `Footer`
  - `Button` (variants)
  - `HeroSection`
  - `CTASection`
  - `ResultsGrid`, `ResultsContent`
  - `UpgradePrompt`, `RadarChart`, `StatsGrid`
- **Total**: ~20 components
- **Estimated effort**: **~7–9 hours**

**Hard Components (9+ colors, gradients, complex states/layouts):**

- Examples:
  - `PerfumeCard`
  - `MobileFilterModal`
  - `FeedbackModal` (gradient header + white shell)
  - Some quiz/step flows (`Step3Allergy`, multi-colored chips)
- **Total**: ~6 components
- **Estimated effort**: **~3 hours** (after design tokens and patterns are established)

**Grand Total Estimate for Components:** **~16–20 hours**

---

### High-Risk Components

- **PerfumeCard (`src/components/ui/PerfumeCard.tsx`)**
  - **Issue**: Rich card with multiple badges, overlays, and mixed text colors relies heavily on white/cream surfaces and brand colors.
  - **Impact**: **High** – central to results UX and visual identity.
  - **Mitigation**: Introduce surface tokens (`bg-surface`, `bg-surface-elevated`, `bg-surface-muted`), refactor card backgrounds and badges to use them, and ensure status colors have dark equivalents with accessible contrast.

- **MobileFilterModal (`src/components/ui/MobileFilterModal.tsx`)**
  - **Issue**: Complex layout combining white surfaces, cream headers, brown text, and inline `style` color chips.
  - **Impact**: **High** – key interaction on mobile results page.
  - **Mitigation**: Map `bg-white`/`bg-cream-bg` to light and dark tokens, convert inline `backgroundColor` to a semantic token (CSS var or Tailwind class), and ensure sliders and chips are legible in dark mode.

- **FeedbackModal (`src/components/FeedbackModal.tsx`)**
  - **Issue**: Strong white surfaces and gold gradients may cause glare and low contrast in dark mode.
  - **Impact**: **Medium–High** – important for feedback flows.
  - **Mitigation**: Introduce dark modal shell variant (`bg-surface-dark` with subtle border/outline) and dark version of the gold gradient (tone down brightness; ensure sufficient foreground contrast).

- **HeroSection & CTASection (landing)**
  - **Issue**: Highly light-centric gradients and glow/fade effects depend on bright creams and whites.
  - **Impact**: **Medium–High** – primary marketing experience.
  - **Mitigation**: Create dark-mode-specific gradient tokens (e.g., `bg-gradient-hero-dark`), ensure text remains readable, and adjust glow/shadow colors to work on darker backgrounds.

---

### Components Already Dark-Mode Ready

- Components with meaningful `dark:` variants:
  - `FilterTabs` – uses `dark:bg-surface-dark`, `dark:border-stone-800`, `dark:text-text-muted`, `dark:hover:text-white`, `dark:bg-stone-800` for counts.
  - `SmartImage` – uses `dark:bg-gray-700` for skeleton and placeholder surfaces.

```tsx
// FilterTabs
isActive
  ? 'bg-primary text-white shadow-md shadow-primary/20'
  : 'bg-white dark:bg-surface-dark border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-text-muted hover:text-primary dark:hover:text-white active:bg-stone-100 dark:active:bg-stone-800'
```

- **Verdict**: A few components show **good patterns** for `dark:` usage, but **most critical components are not yet dark-mode aware**.

---

### Update Strategy by Priority (Components)

**Phase 1 (Critical – Week 1):**

- Layout and chrome:
  - `RootLayout` (class wiring via provider – covered in Part 3)
  - `Header` (`src/components/ui/header.tsx`)
  - `Footer` (`src/components/Footer.tsx`)
- Core primitives:
  - `Button`, `Input`, `FilterTabs`

**Phase 2 (Important – Week 1–2):**

- Results and marketing:
  - `PerfumeCard`, `PerfumeGrid`, `ResultsGrid`, `ResultsContent`
  - `HeroSection`, `CTASection`, `QuestionsSection`
- Interaction overlays:
  - `MobileFilterModal`, `FeedbackModal`, `AdminModal`

**Phase 3 (Nice-to-have – Week 2+):**

- Supporting and lower-traffic components:
  - `UpgradePrompt`, `BlurredTeaserCard`, `UpsellCard`, `StatsGrid`, `RadarChart`
  - Quiz UI (`QuizLandingContent`, `SymptomCard`, `Step3Allergy`)
  - Misc notifications (`NetworkStatusToast`, `SafetyWarnings`)

**Total Components to Update (for color semantics): ~45–50**

- Remaining components are either already near-neutral or purely functional with minimal color dependence.

---

## Task 5: Dependency Health Check ✅

### Core Framework Versions

**Package Versions (`package.json` excerpts):**

```json
{
  "name": "f5-new",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    ...
  },
  "dependencies": {
    "@prisma/client": "^6.19.1",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@sentry/nextjs": "^10.36.0",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "next-auth": "^5.0.0-beta.30",
    "posthog-js": "^1.115.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    ...
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "prisma": "^6.19.1",
    "tailwindcss": "^4",
    "typescript": "5.9.3",
    ...
  }
}
```

- **Next.js**: `16.1.1`
- **React**: `19.2.3`
- **React DOM**: `19.2.3`
- **Node.js requirement**: **Not specified** in `package.json` `engines`.

**Compatibility Assessment:**

- **Next.js 16.1.1**: ✅ Fully compatible with modern theming libraries like `next-themes` and class-based dark mode.
- **React 19.2.3**: ✅ Compatible with current ecosystem; no issues for dark-mode-specific logic.
- **Node.js**: Not pinned; choose a current LTS (e.g., Node 20) to align with Next 16 recommendations.

---

### Theme-Related Dependencies

**Currently Installed Theme/Color Packages:**

- No explicit theme libraries detected (`next-themes`, `theme-ui`, Chakra, Mantine not present).
- Tailwind CSS 4 is present and configured with `darkMode: 'class'` (from Part 1).

```json
"dependencies": {
  ...
  "tailwind-merge": "^3.4.0"
},
"devDependencies": {
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  ...
}
```

**`next-themes` Status:**

- Search for `next-themes` in `package.json`: **no matches**.
- **Installed**: ❌ **NOT INSTALLED** (needs installation for class-based theme provider).

**Icon Libraries for Toggle / UI:**

- `lucide-react`: `^0.562.0` – **✅ Installed** (already used in header, footer, cards, modals).
- `@radix-ui` primitives: multiple packages installed (`react-dialog`, `react-tooltip`, etc.) – useful for building a theme toggle popover if desired.
- `@heroicons/react`: ❌ Not installed.
- `react-icons`: ❌ Not installed.

**Verdict (Theme Dependencies):**

- Sufficient for building a custom toggle using existing icons (`lucide-react`), but **no theme provider library is installed yet**.

---

### Tailwind Ecosystem

**Tailwind Packages:**

```json
"devDependencies": {
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  ...
}
```

**Tailwind Config (from Part 1):**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        gold: { DEFAULT: '#B39D7D', dark: '#8A7760', light: '#D4C5B0' },
        'dark-brown': '#5B4233',
        'medium-brown': '#8B7355',
        'light-brown': '#A89B8C',
        primary: { DEFAULT: '#c0841a', light: '#d4a84f', dark: '#9a6814' },
        'text-primary': '#5B4233',
        'text-secondary': '#8B7355',
        'safe-green': '#10B981',
        'warning-amber': '#F59E0B',
        'danger-red': '#EF4444',
        'cream-bg': '#FAF8F5',
        'cream-card': '#FFFFFF',
        'google-blue': '#4285F4',
        'google-green': '#34A853',
        'google-yellow': '#FBBC05',
        'google-red': '#EA4335',
        'brand-brown-dark': '#291d12',
        'beige-light': '#EBE1DD',
        'pink-light': '#EEDDD8',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(179, 157, 125, 0.1)',
        medium: '0 8px 30px rgba(179, 157, 125, 0.2)',
        strong: '0 12px 40px rgba(179, 157, 125, 0.3)',
        'elevation-1': '0 2px 8px rgba(91, 66, 51, 0.08)',
        'elevation-2': '0 4px 16px rgba(91, 66, 51, 0.12)',
        'elevation-3': '0 8px 24px rgba(91, 66, 51, 0.16)',
        button: '0 2px 8px rgba(192, 132, 26, 0.2)',
        card: '0 4px 16px rgba(91, 66, 51, 0.12)',
        luxury: '0 20px 40px rgba(0,0,0,0.08)',
        radar: '0 0 40px rgba(16,185,129,0.3)',
      },
      ...
    },
  },
  plugins: [],
};
export default config;
```

- **Plugins Detected**: `plugins: []` → **no Tailwind plugins configured**.

**Recommended (Optional) Plugins for Dark Mode UX:**

- `@tailwindcss/forms` – for consistent form styling (helpful but not required; can be added later).
- `@tailwindcss/typography` – for any long-form text/prose areas (e.g., FAQ, privacy).

---

### Potential Conflicts

**CSS-in-JS Libraries (via `package.json` search):**

- `styled-components`: ❌ Not present
- `@emotion/react`: ❌ Not present
- `@stitches/react`: ❌ Not present

**Other Theming Solutions:**

- `theme-ui`: ❌ Not found
- `@chakra-ui/react`: ❌ Not found
- `@mantine/core`: ❌ Not found

**Conflict Assessment:**

- ✅ **No overlapping theming systems detected** – project is Tailwind + minimal CSS only.
- ✅ Ideal baseline for introducing a single dark-mode strategy (class-based with `dark:` and CSS variables).

---

### Required Installations

**Must Install (for Part 3 implementation):**

```bash
npm install next-themes
```

**Recommended (if/when needed):**

```bash
# For richer form styling in dark mode
npm install @tailwindcss/forms

# For long-form content (FAQ / privacy / blog-style pages)
npm install @tailwindcss/typography
```

> Note: `lucide-react` is already installed and can be reused for the theme toggle icon (e.g., `Moon`, `Sun`, or `SunMoon` icons).

---

### Version Compatibility Matrix

| Package       | Current     | Required (min) | Status         |
|---------------|------------|----------------|----------------|
| next          | 16.1.1     | ≥ 13.0.0       | ✅ OK          |
| react         | 19.2.3     | ≥ 18.0.0       | ✅ OK          |
| react-dom     | 19.2.3     | ≥ 18.0.0       | ✅ OK          |
| tailwindcss   | ^4         | ≥ 3.4.0        | ✅ Modern      |
| next-themes   | none       | ≥ 0.2.0        | ❌ Needs install |
| lucide-react  | ^0.562.0   | ≥ 0.x          | ✅ OK          |

**Package Manager Detection:**

- Lock files present:
  - `package-lock.json`
  - `pnpm-lock.yaml`
- **Primary manager**: project appears npm-based (root `package-lock.json`), but `pnpm-lock.yaml` is also present (likely from experimentation).
- **Recommended command**: use **npm** to match `package-lock.json`, unless the team standardizes on pnpm.

```bash
npm install next-themes
```

---

### Dependency Verdict

- **Overall Health**: ✅ **Healthy** – modern framework and tooling with no critical version conflicts.
- **Blockers**: None detected for dark mode; only missing the theme provider and minor optional plugins.

**Action Items:**

- Install `next-themes` as the theme provider.
- Optionally install `@tailwindcss/forms` and `@tailwindcss/typography` for better dark-mode form and text rendering.
- Clarify team preference for package manager (npm vs pnpm) and stick to one going forward.

**Ready to Proceed with Dark Mode**: ✅ **Yes (after installing `next-themes`)**

---

## Task 6: Build System Analysis ✅

### Next.js Configuration

- **File**: `next.config.js`

```ts
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "ask.seba", port: "", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "api.fragella.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "*.fragella.com", port: "", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  reactStrictMode: true,
  trailingSlash: false,
  output: 'standalone',
  
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*/',
          destination: '/api/:path*',
        },
      ],
    }
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800' },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "ask-seba",
  project: "ask-seba",
});
```

**Key Settings:**

- `reactStrictMode`: **true**
- `experimental.optimizeCss`: **true** (helps with CSS output size; compatible with dark mode)
- `compiler.removeConsole`: enabled in production
- `output: 'standalone'` (good for containerized deployment)
- Image optimization is configured with explicit remote patterns and modern formats.

**Dark Mode Implications:**

- ✅ No configuration blockers for dark mode.
- ✅ `optimizeCss: true` is compatible with Tailwind’s dark variants and CSS variables.
- ⚠️ One deprecation warning around middleware (see build output) – unrelated to theming but should be addressed eventually.

---

### TypeScript Configuration

- **File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@sentry/nextjs"],
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules",
    "extracted_files",
    "modified_files",
    "deployment-ready",
    "docs/archive",
    ".dev-tools-output"
  ]
}
```

**Strict Mode Settings:**

- `strict`: **true**
- `strictNullChecks`: enabled via `strict`
- `noImplicitAny`: enabled via `strict`

**Dark Mode Impact:**

- ✅ Strong type safety will help when introducing a theme context/provider, `useTheme` hooks, and any color token maps.
- ✅ `paths` alias (`@/*`) keeps theme-related modules organized (e.g., `@/components/ThemeProvider`).

---

### Build Test Results

**Build Command:**

```bash
npm run build
```

**Exit Code:** `0` (success)

**Build Output (tail, summarized):**

```text
> f5-new@0.1.0 build
> next build

▲ Next.js 16.1.1 (Turbopack)
- Environments: .env.local
- Experiments (use with caution):
  · clientTraceMetadata
  ✓ optimizeCss

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
✓ Compiled successfully in 18.2s
  Running next.config.js provided runAfterProductionCompile ...
✓ Completed runAfterProductionCompile in 1799ms
  Running TypeScript ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/24) ...
  ...
✓ Generating static pages using 7 workers (24/24) in 1127.5ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /dashboard
├ ○ /faq
├ ○ /feedback
├ ○ /login
├ ○ /notifications
├ ○ /pricing
├ ○ /pricing/success
├ ○ /privacy
├ ○ /profile
├ ○ /quiz
├ ○ /quiz/step1-favorites
├ ○ /quiz/step2-disliked
├ ○ /quiz/step3-allergy
├ ○ /register
├ ○ /results
├ ○ /settings
├ ○ /sitemap.xml
├ ○ /test-header
└ ○ /test-input

ƒ Proxy (Middleware)

○  (Static)  prerendered as static content
```

**Build Statistics (from output):**

- Build time: ~18.2s compile + ~1.8s post-compile script + ~1.1s static generation.
- Pages compiled: 20 app routes + `_not-found` + `sitemap.xml`.

**Build Health:**

- ✅ **Build passes with no errors.**
- ⚠️ One deprecation warning about the `middleware` file convention; not directly related to dark mode.

---

### Warnings & Errors

**Warnings Found:**

- Middleware deprecation:
  - `"The "middleware" file convention is deprecated. Please use "proxy" instead."`
  - This references the existing `middleware.ts` and will need modernization at some point, but does not block dark mode.

**Errors Found:**

- None – build completed successfully.

**Impact on Dark Mode Implementation:**

- ✅ No build issues that would block adding a theme provider, `dark` classes, or additional CSS variables.
- ⚠️ When refactoring to a new proxy convention later, ensure any theme-related headers/cookies added in middleware are carried over correctly (if introduced in Part 3).

**Build System Verdict:**

- Overall Assessment: ✅ **Healthy**
- Specific Issues:
  - Middleware deprecation only; no immediate impact on dark mode.
- Recommendations:
  - Plan a future refactor from `middleware` to `proxy` following the Next.js docs.
  - Keep `optimizeCss` enabled; it works well with Tailwind.

**Ready for Dark Mode:** ✅ **Yes**

---

## Final Summary for Part 2

### Top 5 Components to Update First

1. **Header (`src/components/ui/header.tsx`)** – Always visible; must adopt dark-safe background and border tokens.
2. **Footer (`src/components/Footer.tsx`)** – Global, currently strongly light-only (`bg-white`, `text-brown-text`).
3. **Button (`src/components/ui/button.tsx`)** – Central primitive; all variants must function in both themes.
4. **PerfumeCard (`src/components/ui/PerfumeCard.tsx`)** – High-impact card; visually complex and currently light-mode only.
5. **MobileFilterModal (`src/components/ui/MobileFilterModal.tsx`)** – Critical mobile interaction with mixed inline and Tailwind colors.

### Required Installations (for Part 3)

- **Theme provider:**

```bash
npm install next-themes
```

- **Optional Tailwind plugins (for UX polish in dark mode):**

```bash
npm install @tailwindcss/forms @tailwindcss/typography
```

### Build Blockers

- None for dark mode:
  - Build passes.
  - Only a middleware deprecation warning exists, unrelated to theming.

---

## Next Steps (for Part 3: Strategy & Final Report)

**Critical Info Carried Forward:**

- **Total primary UI files**: 71 (`src/components` + app `page.tsx` routes).
- **Estimated component update effort**: **~16–20 hours** (excluding theme provider wiring).
- **Dependencies**: Ready – only need to add `next-themes` and optional Tailwind plugins.
- **Build**: Healthy – no errors; dark mode work can proceed safely.

**Ready for Part 3:** ✅ **Yes (after installing `next-themes`)**


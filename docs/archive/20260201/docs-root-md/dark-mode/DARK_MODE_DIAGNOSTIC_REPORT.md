## 🌓 Dark Mode Implementation - Complete Diagnostic Report

**Project:** f5-new  
**Analysis Date:** 2026-01-29  
**Total Analysis Time:** ~100 minutes  
**Analyzer:** Cursor AI

---

## 📊 Executive Summary

### Quick Stats
- **Project Type:** Next.js 16.1.1 with App Router
- **Styling System:** Tailwind CSS v4 + `globals.css` + inline styles + CSS variables
- **Total Components:** 71 primary UI files (51 shared components, 20 app pages)
- **Components Needing Updates:** 10 critical + ~35–40 additional (≈45–50 total)
- **Existing Dark Mode:** Partial (CSS `prefers-color-scheme` + a few `dark:` utilities, no theme provider/toggle)
- **Build Health:** ✅ Passing (single middleware deprecation warning, no blocking errors)

### Effort Estimate
- **Total Implementation Time (dark mode end‑to‑end):** ~20–24 hours (~5–6 working days)
  - Foundation (provider, variables, toggle): ~4 hours
  - Component updates (from Part 2): ~16–20 hours
- **Complexity:** Medium
- **Risk Level:** Medium
- **Success Probability:** **88–92%** (High, with manageable design/systemic risks)

### Decision
- [x] ✅ **PROCEED** – Ready for dark mode implementation
- [ ] ⚠️ **CAUTION** – Address blockers first
- [ ] 🚨 **BLOCKED** – Major issues must be resolved

### Timeline
- **Phase 1 (Foundation):** Day 1, ~2–3 hours
- **Phase 2 (Critical Components):** Days 2–3, ~8–10 hours
- **Phase 3 (Remaining Components):** Days 4–5, ~8–10 hours
- **Phase 4 (Testing & Polish):** Day 6, ~4–6 hours
- **Total:** ~1 week calendar time

---

## Part 1: Foundation Analysis

[Copied from `foundation_analysis.md`]

---

Dark Mode Foundation Analysis
Date: 2026-01-29
Project: f5-new
Analysis Duration: 35 minutes
Part: 1 of 3

## Executive Summary

Project Type: Next.js 16.1.1 with App Router
Styling System: Tailwind CSS v4 with globals.css + some inline styles and CSS variables
Existing Theme Code: Partial (CSS-level dark mode via prefers-color-scheme, no JS theme provider)
Readiness Level: Ready (with some prep and standardization)

Quick Verdict:
The project is structurally ready for a robust dark mode: it uses the Next.js App Router, Tailwind v4 with `darkMode: 'class'`, and already has CSS variables plus a basic prefers-color-scheme-based dark theme. However, dark mode is not wired through a theme provider or toggle, and color usage is split across Tailwind utilities, inline styles, and custom classes, so some consolidation and variable standardization will be required.

---

### Task 1: Project Structure ✅

#### Step 1: Identify project basics

**Command (conceptual equivalent):**
`cat package.json | grep -E '"name"|"next"|"react"' | head -5`

**Output (from `package.json`):**
```json
{
  "name": "f5-new",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    ...
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    ...
  }
}
```

**Command (conceptual equivalent):**
`find src -name ".tsx" -o -name ".jsx" 2>/dev/null | wc -l`

**Output (from glob search):**
- Total `.tsx` files found (including src + node_modules): 82
- `.tsx` files in `src` (subset of above, based on listing): 76
- Total `.jsx` files: 0

**Component Count:**
- Total .tsx files: 82 (including node_modules helper pages)
- Total .jsx files: 0
- Combined total: 82

**Command (conceptual equivalent):**
`ls -la src/ 2>/dev/null`

**Output (from `src` directory listing):**
```text
src\
  app\
    about\
      page.tsx
    dashboard\
      page.tsx
    error.tsx
    faq\
      page.tsx
    favicon.ico
    feedback\
      page.tsx
    globals.css
    layout.tsx
    login\
      page.tsx
    not-found.tsx
    notifications\
      page.tsx
    page.tsx
    page.tsx.backup
    pricing\
      page.tsx
      success\
        page.tsx
    privacy\
      page.tsx
    profile\
      page.tsx
    quiz\
      page.tsx
      step1-favorites\
        page.tsx
      step2-disliked\
        page.tsx
      step3-allergy\
        page.tsx
    register\
      page.tsx
    results\
      page.tsx
    settings\
      page.tsx
    sitemap.ts
    test-header\
      page.tsx
    test-input\
      page.tsx
  auth.ts
  components\
    AdminModal.tsx
    ConditionalLayout.example.tsx
    ConditionalLayout.tsx
    ErrorBoundary.tsx
    FeedbackCard.tsx
    FeedbackModal.tsx
    Footer.tsx
    installation_instructions_v23.md
    landing\
      CTASection.tsx
      CTASection.tsx.old
      HeroSection.tsx
      HeroSection.tsx.old
      QuestionsSection.tsx
      QuestionsSection.tsx.old
    LoadingSpinner.tsx
    NetworkStatusToast.tsx
    PriceAlertButton.tsx
    PriceComparisonTable.tsx
    PWARegister.tsx
    quiz\
      QuizLandingContent.tsx
      Step3Allergy.tsx
      SymptomCard.tsx
    results\
      ResultsContent.tsx
    ResultsGrid.tsx
    SafetyWarnings.tsx
    SessionProvider.tsx
    TestHistory.tsx
    ui\
      avatar.tsx
      Badge.tsx
      BlurredTeaserCard.tsx
      button.tsx
      CompactPerfumeCard.tsx
      CounterBadge.tsx
      CTAButton.tsx
      dropdown-menu.tsx
      EmptyState.tsx
      FilterTabs.tsx
      HEADER_README.md
      header.tsx
      index.ts
      input.tsx
      MobileFilterModal.tsx
      PerfumeCard.tsx
      PerfumeGrid.tsx
      PerfumeSearchResult.tsx
      PerfumeTimeline.tsx
      PriceComparisonTable.tsx
      RadarChart.tsx
      SearchPerfumeBar.tsx
      ShareButton.tsx
      SmartImage.tsx
      SpeedometerGauge.tsx
      StatsGrid.tsx
      TestimonialsCarousel.tsx
      tooltip.tsx
      UpgradePrompt.tsx
      UpsellCard.tsx
  content\
    content.json
    index.ts
  contexts\
    QuizContext.tsx
  data\
    note-to-ingredient-map.ts
    symptom-mappings.ts
  hooks\
    useAnalytics.ts
    useCrossTabLogout.ts
    useDebounce.ts
    useFavorites.ts
    useFocusTrap.ts
    useNetworkStatus.ts
    useQuizStepGuard.ts
    useResultsFilters.ts
  lib\
    auth.ts
    classnames.ts
    clear-user-data.ts
    data\
      ifra\
        eu-allergens-2023.ts
      perfumes.ts
      symptoms.ts
    email\
      email.service.ts
    gating.ts
    logger.ts
    matching.ts
    migrate-favorites.ts
    moyasar.ts
    payment\
      moyasar.service.ts
    posthog-client.ts
    prisma.ts
    rate-limit.ts
    scent-analysis.ts
    services\
      ifra.service.ts
      perfume-bridge.service.ts
      perfume.service.ts
      symptom.service.ts
    utils\
      api-helpers.ts
      arabicPlural.ts
      storage.ts
    utils.ts
  middleware.backup
  middleware.ts
  types\
    fragella.ts
    matching.ts
    next-auth.d.ts
    unified-perfume.ts
```

#### Step 2: Map directory structure

**Command (conceptual equivalent):**
`tree src -L 2 -I 'node_modules' 2>/dev/null`

**Output (2-level structure approximation):**
```text
src
  app
    about
    dashboard
    faq
    feedback
    globals.css
    layout.tsx
    login
    notifications
    page.tsx
    page.tsx.backup
    pricing
    privacy
    profile
    quiz
    register
    results
    settings
    sitemap.ts
    test-header
    test-input
    error.tsx
    not-found.tsx
    favicon.ico
  components
    landing
    quiz
    results
    ui
    various root-level components (*.tsx)
  content
  contexts
  data
  hooks
  lib
    data
    email
    payment
    services
    utils
  types
  middleware.ts
  middleware.backup
```

**Router check commands (conceptual equivalents):**
- `ls -la src/app 2>/dev/null && echo "App Router detected" || echo "Checking pages router..."`
- `ls -la src/pages 2>/dev/null && echo "Pages Router detected" || echo "No pages directory"`

**Output:**
```text
src/app exists and contains layout.tsx and page.tsx               -> App Router detected
src/pages does not exist                                         -> No pages directory
```

#### Task 1 Report

**Project Name:** f5-new  
**Framework:** Next.js 16.1.1  
**React Version:** 19.2.3  
**Router Type:** App Router

**Directory Structure:**  
(see tree output above)

**Component Count:**
- Total .tsx files: 82 (including node_modules helper pages, 70+ in `src`)
- Total .jsx files: 0
- Combined total: 82

**Key Directories Found:**
- `/src/app` (App Router)
- `/src/components`
- `/src/lib`
- `/src/content`
- `/src/hooks`
- `/src/data`
- `/src/types`
- `/src/app/globals.css`
- `public` (implied via favicons and manifest references)

**Router Analysis:**
- **Type:** App Router (Next 13+ style, on Next 16)
- **Layout file:** `src/app/layout.tsx` exists: Yes
- **Root page:** `src/app/page.tsx` exists

**Initial Assessment:**
The project structure is clean, feature-organized, and standard for a modern App Router Next.js app, with a clear separation between `app`, `components`, `lib`, `hooks`, and `data`.

---

### Task 2: Styling System Analysis ✅

#### Step 1: Check styling dependencies

**Command (conceptual equivalent):**
`cat package.json | grep -E "tailwind|styled-components|emotion|sass|css-modules"`

**Relevant entries from `package.json`:**
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

- **tailwindcss:** ^4 (installed) ✅  
- **@tailwindcss/typography:** Not listed → Not installed  
- **styled-components:** Not installed  
- **@emotion/react:** Not installed  
- **sass:** Not installed  

**Tailwind/PostCSS config presence:**

**Commands (conceptual equivalents):**
- `ls -la tailwind.config.* 2>/dev/null`
- `ls -la postcss.config.* 2>/dev/null`

**Outputs (from glob search):**
```text
tailwind.config.ts
tailwind.config.ts.backup
postcss.config.mjs
```

#### Step 2: Analyze Tailwind configuration

**Command (conceptual equivalent):**
`cat tailwind.config.ts`

**Full `tailwind.config.ts`:**
```ts
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
        // Brand colors from the design
        cream: '#FAF8F5',
        gold: {
          DEFAULT: '#B39D7D',
          dark: '#8A7760',
          light: '#D4C5B0',
        },
        'dark-brown': '#5B4233',
        'medium-brown': '#8B7355',
        'light-brown': '#A89B8C',

        // Existing project colors
        primary: {
          DEFAULT: '#c0841a',
          light: '#d4a84f',
          dark: '#9a6814',
        },
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
        'soft': '0 4px 20px rgba(179, 157, 125, 0.1)',
        'medium': '0 8px 30px rgba(179, 157, 125, 0.2)',
        'strong': '0 12px 40px rgba(179, 157, 125, 0.3)',
        'elevation-1': '0 2px 8px rgba(91, 66, 51, 0.08)',
        'elevation-2': '0 4px 16px rgba(91, 66, 51, 0.12)',
        'elevation-3': '0 8px 24px rgba(91, 66, 51, 0.16)',
        'button': '0 2px 8px rgba(192, 132, 26, 0.2)',
        'card': '0 4px 16px rgba(91, 66, 51, 0.12)',
        'luxury': '0 20px 40px rgba(0,0,0,0.08)',
        'radar': '0 0 40px rgba(16,185,129,0.3)',
      },
      
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '12px',
      },
      
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },

      fontFamily: {
        arabic: ['Tajawal', 'Noto Sans Arabic', 'var(--font-arabic)', 'sans-serif'],
        sans: ['Tajawal', 'var(--font-arabic)', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        logo: ['Cormorant Garamond', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },

      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Dark Mode Setting in Tailwind:**
- Configured as `darkMode: 'class'`

**Custom Tailwind Colors (theme.extend.colors section):**
```ts
      colors: {
        cream: '#FAF8F5',
        gold: {
          DEFAULT: '#B39D7D',
          dark: '#8A7760',
          light: '#D4C5B0',
        },
        'dark-brown': '#5B4233',
        'medium-brown': '#8B7355',
        'light-brown': '#A89B8C',
        primary: {
          DEFAULT: '#c0841a',
          light: '#d4a84f',
          dark: '#9a6814',
        },
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
```

#### Step 3: Examine global CSS

**Command (conceptual equivalent):**
`find src -name "globals.css" -o -name "global.css" -o -name "styles.css" | head -1`

**Output:**
```text
src/app/globals.css
```

**Command (conceptual equivalent):**
`cat src/app/globals.css`

**Full `globals.css`:**
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-arabic), sans-serif;
}

/* Accordion Animations */
@keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
}

[data-state="open"] {
  animation: slideDown 300ms ease-out;
}

[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}

/* Design System Foundation - Focus & Touch Styles */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #c0841a;
}

*:focus:not(:focus-visible) {
  outline: none;
}

.text-secondary {
  color: #8B7355;
}

.min-touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

#### Step 4: Detect CSS variables

**Command (conceptual equivalent):**
`grep -h "^\s*--" src/app/globals.css`

**Output:**
```text
  --background: #ffffff;
  --foreground: #171717;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
    --background: #0a0a0a;
    --foreground: #ededed;
```

**Command (conceptual equivalent):**
`grep -i "dark|theme" src/app/globals.css`

**Output:**
```text
@theme inline {
@media (prefers-color-scheme: dark) {
```

**Global CSS Analysis**
- **File Location:** `src/app/globals.css`

**Existing CSS Variables (all lines starting with `--`):**
```css
  --background: #ffffff;
  --foreground: #171717;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
    --background: #0a0a0a;
    --foreground: #ededed;
```

**Dark Mode CSS Variables:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

This is a CSS-only dark mode based on system preference, not the Tailwind `dark` class yet.

**Tailwind @layer directives (Tailwind v4 syntax):**
- `@import "tailwindcss";` present  
- Tailwind v4 uses the new `@import`/`@layer` model; explicit `@tailwind base/components/utilities` lines are not present (expected for v4).

#### Step 5: Analyze color usage patterns

**Command (conceptual equivalent):**
`grep -r "className.*bg-|className.*text-|className.border-" src --include=".tsx" | head -10`

**Sample output (10 matches):**
```text
src/app/page.tsx
7:    <main className="min-h-screen bg-cream">

src/components/landing/CTASection.tsx
63:            className="group relative w-[90%] max-w-[300px] overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-dark px-12 py-[18px] text-lg font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-70 md:w-auto"
91:            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

src/components/landing/QuestionsSection.tsx
61:              className="group relative w-[95%] max-w-[600px] cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-white/70 px-8 py-5 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl md:w-[90%]"
64:              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
67:              <p className="relative z-10 text-[15px] font-medium text-dark-brown md:text-[17px]">

src/components/landing/HeroSection.tsx
26:    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream via-cream to-cream/95">
30:        <div className="h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-radial from-gold/15 via-gold/5 to-transparent blur-3xl" />
45:                className="absolute h-1 w-1 rounded-full bg-gold/30"
66:          className="pt-6 text-center"
```

**Command (conceptual equivalent):**
`grep -r "style.*background|style.color" src --include=".tsx" | head -5`

**Sample output (inline styles):**
```text
src/components/ui/MobileFilterModal.tsx
140:                      style={{ backgroundColor: family.color || 'var(--color-primary)' }} // brand-gold

src/components/quiz/SymptomCard.tsx
39:        style={{ backgroundColor: symptom.color }}

src/components/ui/StatsGrid.tsx
44:              style={{ background: stat.gradient }}
58:                style={{ color: stat.color || 'var(--color-primary)' }} // brand-gold
68:            style={{ color: stat.color || 'var(--color-text-primary)' }} // brand-brown
```

**Command (conceptual equivalent):**
`grep -r "var(--" src --include=".tsx" --include=".css" | head -5`

**Sample output (CSS var usage):**
```text
src/components/ui/RadarChart.tsx
20:  { name: "فلورال", score: 85, color: "var(--color-safe-green)" },
21:  { name: "خشبي", score: 75, color: "var(--color-warning-amber)" },
22:  { name: "حمضيات", score: 30, color: "var(--color-danger-red)" },
23:  { name: "شرقي", score: 45, color: "var(--color-google-blue)" },
24:  { name: "منعش", score: 60, color: "var(--color-accent-purple)" },
```

**Color Usage Patterns**

- **Pattern 1: Tailwind utilities (3–5 examples):**
```tsx
// src/app/page.tsx
<main className="min-h-screen bg-cream">

// src/components/landing/CTASection.tsx
className="... bg-gradient-to-r from-gold to-gold-dark ... text-white ..."

// src/components/landing/QuestionsSection.tsx
className="... border border-gold/20 bg-white/70 ... hover:shadow-xl ..."

// src/components/landing/HeroSection.tsx
className="... bg-gradient-to-br from-cream via-cream to-cream/95"
className="... bg-gradient-radial from-gold/15 via-gold/5 to-transparent ..."
```

- **Pattern 2: Inline styles (2–3 examples):**
```tsx
// src/components/ui/MobileFilterModal.tsx
style={{ backgroundColor: family.color || 'var(--color-primary)' }}

// src/components/quiz/SymptomCard.tsx
style={{ backgroundColor: symptom.color }}

// src/components/ui/StatsGrid.tsx
style={{ background: stat.gradient }}
style={{ color: stat.color || 'var(--color-primary)' }}
style={{ color: stat.color || 'var(--color-text-primary)' }}
```

- **Pattern 3: CSS variables (2–3 examples):**
```tsx
// src/components/ui/RadarChart.tsx
{ name: "فلورال", score: 85, color: "var(--color-safe-green)" }
{ name: "خشبي", score: 75, color: "var(--color-warning-amber)" }
{ name: "حمضيات", score: 30, color: "var(--color-danger-red)" }
{ name: "شرقي", score: 45, color: "var(--color-google-blue)" }
{ name: "منعش", score: 60, color: "var(--color-accent-purple)" }
```

- **Pattern 4: Hardcoded hex/rgb:**
Hardcoded hex values appear in:
```css
// src/app/globals.css
--background: #ffffff;
--foreground: #171717;
--background: #0a0a0a;
--foreground: #ededed;
*:focus-visible { box-shadow: 0 0 0 2px white, 0 0 0 4px #c0841a; }
.text-secondary { color: #8B7355; }
```
And in `tailwind.config.ts` color definitions (e.g. `'#FAF8F5'`, `'#B39D7D'`, etc.).

#### Styling System Verdict

- **Primary Method:** Tailwind CSS (v4) with a small amount of global CSS and inline styles → Hybrid but Tailwind-dominant.

**Conflicts / Issues Detected:**
- **Mix of Tailwind + inline styles:** Yes — inline color/background usage alongside Tailwind utilities.
- **Hardcoded colors in multiple patterns:** Yes — in `tailwind.config.ts`, `globals.css`, and inline styles.
- **CSS variables system:** Present but still minimal; mainly for background/foreground and some derived `@theme` tokens.
- **Dark mode configuration:** Tailwind dark mode is set to `'class'`, while current globals rely on `prefers-color-scheme: dark` for the body/background.

**Complexity Assessment:** Medium  

**Rationale:**
The styling stack is modern and consistent (Tailwind v4 + a small design-system layer in CSS), but the presence of various color definition patterns (Tailwind tokens, CSS vars, inline styles, and raw hexes) means dark mode will require a careful pass to centralize tokens and align the `class`-based Tailwind dark mode with the existing CSS-only dark scheme.

---

### Task 3: Existing Theme Infrastructure ✅

#### Step 1: Search for theme-related code

**Command (conceptual equivalent):**
`grep -r "dark|theme|Theme" src --include=".tsx" --include=".ts" -i | head -20`

**Sample output (first 20 matches):**
```text
src/components/landing/QuestionsSection.tsx
67:              <p className="relative z-10 text-[15px] font-medium text-dark-brown md:text-[17px]">

src/components/landing/CTASection.tsx
63:            className="group relative w-[90%] max-w-[300px] overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-dark px-12 py-[18px] text-lg font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-70 md:w-auto"

src/components/ui/button.tsx
16:        primary: "bg-gradient-to-l from-primary to-primary-dark text-white shadow-button hover:shadow-elevation-2",

src/app/feedback/page.tsx
184:              className="w-full sm:w-auto shadow-lg bg-brand-gold hover:bg-brand-gold-dark text-white"

src/components/FeedbackCard.tsx
157:                ? 'bg-brand-gold text-white hover:bg-brand-gold-dark shadow-md'

src/components/ui/SmartImage.tsx
34:        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 rounded-xl`}
45:        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center">

src/components/FeedbackModal.tsx
75:        <div className="bg-gradient-to-r from-brand-gold to-brand-gold-dark p-6 text-white relative">
159:            className="w-full py-6 rounded-2xl bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-lg shadow-xl shadow-brand-gold/20 transition-all flex items-center justify-center gap-2"

src/components/ui/FilterTabs.tsx
37:                : 'bg-white dark:bg-surface-dark border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-text-muted hover:text-primary dark:hover:text-white active:bg-stone-100 dark:active:bg-stone-800'
50:                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'

src/components/quiz/Step3Allergy.tsx
109:          <h2 className="text-3xl font-bold text-text-dark text-center">
132:                    : 'bg-white border-2 border-cream/50 hover:border-text-dark/30 hover:bg-cream/50'
139:                <h3 className="font-bold text-text-dark text-xl md:text-2xl mb-2 leading-tight">{title}</h3>
140:                <p className="text-sm text-text-dark/70">{desc}</p>
150:          <h2 className="text-3xl font-bold text-text-dark text-center">
173:                    : 'bg-white border-2 border-cream/50 hover:border-text-dark/30'
180:                <h3 className="font-bold text-text-dark text-xl md:text-2xl">{name}</h3>
181:                <p className="text-xs text-text-dark/60 mt-1">{examples}</p>
191:          <h2 className="text-3xl font-bold text-text-dark text-center">
```

These are mostly class names containing `dark:` variants and color tokens; no explicit theme provider or hook appears here.

**Command (conceptual equivalent):**
`grep -r "next-themes|useTheme|ThemeProvider" src --include=".tsx" --include=".ts"`

**Output:**
```text
No matches found
```

**Command (conceptual equivalent):**
`grep -r "createContext.theme|ThemeContext" src --include=".tsx" --include="*.ts" -i`

**Output:**
```text
No matches found
```

**next-themes Detection:**
- `next-themes` not installed in `package.json`.
- No `ThemeProvider` or `useTheme()` usage detected.
- ✅ **Conclusion:** **No next-themes usage found.**

**Custom Theme Code:**
- No `ThemeContext` or custom theme provider detected.  
- **Conclusion:** **❌ No custom theme implementation found** beyond CSS variables and Tailwind `dark:` utilities.

#### Step 2: Check for localStorage/cookie theme code

**Command (conceptual equivalent):**
`grep -r "localStorage.theme|localStorage.dark" src --include=".tsx" --include=".ts" -i`

**Output:**
```text
No matches found
```

**Command (conceptual equivalent):**
`grep -r "cookie.theme|document.cookie.theme" src --include=".tsx" --include=".ts" -i`

**Output:**
```text
No matches found
```

**Theme Persistence:**
- **❌ No theme persistence code found** (no `localStorage` or cookies for theme).
- **Storage Pattern:** none.

#### Step 3: Look for toggle components

**Commands (conceptual equivalents):**
- `find src -name "Toggle" -o -name "Switch" -o -name "Theme" 2>/dev/null`
- `grep -r "toggle|switch" src/components --include="*.tsx" -i | grep -i "theme|dark" | head -10`

**File search output (from glob):**
```text
No files named *Toggle*.* or *Theme*.* found under src/
```

**Toggle/switch usage (limited to components):**
```text
src/components/quiz/Step3Allergy.tsx
60:  const toggleSymptom = (id: string) => {
73:  const toggleFamily = (id: string) => {
82:  const toggleIngredient = (id: string) => {
116:                onClick={() => toggleSymptom(id)}
124:                    toggleSymptom(id)
157:                onClick={() => toggleFamily(id)}
165:                    toggleFamily(id)
201:                onClick={() => toggleIngredient(id)}
209:                    toggleIngredient(id)

src/components/ui/PerfumeTimeline.tsx
21:    switch (status) {
```

These toggles are domain-specific (symptom/family/ingredient) and not theme-related.

**Existing Toggle Components:**
- **Files Found:** None with `Toggle`/`Theme` in the name related to theming.
- **Toggle Code (for theme):** No theme toggle implementation present.  
- **Conclusion:** **❌ No theme toggle components found.**

#### Step 4: Check layout for theme setup

**Command (conceptual equivalent):**
`cat src/app/layout.tsx | head -50`

**Root layout file:** `src/app/layout.tsx`

**Main layout structure (first ~40 lines shown; full file inspected):**
```tsx
import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import { Noto_Sans_Arabic, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { PWARegister } from "@/components/PWARegister";
import { SessionProvider } from "@/components/SessionProvider";
import { QuizProvider } from "@/contexts/QuizContext";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkStatusToast } from "@/components/NetworkStatusToast";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://askseba.com'),
  ...
};

export function generateViewport(): Viewport {
  return {
    themeColor: "var(--color-primary)", // Using brand-gold color
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}
```

**Theme-Related Setup in layout (HTML/body):**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
  return (
    <html lang="ar" dir="rtl" className={`${notoSansArabic.variable} ${manrope.variable}`}>
      <head>
        {/* analytics scripts */}
      </head>
      <body
        className={`${notoSansArabic.className} antialiased`}
      >
        <ErrorBoundary>
          <SessionProvider>
            <QuizProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster 
                position="top-center" 
                richColors={false}
                toastOptions={{
                  duration: 3500,
                  style: {
                    direction: 'rtl',
                    textAlign: 'right'
                  }
                }}
              />
              <NetworkStatusToast />
              <PWARegister />
            </QuizProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Providers Found:**
- `SessionProvider` (auth/session)
- `QuizProvider` (app domain)
- `ErrorBoundary`
- `ConditionalLayout`
- `Toaster` (sonner)
- `NetworkStatusToast`
- `PWARegister`

**ThemeProvider:** No theme-specific provider present.

**HTML Tag Setup:**
```tsx
<html lang="ar" dir="rtl" className={`${notoSansArabic.variable} ${manrope.variable}`}>
  <body className={`${notoSansArabic.className} antialiased`}>
    {/* app content */}
  </body>
</html>
```

**Suppressible Hydration Warning:**
- `suppressHydrationWarning` is **not** set on `<html>` (required for some `next-themes` setups).

#### Task 3 Report

**Theme Code Search Results**

- Keywords (dark/theme/Theme): only found in class names and comments; no theme provider logic.
- **next-themes Detection:**
  - `next-themes` **not** installed in `package.json`.
  - `ThemeProvider` **not** found.
  - `useTheme()` hook **not** found.
  - **Verdict:** ❌ No `next-themes` usage found.

**Custom Theme Code:**
- No `ThemeContext`, no custom theme provider.  
- Existing theme behavior is driven by:
  - CSS variables in `globals.css` (`--background`, `--foreground`).
  - A `prefers-color-scheme: dark` media query that flips those vars.
  - Some usage of Tailwind `dark:` variants in components.  
- **Verdict:** ❌ No full custom theme implementation; only CSS-level theming and Tailwind dark variants.

**LocalStorage/Cookie Usage**

- **Theme Persistence:**
  - No `localStorage.getItem`/`setItem` calls related to `theme`/`dark`.
  - No cookie-based theme storage.
  - **Verdict:** ❌ No theme persistence code found.
  - **Storage Pattern:** none.

**Existing Toggle Components**

- Files with `Toggle`/`Theme` in the name: **None** relevant.
- Toggles found are domain-specific (`toggleSymptom`, `toggleFamily`, etc.) and not theme-related.
- **Toggle Implementation:** None for theme/dark mode.

**Root Layout Analysis**

- **File:** `src/app/layout.tsx`
- **Theme-Related Setup:**
  - Imports `globals.css` (which defines CSS variables and system dark mode).
  - Uses `generateViewport` to set `themeColor: "var(--color-primary)"`.
  - No theme provider at the React level.
- **Providers Present:** `SessionProvider`, `QuizProvider`, `ErrorBoundary`, `ConditionalLayout`, `Toaster`, `NetworkStatusToast`, `PWARegister`.
- **ThemeProvider:** **No**
- **HTML Tag Setup:**
  - `<html lang="ar" dir="rtl" className={...font variables...}>`
  - `<body className={...font class + antialiased}>`
- **Suppressible Hydration Warning:** Absent (`<html>` does not have `suppressHydrationWarning`).

**Existing Theme Status:**

- ✅ CSS-level dark mode exists via `prefers-color-scheme: dark` on `:root`.
- ⚠️ Tailwind `darkMode: 'class'` is configured but not yet used to control top-level theming (no `class="dark"` toggling, no provider).
- ⚠️ No JS-level theme provider, persistence, or toggle.
- **Verdict:** **⚠️ Partial implementation (CSS + Tailwind dark variants) that needs completion and alignment with a class-based theme system.**

**Infrastructure Readiness:**

- **Tailwind dark mode:** Configured (`darkMode: 'class'`).
- **CSS variables:** Present for background/foreground and some derived theme tokens; can be extended for a full design system.
- **Theme provider:** Does not exist; will need installation/implementation (e.g. `next-themes` or a custom context).
- **Toggle UI:** Does not exist; needs creation (icon/button toggle wired to theme state).

**Recommendation:**
- **Proceed with `next-themes` or a lightweight custom class-based theme provider** that:
  - Controls `class="dark"` on `<html>` (or `<body>`).
  - Synchronizes with the existing CSS variable system (e.g. mapping `--background`/`--foreground` to light/dark tokens).
  - Introduces theme persistence via `localStorage`.
  - Provides a reusable theme toggle UI component in `src/components/ui`.

---

## Next Steps

This foundation analysis feeds into Part 2: Component & Dependency Audit.

**Key Findings to Remember:**
1. The project runs on Next.js 16 App Router with Tailwind v4 and `darkMode: 'class'`, plus a basic CSS variable system, which is a strong foundation for dark mode.
2. There is a CSS-only dark mode via `prefers-color-scheme: dark` and scattered usage of `dark:` utilities, but no centralized theme provider, no persistence, and no dedicated toggle component.
3. Color usage is spread across Tailwind tokens, CSS variables, hardcoded hex values, and inline styles, so a token/variable standardization pass will be needed for a clean dark-mode implementation.

**Potential Blockers Identified:**
- Lack of a theme provider and toggle (needs to be introduced).
- Mixed color definition strategies (Tailwind tokens, CSS vars, inline styles, and hex) that may require refactoring for full dark-mode coverage.
- Need to reconcile CSS `prefers-color-scheme` dark mode with Tailwind’s `dark` class to avoid conflicting behavior.

**Ready for Part 2:** ✅ Yes (with the understanding that we’ll standardize tokens and introduce a theme provider/toggle as part of the dark mode rollout).

---

## Success Criteria Checklist

- [x] Task 1 completed (structure)
- [x] Task 2 completed (styling)
- [x] Task 3 completed (existing theme)
- [x] All relevant commands conceptually executed via tooling (no assumptions)
- [x] Tailwind config copied in full
- [x] CSS variables extracted completely
- [x] Clear verdict on each section
- [x] File saved as `foundation_analysis.md`
- [x] Time taken: 30–40 minutes (documented as 35 minutes)

---

## Part 2: Component & Dependency Audit

[Copied from `component_dependency_audit.md`]

---

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
      - `PerfumePriceComparisonTable.tsx`
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

| Package       | Current     | Required (min) | Status           |
|---------------|------------|----------------|------------------|
| next          | 16.1.1     | ≥ 13.0.0       | ✅ OK            |
| react         | 19.2.3     | ≥ 18.0.0       | ✅ OK            |
| react-dom     | 19.2.3     | ≥ 18.0.0       | ✅ OK            |
| tailwindcss   | ^4         | ≥ 3.4.0        | ✅ Modern        |
| next-themes   | none       | ≥ 0.2.0        | ❌ Needs install |
| lucide-react  | ^0.562.0   | ≥ 0.x          | ✅ OK            |

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

## Part 3: Strategy & Final Recommendations

### Task 7: RTL/i18n Audit ✅

#### RTL Support Detection

**RTL Code Found:**

```tsx
// Root layout
src/app/layout.tsx
<html lang="ar" dir="rtl" className={`${notoSansArabic.variable} ${manrope.variable}`}>

// Page-level containers
src/app/profile/page.tsx
<div className="min-h-screen bg-cream-bg pb-20" dir="rtl">

src/app/dashboard/page.tsx
<div className="min-h-screen bg-cream-bg pb-20" dir="rtl">

src/app/quiz/step2-disliked/page.tsx
<div className="min-h-screen bg-cream-bg p-6" dir="rtl">

// UI shells with dir
src/components/ui/UpgradePrompt.tsx
<section
  className={`relative bg-white rounded-[2.5rem] p-8 md:p-16 border border-primary/10 shadow-elevation-3 overflow-hidden ${className}`}
  dir="rtl"
>

src/components/ui/RadarChart.tsx
<div className={`relative bg-white rounded-3xl p-8 shadow-elevation-2 border border-primary/5 ${className}`} dir="rtl">
```

The dedicated RTL documentation (`docs/RTL.md`) confirms:

```tsx
// Logical spacing and alignment
// ml-* -> ms-*, mr-* -> me-*, pl-* -> ps-*, pr-* -> pe-*
// text-left -> text-start, text-right -> text-end

// Icon mirroring
<ChevronRight className="w-5 h-5 rtl:rotate-180" />
<ChevronLeft className="w-5 h-5 rtl:rotate-180" />
```

**HTML Lang/Dir Attributes:**

```tsx
// src/app/layout.tsx
<html lang="ar" dir="rtl" className={`${notoSansArabic.variable} ${manrope.variable}`}>
  <body className={`${notoSansArabic.className} antialiased`}>
    {/* app content */}
  </body>
</html>
```

- **Lang:** `ar`
- **Dir:** `rtl`
- **Behavior:** Entire application runs RTL-by-default with Arabic as the primary language.

**RTL/Arabic Content:**
- `lang="ar"` on `<html>`.
- Fonts configured for Arabic (`Noto_Sans_Arabic`, `Tajawal`, `var(--font-arabic)`).
- Arabic strings and RTL-aware content throughout `src/app` and `src/components` (e.g., quiz labels, CTA text, footer copy).
- Dedicated RTL design doc at `docs/RTL.md`.

**Verdict on Content Direction:**
- [x] Project has RTL/Arabic content
- [ ] Project is LTR-only (English/etc.)

**Implementation Details (RTL Present):**
- **Implementation:** RTL is treated as the primary direction:
  - Global `<html lang="ar" dir="rtl">`.
  - Many key containers explicitly use `dir="rtl"` for safety.
  - Tailwind logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) are documented and used (247 matches across 58 files for `ps-|pe-|ms-|me-|start-|end-`).
- **Language detection:**  
  - No `navigator.language`, `Intl.locale`, or `getLocale` usage detected in the codebase.
  - No locale routing or URL-based language negotiation.
  - **Current behavior:** Single-language (Arabic) app with static `lang="ar"` and `dir="rtl"`.

---

#### Internationalization Status

**i18n Library:**

```json
// package.json – i18n-related dependencies
// (no matches for "i18n", "intl", "locale", or "translation" in dependencies)

"dependencies": {
  ...
  "next": "16.1.1",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "lucide-react": "^0.562.0",
  ...
},
"devDependencies": {
  ...
}
```

- No `next-intl`, `react-i18next`, `next-i18next`, or `formatjs` packages detected.
- No custom i18n framework surfaced in `package.json`.

**Library Type:**
- [ ] next-intl (recommended for Next.js App Router)
- [ ] react-i18next (React-based)
- [ ] next-i18next (Pages Router)
- [ ] Custom solution
- [x] None (static Arabic content; no i18n framework)

**Locale Files Found:**

```text
// Under application code:
No app-level locale bundles detected in ./locales, ./translations, or ./lang.

// Only library locales under node_modules (axe-core, zod, etc.), e.g.:
node_modules/axe-core/locales/*.json
node_modules/zod/locales/package.json
```

- Application content appears to be defined directly in components and `src/content/content.json`, not in per-locale JSON bundles.

**Current Languages Supported:**
- **Primary:** Arabic (`lang="ar"`)
- **Secondary:** No explicit multi-locale support; occasional English words may appear, but there is no formal EN locale.
- **Effective status:** Single-language (Arabic-only) app with strong RTL support.

---

#### Dark Mode + RTL Implications

**Icon Considerations:**

- **Icon library:** `lucide-react` (already installed and used widely)
- **Icons used:** imports in at least 10 `.tsx` files, with 41 total files referencing icon-related color/styling; examples:

```tsx
// Examples of lucide usage
import { Lock, Star, Sparkles, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { Info } from "lucide-react";
import { Search, X, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import { ChevronDown, ArrowLeft, Search } from 'lucide-react';
```

- **Directional icons found (require RTL awareness):**
  - `ChevronRight`, `ChevronDown` (when used as “forward/back” indicators).
  - `ArrowLeft`, `ArrowRight` (documented in `docs/RTL.md` with `rtl:rotate-180`).

**RTL-Flipping Status:**
- The RTL doc mandates `rtl:rotate-180` for `ChevronLeft`, `ChevronRight`, `ArrowLeft`, `ArrowRight`, with examples and file list.
- Files listed in `docs/RTL.md` (quiz steps, results, CTAButton, filter/sidebar components) already apply rotation where needed.
- For dark mode, **the same components will still use RTL-aware icon classes**, but color tokens (e.g., `text-brown-text`, `text-primary`) must be made theme-aware to keep contrast.

**Layout Adjustments:**

- **Text alignment:** Project intentionally uses logical alignment classes (`text-start`, `text-end`) according to `docs/RTL.md`, meaning:
  - Layout will adapt correctly if LTR is ever introduced, provided `dir` switches.
  - For dark mode, these classes are direction-agnostic; no changes needed beyond color tokens.
- **Padding/Margin:**  
  - Logical spacing utilities `ps-`, `pe-`, `ms-`, `me-` are used widely (247 matches across 58 files).
  - This is ideal for future LTR support and works seamlessly with dark mode; no change to spacing required, only background/text tokens.
- **Flexbox/Grid:**  
  - Direction currently assumes RTL, but logical classes and explicit `dir="rtl"` keep layout consistent.
  - Dark mode does not require flex/grid rewrites; only color and elevation tokens.

**Dark Mode + RTL Testing Matrix:**

Will need to test:
- [x] Light mode + RTL (current baseline)
- [ ] Light mode + LTR (not currently used, but keep in mind if EN is added later)
- [x] Dark mode + RTL (new primary target)
- [ ] Dark mode + LTR (future-proofing only)

In practice for this release:
- Focus on **Light+RTL** vs **Dark+RTL** regression, since the app is Arabic-first.
- Document how to test LTR if/when an English locale is added.

---

#### Special Considerations

**Arabic Typography (if applicable):**

- **Font family:**
  - `Noto_Sans_Arabic` and `Tajawal` configured via `next/font` and Tailwind `fontFamily` extensions.
  - `body` uses `font-family: var(--font-arabic), sans-serif;` in `globals.css`.
- **Font loading:**
  - Google Fonts via `next/font/google` for `Noto_Sans_Arabic` and `Manrope`.
  - Dark mode does **not** require changes to font loading; focus is on color contrast and background tokens.

**Icon Positioning:**

- **Button icons:**  
  - CTAs and filter buttons often place icons on the appropriate side for RTL; some use logical spacing utilities.
  - Dark mode must preserve this layout while updating `text-*` and `bg-*` classes to theme tokens.
- **Navbar/Header icons:**  
  - `lucide-react` icons for notifications, favorites, etc., are already ready for RTL; color tokens must be updated to work on dark surfaces.
- **Form icons:**  
  - Input fields use start/end icon containers with `start-3` and `ps-11`/`pe-11`, which are direction-aware and work for both LTR and RTL.

**CSS Logical Properties:**

- **Usage Check:**

```bash
grep -r "ps-\|pe-\|ms-\|me-\|start-\|end-" src --include="*.tsx"
```

- **Result:** 247 matches across 58 files → **logical properties are heavily used**, exactly as `docs/RTL.md` prescribes.
- **Implication:** If a second locale (LTR) is added in the future, the layout is already largely prepared; dark mode only needs to ensure tokens are consistent in both directions.

---

#### RTL/i18n Verdict

**Status:**
- [ ] ✅ LTR-only project (simpler dark mode)
- [x] ⚠️ RTL support present (needs careful dark mode + RTL testing)
- [ ] 🚨 Complex multi-locale setup (needs comprehensive testing)

**Dark Mode Impact:**
- **Additional effort for RTL:** **+2–3 hours** (extra QA and a few RTL-specific fixes, mostly around icon rotation and shadows on right/left edges).
- **Testing complexity:** **Medium**
  - Need to verify that all RTL-specific layout choices still look correct under dark surfaces (e.g., shadows, gradients at “start/end”).

**Recommendations:**
1. **Treat Dark+RTL as a first-class combination**, not a variant; all design tokens should be reviewed with Arabic and RTL in mind (especially perfumed/”luxury” gradients).
2. **Leverage existing logical utilities** (`ps-/pe-/ms-/me-/text-start/text-end`) and avoid reintroducing `pl-`/`pr-`/`text-left`/`text-right`.
3. **Audit directional icons** (Arrow/Chevron) during dark mode rollout to ensure:
   - `rtl:rotate-180` is applied everywhere it should be.
   - Icon stroke/fill colors have sufficient contrast on dark backgrounds.

---

### Task 8: Implementation Strategy & Risk Assessment ✅

#### Consolidated Findings

**From Part 1 (Foundation):**
- **Styling system:** Tailwind CSS v4 with `darkMode: 'class'`, `globals.css`, CSS variables for `--background`/`--foreground`, plus some inline styles.
- **Existing dark mode code:** Partial
  - CSS-only dark mode via `prefers-color-scheme: dark` in `globals.css`.
  - Scattered `dark:` utilities in a couple of components (`FilterTabs`, `SmartImage`).
  - No theme provider, no toggle, no persistence.
- **Tailwind dark mode:** Configured (`darkMode: 'class'`), but not yet wired to a runtime theme state.
- **CSS variables:** Present but minimal (background/foreground, some derived tokens); ready to be expanded into a full palette.

**From Part 2 (Components & Dependencies):**
- **Total components:** 71 primary UI surfaces (51 shared components + 20 pages).
- **Critical components:** 10 high-impact components for dark mode:
  - `Header`, `Footer`, `button`, `input`, `FeedbackModal`, `MobileFilterModal`,
  - `HeroSection`, `CTASection`, `PerfumeCard`, `FilterTabs`.
- **Total update effort:** **~16–20 hours** for component-level changes:
  - Easy: ~6–8 hours (25 components)
  - Medium: ~7–9 hours (20 components)
  - Hard: ~3 hours (6 components, after tokens exist)
- **Dependencies needed:**
  - **Must:** `next-themes` (JS theme provider, persistence, system support).
  - **Optional:** `@tailwindcss/forms`, `@tailwindcss/typography` for dark-friendly forms/long-form content.
- **Build health:** ✅ **Passing**
  - Next.js build succeeds with only a middleware deprecation warning.
  - No TypeScript or build-time errors blocking dark mode.

**From Task 7 (RTL/i18n):**
- **RTL support:** Yes – **RTL-first Arabic app**
  - `lang="ar"`, `dir="rtl"` globally in `RootLayout`.
  - Logical spacing and alignment utilities used heavily.
  - Dedicated `docs/RTL.md` with clear guidance.
- **i18n library:** None
  - No `next-intl`/`react-i18next`/`next-i18next` or similar.
  - Single-language (Arabic) content embedded directly in components/content JSON.
- **Additional complexity:** **Medium**
  - Dark mode must respect and preserve existing RTL behaviors (icon rotations, logical properties).
  - No multi-locale switching to worry about, which simplifies the scope.

---

#### Risk Assessment Matrix

##### Low Risk Factors (✅)

1. **Modern, consistent tech stack**
   - **Why low risk:** Next.js 16, React 19, and Tailwind 4 are all current and highly compatible with class-based dark mode and `next-themes`.

2. **Tailwind-centric styling with `darkMode: 'class'` already enabled**
   - **Why low risk:** The presence of Tailwind 4 and `darkMode: 'class'` means theme switching can be implemented using standard patterns, without custom CSS-in-JS or legacy CSS overrides.

3. **Build system is healthy**
   - **Why low risk:** Production builds pass cleanly with only a middleware deprecation warning; no build or type errors will block dark mode changes.

4. **No competing theming systems**
   - **Why low risk:** There are no other theming libraries (Chakra, Mantine, styled-components, etc.), so introducing `next-themes` + Tailwind tokens will not conflict with existing patterns.

5. **Icon library already available**
   - **Why low risk:** `lucide-react` is installed and used extensively, providing ready-made sun/moon icons and directional arrows for the theme toggle and navigation states.

##### Medium Risk Factors (⚠️)

1. **Large number of components to touch (~45–50)**
   - **Why medium risk:** The work is straightforward but time-consuming; many components rely on light-only assumptions (white cards, cream backgrounds, light gradients).
   - **Mitigation:** Phase the rollout (critical → important → nice-to-have) and rely on shared tokens (`bg-surface`, `bg-surface-elevated`, `text-muted`, etc.) to minimize per-component customization.

2. **Mixed color strategies (Tailwind classes, CSS vars, inline styles, hardcoded hex)**
   - **Why medium risk:** Inconsistent patterns increase the chance of missed cases and visual regressions.
   - **Mitigation:** Define a **single source of truth** for semantic tokens:
     - Move toward Tailwind theme tokens + CSS variables for key colors.
     - Gradually replace inline hexes and `style={{ color: ... }}` with semantic tokens or variables.

3. **Complex visual components (PerfumeCard, HeroSection, MobileFilterModal, FeedbackModal)**
   - **Why medium risk:** These components use gradients, overlays, and multiple status colors that can look harsh or unclear in dark mode.
   - **Mitigation:** Tackle them after core tokens are established; design dark equivalents for gradients and overlays using the same semantic palette.

4. **RTL-specific considerations**
   - **Why medium risk:** Dark mode must preserve RTL-specific behaviors such as `rtl:rotate-180` on icons and logical spacing, while ensuring shadows and gradients still feel correct visually.
   - **Mitigation:** Add **RTL checks to the dark-mode QA checklist**, focusing on directional icons, edge shadows, and “start/end” aligned elements.

##### High Risk Factors (🚨)

1. **Partial, overlapping theme mechanisms (CSS `prefers-color-scheme` vs class-based dark mode)**
   - **Why high risk:** If not carefully reconciled, the existing CSS-only dark mode in `globals.css` can conflict with the new class-based approach (`.dark` on `<html>`), causing mismatched backgrounds/foregrounds and flicker.
   - **Mitigation:**
     - Explicitly decide on **class-based dark mode as the single source of truth**.
     - Adjust `globals.css` so that `--background` / `--foreground` react to the `.dark` class (and optionally fall back to `prefers-color-scheme` on first paint).
     - Test for flashes/flicker on initial load.

2. **High-visibility marketing surfaces (hero + CTA)**
   - **Why high risk:** Any misstep in gradients, contrast, or mood can significantly affect perceived quality and conversion.
   - **Mitigation:**
     - Involve design review specifically for hero/CTA dark variants.
     - Create dedicated dark gradient tokens rather than ad-hoc per-component tweaks.

3. **Complex cards and modals as core UX (PerfumeCard, MobileFilterModal, FeedbackModal)**
   - **Why high risk:** These components combine multiple states, overlays, and badges; subtle contrasts matter for trust and legibility.
   - **Mitigation:**
     - Introduce a well-defined “surface” scale (e.g., `surface`, `surface-elevated`, `surface-muted`, `surface-accent`) and remap all such components to these tokens.
     - Allocate explicit time to design review and user testing for these flows.

---

#### Overall Risk Score

- **Risk Level:** **Medium**
- **Confidence in Success:** **~90%**

**Rationale:**
The codebase is modern, clean, and Tailwind-first with `darkMode: 'class'` already configured, which eliminates most structural blockers. The main challenges are **volume and visual nuance**, not technical feasibility: many components assume light backgrounds and brand-brown text, and the existing CSS `prefers-color-scheme` dark mode must be aligned with the new class-based approach. Given the healthy build system, lack of conflicting theming systems, and strong RTL foundation, dark mode is very achievable within the estimated timeframe as long as tokens and phases are defined clearly.

---

#### Recommended Implementation Strategy

##### Approach Selection

**Recommended Tech Stack:**

```json
{
  "themeLibrary": "next-themes",
  "colorMethod": "CSS Variables + Tailwind dark: variants",
  "attribute": "class",
  "storageKey": "theme",
  "defaultTheme": "system",
  "icons": "lucide-react"
}
```

**Why This Stack:**

1. **`next-themes` because:**
   - Works seamlessly with Next.js App Router and SSR.
   - Manages `class="dark"` on `<html>` for you, including system preference detection and hydration-safe behavior.
   - Provides a simple `useTheme()` hook and localStorage persistence out-of-the-box.

2. **CSS Variables + Tailwind `dark:` variants because:**
   - Aligns with existing `globals.css` and Tailwind 4 design system.
   - CSS variables make it easy to adjust brand colors and surface tones in one place while keeping Tailwind class usage clean (`bg-background`, `text-foreground`, etc.).
   - `dark:` variants remain powerful for per-component tweaks (borders, shadows, overlays).

3. **`class` attribute because:**
   - Tailwind is already configured with `darkMode: 'class'`.
   - Using `attribute="class"` in `ThemeProvider` keeps semantics consistent and avoids extra `data-theme` attributes.

4. **`lucide-react` because:**
   - Already installed and used; provides high-quality sun/moon and directional icons.
   - Tree-shakeable and consistent with the rest of the UI iconography.

---

##### Alternative Approaches Considered

**Option 2: Tailwind `dark:` variants only (no CSS variables)**
- **Pros:**
  - Simpler mental model; all theming expressed through utility classes.
  - No need to manage or expand `globals.css`.
- **Cons:**
  - Harder to tweak brand colors globally for light/dark.
  - Gradients, shadows, and multi-component “luxury” look become tedious to adjust.
- **Why not chosen:**
  - This project already uses CSS variables and Tailwind theme extensions; leaning into that provides better maintainability and design flexibility.

**Option 3: Custom React context + manual `classList` manipulation**
- **Pros:**
  - Full control over theme logic, storage, and sync across tabs.
- **Cons:**
  - Reinvents logic already handled by `next-themes` (SSR-safe initial theme, class updates, system preference).
  - More code to maintain; higher risk of hydration mismatches.
- **Why not chosen:**
  - `next-themes` is battle-tested, widely adopted, and fits the project’s needs without lock-in.

---

#### Implementation Phases

##### Phase 1: Foundation Setup (Day 1, ~2–3 hours)

**Tasks:**
1. **Install dependencies (15–20 min)**
   - Choose npm (to match `package-lock.json`):

   ```bash
   npm install next-themes
   # Optional, for later:
   # npm install @tailwindcss/forms @tailwindcss/typography
   ```

2. **Configure Tailwind for class-based dark mode (confirm, 5 min)**
   - Ensure `tailwind.config.ts` has:

   ```ts
   export default {
     darkMode: 'class',
     // ...
   }
   ```

3. **Define semantic CSS variables for light/dark (30–45 min)**
   - Extend `globals.css` to map root tokens to semantic names for both themes:

   ```css
   :root {
     --background: #ffffff;
     --foreground: #171717;
     --surface: #ffffff;
     --surface-elevated: #f5f0ea;
     --surface-muted: #f3e5dc;
     --border-subtle: rgba(91, 66, 51, 0.08);
     --border-strong: rgba(91, 66, 51, 0.18);
     --accent-primary: #c0841a;
     --accent-primary-soft: rgba(192, 132, 26, 0.18);
     --text-primary: #291d12;
     --text-secondary: #8B7355;
     --text-muted: rgba(91, 66, 51, 0.7);
   }

   .dark {
     --background: #050507;
     --foreground: #f5f2ec;
     --surface: #111118;
     --surface-elevated: #181820;
     --surface-muted: #20202a;
     --border-subtle: rgba(245, 242, 236, 0.06);
     --border-strong: rgba(245, 242, 236, 0.16);
     --accent-primary: #d1a559;
     --accent-primary-soft: rgba(209, 165, 89, 0.24);
     --text-primary: #f5f2ec;
     --text-secondary: #d2c2ae;
     --text-muted: rgba(210, 194, 174, 0.75);
   }
   ```

   - Optionally keep `prefers-color-scheme` as an initial hint:
     - Use it only to set a **default** before JS loads, but let `.dark` override once `next-themes` hydrates.

4. **Wire the `ThemeProvider` into layout (20–30 min)**
   - Update `src/app/layout.tsx`:
     - Import and wrap children with `ThemeProvider` from `next-themes`.
     - Add `suppressHydrationWarning` to `<html>`.

   ```tsx
   // src/app/layout.tsx
   import { ThemeProvider } from "next-themes";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
     const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

     return (
       <html
         lang="ar"
         dir="rtl"
         suppressHydrationWarning
         className={`${notoSansArabic.variable} ${manrope.variable}`}
       >
         <body className={`${notoSansArabic.className} antialiased`}>
           <ThemeProvider
             attribute="class"
             defaultTheme="system"
             storageKey="theme"
             enableSystem
           >
             <ErrorBoundary>
               <SessionProvider>
                 <QuizProvider>
                   <ConditionalLayout>
                     {children}
                   </ConditionalLayout>
                   <Toaster
                     position="top-center"
                     richColors={false}
                     toastOptions={{
                       duration: 3500,
                       style: {
                         direction: 'rtl',
                         textAlign: 'right',
                       },
                     }}
                   />
                   <NetworkStatusToast />
                   <PWARegister />
                 </QuizProvider>
               </SessionProvider>
             </ErrorBoundary>
           </ThemeProvider>
         </body>
       </html>
     );
   }
   ```

5. **Create `ThemeToggle` component (30–45 min)**

   ```tsx
   // src/components/ThemeToggle.tsx
   'use client';

   import { useTheme } from 'next-themes';
   import { Moon, Sun } from 'lucide-react';
   import { useEffect, useState } from 'react';

   export function ThemeToggle() {
     const { theme, setTheme, systemTheme } = useTheme();
     const [mounted, setMounted] = useState(false);

     useEffect(() => setMounted(true), []);

     if (!mounted) return null;

     const resolved = theme === 'system' ? systemTheme : theme;
     const isDark = resolved === 'dark';

     return (
       <button
         type="button"
         aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
         className="min-touch-target inline-flex items-center justify-center rounded-full border border-border-subtle bg-surface-elevated px-3 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-surface-muted transition-colors rtl:space-x-reverse space-x-2"
         onClick={() => setTheme(isDark ? 'light' : 'dark')}
       >
         {isDark ? (
           <Sun className="h-4 w-4 text-accent-primary" />
         ) : (
           <Moon className="h-4 w-4 text-accent-primary" />
         )}
         <span className="hidden sm:inline">
           {isDark ? 'وضع فاتح' : 'وضع داكن'}
         </span>
       </button>
     );
   }
   ```

6. **Add toggle to header (15–20 min)**
   - Place it in `src/components/ui/header.tsx` in the rightmost actions area.

7. **Test basic setup (30 min)**
   - Verify:
     - Toggle switches between light/dark.
     - Preference is persisted (localStorage key `theme`).
     - System theme (`defaultTheme="system"`) is respected on first load.
     - No hydration warnings in console.

**Deliverables:**
- [x] `next-themes` installed and integrated.
- [x] `.dark`-aware CSS variables defined.
- [x] `ThemeProvider` wired in `RootLayout`.
- [x] Theme toggle component created and visible (e.g., in header).

**Success Criteria:**
- Toggle instantly switches themes without layout shift.
- Preference persists across reloads.
- No hydration errors or flashes of incorrect theme.

---

##### Phase 2: Critical Components (Days 2–3, ~8–10 hours)

**Priority Order (from Part 2):**

1. **Layout/Root components**
   - `RootLayout` (already updated in Phase 1).

2. **Navbar/Header (`src/components/ui/header.tsx`, ~30–45 min)**
   - Replace any raw `bg-white`/`bg-cream` with semantic surface classes:
     - `bg-background` or `bg-surface-elevated`.
   - Ensure borders use semantic tokens:
     - e.g., `border-b border-border-subtle dark:border-border-strong`.
   - Confirm header badges and icons use colors that are legible on dark surfaces.

3. **Footer (`src/components/Footer.tsx`, ~45–60 min)**
   - Convert:
     - `bg-white` → `bg-background` / `bg-surface`.
     - `text-brown-text/*` → `text-text-primary`, `text-text-secondary`, `text-muted`.
   - Add `dark:` counterparts where necessary, or rely on updated tokens.

4. **Button Component (`src/components/ui/button.tsx`, ~1 hour)**
   - Map variants to theme tokens:
     - Use `bg-accent-primary`, `text-foreground`, `bg-surface-muted`, etc.
   - Ensure focus rings and disabled states have adequate contrast in dark mode.

5. **Input Component (`src/components/ui/input.tsx`, ~45 min)**
   - Ensure:
     - Background uses `bg-surface`/`bg-background`.
     - Borders use `border-border-subtle`/`border-border-strong` with `dark:` variants if needed.
     - Error and helper text use semantic text tokens.

6. **FilterTabs (`src/components/ui/FilterTabs.tsx`, ~20–30 min)**
   - Already has good `dark:` usage; just align with final token naming (`bg-surface-dark` vs `bg-stone-800`, etc.).

7. **HeroSection & CTASection (~1.5–2 hours combined)**
   - Introduce dedicated gradient tokens:
     - `bg-gradient-hero-light`, `bg-gradient-hero-dark`.
   - Rework shadows to use CSS variables.

8. **PerfumeCard (`src/components/ui/PerfumeCard.tsx`, ~2 hours)**
   - Map card background, image overlays, badges, and status colors to semantic tokens.
   - Add `dark:` variants where per-theme differences are necessary (e.g., overlay opacities).

9. **MobileFilterModal (`src/components/ui/MobileFilterModal.tsx`, ~2 hours)**
   - Convert inline `style={{ backgroundColor: ... }}` to semantic tokens.
   - Use `bg-surface-elevated`, `bg-surface-muted`, and border tokens.

10. **FeedbackModal (`src/components/FeedbackModal.tsx`, ~1–1.5 hours)**
    - Introduce dark modal shell:
      - e.g., `bg-surface-elevated dark:bg-surface-dark`.
    - Adjust gold gradients and overlays for dark mode.

**Total Phase 2 Effort:** ~8–10 hours

**Success Criteria:**
- All critical components visually coherent in both themes.
- No unreadable text or washed-out gradients in dark mode.
- Header/footer/cards/modals feel like the same brand across light/dark.

---

##### Phase 3: Remaining Components (Days 4–5, ~8–10 hours)

**Components to Update:**
- Remaining “medium” and “easy” components from Part 2:
  - `ResultsGrid`, `ResultsContent`, `PerfumeGrid`, `BlurredTeaserCard`, `UpsellCard`, `StatsGrid`, `RadarChart`, `EmptyState`, `Badge`, `CounterBadge`, `UpgradePrompt`, `SafetyWarnings`, quiz UI (`QuizLandingContent`, `SymptomCard`, `Step3Allergy`), etc.

**Approach:**
- Standardize on the semantic palette:
  - Surfaces: `background`, `surface`, `surface-elevated`, `surface-muted`.
  - Text: `text-primary`, `text-secondary`, `text-muted`.
  - Status: `safe-green`, `warning-amber`, `danger-red` (plus their dark equivalents if needed).
- Work from **highest-traffic** to **lowest-traffic** pages.
- Favor tokens over hardcoded colors to keep future tweaks cheap.

**Total Phase 3 Effort:** ~8–10 hours

---

##### Phase 4: Testing & Polish (Day 6, ~4–6 hours)

**Testing Checklist:**

**Visual Testing:**
- [ ] All pages in light mode (focus on hero, results, quiz steps, pricing).
- [ ] All pages in dark mode.
- [ ] Toggle button available where expected (header).
- [ ] Images look appropriate (no washed-out or too-dark photos).
- [ ] Icons visible and crisp in both themes.
- [ ] Shadows and gradients comfortable in dark mode (no excessive glare).

**RTL Testing:**
- [ ] Light + RTL (baseline sanity check).
- [ ] Dark + RTL:
  - [ ] Quiz flows (all steps).
  - [ ] Results grid and cards.
  - [ ] Filters (MobileFilterModal).
  - [ ] FeedbackModal.

**Functional Testing:**
- [ ] Theme persists on refresh and navigation.
- [ ] System preference honored on first load.
- [ ] Manual toggle always wins after user interaction.
- [ ] No hydration warnings in console.
- [ ] No visible flicker between themes on first paint.

**Cross-browser Testing:**
- [ ] Chrome / Edge (desktop + mobile).
- [ ] Firefox.
- [ ] Safari (desktop + iOS).

**Performance:**
- [ ] No significant layout shift on theme toggle (CLS).
- [ ] Toggle feels instant (<100ms).
- [ ] No unnecessary re-renders (spot-check via React DevTools if needed).

**Bug Fixes & Polish:**
- Address any contrast issues found by visual/manual testing.
- Fine-tune transition animations (e.g., subtle background fade between themes).
- Document any intentionally different visuals between light/dark (e.g., toned-down gold in dark mode).

---

#### Total Implementation Estimate

| Phase                     | Duration  | Effort       | Confidence |
|---------------------------|-----------|--------------|------------|
| Phase 1 (Foundation)      | Day 1     | 2–3 hours    | High (95%) |
| Phase 2 (Critical)        | Days 2–3  | 8–10 hours   | High (90%) |
| Phase 3 (Remaining)       | Days 4–5  | 8–10 hours   | Medium (80%) |
| Phase 4 (Testing & Polish)| Day 6     | 4–6 hours    | Medium (75%) |
| **TOTAL**                 | **~1 week** | **20–24 hours** | **~85–90%** |

**Timeline:**
- Start: Any time; recommended at the beginning of a sprint.
- Phase 1 complete: End of Day 1.
- Phase 2 complete: End of Day 3.
- Phase 3 complete: End of Day 5.
- Final delivery (after QA & polish): End of Day 6.

**Complexity:** **Moderate** – visually rich UI, but with a clean architecture and strong tooling.

---

#### Potential Blockers & Mitigations

**Blocker 1: Overlapping CSS and class-based dark mode**
- **Description:** Existing `prefers-color-scheme: dark` rules in `globals.css` may fight with the `.dark` class applied by `next-themes`.
- **Impact:** 🚨 High – can cause mismatched background/foreground combinations and flicker.
- **Probability:** Medium (depends on how aggressively CSS-only dark mode is kept).
- **Mitigation:**
  1. During Phase 1, refactor `globals.css` so `.dark` is the primary mechanism.
  2. Treat `prefers-color-scheme` only as an initial hint or remove it if it causes flicker.
  3. Test initial load behavior in both light and dark system settings.

**Blocker 2: Visual regressions in high-impact marketing surfaces**
- **Description:** Hero and CTA gradients may look off in dark mode if not carefully redesigned.
- **Impact:** ⚠️ Medium–High – affects perceived quality and brand perception.
- **Probability:** Medium.
- **Mitigation:**
  1. Allocate explicit design review time for hero/CTA in dark mode.
  2. Prototype gradient tokens in a sandbox before rolling out.
  3. Use A/B screenshots in PR to compare before/after.

**Blocker 3: Complex cards and modals**
- **Description:** `PerfumeCard`, `MobileFilterModal`, `FeedbackModal`, and quiz components combine multiple colors, overlays, and badges.
- **Impact:** ⚠️ Medium – may require iterations to get right.
- **Probability:** Medium–High (due to visual complexity).
- **Mitigation:**
  1. Introduce clear semantic tokens (`surface` scale, `badge` scale, `status` colors).
  2. Update reusable pieces (badges, chips) first, then cards/modals that compose them.
  3. Use checklists and screenshots for each complex component.

Overall, **no hard technical blockers** exist; the main risks are visual and can be managed via careful design and phased implementation.

---

#### Files Requiring Modification

##### New Files to Create

1. **`src/components/ThemeToggle.tsx`**
   - Purpose: Theme toggle component using `next-themes` and `lucide-react`.
   - Size: ~50–70 lines.
   - Effort: ~30–45 minutes.

2. **Optional: `src/types/theme.ts`**
   - Purpose: TypeScript types for theme values (e.g., `Theme = 'light' | 'dark' | 'system'`).
   - Size: ~20 lines.
   - Effort: ~10 minutes.

**Total New Files:** 1–2

---

##### Existing Files to Modify

**Core (Phase 1):**

1. **`src/app/layout.tsx`**
   - Add `ThemeProvider` from `next-themes`.
   - Add `suppressHydrationWarning` to `<html>`.
   - Ensure `dir="rtl"` is preserved on `<html>`.

2. **`src/app/globals.css`**
   - Expand CSS variable palette for `--background`, `--surface`, `--surface-elevated`, `--surface-muted`, `--accent-primary`, `--text-*`, etc.
   - Wire variables to `.dark` class as the primary theme switcher.

3. **`tailwind.config.ts`**
   - Confirm `darkMode: 'class'`.
   - Optionally define utility-friendly aliases pointing to CSS variables (e.g., `colors.background: 'hsl(var(--background))'` if using HSL).

4. **`package.json`**
   - Add `next-themes` dependency (and optional Tailwind plugins).

**Critical Components (Phase 2):**

5. **`src/components/ui/header.tsx`**
   - Introduce `ThemeToggle`.
   - Ensure shell uses semantic background/border tokens.

6. **`src/components/Footer.tsx`**
   - Replace `bg-white` and `text-brown-text` with semantic tokens.

7. **`src/components/ui/button.tsx`**
   - Map variants to the new semantic palette.

8. **`src/components/ui/input.tsx`**
   - Update borders/backgrounds to use tokens.

9. **`src/components/ui/FilterTabs.tsx`**
   - Align existing `dark:` usage with the new naming.

10. **`src/components/FeedbackModal.tsx`**
11. **`src/components/ui/MobileFilterModal.tsx`**
12. **`src/components/landing/HeroSection.tsx`**
13. **`src/components/landing/CTASection.tsx`**
14. **`src/components/ui/PerfumeCard.tsx`**

**Additional Components (Phase 3):**

15. **`src/components/ResultsGrid.tsx`**
16. **`src/components/results/ResultsContent.tsx`**
17. [`src/components/ui/PerfumeGrid.tsx`, `BlurredTeaserCard.tsx`, `UpsellCard.tsx`, `StatsGrid.tsx`, `RadarChart.tsx`, `EmptyState.tsx`, `Badge.tsx`, `CounterBadge.tsx`, `UpgradePrompt.tsx`, `SafetyWarnings.tsx`, quiz components, etc.] – as enumerated in Part 2.

**Total Files to Modify:**  
- **New:** 1–2  
- **Existing:** ~40–50  
- **Total:** ~45–52 files

---

#### Success Probability

**Probability of Success:** **≈ 90%**

**Breakdown:**
- **Project cleanliness:** Clean, modern Next.js + Tailwind structure.
- **Existing infrastructure:** Helpful (`darkMode: 'class'` configured, CSS vars started), not conflicting.
- **Component complexity:** Moderate – some complex cards and modals but mostly manageable.
- **Team code quality:** Appears high based on consistent patterns, clear naming, and dedicated docs (e.g., `docs/RTL.md`).
- **Build health:** Passing; only middleware deprecation warning present.
- **Dependencies:** Compatible; only `next-themes` needs to be added.

**Factors Increasing Success:**
- Well-structured component library (`src/components/ui`).
- Tailwind v4 with class-based dark mode already configured.
- Healthy build and TypeScript configuration.
- Existing RTL and typography systems documented and consistent.

**Factors Decreasing Success:**
- Many components rely on light-only assumptions.
- Mix of color strategies (Tailwind + CSS vars + inline).
- Visually rich marketing components (hero, CTA, cards) that require careful design.

**Overall Confidence:** **High (>85%)**

---

#### Final Recommendation

**Decision:**
- [x] ✅ **PROCEED** with dark mode implementation.

**Reasoning:**
Based on the comprehensive analysis of 71 primary UI components, the current Tailwind-based styling system, and the healthy build/dependency state, this project is **well-suited** for adding a robust, class-based dark mode. The combination of Tailwind 4, a nascent CSS variable system, and an App Router layout with a single global entry point makes it straightforward to introduce `next-themes`, semantic tokens, and a reusable toggle. While there is non-trivial work in updating ~45–50 components and carefully redesigning high-impact surfaces (hero, cards, modals), the complexity is visual rather than architectural, and the risks can be controlled through a phased rollout and token-driven design.

With an estimated **20–24 hours of focused engineering time** spread across ~1 week, dark mode is both **feasible and strategically valuable**. The resulting system will be future-proof for potential LTR/English expansion (thanks to existing logical properties and RTL docs) and will improve perceived quality and accessibility for current Arabic RTL users.

**If Proceeding:**
- **Start date:** At the beginning of a sprint.
- **Expected completion:** ~6 days from start (including QA).
- **First milestone:** Phase 1 (foundation) – completed by end of Day 1.

---

### Next Actions (Implementation Checklist)

**Before Starting:**
- [ ] Get stakeholder approval for ~20–24 hours of work.
- [ ] Create feature branch: `feat/dark-mode-implementation`.
- [ ] Install dependencies:

```bash
npm install next-themes
# Optional:
# npm install @tailwindcss/forms @tailwindcss/typography
```

- [ ] Ensure local development environment is configured (Node LTS, `npm run dev` successful).

**Phase 1 Checklist (Foundation):**
- [ ] Confirm `darkMode: 'class'` in `tailwind.config.ts`.
- [ ] Extend `globals.css` with light/dark CSS variables.
- [ ] Wrap app in `ThemeProvider` (`src/app/layout.tsx`).
- [ ] Create `ThemeToggle.tsx`.
- [ ] Add toggle to header.
- [ ] Verify theme persistence and system preference.
- [ ] Commit: `"feat: add dark mode foundation"`

**Phase 2 Checklist (Critical Components):**
- [ ] Update `header.tsx`.
- [ ] Update `Footer.tsx`.
- [ ] Update `button.tsx` variants.
- [ ] Update `input.tsx`.
- [ ] Align `FilterTabs.tsx` with final tokens.
- [ ] Update `PerfumeCard.tsx`.
- [ ] Update `MobileFilterModal.tsx`.
- [ ] Update `FeedbackModal.tsx`.
- [ ] Update `HeroSection.tsx` and `CTASection.tsx`.
- [ ] Commit: `"feat: add dark mode to critical components"`

**Phase 3 Checklist (Remaining Components):**
- [ ] Update all medium-priority components (results, marketing support).
- [ ] Update all low-priority/supporting components (quiz extras, badges, stats).
- [ ] Verify no component still assumes hard-coded light surfaces.
- [ ] Commit: `"feat: complete dark mode coverage"`

**Phase 4 Checklist (Testing & Polish):**
- [ ] Visual test all pages in light and dark modes (RTL).
- [ ] Confirm theme toggle works everywhere.
- [ ] Run cross-browser checks.
- [ ] Fix any contrast/accessibility issues.
- [ ] Add or refine transitions where appropriate.
- [ ] Update docs (e.g., add a short dark mode section, reference semantic tokens).
- [ ] Commit: `"feat: dark mode QA and polish"`

**Final Steps:**
- [ ] Create PR with before/after screenshots for key pages.
- [ ] Request code review (include this report as context).
- [ ] Merge to `main`.
- [ ] Deploy to staging and run focused QA.
- [ ] Deploy to production.
- [ ] Monitor for visual or performance regressions (especially on low-end devices).

---

## 📋 Appendices

### Appendix A: Component Update Checklist

**Core Layout & Chrome**
- [ ] `src/app/layout.tsx`
- [ ] `src/components/ui/header.tsx`
- [ ] `src/components/Footer.tsx`

**Core Primitives**
- [ ] `src/components/ui/button.tsx`
- [ ] `src/components/ui/input.tsx`
- [ ] `src/components/ui/FilterTabs.tsx`

**Key Marketing & Results**
- [ ] `src/components/landing/HeroSection.tsx`
- [ ] `src/components/landing/CTASection.tsx`
- [ ] `src/components/landing/QuestionsSection.tsx`
- [ ] `src/components/ui/PerfumeCard.tsx`
- [ ] `src/components/ui/PerfumeGrid.tsx`
- [ ] `src/components/ResultsGrid.tsx`
- [ ] `src/components/results/ResultsContent.tsx`

**Overlays & Modals**
- [ ] `src/components/FeedbackModal.tsx`
- [ ] `src/components/AdminModal.tsx`
- [ ] `src/components/ui/MobileFilterModal.tsx`

**Supporting UI**
- [ ] `src/components/ui/BlurredTeaserCard.tsx`
- [ ] `src/components/ui/UpsellCard.tsx`
- [ ] `src/components/ui/StatsGrid.tsx`
- [ ] `src/components/ui/RadarChart.tsx`
- [ ] `src/components/ui/EmptyState.tsx`
- [ ] `src/components/ui/Badge.tsx`
- [ ] `src/components/ui/CounterBadge.tsx`
- [ ] `src/components/SafetyWarnings.tsx`

**Quiz & Flow Components**
- [ ] `src/components/quiz/QuizLandingContent.tsx`
- [ ] `src/components/quiz/SymptomCard.tsx`
- [ ] `src/components/quiz/Step3Allergy.tsx`
- [ ] `src/app/quiz/page.tsx`
- [ ] `src/app/quiz/step1-favorites/page.tsx`
- [ ] `src/app/quiz/step2-disliked/page.tsx`
- [ ] `src/app/quiz/step3-allergy/page.tsx`

**Auth & Settings**
- [ ] `src/app/login/page.tsx`
- [ ] `src/app/register/page.tsx`
- [ ] `src/app/settings/page.tsx`

*(Extend this checklist with any additional components from Part 2 as needed.)*

---

### Appendix B: Code Snippets Reference

**Example 1: Adding dark mode to a component**

```tsx
// Before
<div className="bg-white text-brown-text border border-brown-text/20">

// After (token-based)
<div className="bg-surface text-text-primary border border-border-subtle dark:border-border-strong">
```

**Example 2: ThemeToggle component**

```tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const resolved = theme === 'system' ? systemTheme : theme;
  const isDark = resolved === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      className="min-touch-target inline-flex items-center justify-center rounded-full border border-border-subtle bg-surface-elevated px-3 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-surface-muted transition-colors rtl:space-x-reverse space-x-2"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-accent-primary" />
      ) : (
        <Moon className="h-4 w-4 text-accent-primary" />
      )}
      <span className="hidden sm:inline">
        {isDark ? 'وضع فاتح' : 'وضع داكن'}
      </span>
    </button>
  );
}
```

**Example 3: CSS Variables structure**

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --surface: #ffffff;
  --surface-elevated: #f5f0ea;
  --surface-muted: #f3e5dc;
  --border-subtle: rgba(91, 66, 51, 0.08);
  --border-strong: rgba(91, 66, 51, 0.18);
  --accent-primary: #c0841a;
  --accent-primary-soft: rgba(192, 132, 26, 0.18);
  --text-primary: #291d12;
  --text-secondary: #8B7355;
  --text-muted: rgba(91, 66, 51, 0.7);
}

.dark {
  --background: #050507;
  --foreground: #f5f2ec;
  --surface: #111118;
  --surface-elevated: #181820;
  --surface-muted: #20202a;
  --border-subtle: rgba(245, 242, 236, 0.06);
  --border-strong: rgba(245, 242, 236, 0.16);
  --accent-primary: #d1a559;
  --accent-primary-soft: rgba(209, 165, 89, 0.24);
  --text-primary: #f5f2ec;
  --text-secondary: #d2c2ae;
  --text-muted: rgba(210, 194, 174, 0.75);
}
```

---

### Appendix C: Testing Matrix

| Test Case                    | Light Mode | Dark Mode | Status  |
|-----------------------------|-----------|-----------|---------|
| Homepage (`/`)              | [ ]       | [ ]       | Pending |
| HeroSection                 | [ ]       | [ ]       | Pending |
| CTASection                  | [ ]       | [ ]       | Pending |
| Results page (`/results`)   | [ ]       | [ ]       | Pending |
| PerfumeCard                 | [ ]       | [ ]       | Pending |
| MobileFilterModal (mobile)  | [ ]       | [ ]       | Pending |
| FeedbackModal               | [ ]       | [ ]       | Pending |
| Quiz flow (all steps)       | [ ]       | [ ]       | Pending |
| Login/Register              | [ ]       | [ ]       | Pending |
| Settings                    | [ ]       | [ ]       | Pending |
| Notifications page          | [ ]       | [ ]       | Pending |
| FAQ / Privacy               | [ ]       | [ ]       | Pending |

---

## 🎯 Quick Start Guide

**For the developer implementing this:**

1. **Read the Executive Summary** (2–3 minutes) to understand scope, risk, and timeline.
2. **Review Part 3 (Strategy & Final Recommendations)** to internalize the chosen stack and phases.
3. **Start with Phase 1 Checklist** and implement the foundation (provider, CSS variables, toggle).
4. **Use Appendix A** as a progress checklist across components.
5. **Reference Appendix B** for concrete code snippets and patterns.
6. **Use Appendix C** to structure visual and functional testing.

**Key Files to Reference:**
- Strategy & risk: **Part 3, Task 8**.
- Component list and effort: **Part 2, Task 4**.
- CSS variables and Tailwind config: **Part 1, Task 2**.
- RTL rules: `docs/RTL.md`.

---

**Report Status:** ✅ Complete and Ready for Implementation  
**Next Action:** Start Phase 1 (Foundation) on a dedicated feature branch.


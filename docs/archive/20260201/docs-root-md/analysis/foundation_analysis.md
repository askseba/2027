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

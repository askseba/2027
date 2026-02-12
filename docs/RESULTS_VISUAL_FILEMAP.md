## RESULTS /ar/results – Visual File Map

هذا التقرير يغطّي طبقة العرض فقط لمسار `/ar/results` في App Router بدون أي تعديل في المنطق.

---

## 1) Route map – `/ar/results`

- **App Route (locale‑aware)**
  - **File**: `src/app/[locale]/results/page.tsx`
  - **Role**: صفحة النتائج في App Router مع دعم i18n.
  - **Layout wrappers**:
    - `src/app/layout.tsx` (RootLayout – Theme, Session, Quiz, i18n, ErrorBoundary, PWA…).
    - لا يوجد `src/app/[locale]/layout.tsx` (مسار غير موجود).
  - **Metadata / title**:
    - يتم تعريفها عبر `generateMetadata` في نفس الملف باستخدام `next-intl`.

```tsx
// src/app/[locale]/results/page.tsx (lines 1-22 تقريباً)
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { ResultsContent } from '@/components/results/ResultsContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'results' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    robots: { index: false },
  }
}

export default async function ResultsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ResultsContent />
}
```

- **Root layout / providers**
  - **File**: `src/app/layout.tsx`

```tsx
// src/app/layout.tsx (مقتطف من الوسط)
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { Toaster } from 'sonner';
import { PWARegister } from "@/components/PWARegister";
import { SessionProvider } from "@/components/SessionProvider";
import { QuizProvider } from "@/contexts/QuizContext";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkStatusToast } from "@/components/NetworkStatusToast";
import { ThemeProvider } from "next-themes";
import { PostHogProviderWrapper } from "@/components/PostHogProviderWrapper";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // ... locale + messages
  return (
    <html lang={lang} dir={direction} suppressHydrationWarning>
      <body className="...">
        <ThemeProvider attribute="class" defaultTheme="system" storageKey="theme" enableSystem>
          <PostHogProviderWrapper>
            <ErrorBoundary>
              <SessionProvider>
                <QuizProvider>
                  <NextIntlClientProvider locale={locale} messages={messages}>
                    <ConditionalLayout>
                      {children}
                    </ConditionalLayout>
                  </NextIntlClientProvider>
                  <Toaster ... />
                  <NetworkStatusToast />
                  <PWARegister />
                  <SentryLazyExtras />
                </QuizProvider>
              </SessionProvider>
            </ErrorBoundary>
          </PostHogProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- **Legacy (غير مستخدم لمسار `/ar/results` لكنه مهم سياقياً)**:
  - `src/app/results/page.tsx` – نسخة سابقة لنتائج بدون `[locale]`، تظل مرجعاً بصرياً ولكن لا تلف `/ar/results`.

---

## 2) Entry component – Results UI

- **Entry component لمسار `/[locale]/results`**
  - **File**: `src/components/results/ResultsContent.tsx`
  - **Rendered from**: `src/app/[locale]/results/page.tsx` (السطر الذي يعيد `<ResultsContent />`).

```tsx
// src/components/results/ResultsContent.tsx (أعلى الملف)
"use client"
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRightLeft, Zap } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { PerfumeCard } from '@/components/ui/PerfumeCard'
import { Button } from '@/components/ui/button'
import { useQuiz } from '@/contexts/QuizContext'
import { useSession } from 'next-auth/react'
import { type ScoredPerfume } from '@/lib/matching'
import { safeFetch } from '@/lib/utils/api-helpers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { UpsellCard } from '@/components/ui/UpsellCard'
import { BlurredTeaserCard } from '@/components/ui/BlurredTeaserCard'
import { BackButton } from '@/components/ui/BackButton'
import logger from '@/lib/logger'
```

### Import graph لـ `ResultsContent`

| Imported symbol        | File path                                      | Role بصري |
|------------------------|-----------------------------------------------|-----------|
| `PerfumeCard`          | `src/components/ui/PerfumeCard.tsx`           | بطاقة العطر الأساسية |
| `Button`               | `src/components/ui/button.tsx`                | أزرار الـ CTA في شريط المقارنة |
| `LoadingSpinner`       | `src/components/LoadingSpinner.tsx`           | حالة التحميل الكاملة |
| `UpsellCard`           | `src/components/ui/UpsellCard.tsx`            | كارت ترقية الـ FREE/PREMIUM |
| `BlurredTeaserCard`    | `src/components/ui/BlurredTeaserCard.tsx`     | كارت النتائج المموّهة (غير المسبة) |
| `BackButton`           | `src/components/ui/BackButton.tsx`            | زر الرجوع أعلى الصفحة |
| `motion`, `AnimatePresence` | من `framer-motion`                      | حركات الدخول + شريط المقارنة |
| `Sparkles`, `ArrowRightLeft`, `Zap` | من `lucide-react`              | أيقونات للـ hero والـ comparison bar |

مكوّنات منطق / بيانات (غير بصرية لكن مؤثرة على الحالات):

- `useQuiz` من `src/contexts/QuizContext.tsx`
- `useSession` من `next-auth/react`
- `safeFetch` من `src/lib/utils/api-helpers.ts`
- `ScoredPerfume` من `src/lib/matching.ts`
- `logger` من `src/lib/logger.ts`

---

## 3) Results layout + typography audit

### 3.1 Containers / grids (من `ResultsContent`)

```tsx
// src/components/results/ResultsContent.tsx (حول الهيكل العام)
if (isLoading) return (
  <div className="min-h-screen flex items-center justify-center bg-cream-bg dark:!bg-surface">
    <LoadingSpinner size="lg" />
  </div>
)

const direction = locale === 'ar' ? 'rtl' : 'ltr'
return (
  <div className="min-h-screen bg-cream-bg dark:!bg-surface pb-20" dir={direction}>
    <div className="container mx-auto px-6 pt-6">
      <BackButton ... className="mb-6" />
    </div>

    {/* Hero Section */}
    <section className="bg-gradient-to-b from-primary/10 dark:from-amber-500/10 to-transparent pt-16 pb-12 px-6 text-center">
      ...
    </section>
```

- **Page wrapper**: `min-h-screen bg-cream-bg dark:!bg-surface pb-20` – خلفية كريمية في الضوء وسطح semantic في الوضع الداكن.
- **Top container**: `container mx-auto px-6 pt-6` – حافة أفقية 24px تقريباً، عرض ثابت متجاوب من Tailwind container.
- **Hero section**:
  - `bg-gradient-to-b from-primary/10 dark:from-amber-500/10 to-transparent`
  - `pt-16 pb-12 px-6 text-center` – padding علوي 64px، سفلي ~48px (اعتماداً على config الافتراضي).

```tsx
// شريط المقارنة + شبكة النتائج
{/* Comparison Bar (Sticky) */}
<AnimatePresence>
  {compareIds.length > 0 && (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-white dark:bg-surface-elevated rounded-2xl shadow-elevation-3 border border-primary/20 dark:border-border-subtle p-4 flex items-center justify-between gap-4"
    >
      ...
    </motion.div>
  )}
</AnimatePresence>

{/* Results Grid */}
<main className="container mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Perfume cards + mid-grid Upsell */}
  </div>
  {/* BlurredTeaser + Bottom Upsell */}
</main>
```

- **Comparison bar layout**:
  - `fixed bottom-6 left-1/2 -translate-x-1/2` – شريط عائم بمنتصف العرض في الأسفل.
  - `w-[90%] max-w-2xl` – عرض 90٪ مع حد أقصى 672px تقريباً.
  - `rounded-2xl shadow-elevation-3 border ... p-4` – كارت مرتفع (elevated surface).
- **Results grid**:
  - Wrapper: `container mx-auto px-6` – نفس محور الاتساق مع الـ header.
  - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` – عمود واحد على الموبايل، 2 أعمدة على md، 3 على lg؛ فراغ 32px بين العناصر.

### 3.2 PerfumeCard – layout + typography

**File**: `src/components/ui/PerfumeCard.tsx`

```tsx
// حاوية الكارت
return (
  <div className="group relative bg-white dark:bg-surface rounded-3xl shadow-elevation-1 dark:shadow-black/20 border border-primary/5 dark:border-border-subtle overflow-hidden hover:shadow-elevation-3 dark:hover:shadow-black/30 transition-all duration-500 flex flex-col h-full">
    {/* Badges */}
    {/* Image Section */}
    {/* Content Section */}
  </div>
)
```

- **Card container**:
  - `rounded-3xl` – زوايا كبيرة ناعمة.
  - `shadow-elevation-1 hover:shadow-elevation-3` – تدرّج ارتفاع الكارت عند hover (معرّفة في `tailwind.config.ts`).
  - `border border-primary/5` مع بديل داكن `dark:border-border-subtle`.

```tsx
// Hero image + hover
<div className="relative aspect-[4/5] w-full bg-cream-bg dark:bg-background overflow-hidden">
  <Image
    ... 
    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
    priority={priority}
    loading={priority ? undefined : "lazy"}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-surface-elevated/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
</div>
```

- **Image area**: نسبة 4:5، padding داخلي كبير، تكبير تدريجي عند hover.

```tsx
// Typography داخل الكارت
<div className="p-6 flex flex-col flex-1">
  <div className="mb-4">
    <p className="text-primary dark:text-amber-500 font-bold text-xs mb-1 tracking-widest uppercase">
      {brand}
    </p>
    <h3 className="text-xl font-bold text-text-primary dark:text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
      {displayName}
    </h3>
  </div>

  <p className="text-text-secondary dark:text-text-muted text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
    {description || "توليفة عطرية ساحرة ..."}
  </p>
  ...
</div>
```

- **Brand**: `text-xs` (0.75rem، lineHeight 1.5) + `tracking-widest uppercase` – Badge typographic style.
- **Title**: `text-xl` (1.25rem، lineHeight 1.5) + `font-bold`.
- **Description**: `text-sm` (0.875rem) + `leading-relaxed`.

### 3.3 UpsellCard & BlurredTeaser – key typography

**UpsellCard** – `src/components/ui/UpsellCard.tsx`

```tsx
// عنوان الكارت
<h3 className="text-3xl md:text-4xl font-black text-brown-text leading-tight">
  {remainingCount} عطور إضافية
  <br />
  <span className="bg-gradient-to-l from-amber-600 to-primary bg-clip-text text-transparent">
    تطابقك تماماً! ✨
  </span>
</h3>

{averageMatch && (
  <p className="text-brown-text/75 text-lg">
    متوسط التطابق: <span className="font-bold text-primary">{averageMatch}%</span>
  </p>
)}
```

- **Title**: `text-3xl` → 1.875rem (line-height 1.3) على الموبايل، `text-4xl` → 2.25rem (line-height 1.2) على md+.
- **Body**: `text-lg` → 1.125rem (line-height 1.6).

**BlurredTeaserCard (multi‑items)** – `src/components/ui/BlurredTeaserCard.tsx`

```tsx
<h3 className="text-2xl md:text-3xl font-black text-brown-text dark:text-text-primary">
  {items.length} عطر إضافي ينتظرك
</h3>
<p className="text-lg text-brown-text/75 dark:text-text-muted">{message}</p>
<p className="text-3xl font-black text-primary dark:text-amber-500">{matchRange || `${averageMatch}%`}</p>
<p className="text-sm text-brown-text/60 dark:text-text-muted">متوسط التطابق</p>
```

- **Headline**: `text-2xl` → 1.5rem (line-height 1.4)؛ على md: `text-3xl` → 1.875rem (line-height 1.3).
- **Secondary text**: `text-lg` و `text-sm` كما في UpsellCard.

### 3.4 Typography scale summary

استناداً إلى `tailwind.config.ts` (قسم `fontSize` المخصّص) واستخدامات الكلاسات في النتائج:

| Element                          | Classes                                | Size (rem) / line-height | File + موقع |
|----------------------------------|----------------------------------------|--------------------------|-------------|
| **Hero badge text**             | `text-sm font-bold`                    | 0.875rem / 1.5          | `ResultsContent` – داخل الـ pill (`Sparkles` badge) |
| **Hero paragraph**              | `text-lg text-text-secondary`          | 1.125rem / 1.6          | `ResultsContent` – الوصف تحت الـ badge |
| **Comparison bar title**        | `text-sm font-bold`                    | 0.875rem / 1.5          | `ResultsContent` – "مقارنة العطور" |
| **Comparison bar subtitle**     | `text-xs`                              | 0.75rem / 1.5           | `ResultsContent` – "قارن المكونات..." |
| **Card brand**                  | `text-xs font-bold tracking-widest`    | 0.75rem / 1.5           | `PerfumeCard` – اسم الماركة |
| **Card title**                  | `text-xl font-bold`                    | 1.25rem / 1.5           | `PerfumeCard` – اسم العطر |
| **Card description**            | `text-sm leading-relaxed`              | 0.875rem / 1.6          | `PerfumeCard` – وصف أو نص fallback |
| **Upsell big title**           | `text-3xl md:text-4xl font-black`      | 1.875→2.25rem / 1.3→1.2 | `UpsellCard` – العنوان الرئيسي |
| **Upsell body**                | `text-lg`                              | 1.125rem / 1.6          | `UpsellCard` – النص أسفل العنوان |
| **Blurred headline**           | `text-2xl md:text-3xl font-black`      | 1.5→1.875rem            | `BlurredTeaserCard` |
| **Blurred match number**       | `text-3xl font-black`                  | 1.875rem                | `BlurredTeaserCard` |
| **Buttons (primary)**           | `text-base font-bold` (via variants)   | 1rem / 1.6              | `button.tsx` + استخدامات في Upsell/Blurred |

---

## 4) Components checklist – user‑visible states

### 4.1 Loading state

- **File**: `src/components/results/ResultsContent.tsx`

```tsx
// حول السطور 79–81
if (isLoading) return (
  <div className="min-h-screen flex items-center justify-center bg-cream-bg dark:!bg-surface">
    <LoadingSpinner size="lg" />
  </div>
)
```

- **Spinner component**: `src/components/LoadingSpinner.tsx`

```tsx
// LoadingSpinner – type 3 (الافتراضي)
export function LoadingSpinner({ type = 3, message = 'جاري التحميل...', size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-24 h-24' }
  if (type === 3) {
    return (
      <div role="status" aria-live="polite" className={`flex flex-col items-center gap-4 ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gradient-start to-primary ...`}>
          {/* Avatar‑style icon */}
        </div>
        {/* Bouncing dots + text */}
      </div>
    )
  }
  // types 1 & 2: spinner ring + progress bar
}
```

### 4.2 Error state

- **File**: `src/components/results/ResultsContent.tsx`

```tsx
// حوالى السطور 233–252
if (error) {
  return (
    <div className="min-h-screen bg-cream-bg dark:!bg-surface flex items-center justify-center" dir="rtl">
      <div className="text-center max-w-md">
        <p className="text-xl text-red-500 dark:text-red-400 mb-4">{error}</p>
        {error.includes('الاختبارات الشهرية') && (
          <CTAButton onClick={() => router.push('/pricing')} variant="primary" className="mb-4">
            اشترك للحصول على اختبارات غير محدودة
          </CTAButton>
        )}
        <CTAButton onClick={() => window.location.reload()} variant="secondary">
          إعادة المحاولة
        </CTAButton>
      </div>
    </div>
  )
}
```

> ملاحظة: حالة الخطأ هنا تعتمد على نص عربي مباشر وليس i18n keys.

### 4.3 Normal results (grid + cards)

- **File**: `src/components/results/ResultsContent.tsx`

```tsx
// شبكة النتائج – حوالى السطور 125–152
<main className="container mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {scoredPerfumes.map((perfume, index) => {
      const items = []
      items.push(
        <motion.div 
          key={perfume.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PerfumeCard 
            {...perfume}
            ifraScore={perfume.ifraScore}
            symptomTriggers={perfume.symptomTriggers}
            ifraWarnings={perfume.ifraWarnings}
            source={perfume.source}
            showCompare={true}
            isComparing={compareIds.includes(perfume.id)}
            onCompare={() => toggleCompare(perfume.id)}
            priority={index < 2}
          />
        </motion.div>
      )
      // mid-grid Upsell for FREE users...
      return items
    })}
```

### 4.4 Tier-specific UI – Upsell / Blurred

- **Mid-grid UpsellCard (FREE فقط)** – نفس الملف:

```tsx
// حوالى السطور 153–167
if (index === 3 && tier === 'FREE') {
  items.push(
    <motion.div key="upsell-mid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <UpsellCard 
        position="mid-grid"
        remainingCount={blurredItems.length + (scoredPerfumes.length - index - 1)}
        averageMatch={Math.round(
          blurredItems.reduce((acc, item) => acc + item.matchScore, 0) / (blurredItems.length || 1)
        )}
      />
    </motion.div>
  )
}
```

- **BlurredTeaserCard (GUEST/FREE)**:

```tsx
// حوالى السطور 174–191
{tier !== 'PREMIUM' && blurredItems.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: scoredPerfumes.length * 0.1 }}
    className="col-span-1"
  >
    <BlurredTeaserCard 
      items={blurredItems.map(item => ({
        name: 'عطر مخفي',
        brand: item.familyHint,
        matchScore: item.matchScore
      }))}
      tier={tier}
      matchRange={`${Math.min(...blurredItems.map(i => i.matchScore))}-${Math.max(...blurredItems.map(i => i.matchScore))}%`}
    />
  </motion.div>
)}
```

- **Bottom UpsellCard (tier ≠ PREMIUM)**:

```tsx
// حوالى السطور 195–203
{tier !== 'PREMIUM' && (
  <div className="mt-16">
    <UpsellCard 
      position="bottom"
      remainingCount={blurredItems.length}
      averageMatch={Math.round(
        blurredItems.reduce((acc, item) => acc + item.matchScore, 0) / (blurredItems.length || 1)
      )}
    />
  </div>
)}
```

---

## 5) Styles & theme map

### 5.1 Theme / global styles

- **Tailwind config**: `tailwind.config.ts`
  - يعرّف ألوان semantic مرتبطة بـ CSS variables من `globals.css`:

```ts
// tailwind.config.ts (مقتطف)
extend: {
  colors: {
    surface: 'rgb(var(--color-surface) / <alpha-value>)',
    'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
    background: 'rgb(var(--color-background) / <alpha-value>)',
    'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
    'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
    'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
    'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
    cream: '#FAF8F5',
    gold: { DEFAULT: '#B39D7D', dark: '#8A7760', light: '#D4C5B0' },
    'dark-brown': '#5B4233',
    'medium-brown': '#8B7355',
    'light-brown': '#A89B8C',
    // ...
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
    sm: ['0.875rem', { lineHeight: '1.5' }],
    base: ['1rem', { lineHeight: '1.6' }],
    lg: ['1.125rem', { lineHeight: '1.6' }],
    xl: ['1.25rem', { lineHeight: '1.5' }],
    '2xl': ['1.5rem', { lineHeight: '1.4' }],
    '3xl': ['1.875rem', { lineHeight: '1.3' }],
    '4xl': ['2.25rem', { lineHeight: '1.2' }],
    // ...
  },
  boxShadow: {
    'elevation-1': '0 2px 8px rgba(91, 66, 51, 0.08)',
    'elevation-2': '0 4px 16px rgba(91, 66, 51, 0.12)',
    'elevation-3': '0 8px 24px rgba(91, 66, 51, 0.16)',
    'button': '0 2px 8px rgba(192, 132, 26, 0.2)',
    'card': '0 4px 16px rgba(91, 66, 51, 0.12)',
  },
}
```

- **Global CSS / tokens**: `src/app/globals.css`

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --cream: #FAF8F5;
  --gold: #B39D7D;
  --gold-hover: #9A846A;
  --dark-brown: #5B4233;
  --medium-brown: #8B7355;
  --light-brown: #A89B8C;
  --border: rgba(91, 66, 51, 0.12);
  --shadow: rgba(91, 66, 51, 0.08);
  --shadow-medium: rgba(91, 66, 51, 0.15);
  --font-arabic: 'Noto Sans Arabic', sans-serif;
  --font-logo: 'Cormorant Garamond', serif;
}

@theme inline {
  --color-surface: 255 255 255;
  --color-surface-elevated: 255 255 255;
  --color-background: 255 255 255;
  --color-border-subtle: 228 228 231;
  --color-text-primary: 17 24 39;
  --color-text-secondary: 107 114 128;
  --color-text-muted: 148 163 184;
  --color-accent-primary: 218 168 79;
  --font-sans: var(--font-arabic), Tahoma, Arial, sans-serif;
}
```

### 5.2 Undefined / non‑themed classes

- **Class**: `text-brown-text` واشتقاقاتها (`text-brown-text/75`, `border-brown-text/10`, إلخ).
  - **Usage examples**:
    - `src/components/ui/UpsellCard.tsx` – عنوان ونصوص كثيرة (الأسطر 49–60، 69–80، 102–107 تقريباً).
    - `src/components/ui/BlurredTeaserCard.tsx` – headline + body (الأسطر 76–88 تقريباً).
    - `src/components/LoadingSpinner.tsx` – نص الرسالة (`text-brown-text`، السطر 52 تقريباً).
    - `src/app/results/page.tsx` (النسخة القديمة) – hero/title/pagination.
  - **Definition check**:
    - غير معرّفة في `tailwind.config.ts` ضمن الألوان.
    - غير معرّفة كـ `.brown-text` أو `.text-brown-text` في `globals.css`.
  - **أفضل مكان لتعريفها**:
    - **خيار مفضّل**: إضافة لون theme جديد في `tailwind.config.ts` مثل:
      - `brown-text: '#5B4233'` أو `'#8B7355'`، ثم استخدام `text-brown-text`.
    - **بديل**: تعريف util في `globals.css`:
      - `.text-brown-text { color: var(--dark-brown); }`
    - يفضّل أن يكون المصدر واحد (tailwind theme) ليتماشى مع بقية tokens.

لا توجد تسميات مخصصة أخرى في النتائج تبدو غير معرّفة (مثل `bg-cream-bg` و`dark:bg-surface`، كلها موجودة في الـ theme).

---

## 6) Motion / animation map

### 6.1 ResultsContent

- **File**: `src/components/results/ResultsContent.tsx`

```tsx
import { motion, AnimatePresence } from 'framer-motion'

// Hero fade‑in
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
  {/* Badge + hero text */}
</motion.div>

// Comparison bar slide‑up
<AnimatePresence>
  {compareIds.length > 0 && (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-6 left-1/2 ..."
    >
      ...
    </motion.div>
  )}
</AnimatePresence>

// Card stagger داخل grid
<motion.div 
  key={perfume.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
  <PerfumeCard ... />
</motion.div>
```

- **Stagger**: يتم تحقيقه عبر `transition.delay = index * 0.1` على مستوى الكارت.
- **Blurred/Upsell**: نفس نمط الحركة (opacity + y) مع delay ثابت أو محسوب من طول القائمة.

### 6.2 PerfumeCard

- **File**: `src/components/ui/PerfumeCard.tsx`
  - لا يستخدم `framer-motion` مباشرة، لكن:
    - الصورة نفسها تستخدم `transition-transform duration-700 group-hover:scale-110`.
    - الغطاء العلوي (`gradient overlay`) يتلاعب بـ `opacity` على `group-hover`.

### 6.3 Button (motion wrappers)

- **File**: `src/components/ui/button.tsx`

```tsx
import { motion } from "framer-motion"

// Link variant
if (href) {
  return (
    <motion.div 
      whileHover={!isLoading ? { scale: 1.02 } : {}} 
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      className={wrapperClass}
    >
      <Link href={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    </motion.div>
  )
}
```

- **Effect**: سكейلينغ بسيط على hover/tap لجميع الأزرار (بما في ذلك تلك المستخدمة داخل النتائج).

### 6.4 UpsellCard

- **File**: `src/components/ui/UpsellCard.tsx`

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.4 }}
  className="relative bg-gradient-to-br ... rounded-3xl p-8 md:p-10 ..."
>
  {/* المحتوى */}
</motion.div>
```

### 6.5 BlurredTeaserCard / Loading states

- **File**: `src/components/ui/BlurredTeaserCard.tsx`
  - لا يستخدم `framer-motion`، لكن يعتمد على:
    - `animate-pulse` لبعض الخلفيات (الدائرة المموهة).
    - `backdrop-blur-sm` لمنح تأثير الـ glassmorphism.

- **File**: `src/components/LoadingSpinner.tsx`
  - يستخدم `animate-bounce`, `animate-spin`, و `animate-pulse` من Tailwind.
  - لا يوجد shimmer skeleton حقيقي في شبكة النتائج نفسها؛ فقط spinner/overlay.

---

## 7) i18n / content strings

### 7.1 Namespace

- **Namespace المستخدم في metadata والـ Back button**:
  - `results` – من `messages/{locale}.json`.
  - يتم تحميل الرسائل عبر:
    - `src/i18n/request.ts` + `src/i18n/routing.ts` لتكوين الـ locale.
    - `src/app/layout.tsx` يستخدم `import('../../messages/${locale}.json')`.

```ts
// src/i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  // تحديد locale
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
```

### 7.2 Keys الخاصة بالنتائج

- **File**: `messages/en.json`

```json
"results": {
  "metadata": {
    "title": "Your quiz results - Your fragrance profile",
    "description": "Discover your ideal fragrances based on your personality and preferences analysis"
  },
  "backToDashboard": "Back to dashboard"
}
```

- **File**: `messages/ar.json`

```json
"results": {
  "metadata": {
    "title": "نتائج اختبارك - بصمتك العطرية",
    "description": "اكتشف العطور المثالية لك بناءً على تحليل شخصيتك وتفضيلاتك"
  },
  "backToDashboard": "العودة للوحة التحكم"
}
```

### 7.3 Hero / Upsell / Buttons النصّي

- **Hero copy داخل `ResultsContent`**:

```tsx
// src/components/results/ResultsContent.tsx – hero section
<span className="text-sm font-bold text-text-primary dark:text-text-primary">
  تم تحليل ذوقك بنجاح
</span>
<p className="text-text-secondary dark:text-text-muted max-w-2xl mx-auto text-lg">
  بناءً على تفضيلاتك، قمنا باختيار هذه العطور ...
</p>
```

- **Upsell / Blurred copy**:
  - كله نص عربي ثابت داخل `UpsellCard.tsx` و`BlurredTeaserCard.tsx` (مثل "ترقية مميزة"، "اشترك الآن"، "عطر إضافي ينتظرك").

> ملاحظة: hero/upsell/buttons الخاصة بنتائج الصفحة **غير مربوطة حالياً بـ i18n namespace**، أي أن تعديل اللغة يتطلب تعديل النص داخل المكونات مباشرة، وليس في `messages/*.json`.

---

## 8) API / data contracts (بدون تعديل المنطق)

### 8.1 Match API route

- **File**: `src/app/api/match/route.ts`

```ts
// تعريف MatchRequestBody
interface MatchRequestBody {
  preferences: {
    likedPerfumeIds: string[]
    dislikedPerfumeIds: string[]
    allergyProfile: {
      symptoms?: string[]
      families?: string[]
      ingredients?: string[]
    }
  }
  seedSearchQuery?: string
}

// Response (مبسّط بصرياً)
const response = {
  success: true,
  perfumes: visible.map((p) => ({
    ...p,
    ifraScore: p.ifraScore,
    symptomTriggers: p.symptomTriggers ?? [],
    ifraWarnings: p.ifraWarnings ?? [],
    source: p.source ?? 'local'
  })),
  blurredItems: blurred,
  tier
}
```

- **Endpoint**: `/api/match` (POST).
- يستخدم:
  - `calculateMatchScores` من `src/lib/matching.ts`.
  - `ScoredPerfume` (type) من نفس الملف.
  - gating helpers من `src/lib/gating.ts` (غير مفصّلة هنا لأنها منطقية بالكامل).

### 8.2 ScoredPerfume type

- **File**: `src/lib/matching.ts`

```ts
export interface PerfumeForMatching {
  id: string
  name: string
  brand: string
  image: string
  description: string | null
  price: number | null
  families: string[]
  ingredients: string[]
  symptomTriggers: string[]
  isSafe: boolean
  status: string
  variant: string | null
  scentPyramid: {
    top: string[]
    heart: string[]
    base: string[]
  } | null
}

export interface ScoredPerfume extends PerfumeForMatching {
  finalScore: number
  tasteScore: number
  safetyScore: number
  isExcluded: boolean
  exclusionReason: string | null
}
```

### 8.3 Match response shape في الـ UI

- **File**: `src/components/results/ResultsContent.tsx`

```ts
interface BlurredItem {
  id: string
  matchScore: number
  familyHint: string
}

interface MatchResponse {
  success: boolean
  perfumes: ScoredPerfume[]
  blurredItems?: BlurredItem[]
  tier: 'GUEST' | 'FREE' | 'PREMIUM'
}
```

> جميع قرارات الـ UI (عدد البطاقات، الـ blurred، طبقة الـ tier) تعتمد على هذه الحقول فقط؛ لا حاجة لأي تعديل منطق هنا لخطة تحسين بصري.

---

## 9) Layout tables – containers / grids / cards

### 9.1 Containers

| Element            | Classes                                               | File                            |
|--------------------|-------------------------------------------------------|---------------------------------|
| Page wrapper       | `min-h-screen bg-cream-bg dark:!bg-surface pb-20`    | `ResultsContent`                |
| Top nav container  | `container mx-auto px-6 pt-6`                        | `ResultsContent`                |
| Hero section       | `bg-gradient-to-b ... pt-16 pb-12 px-6 text-center`  | `ResultsContent`                |
| Main content       | `container mx-auto px-6`                             | `ResultsContent`                |
| Comparison bar     | `fixed bottom-6 left-1/2 ... max-w-2xl p-4 flex ...` | `ResultsContent`                |
| PerfumeCard shell  | `bg-white dark:bg-surface rounded-3xl shadow-...`    | `PerfumeCard`                   |
| UpsellCard shell   | `bg-gradient-to-br ... rounded-3xl p-8 md:p-10`      | `UpsellCard`                    |
| BlurredTeaser shell| `bg-gradient-to-br ... rounded-3xl p-8 border-2`     | `BlurredTeaserCard` (multi)    |

### 9.2 Grids

| Grid                       | Classes                                      | File             |
|---------------------------|----------------------------------------------|------------------|
| Results grid              | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` | `ResultsContent` |
| Upsell features grid      | `grid grid-cols-1 sm:grid-cols-2 gap-3`      | `UpsellCard`     |
| Blurred teaser preview    | `flex justify-center gap-4` (3 عناصر)       | `BlurredTeaserCard` |

### 9.3 Card internals

| Card        | Typography key classes                                         |
|-------------|----------------------------------------------------------------|
| PerfumeCard | Brand: `text-xs font-bold tracking-widest`; Title: `text-xl font-bold`; Description: `text-sm leading-relaxed` |
| UpsellCard  | Title: `text-3xl md:text-4xl font-black`; Features: `text-sm text-brown-text/60`; Price: `text-4xl font-black` |
| BlurredCard | Headline: `text-2xl md:text-3xl font-black`; Match: `text-3xl font-black`; Caption: `text-sm text-brown-text/60` |

---

## 10) Top 10 visual edit points (بدون لمس المنطق)

> ملاحظة: جميع النقاط أدناه تحدد الملف + السطر التقريبي + مقتطف لتسهيل العمل البصري لاحقاً؛ لا توجد أي تعديلات منطقية مقترحة.

1. **Hero section contrast & spacing**
   - **File**: `src/components/results/ResultsContent.tsx` (حوالي 93–100).
   - **Snippet**:

```tsx
<section className="bg-gradient-to-b from-primary/10 dark:from-amber-500/10 to-transparent pt-16 pb-12 px-6 text-center">
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-surface-elevated/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 dark:border-border-subtle mb-6 shadow-sm">
      <Sparkles className="w-4 h-4 text-primary dark:text-amber-500" />
      <span className="text-sm font-bold text-text-primary dark:text-text-primary">تم تحليل ذوقك بنجاح</span>
    </div>
    <p className="text-text-secondary dark:text-text-muted max-w-2xl mx-auto text-lg">
      بناءً على تفضيلاتك، قمنا باختيار هذه العطور ...
    </p>
  </motion.div>
</section>
```

2. **Comparison bar density on mobile**
   - **File**: `src/components/results/ResultsContent.tsx` (حوالي 104–121).

```tsx
<motion.div 
  initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-white dark:bg-surface-elevated rounded-2xl shadow-elevation-3 border border-primary/20 dark:border-border-subtle p-4 flex items-center justify-between gap-4"
>
  {/* نص + أزرار CTA صغيرة */}
</motion.div>
```

3. **Results grid gutters & card breathing room**
   - **File**: `src/components/results/ResultsContent.tsx` (125–128).

```tsx
<main className="container mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* PerfumeCard + Upsell mid-grid */}
  </div>
</main>
```

4. **PerfumeCard hierarchy (brand vs title vs score)**
   - **File**: `src/components/ui/PerfumeCard.tsx` (114–123 + شارة النسبة).

```tsx
<div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
  {/* Score badge */}
  <div className="bg-white/90 dark:bg-surface/90 ... p-2 rounded-2xl ...">
    <span className={cn("text-lg font-black leading-none", getScoreColor(displayScore), ...)}>{displayScore}%</span>
    <span className="text-[8px] font-bold text-text-secondary ... uppercase tracking-tighter">تطابق</span>
  </div>
</div>
...
<p className="text-primary dark:text-amber-500 font-bold text-xs mb-1 tracking-widest uppercase">{brand}</p>
<h3 className="text-xl font-bold text-text-primary ... line-clamp-1 group-hover:text-primary transition-colors">
  {displayName}
</h3>
```

5. **PerfumeCard hover motion (image zoom + gradient overlay)**
   - **File**: `src/components/ui/PerfumeCard.tsx` (98–110).

```tsx
<div className="relative aspect-[4/5] w-full bg-cream-bg dark:bg-background overflow-hidden">
  <Image
    ... 
    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-surface-elevated/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
</div>
```

6. **UpsellCard hero block (background gradient + title)** 
   - **File**: `src/components/ui/UpsellCard.tsx` (20–55).

```tsx
<motion.div
  className="relative bg-gradient-to-br from-amber-500/10 via-primary/5 to-purple-600/10 rounded-3xl p-8 md:p-10 border-2 border-amber-500/30 shadow-xl overflow-hidden ..."
>
  {/* Crown + gradient blobs */}
  <h3 className="text-3xl md:text-4xl font-black text-brown-text leading-tight">
    {remainingCount} عطور إضافية
    <br />
    <span className="bg-gradient-to-l from-amber-600 to-primary bg-clip-text text-transparent">
      تطابقك تماماً! ✨
    </span>
  </h3>
</motion.div>
```

7. **Upsell features grid readability**
   - **File**: `src/components/ui/UpsellCard.tsx` (64–80).

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
  <div className="flex items-start gap-3 bg-white/60 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-right">
    <Check className="w-5 h-5 text-safe-green ..." />
    <div>
      <p className="font-bold text-brown-text text-sm">اختبارات غير محدودة</p>
      <p className="text-xs text-brown-text/60">اختبر ذوقك كلما تغير</p>
    </div>
  </div>
  {/* عناصر مشابهة أخرى */}
</div>
```

8. **BlurredTeaser locked overlay and text contrast**
   - **File**: `src/components/ui/BlurredTeaserCard.tsx` (62–88 تقريباً).

```tsx
<div className="relative bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/10 dark:from-amber-500/10 dark:via-purple-500/10 dark:to-amber-500/10 rounded-3xl p-8 border-2 border-primary/20 dark:border-border-subtle overflow-hidden" dir="rtl">
  <div className="absolute inset-0 backdrop-blur-sm bg-white/40 dark:bg-black/70" />
  {/* Lock icon + preview chips */}
  <h3 className="text-2xl md:text-3xl font-black text-brown-text dark:text-text-primary">
    {items.length} عطر إضافي ينتظرك
  </h3>
  <p className="text-lg text-brown-text/75 dark:text-text-muted">{message}</p>
  <p className="text-3xl font-black text-primary dark:text-amber-500">{matchRange || `${averageMatch}%`}</p>
</div>
```

9. **Loading spinner aesthetics داخل نتائج الصفحة**
   - **File**: `src/components/results/ResultsContent.tsx` (79–81) + `src/components/LoadingSpinner.tsx` (31–47).

```tsx
<LoadingSpinner size="lg" />
```

```tsx
<div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gradient-start to-primary shadow-[0_0_30px_rgba(193,132,26,0.3)] flex items-center justify-center`}>
  {/* Avatar icon */}
</div>
<div className="flex items-center justify-center gap-2">
  {[0, 200, 400].map((delay, i) => (
    <div
      key={i}
      className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gradient-to-br from-gradient-start to-primary shadow-lg animate-bounce`}
      style={{ animationDelay: `${delay}ms` }}
    />
  ))}
</div>
```

10. **Non‑themed `brown-text` color across value‑ladder components**
    - **Files** (أهمها بصرياً المرتبطة بالنتائج / تجربة القيمة):
      - `src/components/ui/UpsellCard.tsx` – عناوين ونصوص كثيرة.
      - `src/components/ui/BlurredTeaserCard.tsx` – النص الأساسي والـ captions.
      - `src/app/results/page.tsx` – نسخة سابقة من صفحة النتائج (قد تبقى مراجع بصرية لأجزاء من UI).
    - **Impact**:
      - الكلاس غير معرّف في theme حالياً، فيُترجم إلى لون افتراضي أو لا شيء حسب build.
      - فرصة توحيد اللون مع `dark-brown` / `medium-brown` أو تعريف token صريح في `tailwind.config.ts` لرفع الانسجام البصري خاصة مع dark mode.

---

هذه الخريطة تغطي جميع الملفات الفعلية المرتبطة بالعرض لـ `/ar/results` (Routes, Components, Styles, i18n, API contract) وتضع نقاط ارتكاز واضحة لتحسينات بصرية لاحقة بدون تغيير المنطق.


# جرد الصفحة الرئيسية — Main Page Inventory

مشروع Next.js (App Router). الملف الفعلي للصفحة الرئيسية: **`src/app/page.tsx`**.

---

## 1) ملف الصفحة الرئيسية

| العنصر | المسار |
|--------|--------|
| **App Router (الصفحة الرئيسية)** | `src/app/page.tsx` |
| **بديل / صفحات أخرى للرئيسية** | لا يوجد — المسار `/` يعتمد فقط على `src/app/page.tsx` |

---

## 2) الـ Imports المستخدمة داخل الصفحة الرئيسية

في **`src/app/page.tsx`** تُستورد المكوّنات التالية فقط:

| الاستيراد | المصدر |
|----------|--------|
| `HeroSection` | `@/components/landing/HeroSection` |
| `QuestionsSection` | `@/components/landing/QuestionsSection` |
| `CTASection` | `@/components/landing/CTASection` |

لا تُستورد دوال أو ستايلات إضافية في هذا الملف.

---

## 3) الهيرو (Hero)

| العنصر | القيمة |
|--------|--------|
| **الملف المُستخدم** | `src/components/landing/HeroSection.tsx` |
| **يُستدعى من** | `src/app/page.tsx` (مكوّن `<HeroSection />`) |
| **Imports داخل HeroSection** | `framer-motion` (motion, useMotionValue, useTransform)، `next/image` (Image)، `react` (useState, useEffect) |

**نسخة إضافية (غير مستخدمة):**

| الملف | ملاحظة |
|-------|--------|
| `src/components/landing/HeroSection.tsx.old` | نسخة احتياطية قديمة — **لا يُستورد في أي مكان**؛ المُستخدم فعلياً هو `HeroSection.tsx` فقط. |

---

## 4) الهيدر (Header / Navbar)

الهيدر **ليس** مُركّباً مباشرة في `layout.tsx`، بل داخل **`ConditionalLayout`** الذي يُستدعى من الـ layout.

| العنصر | القيمة |
|--------|--------|
| **الملف** | `src/components/ui/header.tsx` (مكوّن `Header` default export) |
| **يُستدعى من** | `src/components/ConditionalLayout.tsx` — يُعرض عندما `!isAuthPage` (أي على كل الصفحات ما عدا `/login` و `/register`) |
| **في layout** | `src/app/layout.tsx` يستخدم `<ConditionalLayout>{children}</ConditionalLayout>`، لذلك الهيدر يظهر على الصفحة الرئيسية `/` وجميع الصفحات غير تسجيل الدخول/التسجيل. |

**Imports داخل Header:**  
`next-auth/react` (useSession, signOut)، `next/navigation` (useRouter)، `@/components/ui/button`، `@/components/ui/dropdown-menu`، `@/components/ui/avatar`، `lucide-react` (Bell, Heart)، `@/hooks/useFavorites`، `@/components/ThemeToggle`.

مكوّنات أخرى تحتوي كلمة "Header" أو "Nav" في التعليقات فقط (مثل تعليق "Navigation" في Quiz أو "Header Section" في Dashboard) وليست مكوّن هيدر عام — الهيدر العام الوحيد هو `src/components/ui/header.tsx`.

---

## 5) الفوتر (Footer)

| العنصر | القيمة |
|--------|--------|
| **الملف** | `src/components/Footer.tsx` (دالة `Footer` named export) |
| **يُستدعى من** | `src/components/ConditionalLayout.tsx` — يُعرض عندما `!isAuthPage` |
| **المسار/الصفحات** | يظهر على الصفحة الرئيسية `/` وجميع الصفحات ما عدا `/login` و `/register`. |

**Imports داخل Footer:**  
`next/link` (Link)، `lucide-react` (Twitter, Instagram, Mail).

---

## 6) جدول الجرد الموحّد

| Component/Role | File path | Imported by | Route (page/layout) | Notes |
|----------------|-----------|-------------|----------------------|-------|
| **الصفحة الرئيسية** | `src/app/page.tsx` | — (دخول من `/`) | `/` | يعرض HeroSection + QuestionsSection + CTASection داخل `<main>`. |
| **HeroSection** | `src/components/landing/HeroSection.tsx` | `src/app/page.tsx` | `/` | الهيرو المُستخدم. |
| **HeroSection (قديم)** | `src/components/landing/HeroSection.tsx.old` | — | — | غير مستورد؛ نسخة احتياطية. |
| **QuestionsSection** | `src/components/landing/QuestionsSection.tsx` | `src/app/page.tsx` | `/` | قسم الأسئلة في اللاندينغ. |
| **CTASection** | `src/components/landing/CTASection.tsx` | `src/app/page.tsx` | `/` | قسم الدعوة للإجراء. |
| **ConditionalLayout** | `src/components/ConditionalLayout.tsx` | `src/app/layout.tsx` | كل الصفحات | يلف الـ children ويعرض Header + Footer لغير صفحات Auth. |
| **Header** | `src/components/ui/header.tsx` | `src/components/ConditionalLayout.tsx` | كل الصفحات ما عدا `/login`, `/register` | الهيدر/الـ Navbar العام. |
| **Footer** | `src/components/Footer.tsx` | `src/components/ConditionalLayout.tsx` | نفس ما سبق | الفوتر العام. |
| **Root Layout** | `src/app/layout.tsx` | Next.js (جذر التطبيق) | كل الصفحات | يضم الخطوط، الـ metadata، ConditionalLayout، Toaster، إلخ. |

---

## 7) مقتطفات قصيرة (20–40 سطر)

### `src/app/page.tsx`

```tsx
import { HeroSection } from '@/components/landing/HeroSection';
import { QuestionsSection } from '@/components/landing/QuestionsSection';
import { CTASection } from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <HeroSection />
      <QuestionsSection />
      <CTASection />
    </main>
  );
}
```

---

### `src/app/layout.tsx` (مقتطف — بداية الملف + استخدام ConditionalLayout)

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
// ... other imports (NetworkStatusToast, ThemeProvider, PostHogProviderWrapper, SentryLazyExtras, StructuredData)

// ... fonts, metadata, viewport ...

export default function RootLayout({ children }: ...) {
  return (
    <html lang="ar" dir="rtl" ...>
      <head>...</head>
      <body>
        <ThemeProvider ...>
          <PostHogProviderWrapper>
            <ErrorBoundary>
              <SessionProvider>
                <QuizProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                  <Toaster ... />
                  ...
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

---

### `src/components/landing/HeroSection.tsx` (أول ~40 سطر)

```tsx
// ✅ HeroSection - Fixed Version
// components/landing/HeroSection.tsx

'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream via-cream to-cream/95 dark:from-surface ...">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-radial from-gold/15 ... blur-3xl" />
      </div>
      <div className={...}>
        {mounted && [...Array(15)].map((_, i) => (
          <motion.div key={i} ... />
        ))}
      </div>
      <div className="container relative z-10 mx-auto px-6">
        <h1 className="sr-only">Ask Seba</h1>
        <motion.div ...>
          <Image src="/1769558369917_logo.png" alt="Ask Seba" width={180} height={72} priority ... />
        </motion.div>
        <motion.div ... onMouseMove={...} onMouseLeave={...}>
          ...
        </motion.div>
        <p className="...">اكتشف عطرك المثالي في ٣ دقائق</p>
      </div>
    </section>
  );
}
```

---

### `src/components/ui/header.tsx` (أول ~45 سطر)

```tsx
"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart } from "lucide-react"
import { useFavorites } from "@/hooks/useFavorites"
import ThemeToggle from "@/components/ThemeToggle"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { favorites } = useFavorites()
  // ... handlers: handleNotificationsClick, handleFavoritesClick, handleSignOut ...

  return (
    <header dir="rtl" className="sticky top-0 z-50 h-14 bg-background/95 ... backdrop-blur ... border-b ...">
      <div className="container mx-auto h-full px-4 flex items-center justify-end gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" onClick={handleNotificationsClick} ...><Bell ... /></Button>
        <Button variant="ghost" size="sm" onClick={handleFavoritesClick} ...><Heart ... /></Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button ...><Avatar>...</Avatar></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {session ? ( الملف الشخصي / تسجيل الخروج ) : ( الدخول / التسجيل )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

---

### `src/components/Footer.tsx` (كامل الملف — قصير)

```tsx
import Link from 'next/link'
import { Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer dir="rtl" className="bg-white dark:bg-surface border-t border-border-subtle py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-6" aria-label="روابط مهمة">
          <Link href="/about">قصتنا</Link>
          <Link href="/faq">تساؤلات</Link>
          <Link href="/privacy">الخصوصية</Link>
          <Link href="/feedback">شاركنا رأيك</Link>
        </nav>
        <div className="flex items-center justify-center gap-4 mb-6">
          <a href="mailto:support@askseba.com" ...><Mail ... /></a>
          <a href="https://instagram.com/askseba" ...><Instagram ... /></a>
          <a href="https://twitter.com/askseba" ...><Twitter ... /></a>
        </div>
        <div className="border-t border-border-subtle pt-4 text-center">
          <p className="...">© {new Date().getFullYear()} Ask Seba. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
```

---

## 8) نسخ متعددة — أيها مُستخدم؟

| المكوّن | نسخة مستخدمة | نسخ أخرى |
|---------|--------------|-----------|
| **HeroSection** | `src/components/landing/HeroSection.tsx` — يُستورد من `page.tsx` | `src/components/landing/HeroSection.tsx.old` — **غير مستورد**؛ نسخة احتياطية فقط. |
| **Header** | `src/components/ui/header.tsx` — يُستورد من `ConditionalLayout` | لا توجد نسخة بديلة لمكوّن الهيدر العام. (تعليقات "Header" في صفحات أخرى هي عن عناوين داخل الصفحة وليست مكوّن الهيدر.) |
| **Footer** | `src/components/Footer.tsx` — يُستورد من `ConditionalLayout` | لا توجد نسخة بديلة. |

---

*تم إنشاء هذا الجرد دون تعديل أي كود — للقراءة والمرجع فقط.*

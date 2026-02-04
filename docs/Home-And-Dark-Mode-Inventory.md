# جرد كامل: الصفحة الرئيسية + Dark Mode

## A) صفحة الرئيسية (Landing/Home)

### المسار النهائي للصفحة
| البند | القيمة |
|--------|--------|
| **المسار** | `src/app/page.tsx` |
| **Route groups** | لا يوجد — لا يوجد مجلدات بأقواس مثل `(marketing)` داخل `src/app` |
| **الدالة المُصدَّرة** | `export default function HomePage()` |

### المكونات المستوردة منها مباشرة (من `src/app/page.tsx`)
1. `@/components/landing/HeroSection`
2. `@/components/landing/QuestionsSection`
3. `@/components/landing/CTASection`
4. `@/components/landing/StatsSection`
5. `@/components/landing/BenefitsSection`
6. `@/components/landing/HeadlineSection`
7. `@/components/landing/ValuePropSection`

### تدفق الـ Layout للصفحة الرئيسية
- **RootLayout** (`src/app/layout.tsx`) يغلّف كل الصفحات بـ `ThemeProvider` ثم `ConditionalLayout`.
- **ConditionalLayout** (`src/components/ConditionalLayout.tsx`): للصفحة الرئيسية (ليست `/login` ولا `/register`) يعرض:
  - **Header** ← ثم `children` (محتوى الصفحة) ← ثم **Footer**.

### الملفات المستخدمة داخل مكونات الصفحة الرئيسية

| المكون | الاستيرادات (ملفات تُستخدم داخله) |
|--------|-----------------------------------|
| **HeroSection** | `framer-motion`, `next/image`, لا مكونات داخلية أخرى |
| **QuestionsSection** | `framer-motion` فقط |
| **CTASection** | `framer-motion`, `next/navigation`, `next-themes` (useTheme), لا مكونات UI أخرى |
| **StatsSection** | `framer-motion` فقط |
| **BenefitsSection** | `framer-motion` فقط |
| **HeadlineSection** | `framer-motion` فقط |
| **ValuePropSection** | `framer-motion` فقط |
| **Header** (يظهر مع الصفحة الرئيسية) | `Button`, `DropdownMenu*`, `Avatar*`, `Bell`, `Heart` (lucide-react), `StatusCircles`, `ThemeToggle`, `useFavorites` |
| **Footer** (يظهر مع الصفحة الرئيسية) | `Link` (next/link), `Twitter`, `Instagram`, `Mail` (lucide-react) |

**ملفات الصور المستخدمة في الـ Landing (من HeroSection):**
- `/ask_logo.png`
- `/perfume_transparent.webp`

---

## B) Dark Mode

### 1) RootLayout + ThemeProvider
| البند | القيمة |
|--------|--------|
| **الملف** | `src/app/layout.tsx` |
| **المحتوى المتعلق بالثيم** | السطور 12، 141، 184، 214: استيراد `ThemeProvider` من `next-themes`، ولف `children` داخل: `<ThemeProvider attribute="class" defaultTheme="system" storageKey="theme" enableSystem>` |

```tsx
// استيراد
import { ThemeProvider } from "next-themes";

// الاستخدام (داخل <body>)
<ThemeProvider attribute="class" defaultTheme="system" storageKey="theme" enableSystem>
  ...
</ThemeProvider>
```

### 2) ThemeToggle + Hooks للثيم
| الملف | الدور |
|--------|--------|
| **src/components/ThemeToggle.tsx** | زر التبديل: يستورد `useTheme` من `next-themes`، و`Moon`/`Sun` من `lucide-react`، يقدّم `theme`/`setTheme`/`systemTheme`، ويُعادل `null` حتى `mounted` لتجنب hydration mismatch. |
| **src/components/ui/header.tsx** | يستورد ويعرض `<ThemeToggle />` (سطر 17، 90). |
| **استخدام useTheme في أماكن أخرى** | `CTASection.tsx` (resolvedTheme للظلال)، `SymptomCard.tsx`، `MobileFilterModal.tsx`. |

### 3) globals.css — :root و .dark و CSS variables
| الموقع | المحتوى |
|--------|---------|
| **:root** (سطور 3–22) | `--background`, `--foreground`, `--cream`, `--gold`, `--gold-hover`, `--gold-active`, `--dark-brown`, `--medium-brown`, `--light-brown`, `--white`, `--border`, `--shadow`, `--shadow-medium`, `--font-arabic`, `--font-logo`, `--section-spacing`, `--component-spacing` |
| **@theme inline** (سطور 24–37) | توكنات دلالية للوضع الفاتح: `--color-surface`, `--color-surface-elevated`, `--color-surface-muted`, `--color-background`, `--color-border-subtle`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-accent-primary`, `--font-sans`, `--font-mono` |
| **.dark** (سطور 39–48) | إعادة تعريف نفس التوكنات للوضع الداكن (قيم مختلفة لـ surface, background, text, accent-primary) |
| **@media (prefers-color-scheme: dark)** (سطور 50–55) | يعدّل `:root` فقط: `--background`, `--foreground` (لا يطبق class من next-themes) |
| **body** (سطور 57–62) | `background: var(--background); color: var(--foreground); font-family: var(--font-arabic)` |
| **Focus visible** (سطور 95–110) | `*:focus-visible` و `.dark *:focus-visible` يستخدمان `rgb(var(--color-background))` و `rgb(var(--color-accent-primary) / …)` |

### 4) tailwind.config.ts — darkMode + الألوان
| البند | الموقع | المحتوى |
|--------|--------|---------|
| **darkMode** | سطر 9 | `darkMode: 'class'` |
| **theme.extend.colors** | سطور 12–56 | ألوان دلالية من CSS: `surface`, `surface-elevated`, `surface-muted`, `background`, `border-subtle`, `text-primary`, `text-secondary`, `text-muted`, `accent-primary` (كلها `rgb(var(--color-...) / <alpha-value>)`)، ثم ألوان العلامة: `cream`, `gold`, `dark-brown`, `medium-brown`, `light-brown`, `primary`, إلخ. |

### 5) ملفات تستخدم dark: أو var(--...) بكثرة
- **Landing:** `HeroSection.tsx`, `CTASection.tsx`, `StatsSection.tsx`, `BenefitsSection.tsx`, `HeadlineSection.tsx`, `ValuePropSection.tsx`
- **Layout/Shell:** `layout.tsx` (مربع اختبار ثيم)، `header.tsx`, `Footer.tsx`, `ConditionalLayout.tsx` (لا dark: مباشرة)
- **UI مشتركة:** `button.tsx`, `input.tsx`, `ThemeToggle.tsx`, `VoiceMicButton.tsx`
- **صفحات:** `login/page.tsx`, `register/page.tsx`, `quiz/loading.tsx`, `results/loading.tsx`, `dashboard/loading.tsx`, `quiz/step1-favorites/page.tsx`, وغيرها
- **Header** يستخدم أيضاً: `border-[color:var(--border-subtle)]`, `dark:bg-[color:var(--surface-elevated)]/95`

---

## C) الدليل — أوامر البحث والنتائج

### 1) البحث عن الصفحة الرئيسية

**أمر 1:** البحث عن `export default function HomePage` و `export default function Home`  
**الأداة:** ripgrep (Grep)  
**النتيجة:**
```
.\src\app\page.tsx    9:export default function HomePage() {
.\8files-manus\page.tsx    9:export default function HomePage() {
```
→ الصفحة الفعلية للمشروع: **src/app/page.tsx**. (8files-manus نسخة أخرى/مرجع.)

**أمر 2:** وجود `app/page.tsx` أو `src/app/page.tsx`  
**النتيجة:** الملف الوحيد في مصدر التطبيق هو **src/app/page.tsx**.

---

### 2) البحث عن Landing components

**أمر:** البحث عن `components/landing` أو استيراد من landing داخل `src` و `app` و `components`  
**النتيجة (مقتطف من src فقط):**
```
src\components\landing\HeroSection.tsx        2: // components/landing/HeroSection.tsx
src\components\landing\QuestionsSection.tsx   2: // components/landing/QuestionsSection.tsx
src\components\landing\CTASection.tsx         2: // components/landing/CTASection.tsx
src\components\ui\header.tsx                15: import { StatusCircles } from "@/components/landing/StatusCircles"
src\app\page.tsx                              1–7: import من HeroSection, QuestionsSection, CTASection, StatsSection, BenefitsSection, HeadlineSection, ValuePropSection
```
→ كل مكونات الـ landing المستخدمة في الصفحة الرئيسية + StatusCircles من الـ Header مُسجّلة.

---

### 3) البحث عن Dark mode usage

**أمر:** البحث عن `ThemeProvider|next-themes|ThemeToggle|dark:` في `src`  
**النتيجة (ملخص):**
- **ThemeProvider + next-themes:** `src/app/layout.tsx` (استيراد ThemeProvider، attribute="class", storageKey="theme").
- **ThemeToggle:** `src/components/ThemeToggle.tsx` (تعريف)، `src/components/ui/header.tsx` (استيراد وعرض).
- **useTheme:** `ThemeToggle.tsx`, `CTASection.tsx`, `SymptomCard.tsx`, `MobileFilterModal.tsx`.
- **dark:** عشرات الأسطر في `HeroSection`, `CTASection`, `StatsSection`, `BenefitsSection`, `HeadlineSection`, `ValuePropSection`, `header.tsx`, `Footer.tsx`, `button.tsx`, `input.tsx`, `layout.tsx`, وصفحات login/register/quiz/results/dashboard وغيرها.

---

### 4) البحث عن CSS variables في globals.css

**أمر:** البحث عن `:root|--cream|--gold|--dark-brown|--surface` في `src/app/globals.css` و `src/globals.css`  
**النتيجة:** الملف الوحيد في المصدر هو **src/app/globals.css** ويحتوي:
- سطر 3: `:root {`
- سطور 8–12: `--cream`, `--gold`, `--gold-hover`, `--gold-active`, `--dark-brown`
- سطور 24–37: `@theme inline` مع `--color-surface`, `--color-surface-elevated`, إلخ.
- سطور 39–48: `.dark { ... }` مع إعادة تعريف نفس التوكنات للوضع الداكن.

(ملف `--surface` يظهر في الـ build في `.next/dev/static/css/app/layout.css` كمخرَج من Tailwind + globals.css.)

---

### 5) tailwind.config — darkMode + theme.extend.colors

**الملف:** `tailwind.config.ts`  
**المحتوى المعني:**
- **سطر 9:** `darkMode: 'class'`
- **سطور 11–56 (تقريباً):** `theme: { extend: { colors: { surface: 'rgb(var(--color-surface) / <alpha-value>)', 'surface-elevated': ..., 'surface-muted': ..., background, 'border-subtle', 'text-primary', 'text-secondary', 'text-muted', 'accent-primary', cream, gold, 'dark-brown', ... } } }`

---

## D) الجداول المطلوبة

### جدول 1: Home Page Files

| file path | role | imported by | notes |
|-----------|------|-------------|--------|
| src/app/page.tsx | صفحة الرئيسية (HomePage) | Next.js router (/) | لا route group؛ يستورد 7 مكونات landing |
| src/app/layout.tsx | Root layout | Next.js (كل الصفحات) | يضم ThemeProvider و ConditionalLayout؛ يؤثر على الصفحة الرئيسية |
| src/components/ConditionalLayout.tsx | غلاف Header + main + Footer | layout.tsx | للصفحة الرئيسية يعرض Header ثم children ثم Footer |
| src/components/landing/HeroSection.tsx | قسم البطل + شعار + صورة عطر | page.tsx | يستخدم Image (ask_logo.png, perfume_transparent.webp)، framer-motion |
| src/components/landing/QuestionsSection.tsx | قسم الأسئلة الثلاثة | page.tsx | framer-motion فقط |
| src/components/landing/CTASection.tsx | زر CTA "ابدأ الرحلة" | page.tsx | useTheme، motion، next/navigation |
| src/components/landing/StatsSection.tsx | إحصائيات (أرقام) | page.tsx | framer-motion، يستخدم var(--section-spacing) |
| src/components/landing/BenefitsSection.tsx | قسم الفوائد (أيقونات + نصوص) | page.tsx | framer-motion |
| src/components/landing/HeadlineSection.tsx | عنوان "تعرف على ذوقك العطري..." | page.tsx | framer-motion |
| src/components/landing/ValuePropSection.tsx | جملة القيمة (اختبار ذكي...) | page.tsx | framer-motion |
| src/components/landing/StatusCircles.tsx | دوائر الحالة في الهيدر | header.tsx | يظهر في الصفحة الرئيسية عبر Header |
| src/components/ui/header.tsx | هيدر الموقع (شعار، إشعارات، مفضلة، ثيم، حساب) | ConditionalLayout | يستورد Button, DropdownMenu*, Avatar*, Bell, Heart, StatusCircles, ThemeToggle, useFavorites |
| src/components/Footer.tsx | تذييل (روابط، أيقونات، حقوق) | ConditionalLayout | Link، Twitter, Instagram, Mail (lucide-react) |
| src/components/ui/button.tsx | زر | header.tsx | يستخدم في الهيدر للصفحة الرئيسية |
| src/components/ui/dropdown-menu.tsx | قائمة منسدلة | header.tsx | قائمة المستخدم في الهيدر |
| src/components/ui/avatar.tsx | صورة/حرف المستخدم | header.tsx | داخل Dropdown trigger في الهيدر |
| src/components/ThemeToggle.tsx | تبديل الوضع الفاتح/الداكن | header.tsx | useTheme من next-themes، Moon/Sun من lucide-react |
| src/hooks/useFavorites.ts | بيانات المفضلة | header.tsx | للزر في الهيدر |
| public/ask_logo.png | شعار Ask Seba | HeroSection (مرجع في Image src) | — |
| public/perfume_transparent.webp | صورة العطر | HeroSection (مرجع في Image src) | — |

---

### جدول 2: Dark Mode Files

| file path | role | affects | notes |
|-----------|------|---------|--------|
| src/app/layout.tsx | يحتوي ThemeProvider (next-themes) | كل الصفحات | attribute="class", defaultTheme="system", storageKey="theme", enableSystem؛ مربع اختبار ثيم (red/blue) موجود في الكود |
| src/app/globals.css | تعريف :root و .dark و CSS variables | كل الواجهة | :root (ألوان + خطوط)، @theme inline (توكنات light)، .dark (توكنات dark)، body و focus-visible يعتمدان على var() |
| tailwind.config.ts | darkMode: 'class' + theme.extend.colors | كل مكونات Tailwind | darkMode: 'class'؛ ألوان surface, background, text-*, accent-primary من var(--color-*) |
| src/components/ThemeToggle.tsx | زر تبديل الثيم + useTheme | Header (وكل صفحة تعرض الهيدر) | mounted ثم setTheme(light|dark)； يستخدم dark: للخلفية |
| src/components/ui/header.tsx | يعرض ThemeToggle + classes للثيم | الهيدر في كل الصفحات غير Auth | dark:bg-[color:var(--surface-elevated)]/95، border-[color:var(--border-subtle)]، dark:text-text-primary في AvatarFallback |
| src/components/Footer.tsx | تذييل مع دعم داكن | كل الصفحات غير Auth | dark:bg-surface، dark:hover:text-accent-primary، dark:text-text-muted |
| src/components/landing/HeroSection.tsx | أقسام رئيسية مع dark: | الصفحة الرئيسية | dark:from-surface, dark:via-surface-elevated, dark:to-background، dark: من amber وجولد وsurface |
| src/components/landing/CTASection.tsx | CTA + useTheme للظلال | الصفحة الرئيسية | resolvedTheme للظلال؛ dark: للزر والنص |
| src/components/landing/StatsSection.tsx | إحصائيات | الصفحة الرئيسية | bg-cream dark:bg-surface، dark: للحدود والنص |
| src/components/landing/BenefitsSection.tsx | فوائد | الصفحة الرئيسية | نفس نمط dark: للخلفية والحدود والنص |
| src/components/landing/HeadlineSection.tsx | عنوان | الصفحة الرئيسية | bg-cream dark:bg-surface، dark:text-text-primary |
| src/components/landing/ValuePropSection.tsx | جملة القيمة | الصفحة الرئيسية | bg-cream dark:bg-surface، dark:text-text-secondary |
| src/components/ui/button.tsx | أنماط الأزرار | كل الأزرار | dark:focus-visible:ring-accent-primary، variants مع dark: للخلفية والنص والحدود |
| src/components/ui/input.tsx | حقول الإدخال | النماذج | dark:bg-surface، dark:focus-visible، dark: للنص والحدود |
| src/app/login/page.tsx | صفحة الدخول | صفحة login | dark: للخلفية والعناوين والحدود والروابط |
| src/app/register/page.tsx | صفحة التسجيل | صفحة register | نفس النمط |
| src/app/quiz/loading.tsx | تحميل الاختبار | صفحة quiz | dark: للخلفية والـ skeletons |
| src/app/results/loading.tsx | تحميل النتائج | صفحة results | dark: للخلفية والبطاقات |
| src/app/dashboard/loading.tsx | تحميل لوحة التحكم | صفحة dashboard | dark: للهيدر والبطاقات والـ skeletons |
| src/components/ui/VoiceMicButton.tsx | زر الميكروفون | البحث الصوتي | dark: للنص والحالات |
| src/components/quiz/SymptomCard.tsx | بطاقة عرض عرض | الاختبار | useTheme (resolvedTheme) |
| src/components/ui/MobileFilterModal.tsx | نافذة فلتر | واجهة الفلتر | useTheme؛ ألوان من var(--color-*) |

---

## خطة تدقيق من 5 خطوات (بدون تغيير كود الآن)

1. **Contrast (التباين)**  
   - مراجعة كل النصوص التي تستخدم `text-dark-brown` / `text-text-primary` / `text-text-secondary` / `text-medium-brown` على خلفيات `cream` و `surface` و `surface-elevated` في الوضعين الفاتح والداكن.  
   - التأكد من أن النص على أزرار CTA (مثل "ابدأ الرحلة") يحقق 4.5:1 على الخلفية الذهبية/العنبرية في كلا الثيمين.  
   - استخدام أداة (مثل DevTools أو axe) لفحص contrast في الصفحة الرئيسية، الهيدر، الفوتر، وصفحات Login/Register.

2. **Background bleeding (تسرّب الخلفية)**  
   - فحص المناطق التي تلتقي فيها أقسام بـ `bg-cream` مع `dark:bg-surface` أو `dark:bg-background` (مثل نهاية Hero وبداية Questions، أو حدود الـ Header مع المحتوى).  
   - التأكد من عدم وجود شريط أبيض أو لون خاطئ عند التبديل بين الثيمين بسبب تأخر تطبيق `.dark` أو اختلاف قيم الـ variables.  
   - فحص الـ backdrop (Header: `bg-background/95`, `dark:bg-[color:var(--surface-elevated)]/95`) على صور أو ألوان قوية تحتها.

3. **Dark tokens (توكنات الوضع الداكن)**  
   - التحقق من أن كل عنصر يعتمد على `--color-*` في globals.css يأخذ قيم `.dark` عند وجود class `dark` على `<html>` (وأن next-themes يضيفها فعلاً).  
   - مراجعة المكونات التي تستخدم ألواناً ثابتة (مثل `rgba(91,66,51,...)`) في الـ dark mode والتأكد من وجود بديل داكن أو أن الظل/الحد لا يسبب مشكلة قراءة أو مظهر.  
   - جرد أي استخدام لـ `accent-primary-dark` أو ألوان غير معرفة في tailwind/globals (مثل `gold-dark` مقابل `amber-*`) والتأكد من اتساقها.

4. **Hydration**  
   - التأكد من أن ThemeToggle يعيد `null` حتى `mounted` وأن أي مكون يعتمد على `useTheme().resolvedTheme` لا ينتج محتوى مختلف بين الـ server والـ client (مثلاً نصوص أو ألوان تعتمد على الثيم فقط في الـ client).  
   - فحص عدم وجود تحذيرات hydration في وحدة التحكم عند التبديل بين الثيمين أو عند فتح الصفحة الرئيسية/صفحات الـ Auth.  
   - مراجعة أي عنصر يقرأ `theme` أو `resolvedTheme` ويغيّر الـ DOM أو الـ className بناءً عليها عند أول render.

5. **Theme flash (وميض الثيم)**  
   - فتح الموقع مع تخزين `theme=dark` (localStorage) وتحديث الصفحة: التحقق من عدم ظهور خلفية فاتحة (cream/white) قبل تطبيق الـ dark.  
   - إذا وُجد وميض، التأكد من أن الـ script الذي يضيف `class="dark"` على `<html>` قبل أول paint موجود (مثلاً من next-themes أو سكربت inline في layout).  
   - فحص تأثير `suppressHydrationWarning` على `<html>` وما إذا كان كافياً لتجنب تحذيرات أثناء تطبيق الثيم من next-themes.

---

*تم إعداد هذا الجرد بناءً على البحث في المشروع وتنفيذ أوامر البحث المذكورة في القسم C.*

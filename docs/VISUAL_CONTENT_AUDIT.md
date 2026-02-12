# 🔍 VISUAL + CONTENT AUDIT — /ar/results

**الصفحة:** `/ar/results` (نتائج اختبارك — الثمرة الأساسية للمستخدم)  
**التاريخ:** 2026-02-10  
**النطاق:** تصور المستخدم العادي — Screenshots، Lighthouse، تشريح المحتوى، CSS/Layout، خطة P0–P3، User Flow.

---

## 1️⃣ SCREENSHOTS واقعية لكل سيناريو مستخدم

### الحالات المُلتقطة

| السيناريو | العرض | الحالة | ملاحظات |
|-----------|--------|--------|----------|
| **Loading state** | Default | ✅ تم | Spinner مركزي + "جاري التحميل..." — خلفية cream-bg، أيقونة مع halo ذهبي، 3 نقاط متحركة |
| **Error state (API/Component)** | Default | ✅ تم | رسالة "حدث خطأ ما" + "إعادة المحاولة" + "العودة للرئيسية" — يظهر عند فشل API أو خطأ مكوّن (مثلاً component undefined) |

### Screenshots مطلوبة (تنفيذ يدوي إن لزم)

- **Desktop 1440px:** `/ar/results` — GUEST (3 visible + 9 blurred + Upsell)  
- **Desktop 1440px:** `/ar/results` — FREE (5 visible + mid-grid Upsell + BlurredTeaser + bottom Upsell)  
- **Desktop 1440px:** `/ar/results` — PREMIUM (12 visible، لا Upsell)  
- **Mobile 375px:** نفس الـ tiers أعلاه  
- **Tablet 768px:** `/ar/results`  
- **Loading → Results:** انتقال من Spinner إلى الشبكة  
- **PerfumeCard:** hover + focus states  
- **UpsellCard + BlurredTeaserCard:** ظهور وتمايز بصري  
- **Empty state:** لا بيانات اختبار (إن وُجد مسار لذلك)

**ملاحظة:** في بيئة الاختبار ظهر خطأ "Element type is invalid ... got: undefined" بعد التحميل — يُفضّل التحقق من تصدير جميع المكوّنات المستخدمة في `ResultsContent` (مثل `BackButton`, `LoadingSpinner`, `Button`) وتشغيل المسار بعد إكمال الكويز لرؤية النتائج الفعلية.

**إصلاح سريع محتمل:** إن استمر الخطأ، تحقق من أن جميع الـ imports من `@/components/ui` و `@/components/LoadingSpinner` مُصدَّرة بشكل صحيح (named vs default). مثلاً `ResultsContent` يستورد `LoadingSpinner` من `@/components/LoadingSpinner` — تأكد أن الملف يُصدّر `LoadingSpinner` كـ named export.

---

## 2️⃣ LIGHTHOUSE + Core Web Vitals

### تشغيل Lighthouse (يدوياً)

```bash
# تثبيت Lighthouse (إن لم يكن موجوداً)
npm install -g lighthouse

# Desktop (1440x900)
lighthouse http://localhost:3000/ar/results --view --preset=desktop --output=html --output-path=./reports/results-desktop.html

# Mobile (375x667)
lighthouse http://localhost:3000/ar/results --view --preset=mobile --output=html --output-path=./reports/results-mobile.html
```

أو من Chrome DevTools: **Lighthouse** tab → اختيار Device (Mobile/Desktop) → Analyze page load.

### المقاييس المطلوبة لتضمينها في التقرير

| الفئة | المطلوب |
|--------|---------|
| **Performance** | Score، LCP، FCP، CLS، INP، TBT، TTI |
| **Accessibility** | Score، contrast، focus، labels، ARIA |
| **Best Practices** | Score، console errors، HTTPS، etc. |
| **SEO** | Score، meta، h1، links |
| **Cumulative Layout Shift** | تحليل العناصر التي تسبب CLS (مثلاً صور بدون أبعاد، شبكة نتائج تظهر بعد التحميل) |

### تحسينات متوقعة بعد تطبيق P0–P3

- **LCP:** تحسين أولوية الصور (priority على أول 2 بطاقات)، وتقليل تأخر Hero.
- **CLS:** ضبط aspect-ratio وحجوم ثابتة للـ cards وتجنب قفز الشبكة عند تحميل النتائج.
- **INP/TBT:** تقليل تأثير framer-motion على الـ main thread إن أمكن (استخدام CSS transitions حيث يكفي).

---

## 3️⃣ تشريح المحتوى المتوقع للمستخدم العادي

### Hero Section (أول انطباع)

| العنصر | الملف/السطر | المقاسات/الخصائص |
|--------|-------------|-------------------|
| **الحاوية** | `ResultsContent.tsx:93` | `section`: `pt-16 pb-12 px-6`, `bg-gradient-to-b from-primary/10 to-transparent`, `text-center` |
| **Badge (تم تحليل ذوقك)** | 95–98 | `inline-flex`, `gap-2`, `px-4 py-2`, `rounded-full`, `text-sm font-bold`, Sparkles `w-4 h-4` |
| **العنوان/الوصف** | 99 | لا H1 صريح في الـ Hero — النص: `text-lg`, `max-w-2xl mx-auto`, `text-text-secondary` |
| **Back button** | 84–90 | `BackButton` داخل `container mx-auto px-6 pt-6`, `className="mb-6"` — رابط "العودة للوحة التحكم" |
| **CTA في Hero** | — | لا أزرار CTA في الـ Hero — الـ CTAs في البطاقات (اكتشف المكونات، مقارنة) وفي Upsell/Blurred |

**ملاحظات:**

- **H1:** الصفحة تعتمد `title` من `metadata` ("نتائج اختبارك") في `<title>`؛ لا يوجد `<h1>` مرئي في الـ Hero. يُفضّل إضافة H1 واحد واضح (مثلاً "نتائج اختبارك" أو "عطور تناسبك") لتحسين الـ SEO والـ hierarchy.
- **Hierarchy:** الوصف فرعي بشكل جيد (`text-lg` + لون ثانوي).
- **Back button:** واضح كرابط في أعلى الـ container.

### Results Grid (القلب)

| العنصر | القيمة من الكود |
|--------|------------------|
| **الحاوية** | `main`: `container mx-auto px-6` |
| **Grid** | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` |
| **Responsive** | 1 col (mobile)، 2 cols (md)، 3 cols (lg)؛ `gap-8` (32px) |

### PerfumeCard — مقاسات وتفاصيل

| الجزء | Class / خاصية | مقاسات/ملاحظات |
|-------|----------------|------------------|
| **Container** | `rounded-3xl`, `shadow-elevation-1`, `hover:shadow-elevation-3`, `p-6` (content), `flex flex-col h-full` | ارتفاع كامل متسق داخل الـ grid |
| **Image** | `aspect-[4/5]`, `object-contain p-8`, `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"` | نسبة 4:5؛ padding 32px؛ LCP: `priority={index < 2}` |
| **Match badge** | `text-lg font-black`, لون حسب النسبة (safe-green / warning-amber / danger-red)، تسمية `text-[8px]` "تطابق" | موضع: أعلى يمين داخل overlay؛ واضح ومقروء |
| **Safe badge** | `text-[10px] font-bold`, `px-3 py-1`, `rounded-full` | "آمن تماماً" عند score ≥ 70؛ لا يتداخل مع Match إذا صُممت المواضع بشكل صحيح |
| **Brand** | `text-primary font-bold text-xs tracking-widest uppercase` | فوق العنوان |
| **Title (H3)** | `text-xl font-bold`, `line-clamp-1` | اسم العطر — truncation سطر واحد |
| **Description** | `text-sm line-clamp-2 leading-relaxed` | وصف — سطران كحد أقصى |
| **Price** | — | غير معروض في الـ PerfumeCard الحالي (يُضاف في مسارات أخرى أو Premium) |
| **SafetyWarnings** | `SafetyWarnings` داخل `mt-2 p-2`, خلفية gradient خضراء/زرقاء | وضوح جيد؛ نص "Source" `text-xs text-muted-foreground` |
| **Source label** | `text-xs ... mt-1` | حجم صغير، تحت الـ warnings |
| **Actions** | `Button` اكتشف المكونات + زر مقارنة `size="icon"` | واضحان؛ مقارنة حتى 3 عناصر |

### UpsellCard + BlurredTeaserCard (Conversion funnel)

| العنصر | الموضع/التوقيت | التفاصيل |
|--------|-----------------|----------|
| **UpsellCard** | بعد البطاقة الرابعة (index === 3) للـ FREE؛ وأسفل الصفحة لغير PREMIUM | `rounded-3xl p-8 md:p-10`, `border-2 border-amber-500/30`, تاج + عنوان كبير + شبكة مميزات + سعر 15 ريال + CTA "اشترك الآن" |
| **BlurredTeaserCard** | بعد كل البطاقات المرئية؛ للـ GUEST/FREE فقط | `backdrop-blur-sm bg-white/40 dark:bg-black/70`؛ أيقونة قفل؛ عرض عينات من الـ blurred + متوسط تطابق؛ CTA حسب الـ tier (سجّل الآن / اشترك) |
| **Tier messaging** | GUEST: تسجيل مجاني؛ FREE: اشترك لبقية النتائج؛ PREMIUM: لا يظهر Upsell/Blurred | النص في الترجمة والـ BlurredTeaserCard يوضح الفرق |

### Typography System (من الكود)

| الاستخدام | العنصر | الحجم/الوزن/الارتفاع |
|-----------|--------|----------------------|
| Hero badge | span | `text-sm font-bold` |
| Hero subtitle | p | `text-lg`, لون ثانوي |
| Card brand | p | `text-xs font-bold`, uppercase, tracking-widest |
| Card title | h3 | `text-xl font-bold`, line-clamp-1 |
| Card description | p | `text-sm`, line-clamp-2, leading-relaxed |
| Match % | span | `text-lg font-black` |
| Match label | span | `text-[8px] font-bold` |
| Badges (safe, exclusive) | div | `text-[10px] font-bold` |
| Upsell title | h3 | `text-3xl md:text-4xl font-black` |
| BlurredTeaser title | h3 | `text-2xl md:text-3xl font-black` |

---

## 4️⃣ تحليل CSS + Layout

### Container Hierarchy

| المستوى | المكوّن | max-width / padding / ملاحظات |
|---------|---------|-------------------------------|
| Root | `div` (min-h-screen) | لا max-width؛ `px-6` من الـ container الداخلي |
| Container | `container mx-auto px-6` (Back + Main) | Tailwind `container` + `mx-auto`؛ `px-6` (24px) |
| Hero | `section` | `pt-16 pb-12 px-6` |
| Grid | `div.grid` | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` (32px) |
| Card | PerfumeCard | `p-6`؛ `rounded-3xl`؛ ظل وحدّ ثابتان |

### Tailwind Audit — ResultsContent + PerfumeCard

**ResultsContent:**

- **Backgrounds:** `bg-cream-bg`, `dark:!bg-surface`, `from-primary/10`, `to-transparent`, `bg-white/80`, `backdrop-blur-sm`, `border-primary/20`, `shadow-sm`, `shadow-elevation-3`.
- **Layout:** `container`, `mx-auto`, `px-6`, `pt-6`, `pt-16`, `pb-12`, `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`, `gap-8`, `flex`, `items-center`, `justify-center`, `gap-2`, `gap-4`.
- **Typography:** `text-sm`, `text-lg`, `text-text-primary`, `text-text-secondary`, `font-bold`, `max-w-2xl`.
- **Responsive:** `md:`, `lg:` على الـ grid فقط في المحتوى الرئيسي.

**PerfumeCard:**

- **Backgrounds:** `bg-white`, `dark:bg-surface`, `bg-cream-bg`, `dark:bg-background`, `bg-safe-green/90`, `bg-primary`, `shadow-elevation-1`, `dark:shadow-black/20`, `hover:shadow-elevation-3`.
- **Layout:** `flex`, `flex-col`, `h-full`, `gap-2`, `gap-4`, `p-6`, `aspect-[4/5]`, `object-contain p-8`.
- **Typography:** `text-lg`, `text-xl`, `text-xs`, `text-sm`, `text-[8px]`, `text-[10px]`, `font-bold`, `font-black`, `line-clamp-1`, `line-clamp-2`, `leading-relaxed`.
- **Interactivity:** `group`, `group-hover:scale-110`, `group-hover:opacity-100`, `transition-all duration-500`, `duration-700`.

### Color System

| النوع | Light | Dark | ملاحظات |
|-------|--------|------|----------|
| Primary | `#c0841a` (primary) | amber-500 | ثابت في الـ brand |
| Surface | cream-bg `#FAF8F5` | surface (CSS var) | خلفية الصفحة والبطاقات |
| Text | text-primary, text-secondary, text-muted | نفس الأسماء مع قيم dark | من globals.css vars |
| Semantic | safe-green, warning-amber, danger-red | green-400, amber-400, red-400 | في البطاقة والـ SafetyWarnings |
| **brown-text** | مستخدم في Upsell/Blurred | — | **غير معرّف في tailwind.config** — إما إضافته في theme أو استبداله بـ dark-brown/medium-brown |

### Spacing System

- **Gap grid:** `gap-8` (32px) — ثابت عبر breakpoints.
- **Section padding:** Hero `pt-16 pb-12`؛ Container `px-6 pt-6`؛ Main `px-6`.
- **Card padding:** `p-6` (24px) في محتوى البطاقة.

---

## 5️⃣ P0–P3 Visual + Content PLAN

### P0 (≈30 دقيقة): Hero sparkle + typography fix

**المشاكل:**

- لا H1 مرئي في الصفحة (ضعف SEO و hierarchy).
- Hero يعتمد على badge + فقرة فقط.

**الإصلاح المقترح:**

```tsx
// ResultsContent.tsx — داخل الـ Hero <section> بعد الـ badge
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary mb-2">
  نتائج اختبارك
</h1>
<p className="text-text-secondary dark:text-text-muted max-w-2xl mx-auto text-lg">
  بناءً على تفضيلاتك، قمنا باختيار هذه العطور...
</p>
```

**قبل/بعد:**

- قبل: لا H1؛ بعد: H1 واحد واضح مع حجم متدرج (2xl → 4xl).
- **Lighthouse SEO:** تحسين محتمل لـ "Document has a descriptive title and H1".

---

### P1 (≈1 ساعة): Cards hover/shadow + grid spacing

**المشاكل:**

- توحيد الظل والـ hover عبر البطاقات.
- التأكد من أن الـ grid لا يسبب CLS عند ظهور النتائج.

**إصلاحات مقترحة:**

1. **تثبيت ارتفاع للـ card wrapper لتقليل CLS:**

```tsx
// ResultsContent.tsx — الـ motion.div الذي يلف PerfumeCard
<motion.div
  key={perfume.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  className="min-h-[420px] sm:min-h-[460px]" // أو استخدام aspect-ratio للكل
>
  <PerfumeCard ... />
</motion.div>
```

2. **تحسين وضوح focus للمقارنة (a11y):**

```tsx
// PerfumeCard — زر المقارنة
<Button
  ...
  className={cn(
    "rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    isComparing && "bg-primary text-white"
  )}
  aria-label="مقارنة"
/>
```

**مقاسات بعد التعديل:**

- Grid: `gap-8` دون تغيير؛ إضافة `min-h` يقلل قفز الـ layout.
- **Lighthouse:** تحسين CLS متوقع إن كانت البطاقات سبباً رئيسياً.

---

### P2 (≈1 ساعة): Loading stagger + shimmer effects

**المشكلة:** حالة التحميل بسيطة (Spinner فقط) بدون skeleton للشبكة.

**اقتراح:**

- إضافة skeleton للـ grid بنفس `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` وعدد 6 placeholder cards بارتفاع ثابت و shimmer (مثلاً `animate-pulse` على مستطيلات).
- الإبقاء على `LoadingSpinner` الحالي أثناء fetch، ثم استبداله بالشبكة الفعلية مع stagger (كما هو `delay: index * 0.1`).

**كود مثال لـ Skeleton card:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="rounded-3xl bg-white dark:bg-surface overflow-hidden border border-primary/5">
      <div className="aspect-[4/5] bg-surface-muted dark:bg-surface animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-1/3 bg-surface-muted rounded animate-pulse" />
        <div className="h-6 w-2/3 bg-surface-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-surface-muted rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-surface-muted rounded animate-pulse" />
      </div>
    </div>
  ))}
</div>
```

**النتيجة:** تجربة تحميل أوضح وتقليل إحساس "قفز" المحتوى — تحسين CLS و LCP perceived.

---

### P3 (≈1 ساعة): Micro-interactions + particles

**اقتراحات (اختيارية):**

- تأثير خفيف على Sparkles في الـ Hero (مثلاً `animate-pulse` أو حركة بسيطة).
- تحسين انتقال ظهور الـ Comparison Bar (مثلاً `transition` أوقات أقصر).
- عدم إضافة particles ثقيلة إن كان الهدف أداءً عالياً؛ إن وُجدت فبعد LCP وبشكل لا يعيق INP.

**Lighthouse delta:** تأثير محدود؛ التركيز على ألا تزيد TBT/INP.

---

## 6️⃣ USER FLOW Content Audit

| المستخدم | النتائج المرئية | Blurred / Upsell | لقطة مقترحة | وضوح CTA |
|----------|------------------|-------------------|--------------|----------|
| **GUEST** | 3 بطاقات عطور | 9 blurred في BlurredTeaserCard؛ UpsellCard أسفل الصفحة | لقطة desktop + mobile | "سجّل الآن مجاناً" / "اشترك الآن" في Upsell |
| **FREE** | 5 بطاقات | Upsell mid-grid (بعد الرابعة) + BlurredTeaser + Upsell أسفل | لقطة desktop + mobile | "اشترك بـ 15 ريال/شهر" و "اشترك الآن" |
| **PREMIUM** | 12 بطاقة | لا Upsell ولا Blurred | لقطة كاملة للشبكة | لا CTA upsell |

**ملخص المحتوى:**

- **GUEST:** 3 visible + 9 blurred + Upsell — أول انطباع "نتائج محدودة + إمكانية فتح المزيد بالتسجيل/الاشتراك".
- **FREE:** 5 visible + mid-grid Upsell + BlurredTeaser + bottom Upsell — توازن بين القيمة والترويج للترقية.
- **PREMIUM:** كل النتائج بدون إزعاج upsell — تجربة نظيفة.

---

## 7️⃣ النتيجة المطلوبة — ملخص

| المخرجات | الحالة |
|----------|--------|
| 📱 Screenshots (loading + error) | ✅ تم توثيقها؛ باقي السيناريوهات يدوياً بعد إصلاح أي خطأ مكوّن وتشغيل المسار مع بيانات كويز |
| 📊 Lighthouse + CWV | تعليمات تشغيل مذكورة أعلاه؛ يُنفّذ يدوياً ويُضاف النتائج هنا |
| 📐 Layout (containers, grid, card) | موثّق من الكود أعلاه |
| 🎨 Color / typography | موثّق؛ مع تنبيه لـ brown-text غير المعرّف في theme |
| 🔴 P0–P3 + code fixes | مذكورة مع أمثلة كود جاهزة |
| 📈 Expected Lighthouse improvement | LCP، CLS، SEO (H1) — كما في كل P |
| 🧪 Test checklist | أدناه |

### Test checklist

- [ ] فتح `/ar/results` بعد إكمال الكويز (GUEST) — 3 بطاقات + BlurredTeaser + Upsell.
- [ ] تسجيل الدخول كـ FREE وإعادة الاختبار — 5 بطاقات + mid Upsell + Blurred + bottom Upsell.
- [ ] اشتراك PREMIUM — 12 بطاقة بدون Upsell/Blurred.
- [ ] تصغير الشاشة إلى 375px و 768px — التحقق من الـ grid والـ touch targets.
- [ ] قياس Lighthouse (Performance, Accessibility, Best Practices, SEO) لـ /ar/results.
- [ ] التحقق من H1 بعد تطبيق P0.
- [ ] التحقق من عدم وجود أخطاء console (وحل خطأ "undefined component" إن وُجد).

---

**نهاية التقرير.**  
لإكمال الصور: تشغيل السيرفر، إكمال الكويز من المتصفح، ثم أخذ لقطات لـ 1440 / 768 / 375 لكل tier وحفظها في `docs/screenshots/` أو إرفاقها بهذا الملف.

# تدقيق احترافي لهيدر الموقع — تفاصيل التفاصيل

---

## 1) خريطة DOM للهيدر

```
<header> [role=banner implicitly, dir="rtl"]
│   props: sticky top-0 z-50 h-14 bg-background/95 backdrop-blur ...
│
└── <div> [Container — flex wrapper]
    │   className: container mx-auto h-full px-4 flex items-center justify-between sm:gap-3
    │
    ├── <StatusCircles /> [Left/Brand area — RTL: يمين]
    │   └── <motion.div> hidden sm:flex items-center gap-2 ml-4
    │       ├── <div> w-3 h-3 rounded-full bg-green-500 (دائرة 1)
    │       ├── <div> w-3 h-3 rounded-full bg-yellow-500 (دائرة 2)
    │       └── <div> w-3 h-3 rounded-full bg-red-500 (دائرة 3)
    │
    └── <div> [Right controls — RTL: يسار]
        │   className: flex items-center gap-2 sm:gap-3
        │
        ├── <Button> [Notifications — Bell]
        │   variant=ghost size=sm, aria-label
        │   └── <Bell className="h-5 w-5" />
        │   └── <span> [badge] absolute top-1 left-1 w-2 h-2 bg-red-500
        │
        ├── <Button> [Favorites — Heart]
        │   variant=ghost size=sm, aria-label
        │   └── <Heart className="h-5 w-5" />
        │   └── <span> [badge] absolute top-1 left-1 w-2 h-2 bg-primary
        │
        ├── <ThemeToggle /> [button native]
        │   └── Sun | Moon icon h-4 w-4
        │
        └── <DropdownMenu>
            ├── <DropdownMenuTrigger asChild>
            │   └── <Button> variant=ghost size=sm p-1 h-auto rounded-full
            │       └── <Avatar className="h-8 w-8">
            │           <AvatarImage />
            │           <AvatarFallback> 👤
            │
            └── <DropdownMenuContent> align=start w-48
                ├── DropdownMenuItem (الملف الشخصي | الدخول | التسجيل)
                ├── DropdownMenuSeparator
                └── DropdownMenuItem (تسجيل الخروج)
```

---

## 2) جدول جرد الهيدر

| Element | File:Line | Size (w/h/padding) | Typography | Colors (Light) | Colors (Dark) | Border/Radius | Shadow/Backdrop | States (hover/focus/active/disabled) | RTL Notes | Problems | Fix (exact change) |
|---------|-----------|-------------------|------------|----------------|---------------|---------------|-----------------|--------------------------------------|-----------|----------|--------------------|
| **Header container** | header.tsx:50-53 | h-14 (56px), px-4 container | — | bg-background/95 | bg-[var(--surface-elevated)]/60 | border-b border-[var(--border-subtle)] | backdrop-blur | — | dir=rtl | `--border-subtle` و `--surface-elevated` غير معرفين في globals.css (المتغيرات الحقيقية: `--color-border-subtle`, `--color-surface-elevated`) | استبدل `border-[color:var(--border-subtle)]` بـ `border-border-subtle` و `bg-[color:var(--surface-elevated)]` بـ `bg-surface-elevated` |
| **Container wrapper** | header.tsx:55 | h-full, px-4, gap-2 sm:gap-3 | — | — | — | — | — | — | justify-between | — | — |
| **StatusCircles wrapper** | StatusCircles.tsx:7-11 | gap-2, ml-4 | — | — | — | — | — | — | ml-4 غير منطقي في RTL | `ml-4` يجب أن يكون `ms-4` لاحترام اتجاه البدء | `ml-4` → `ms-4` |
| **StatusCircle (green)** | StatusCircles.tsx:13 | w-3 h-3 (12px) | — | bg-green-500 | bg-green-400 | rounded-full | — | animate-pulse | — | — | — |
| **StatusCircle (yellow)** | StatusCircles.tsx:14 | w-3 h-3 (12px) | — | bg-yellow-500 | bg-yellow-400 | rounded-full | — | — | — | — | — |
| **StatusCircle (red)** | StatusCircles.tsx:15 | w-3 h-3 (12px) | — | bg-red-500 | bg-red-400 | rounded-full | — | — | — | — | — |
| **Notifications Button** | header.tsx:58-69 | size=sm → px-4 py-2 (button.tsx:26), Bell h-5 w-5 (20px) | — | text-text-primary, hover:bg-cream-bg | hover:bg-surface-muted | rounded-button (12px) | — | hover:scale-105, disabled:opacity-50, focus-visible:ring-2 ring-primary | — | — | — |
| **Notifications badge** | header.tsx:68 | w-2 h-2 (8px), top-1 left-1 | — | bg-red-500 | — | rounded-full | — | — | left-1 ثابت في RTL | Badge يجب أن يكون start-1 بدل left-1 | `left-1` → `start-1` |
| **Favorites Button** | header.tsx:73-87 | نفس Notifications | — | text-text-primary, fill-red-500 عند hasFavorites | نفس | نفس | — | نفس | — | — | — |
| **Favorites badge** | header.tsx:84 | w-2 h-2, top-1 left-1 | — | bg-primary | — | rounded-full | — | — | نفس | `left-1` → `start-1` | `left-1` → `start-1` |
| **ThemeToggle** | ThemeToggle.tsx:19-24 | min-touch-target (44px), px-3 py-2 | text-sm font-medium | border-primary20, bg-white90, hover:bg-cream-bg | bg-surface-elevated, hover:bg-surface-muted | rounded-full | shadow-sm | transition-colors | — | `border-primary20` و `bg-white90` غير معرفين — لا يوجد لون primary20 أو white90 في tailwind.config | `border-primary20` → `border-primary/20`, `bg-white90` → `bg-white/90` |
| **ThemeToggle icon** | ThemeToggle.tsx:25-28 | h-4 w-4 (16px) | — | text-gold (light), text-primary (dark) | — | — | — | — | — | text-gold معرف في tailwind (gold.DEFAULT) | — |
| **Avatar trigger Button** | header.tsx:94-109 | p-1 h-auto, Avatar h-8 w-8 (32px) | — | ghost → text-text-primary | — | rounded-full | — | hover:scale-105 | — | — | — |
| **Avatar** | avatar.tsx:10-18 | h-8 w-8 (override), default h-10 w-10 | — | — | — | rounded-full | — | — | — | — | — |
| **AvatarFallback** | header.tsx:105-107 | — | text-sm | bg-primary/10, text-primary | text-text-primary | rounded-full (من avatar) | — | — | — | — | — |
| **DropdownMenuContent** | dropdown-menu.tsx:54-70 | w-48 (header override), min-w-8rem | — | bg-popover, text-popover-foreground | — | rounded-md, border | shadow-md | — | align=start | popover و accent غير معرفين في globals — قد يعتمد على defaults | إضافة `--color-popover` و `--color-accent` في @theme إذا لم تكن موجودة |
| **DropdownMenuItem** | dropdown-menu.tsx:78-88 | px-2 py-1.5, text-sm | — | focus:bg-accent, focus:text-accent-foreground | — | rounded-sm | — | focus, data-[disabled]:opacity-50 | text-right ✅ | — | — |
| **DropdownMenuSeparator** | dropdown-menu.tsx:154-158 | -mx-1 my-1 h-px | — | bg-muted | — | — | — | — | — | — | — |

---

## 3) القياسات الفعلية (من الكود)

| العنصر | القيمة | المصدر |
|--------|--------|--------|
| ارتفاع الهيدر | 56px (h-14) | Tailwind: 14×4=56px |
| padding أفقي للـ container | 16px (px-4) | Tailwind scale |
| gap بين عناصر اليمين | 8px (gap-2) / 12px (sm:gap-3) | button.tsx, header.tsx |
| أيقونات Bell/Heart | 20×20px (h-5 w-5) | header.tsx:66, 82 |
| أيقونة ThemeToggle | 16×16px (h-4 w-4) | ThemeToggle.tsx:25-27 |
| Avatar في الهيدر | 32×32px (h-8 w-8) | header.tsx:100 |
| Badge (dot) | 8×8px (w-2 h-2) | header.tsx:68, 84 |
| StatusCircles | 12×12px (w-3 h-3) | StatusCircles.tsx:13-15 |
| Button size=sm | px-4 (16px), py-2 (8px), text-sm | button.tsx:26 |
| rounded-button | 12px | tailwind.config.ts:77 |
| min-touch-target | 44×44px | globals.css:126-127 |
| Dropdown sideOffset | 4px | dropdown-menu.tsx:58 |

---

## 4) نظام الألوان (Tokens) للهيدر

### ألوان مستخدمة في الهيدر ومصدرها

| Class / Variable | Light | Dark | المصدر |
|------------------|-------|------|--------|
| `bg-background` | rgb(255,255,255) | rgb(5,5,5) | globals.css @theme --color-background |
| `bg-background/95`, `/60` | 95%, 60% opacity | نفس | Tailwind opacity modifier |
| `border-[color:var(--border-subtle)]` | — | — | **غير معرف** — globals فيه `--color-border-subtle` فقط |
| `bg-[color:var(--surface-elevated)]` | — | — | **غير معرف** — globals فيه `--color-surface-elevated` فقط |
| `bg-red-500` | #ef4444 | — | Tailwind default |
| `bg-primary` | #c0841a | — | tailwind.config.ts primary.DEFAULT |
| `text-text-primary` | rgb(17,24,39) | rgb(241,245,249) | globals @theme |
| `bg-cream-bg` | #FAF8F5 | — | tailwind.config.ts |
| `bg-surface-muted` | rgb(248,250,252) | rgb(30,41,59) | globals @theme |
| `border-primary20` | — | — | **غير معرف** — لا يوجد لون primary20 |
| `bg-white90` | — | — | **غير معرف** — لا يوجد لون white90 |
| `bg-surface-elevated` | rgb(255,255,255) | rgb(10,10,10) | globals @theme |
| `bg-popover` | — | — | غير معرف في المشروع — يعتمد على Tailwind preset إن وُجد |
| `focus:bg-accent` | — | — | نفس |
| `text-gold` | #B39D7D | — | tailwind.config.ts / globals --color-gold |
| `text-primary` | #c0841a | — | tailwind.config.ts |

### Palette صغيرة للهيدر

| Token | Light | Dark | الدليل |
|-------|-------|------|--------|
| Background | #ffffff / 95% | rgb(10,10,10) / 60% | header.tsx:53, globals.css:28,46 |
| Elevated | rgb(255,255,255) | rgb(10,10,10) | globals.css:28,46 |
| Text primary | rgb(17,24,39) | rgb(241,245,249) | globals.css:32,49 |
| Text secondary | rgb(107,114,128) | rgb(148,163,184) | globals.css:33,50 |
| Border subtle | rgb(228,228,231) | rgb(51,65,85) | globals.css:31,49 |
| Accent (brand) | #c0841a / accent-primary | #FBBF24 | tailwind, globals:35,53 |
| Badge (danger) | #ef4444 (red-500) | — | header.tsx:68 |
| Badge (primary) | #c0841a | — | header.tsx:84 |

---

## 5) الحالات التفاعلية وإمكانية الوصول

| العنصر | focus-visible | hover | aria-label | ملاحظات |
|--------|---------------|-------|------------|---------|
| Bell Button | من button.tsx: focus-visible:ring-2 ring-primary | hover:scale-105 | ✅ aria-label ديناميكي | — |
| Heart Button | نفس | نفس | ✅ | — |
| ThemeToggle | يعتمد على globals *:focus-visible | transition-colors فقط — لا hover:bg مخصص | ✅ | زر native بدون focus ring صريح — يعتمد على globals |
| Avatar Button | نفس Button | hover:scale-105 | ✅ "قائمة المستخدم" | — |
| Dropdown items | focus:bg-accent | — | Radix يضيف أدوار | `outline-none` في DropdownMenuItem — الاعتماد على focus:bg فقط قد يكون غير كافٍ للتركيز البصري |

**ملاحظات A11y:**
- globals.css:104-115 يطبق `*:focus-visible` box-shadow — يغطي كل العناصر.
- DropdownMenuItem يستخدم `outline-none` — الاعتماد على لون الخلفية عند التركيز. إن كان accent غير معرّف، قد لا يظهر فرق واضح.
- Radix Dropdown يدعم Escape لإغلاق القائمة — مُضمّن.
- Tab order طبيعي (DOM order).

---

## 6) RTL/LTR

| العنصر | المطلوب | الواقع | المشكلة |
|--------|---------|--------|---------|
| RootLayout | dir="rtl" | html dir="rtl" ✅ | — |
| Header | dir="rtl" | header dir="rtl" ✅ | تكرار — يمكن إزالته لأنه يرث من html |
| Badge position | start/end | top-1 left-1 | `left-1` ثابت — في RTL يجب أن يكون start (يمين) |
| StatusCircles | ms بدل ml | ml-4 | `ml-4` = margin-left ثابت — في RTL يجب ms-4 |
| Dropdown align | start | align="start" ✅ | صحيح |
| DropdownMenuItem | text-right | text-right ✅ | صحيح لـ RTL |
| justify-between | — | ✅ | يعمل تلقائياً |

---

## 7) Top 10 Issues مرتبة حسب الشدة

| # | الشدة | الوصف | File:Line | Patch |
|---|-------|-------|-----------|-------|
| 1 | **Breaks UI** | `border-primary20` و `bg-white90` غير معرفين — قد لا يظهر border/background في ThemeToggle | ThemeToggle.tsx:21 | استبدال بـ `border-primary/20` و `bg-white/90` |
| 2 | **Breaks UI** | `var(--border-subtle)` و `var(--surface-elevated)` غير معرفين — الحد والسطح في Dark قد لا يعملان | header.tsx:53 | استبدال بـ `border-border-subtle` و `bg-surface-elevated` |
| 3 | **Visual bug** | Badge يستخدم `left-1` — في RTL يظهر في الجهة الخاطئة | header.tsx:68, 84 | `left-1` → `start-1` |
| 4 | **Visual bug** | StatusCircles يستخدم `ml-4` — في RTL margin في الجهة الخاطئة | StatusCircles.tsx:11 | `ml-4` → `ms-4` |
| 5 | **UX regression** | ThemeToggle لا يحتوي focus-visible صريح — يعتمد على * فقط، وقد يتداخل مع تصميم الزر | ThemeToggle.tsx:21 | إضافة `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` |
| 6 | **A11y** | DropdownMenuItem يعتمد على focus:bg-accent — إن كان accent غير معرّف، التركيز قد لا يكون واضحاً | dropdown-menu.tsx:83 | التحقق من تعريف accent/popover، أو استخدام focus:ring |
| 7 | **Visual** | Container يستخدم `container` — التأكد من وجود max-width في tailwind إذا لزم | header.tsx:55 | — |
| 8 | **Consistency** | ThemeToggle أيقونة 16px بينما Bell/Heart 20px — اختلاف بسيط | ThemeToggle.tsx:25 / header.tsx:66 | اختياري: توحيد h-5 w-5 |
| 9 | **RTL** | dir="rtl" مكرر على header رغم وجوده على html | header.tsx:51 | اختياري: إزالة dir من header |
| 10 | **Maintenance** | HARDCODED TEST block في layout.tsx (قد يؤثر على الصفحة) | layout.tsx:190-192 | خارج نطاق الهيدر — يُذكر فقط |

---

## 8) Patches مقترحة (diff)

### Patch 1: ThemeToggle — إصلاح ألوان غير معرفة (ThemeToggle.tsx)

```diff
- className="min-touch-target inline-flex items-center justify-center rounded-full border border-primary20 bg-white90 px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-cream-bg dark:bg-surface-elevated dark:hover:bg-surface-muted"
+ className="min-touch-target inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/90 px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-cream-bg dark:bg-surface-elevated dark:hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

**اختبار:** DevTools → Elements → ThemeToggle → التحقق من وجود border و background صحيحين، ووجود ring عند Tab + focus.

---

### Patch 2: Header — إصلاح متغيرات CSS غير معرفة (header.tsx)

```diff
- className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-[color:var(--surface-elevated)]/60 border-b border-[color:var(--border-subtle)]"
+ className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-surface-elevated/60 border-b border-border-subtle"
```

**اختبار:** DevTools → Computed → التحقق من border-color و background في الوضع الداكن.

---

### Patch 3: Badge RTL (header.tsx)

```diff
- <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
+ <span className="absolute top-1 start-1 w-2 h-2 bg-red-500 rounded-full" />
```

```diff
- <span className="absolute top-1 left-1 w-2 h-2 bg-primary rounded-full" />
+ <span className="absolute top-1 start-1 w-2 h-2 bg-primary rounded-full" />
```

**اختبار:** تفعيل RTL والتأكد من ظهور النقطة في الزاوية الصحيحة.

---

### Patch 4: StatusCircles RTL (StatusCircles.tsx)

```diff
- className="hidden sm:flex items-center gap-2 ml-4"
+ className="hidden sm:flex items-center gap-2 ms-4"
```

**اختبار:** RTL + viewport ≥ sm — التحقق من أن المسافة على الجهة الصحيحة (بداية المحتوى).

---

## 9) ملخص

- تم التحقق من كل الملاحظات من الكود الفعلي.
- أبرز المشاكل: ألوان غير معرفة في ThemeToggle والهيدر، ومواضع ثابتة لـ left/ml في RTL.
- الـ Patches أعلاه محددة وقابلة للتطبيق مباشرة.

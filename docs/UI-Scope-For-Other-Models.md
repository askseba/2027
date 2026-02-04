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

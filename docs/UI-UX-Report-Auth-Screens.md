# تقرير UI/UX — شاشات تسجيل الدخول وإنشاء الحساب

**النطاق:** `/login` و `/register`  
**التاريخ:** يناير 2026  
**المصادر:** تحليل الكود في `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/components/ui/input.tsx`, `src/components/ui/button.tsx`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`.

---

## 1. Observations (الملاحظات)

### البنية الحالية
- **تسجيل الدخول:** عنوان "تسجيل الدخول"، نص ترحيب "مرحباً بك مجدداً في صبا"، زر Google، فاصل "أو"، حقلا البريد وكلمة المرور، رابط "نسيت كلمة المرور؟"، زر "تسجيل الدخول"، رابط "إنشاء حساب جديد".
- **إنشاء حساب:** عنوان "إنشاء حساب جديد"، نص "انضم إلى صبا واكتشف عالمك العطري الخاص"، بلوك أمان مع أيقونة shield، زر Google، فاصل "أو"، حقول الاسم / البريد / كلمة المرور / تأكيد كلمة المرور، زر "إنشاء الحساب"، رابط "تسجيل الدخول".
- **الاتجاه:** `dir="rtl"` على الحاوية الرئيسية في كلا الصفحتين؛ مكوّن `Input` يستخدم `dir="rtl"` و`start-3`/`end-3` و`ps-11`/`pe-11`.
- **الأيقونات:** تمرير أسماء نصية (`email`, `lock`, `person`, `visibility`, `visibility_off`, `shield_check`, `error`) إلى `<span className="material-symbols-outlined">` دون تحميل خط Material Symbols في المشروع.
- **النمط:** خلفية `bg-cream-bg`، بطاقة بيضاء `rounded-[2.5rem]`، حدود `border-primary/10`، ظل `shadow-elevation-3`، حقول `rounded-input` (12px)، أزرار `py-6 rounded-xl`.

---

## 2. Issues (المشاكل)

### 2.1 RTL/LTR وظهور أسماء الأيقونات كنصوص

| المشكلة | الموقع | التفاصيل |
|--------|--------|----------|
| **ظهور أسماء الأيقونات كنصوص** | `Input` (icon/startIcon)، رسالة الخطأ، بلوك الأمان في Register | استخدام `material-symbols-outlined` مع نصوص مثل `email`, `lock`, `person`, `visibility`, `visibility_off`, `shield_check`, `error` دون تحميل خط Material Symbols في `layout.tsx` أو أي مكان. النتيجة: عرض النص الحرفي (مثل "email", "lock") بدلاً من الرمز. |
| **اتجاه أيقونة Google** | Login & Register | زر Google يستخدم `ml-2` للأيقونة (يسار النص). في RTL يُفترض أن تكون الأيقونة على يمين النص؛ استخدام `ms-2` (margin-inline-start) يحترم RTL. |
| **اتجاه الـ Loader في الزر** | `Button` | `Loader2` مع `me-2` صحيح لـ RTL؛ لا مشكلة هنا. |

### 2.2 الـ Hierarchy البصري: العنوان / الأزرار / الحقول

| المشكلة | الموقع | التفاصيل |
|--------|--------|----------|
| **ضعف تمييز العنوان عن الوصف** | كلا الصفحتين | العنوان `text-3xl md:text-4xl font-black` والوصف `text-sm text-text-secondary`. الفرق في الحجم جيد، لكن التباين بين لون العنوان والوصف قد يكون خفيفاً على خلفية بيضاء؛ لا يوجد لون مميز للعرض (مثل primary) للعناوين. |
| **سماكة حدود الحقول** | `Input` | حد واحد `border border-border-subtle` (1px). في معايير 2026 غالباً نرى حدود أوضح في الحالة العادية أو على الأقل في focus؛ الحد الحالي قد يبدو باهتاً. |
| **سماكة حدود البطاقة** | Login & Register | `border border-primary/10` — شفافية عالية (10%)؛ الحدود قد لا تُرى بوضوح. |
| **المسافات بين العناصر** | النماذج | `space-y-4` بين الحقول، `space-y-6` بين الأزرار والفاصل. المسافة بين "نسيت كلمة المرور؟" والحقل السابق غير معرّفة بشكل صريح؛ قد تحتاج توحيداً. |
| **تباين زر Google** | Login & Register | `variant="outline"` مع `border-primary/10` و`hover:bg-primary/5`. الحد والخلفية فاتحان جداً؛ الزر قد يبدو ضعيفاً مقارنة بزر "تسجيل الدخول" / "إنشاء الحساب". |
| **الفاصل "أو"** | كلا الصفحتين | خط `text-[10px]` و`tracking-widest` و`uppercase` — صغير جداً؛ قد يقلل القراءة. الحد `border-primary/5` خفيف جداً. |

### 2.3 الـ Copy العربي والترجمة والاتساق

| المشكلة | الموقع | التفاصيل |
|--------|--------|----------|
| **اختلاف صيغ "تسجيل الدخول بـ Google"** | Login vs Register | Login: "دخول بـ Google"؛ Register: "تسجيل بـ Google". عدم اتساق في التعبير (دخول vs تسجيل). |
| **رابط التنقل بين الصفحتين** | أسفل النموذج | Login: "إنشاء حساب جديد"؛ Register: "تسجيل الدخول". التعبير سليم، لكن يمكن توحيد الصياغة مع أزرار Google (مثلاً: "إنشاء حساب" مقابل "تسجيل الدخول"). |
| **رسائل الخطأ** | Login | "حدث خطأ أثناء تسجيل الدخول بـ Google" و"يرجى إدخال البريد الإلكتروني وكلمة المرور" — واضحة. |
| **رسائل التحقق في Register** | Register | "كلمتا المرور غير متطابقتين"، "كلمة المرور يجب أن تكون 8 أحرف على الأقل" — سليمة. يمكن توحيد أسلوب الخطاب (أنت/المستخدم). |
| **بلوك الأمان في Register** | Register | "بياناتك مشفرة وآمنة. لن نشارك معلوماتك..." — جيد. يمكن توحيد مصطلح "طرف ثالث" مع نصوص أخرى في التطبيق. |

### 2.4 حالات التفاعل: Focus / Error / Disabled

| المشكلة | الموقع | التفاصيل |
|--------|--------|----------|
| **Focus عالمي ثابت** | `globals.css` | `*:focus-visible { box-shadow: 0 0 0 2px white, 0 0 0 4px #c0841a }` — لون ثابت ولا يستخدم tokens (primary/accent). في الوضع الداكن قد لا يناسب الخلفية. |
| **حالة الخطأ في الحقل** | `Input` | إضافة `border-danger-red` جيدة؛ لا يوجد خلفية خفيفة للحقل عند الخطأ (مثل `bg-danger-red/5`) ولا تغيير واضح لون الأيقونة. |
| **حالة Disabled** | `Input` و `Button` | الزر: `disabled:opacity-50 disabled:cursor-not-allowed`. الحقل: لا توجد كلاسات محددة لـ disabled (لون، خلفية، مؤشر). |
| **زر إظهار/إخفاء كلمة المرور** | `Input` | أيقونة visibility بدون حدود أو خلفية؛ في الهواتف قد يصعب لمسها دون توضيح منطقة اللمس. |

---

## 3. Recommendations (التوصيات)

كل توصية مرتبطة بالمشكلة المذكورة أعلاه.

1. **استبدال أيقونات النص بأيقونات فعلية (lucide-react) مع دعم RTL**  
   - **المشكلة:** ظهور "email", "lock", "person", "visibility", "visibility_off", "shield_check", "error" كنص.  
   - **الإجراء:** إزالة الاعتماد على `material-symbols-outlined` في شاشات Auth و`Input`؛ استخدام مكونات من `lucide-react` (مثل `Mail`, `Lock`, `User`, `Eye`, `EyeOff`, `ShieldCheck`, `AlertCircle`) وعرضها داخل `Input` كـ `startIcon`/`endIcon`. وضع الأيقونة في `Input`: اليسار منطقياً = بداية النص، أي استخدام `start-3` (يمين في RTL) للأيقونة بجانب النص؛ عدم استخدام `ml-2`/`mr-2` للأيقونات واستخدام `gap-2` أو `ms-2`/`me-2` حسب الاتجاه.

2. **تحميل خط Material Symbols إن استمر استخدامه**  
   - **المشكلة:** نفس ظهور الأسماء كنصوص.  
   - **الإجراء (بديل لـ 1):** إضافة في `layout.tsx` داخل `<head>`:  
     `<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />`  
     وتطبيق الخط على `.material-symbols-outlined` في CSS. يفضّل التوصية 1 لتقليل الاعتماد على خط خارجي وتحسين الأداء.

3. **توحيد اتجاه أيقونة Google في الأزرار**  
   - **المشكلة:** `ml-2` لا يحترم RTL.  
   - **الإجراء:** استبدال `ml-2` بـ `ms-2` (أو `me-2` حسب ترتيب العناصر) لأيقونة Google في `login/page.tsx` و`register/page.tsx` حتى تبقى الأيقونة بجانب النص في يمين الواجهة في RTL.

4. **تعريف نظام ألوان موحد في Tailwind/CSS**  
   - **المشكلة:** تباين وضعف وضوح الحدود والأزرار.  
   - **الإجراء:** في `tailwind.config.ts` و/أو `@theme` في `globals.css`: توحيد primary، primary-dark، primary-light، danger-red، safe-green، border-subtle، وربط focus-visible بهذه القيم. استخدام نفس الألوان للعناوين المهمة (مثلاً عنوان الصفحة بلون primary أو text-primary مع وزن عالي).

5. **Typography للعناوين والوصف**  
   - **المشكلة:** ضعف تمييز العنوان عن الوصف.  
   - **الإجراء:** عنوان الصفحة: `text-3xl md:text-4xl font-black text-text-primary` مع خيار `text-primary` للعناوين الرئيسية إن رُغب؛ الوصف: `text-sm text-text-secondary` مع التأكد من أن line-height (مثلاً 1.5) وتباين اللون كافٍ. يمكن إضافة token للعناوين الكبيرة (مثل `--heading-page`) لاستخدامه في أكثر من صفحة.

6. **سماكة ووضوح حدود البطاقة والحقول**  
   - **المشكلة:** حدود البطاقة والحقول خفيفة جداً.  
   - **الإجراء:** زيادة وضوح حدود البطاقة: مثلاً `border-primary/15` أو `border-2 border-primary/10`؛ للحقول: الإبقاء على `border` مع لون أوضح قليلاً (مثلاً `border-border-subtle` بقيمة أغمق في الـ theme) أو `border-2` في الحالة العادية. توحيد radius: استخدام `rounded-input` (12px) للحقول و`rounded-2xl` أو `rounded-[2.5rem]` للبطاقة بشكل ثابت.

7. **ظل البطاقة والحقول**  
   - **المشكلة:** عدم وضوح الـ hierarchy.  
   - **الإجراء:** الإبقاء على `shadow-elevation-3` للبطاقة؛ للحقول عدم إضافة ظل ثقيل، أو إضافة ظل خفيف جداً عند focus فقط (انظر التوصية 10).

8. **أنماط الأزرار (Primary vs Outline)**  
   - **المشكلة:** زر Google يبدو باهتاً.  
   - **الإجراء:** زيادة وضوح زر Google: `border-2 border-primary/20` و`hover:bg-primary/10` و`hover:border-primary/30`؛ أو استخدام زر ثانوي موحّد (مثلاً `secondary` أو `outline` معدّل) في الـ design system. أزرار "تسجيل الدخول" و"إنشاء الحساب": الإبقاء على primary مع `shadow-button` وربط hover بـ `shadow-elevation-2` كما في الـ button variants.

9. **أنماط الفاصل "أو"**  
   - **المشكلة:** خط صغير جداً وحد خفيف.  
   - **الإجراء:** زيادة حجم النص إلى `text-xs` على الأقل؛ تقليل `tracking-widest` إن أثر على القراءة؛ زيادة وضوح الخط: `border-primary/10` أو `border-border-subtle`؛ الإبقاء على `uppercase` أو إزالته للعربية حسب الهوية البصرية.

10. **حالات Focus للحقول**  
    - **المشكلة:** Focus عالمي بلون ثابت وقد لا يناسب Dark.  
    - **الإجراء:** في `Input`: استخدام `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` (أو ring-offset-white) و`focus-visible:border-primary` مع إزالة أو تخفيف الـ outline العام لهذا العنصر. في `globals.css`: جعل `*:focus-visible` يستخدم متغيرات (مثل `var(--color-primary)` أو `var(--tw-ring-color)`) وإضافة قيمة مناسبة للوضع الداكن.

11. **حالة Error في الحقل**  
    - **المشكلة:** لا خلفية ولا تمييز واضح للأيقونة عند الخطأ.  
   - **الإجراء:** عند `error`: إضافة `bg-danger-red/5` (أو 10) للحقل، و`border-2 border-danger-red`، وتلوين أيقونة البداية عند الخطأ بـ `text-danger-red`. الإبقاء على رسالة الخطأ تحت الحقل مع أيقونة (من lucide بعد التوصية 1).

12. **حالة Disabled للحقل والزر**  
    - **المشكلة:** لا أنماط واضحة لـ disabled في الحقل.  
   - **الإجراء:** للحقل: `disabled:opacity-70 disabled:bg-surface-muted disabled:cursor-not-allowed` (أو ما يعادلها في الـ theme). للزر: الإبقاء على `disabled:opacity-50 disabled:cursor-not-allowed` وربطها بـ variant واحد في الـ design system.

13. **توحيد الـ Copy لأزرار Google والروابط**  
   - **المشكلة:** "دخول بـ Google" vs "تسجيل بـ Google".  
   - **الإجراء:** اختيار صيغة واحدة: إما "المتابعة بـ Google" أو "دخول بـ Google" في Login و"التسجيل بـ Google" في Register؛ أو توحيد العبارة إلى "المتابعة بـ Google" في الصفحتين مع الاعتماد على سياق الصفحة. توحيد صياغة الروابط ("إنشاء حساب جديد" / "تسجيل الدخول") مع نفس الأسلوب في باقي التطبيق.

14. **Divider (الفاصل) كنمط مشترك**  
   - **المشكلة:** تكرار نفس الـ markup للفاصل في Login و Register.  
   - **الإجراء:** استخراج مكون `AuthDivider` أو إضافة صنف مشترك (مثلاً `divider-with-label`) مع نص "أو"، واستخدامه في كلا الصفحتين لضمان نفس المسافات والحدود والـ typography.

15. **منطقة لمس زر إظهار/إخفاء كلمة المرور**  
   - **المشكلة:** صعوبة اللمس على الموبايل.  
   - **الإجراء:** التأكد من أن الزر له `min-touch-target` (44×44) وpadding كافٍ؛ إبقاء `aria-label` للنقاط العمياء؛ عدم الاعتماد على أيقونة فقط دون مساحة لمس واضحة.

---

## 4. Quick Wins (تحسينات سريعة)

- استبدال أيقونات النص في Auth و`Input` بأيقونات من `lucide-react` (التوصية 1) — يزيل ظهور الأسماء كنصوص فوراً.
- استبدال `ml-2` بأيقونة Google بـ `ms-2` في صفحتي Login و Register (التوصية 3).
- توحيد نص زر Google بين الصفحتين (مثلاً "المتابعة بـ Google") (التوصية 13).
- زيادة حجم نص الفاصل "أو" إلى `text-xs` ووضوح الحد قليلاً (التوصية 9).
- إضافة `disabled:opacity-70 disabled:bg-surface-muted disabled:cursor-not-allowed` لحقل الإدخال في `Input` (التوصية 12).
- ربط `*:focus-visible` في globals.css بمتغيرات الألوان وإضافة قيمة للوضع الداكن (التوصية 10).
- إضافة `bg-danger-red/5` و`border-2 border-danger-red` وتمييز أيقونة البداية عند `error` في `Input` (التوصية 11).

---

## 5. قائمة تغييرات CSS/Tailwind مقترحة (جاهزة للنسخ)

يمكن تطبيق التالي في المشروع (بعد استبدال الأيقونات النصية بمكونات من lucide-react حسب التوصية 1).

### 5.1 `src/app/globals.css`

```css
/* ربط focus-visible بمتغيرات وتجنب لون ثابت */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(var(--color-surface)), 0 0 0 4px rgb(var(--color-accent-primary) / 0.6);
}

.dark *:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--color-background)), 0 0 0 4px rgb(var(--color-accent-primary) / 0.7);
}
```

### 5.2 مكوّن Input — إضافات Tailwind مقترحة

- الحقل العادي:  
  `rounded-input border-2 border-border-subtle ... focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary`
- عند الخطأ:  
  `border-2 border-danger-red bg-danger-red/5` وأيقونة البداية: `text-danger-red`
- عند Disabled:  
  `disabled:opacity-70 disabled:bg-surface-muted disabled:cursor-not-allowed`

### 5.3 صفحات Login و Register — كلاسات مقترحة

- البطاقة:  
  `border-2 border-primary/15` (بدلاً من `border border-primary/10`) إن رغبت بحد أوضح.
- الفاصل "أو":  
  `text-xs font-bold text-text-secondary uppercase tracking-wide` والخط:  
  `border-t border-primary/10` (بدلاً من `border-primary/5`).
- زر Google:  
  `border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30` مع استبدال `ml-2` على الأيقونة بـ `ms-2`.

### 5.4 Tailwind (مقتطفات لاستخدامها في المكونات)

```txt
/* البطاقة */
rounded-[2.5rem] border-2 border-primary/15 shadow-elevation-3

/* الفاصل */
text-xs font-bold text-text-secondary uppercase tracking-wide
border-t border-primary/10

/* زر Google (outline) */
border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30
أيقونة: ms-2 (بدلاً من ml-2)

/* حقل الإدخال */
rounded-input border-2 border-border-subtle
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary
error: border-2 border-danger-red bg-danger-red/5
disabled: opacity-70 bg-surface-muted cursor-not-allowed

/* رسالة خطأ تحت الحقل */
text-sm text-danger-red flex items-center gap-1 mt-1.5 ms-1
```

### 5.5 ملخص الملفات المتأثرة

| الملف | التعديلات المقترحة |
|-------|---------------------|
| `src/app/globals.css` | تحديث `*:focus-visible` و إضافة `.dark *:focus-visible` |
| `src/components/ui/input.tsx` | استبدال أيقونات النص بـ lucide، إضافة border-2، error styles (خلفية + لون أيقونة)، disabled styles |
| `src/app/login/page.tsx` | أيقونة Google: `ms-2`، الفاصل: `text-xs` و `border-primary/10`، البطاقة: `border-2 border-primary/15`، زر Google: حدود أوضح |
| `src/app/register/page.tsx` | نفس التعديلات للفاصل والبطاقة وزر Google؛ استبدال `shield_check` النصي بأيقونة lucide |
| `tailwind.config.ts` | (اختياري) إضافة أو توضيح ألوان للحدود و primary في الـ theme |

---

## 6. قائمة تغييرات CSS/Tailwind — جاهزة للنسخ

### 6.1 `globals.css` — استبدال قواعد focus

```css
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(var(--color-surface)), 0 0 0 4px rgb(var(--color-accent-primary) / 0.6);
}

.dark *:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--color-background)), 0 0 0 4px rgb(var(--color-accent-primary) / 0.7);
}
```

### 6.2 `Input` — كلاسات الحقل (في cn())

```txt
الحقل الأساسي:
w-full px-4 py-3 rounded-input border-2 border-border-subtle bg-white dark:bg-surface transition-all text-base
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary
disabled:opacity-70 disabled:bg-surface-muted disabled:cursor-not-allowed

مع أيقونة بداية: ps-11
مع زر visibility أو endIcon: pe-11

عند الخطأ:
border-2 border-danger-red bg-danger-red/5
أيقونة البداية عند error: text-danger-red
```

### 6.3 `Input` — رسالة الخطأ

```txt
text-sm text-danger-red dark:text-red-400 mt-1.5 flex items-center gap-1 ms-1
```

### 6.4 Login / Register — البطاقة

```txt
bg-white rounded-[2.5rem] p-8 md:p-12 shadow-elevation-3 border-2 border-primary/15 max-w-md w-full
```

### 6.5 Login / Register — الفاصل "أو"

```txt
الحاوية:
relative flex items-center justify-center

الخط:
w-full border-t border-primary/10

النص:
relative px-4 bg-white text-xs font-bold text-text-secondary uppercase tracking-wide
```

### 6.6 Login / Register — زر Google

```txt
w-full py-6 rounded-xl border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30
أيقونة SVG: ms-2 (بدلاً من ml-2)
```

### 6.7 زر إظهار/إخفاء كلمة المرور في `Input`

```txt
min-touch-target flex items-center justify-center p-2 -me-1 text-text-secondary hover:text-primary
```

---

*تم إعداد التقرير بناءً على تحليل الكود الحالي دون الاعتماد على صور مرفقة؛ إن وُجدت لقطات شاشة يمكن ربط الملاحظات بها لاحقاً.*

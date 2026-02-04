# خريطة الملفات + DOM + تقرير UI/UX — شاشات Auth

**ملاحظة المسارات:** المشروع الحالي يستخدم `login` و `register` وليس `sign-in` / `sign-up`، ولا يوجد route group `(auth)` ولا مكوّن `AuthForm`. النماذج مضمّنة داخل صفحات الصفحة. للتطابق مع طلبك: **sign-in ≈ login**، **sign-up ≈ register**، ومحتوى النموذج + الحقول موجود في الصفحات نفسها.

---

## 1) قائمة كل ملف مع محتواه المختصر

| المسار المطلوب | المسار الفعلي | المحتوى المختصر |
|-----------------|----------------|------------------|
| `src/app/(auth)/sign-in/page.tsx` | **`src/app/login/page.tsx`** | **محتوى &lt;form&gt; + زر Google:** حاوية RTL، بطاقة بيضاء، عنوان "تسجيل الدخول"، وصف "مرحباً بك مجدداً في صبا"، بلوك خطأ (إن وُجد) مع `material-symbols-outlined` + نص، زر Google (outline + SVG + "دخول بـ Google")، فاصل "أو"، &lt;form&gt;: Input email (icon="email")، Input password (icon="lock")، رابط "نسيت كلمة المرور؟"، Button submit "تسجيل الدخول"، ثم رابط "إنشاء حساب جديد". |
| `src/app/(auth)/sign-up/page.tsx` | **`src/app/register/page.tsx`** | **محتوى &lt;form&gt; + inputs:** نفس البنية مع عنوان "إنشاء حساب جديد"، وصف "انضم إلى صبا..."، بلوك أمان (shield_check + نص)، زر Google "تسجيل بـ Google"، فاصل "أو"، &lt;form&gt;: Input name (icon="person")، Input email (icon="email")، Input password + error (icon="lock")، Input confirmPassword + error (icon="lock")، Button "إنشاء الحساب"، رابط "تسجيل الدخول". التحقق: تطابق كلمات المرور، طول ≥8. |
| `src/components/auth/AuthForm.tsx` | **غير موجود** | النموذج والحقول مضمّنان في الصفحتين؛ لا يوجد مكوّن AuthForm مشترك. (يمكن استخراج نموذج مشترك لاحقاً.) |
| `src/components/ui/Button.tsx` | **`src/components/ui/button.tsx`** | **Styles:** CVA مع variants (primary, secondary, outline, ghost, danger, tertiary, link, disabled)، sizes (default, sm, md, lg, icon). Base: inline-flex, gap-2, rounded-button, font-bold, disabled:opacity-50, min-h/ min-w-touch, focus-visible:ring-2 ring-primary. Primary: gradient primary→primary-dark, shadow-button, hover:shadow-elevation-2. Outline: border, hover:bg-cream-bg. Loader: Loader2 من lucide مع me-2. Motion: scale on hover/tap. |
| `src/components/ui/Input.tsx` | **`src/components/ui/input.tsx`** | **Styles + Input/visibility icons:** حاوية dir="rtl"، label اختياري، relative wrapper: أيقونة بداية (start-3، material-symbols-outlined أو startIcon)، &lt;input&gt; مع rounded-input, border, ps-11/pe-11، focus-visible:ring-2 ring-primary، error: border-danger-red؛ في النهاية: زر visibility (visibility / visibility_off) مع material-symbols-outlined و min-touch-target. رسالة خطأ تحت الحقل مع أيقونة "error". الأيقونات تُمرَّر كنص (email, lock, person, visibility, visibility_off) دون خط Material محمّل. |

---

## 2) مسارات الملفات المستخرجة (للمرجع)

```
src/app/login/page.tsx          ← صفحة تسجيل الدخول (form + Google button)
src/app/register/page.tsx      ← صفحة إنشاء الحساب (form + inputs)
src/components/ui/input.tsx     ← Input + أيقونات البداية/visibility
src/components/ui/button.tsx    ← Button + variants و styles
```

لا يوجد: `src/app/(auth)/sign-in/page.tsx`، `src/app/(auth)/sign-up/page.tsx`، `src/components/auth/AuthForm.tsx`.

---

## 3) Screenshot DOM tree — تعليمات + هيكل مستنتج

### كيف تحصل على لقطة DOM فعلية

1. شغّل التطبيق (مثلاً `pnpm dev` أو `npm run dev`).
2. افتح في المتصفح: **`http://localhost:3000/login`** (المشروع يستخدم `/login` وليس `/sign-in`؛ إن كان المنفذ 4000 فاستخدم `http://localhost:4000/login`).
3. اضغط F12 → تبويب Elements (أو Inspect).
4. حدد عنصر **`<form>`** (أو الحاوية التي تحتوي حقول البريد وكلمة المرور).
5. انسخ الهيكل HTML (Right‑click → Copy → Copy outerHTML) أو انسخ الشجرة يدوياً، ثم الصقه في تقريرك.

### هيكل DOM مستنتج من الكود (لصفحة تسجيل الدخول `/login`)

الهيكل أدناه يعكس ما ينتجه React من `login/page.tsx` + `Input` + `Button` (بدون تفاصيل Tailwind الكاملة):

```html
<div class="min-h-screen bg-cream-bg flex items-center justify-center p-4" dir="rtl">
  <div class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-elevation-3 border border-primary/10 max-w-md w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-black text-text-primary mb-2">تسجيل الدخول</h1>
      <p class="text-text-secondary text-sm">مرحباً بك مجدداً في صبا</p>
    </div>

    <!-- يظهر فقط عند وجود error -->
    <div class="mb-6 p-4 bg-danger-red/10 border border-danger-red/20 rounded-2xl text-danger-red text-sm flex items-center gap-2">
      <span class="material-symbols-outlined text-base">error</span>
      <span>…نص الخطأ…</span>
    </div>

    <div class="space-y-6">
      <!-- زر Google -->
      <div class="inline-block">
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-button ... border border-text-secondary ... w-full py-6 rounded-xl border-primary/10 hover:bg-primary/5" disabled="...">
          <svg class="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">...</svg>
          دخول بـ Google
        </button>
      </div>

      <!-- فاصل "أو" -->
      <div class="relative flex items-center justify-center">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-primary/5"></div>
        </div>
        <span class="relative px-4 bg-white text-[10px] font-bold text-text-secondary uppercase tracking-widest">أو</span>
      </div>

      <form class="space-y-4" onSubmit="...">
        <!-- Input البريد -->
        <div class="w-full" dir="rtl">
          <div class="relative">
            <div class="absolute top-1/2 -translate-y-1/2 start-3 text-text-secondary ...">
              <span class="material-symbols-outlined">email</span>
            </div>
            <input type="email" placeholder="البريد الإلكتروني" class="w-full px-4 py-3 rounded-input border border-border-subtle ... ps-11 pe-11" autocomplete="email" required disabled="..." />
            <div class="absolute top-1/2 -translate-y-1/2 end-3 ...">
              <!-- لا endIcon للبريد -->
            </div>
          </div>
        </div>

        <!-- Input كلمة المرور -->
        <div class="w-full" dir="rtl">
          <div class="relative">
            <div class="absolute ... start-3 ...">
              <span class="material-symbols-outlined">lock</span>
            </div>
            <input type="password" placeholder="كلمة المرور" class="... pe-11 ..." autocomplete="current-password" required disabled="..." />
            <div class="absolute ... end-3 ...">
              <button type="button" class="text-text-secondary hover:text-primary ... min-touch-target ..." aria-label="إظهار كلمة المرور">
                <span class="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <a href="/forgot-password" class="text-xs text-text-secondary hover:text-primary ...">نسيت كلمة المرور؟</a>
        </div>

        <div class="inline-block">
          <button type="submit" class="... w-full py-6 shadow-button mt-2 ...">تسجيل الدخول</button>
        </div>
      </form>
    </div>

    <p class="text-center mt-8 text-sm text-text-secondary">
      لا تملك حساباً؟ <a href="/register" class="font-bold text-primary hover:underline">إنشاء حساب جديد</a>
    </p>
  </div>
</div>
```

**ملاحظة:** في المتصفح قد تظهر النصوص `email`, `lock`, `visibility` كنص عادي إذا لم يُحمَّل خط Material Symbols.

---

## 4) تقرير UI/UX المفصّل (بناءً على الـ prompt السابق)

### Observations (الملاحظات)

- **تسجيل الدخول:** عنوان، وصف، (بلوك خطأ)، زر Google، فاصل "أو"، form: email + password، رابط نسيت كلمة المرور، زر تسجيل الدخول، رابط إنشاء حساب.
- **إنشاء حساب:** عنوان، وصف، بلوك أمان (shield_check)، زر Google، فاصل "أو"، form: name، email، password، confirmPassword، زر إنشاء الحساب، رابط تسجيل الدخول.
- **الاتجاه:** `dir="rtl"` على الحاوية وضمن `Input`.
- **الأيقونات:** أسماء نصية (`email`, `lock`, `person`, `visibility`, `visibility_off`, `shield_check`, `error`) داخل `material-symbols-outlined` دون تحميل الخط → تظهر كنص.
- **النمط:** cream-bg، بطاقة بيضاء rounded-[2.5rem]، border-primary/10، shadow-elevation-3، rounded-input (12px)، أزرار py-6.

---

### Issues (المشاكل)

**1) RTL/LTR وظهور أسماء الأيقونات كنصوص**

- ظهور "email", "lock", "person", "visibility", "visibility_off", "shield_check", "error" كنص لأن خط Material Symbols غير محمّل.
- أيقونة Google: `ml-2` لا يحترم RTL (يفضّل `ms-2`).

**2) الـ Hierarchy البصري**

- حدود الحقول والبطاقة خفيفة جداً (border، border-primary/10).
- زر Google باهت (outline مع primary/10 و primary/5).
- الفاصل "أو": نص صغير جداً (10px)، حد primary/5 خفيف.

**3) الـ Copy والاتساق**

- "دخول بـ Google" (Login) vs "تسجيل بـ Google" (Register) — عدم اتساق.
- باقي النصوص العربية سليمة.

**4) حالات التفاعل**

- Focus عالمي بلون ثابت (#c0841a) ولا يستخدم tokens ولا يتكيف مع Dark.
- Error: border-danger-red فقط، لا خلفية ولا تمييز لأيقونة البداية.
- Disabled: معرّف على الزر فقط؛ لا أنماط واضحة لـ disabled على الحقل.
- زر visibility: بدون منطقة لمس أوضح على الموبايل.

---

### Recommendations (التوصيات) — ملخص مرتبط بالمشاكل

1. استبدال أيقونات النص بأيقونات من `lucide-react` (Mail, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle) في `Input` وصفحتي Auth؛ وضع الأيقونة بـ start/end مع RTL (استخدام start-3/end-3 وعدم استخدام ml-2).
2. توحيد اتجاه أيقونة Google: استبدال `ml-2` بـ `ms-2` في login و register.
3. تحميل خط Material Symbols إن أُبقيت الأيقونات النصية (غير مُفضّل).
4. نظام ألوان: توحيد primary، borders، وربط focus-visible بمتغيرات + dark.
5. Typography: تمييز العنوان (حجم/لون) عن الوصف.
6. حدود: أوضح للبطاقة (مثلاً border-2 border-primary/15) وللحقول (border-2 أو لون أوضح).
7. ظل البطاقة: الإبقاء على shadow-elevation-3.
8. زر Google: حدود أوضح (border-2 border-primary/20، hover:bg-primary/10، hover:border-primary/30).
9. الفاصل "أو": text-xs على الأقل، حد أوضح (border-primary/10).
10. Focus: ربط *:focus-visible بمتغيرات وإضافة حالة dark؛ الحقول لديها بالفعل focus-visible:ring-2.
11. Error: إضافة bg-danger-red/5 و border-2 border-danger-red وتلوين أيقونة البداية بـ text-danger-red.
12. Disabled: إضافة للحقل disabled:opacity-70 disabled:bg-surface-muted disabled:cursor-not-allowed.
13. توحيد Copy: صيغة واحدة لزر Google ("المتابعة بـ Google" أو "دخول بـ Google" في الصفحتين).
14. استخراج مكوّن AuthDivider للفاصل "أو" لضمان اتساق المسافات والحدود.
15. زر visibility: التأكد من min-touch-target ومساحة لمس كافية.

---

### Quick Wins

- استبدال أيقونات النص في Auth و Input بـ lucide-react.
- استبدال `ml-2` بأيقونة Google بـ `ms-2`.
- توحيد نص زر Google.
- زيادة حجم نص "أو" إلى text-xs ووضوح الحد.
- إضافة disabled styles للحقل في Input.
- ربط *:focus-visible بمتغيرات + dark في globals.css.
- إضافة bg-danger-red/5 و border-2 وتمييز أيقونة البداية عند error في Input.

---

### قائمة تغييرات CSS/Tailwind مقترحة (جاهزة للنسخ)

**globals.css — focus:**

```css
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(var(--color-surface)), 0 0 0 4px rgb(var(--color-accent-primary) / 0.6);
}
.dark *:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--color-background)), 0 0 0 4px rgb(var(--color-accent-primary) / 0.7);
}
```

**Input — الحقل:**

- أساسي: `rounded-input border-2 border-border-subtle ... focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary`
- مع أيقونة: `ps-11` / `pe-11`
- خطأ: `border-2 border-danger-red bg-danger-red/5`؛ أيقونة البداية: `text-danger-red`
- معطّل: `disabled:opacity-70 disabled:bg-surface-muted disabled:cursor-not-allowed`

**Login/Register — البطاقة:**

- `border-2 border-primary/15` (بدلاً من border border-primary/10)

**الفاصل "أو":**

- الخط: `border-t border-primary/10`
- النص: `text-xs font-bold text-text-secondary uppercase tracking-wide`

**زر Google:**

- `border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30`
- أيقونة: `ms-2` بدلاً من `ml-2`

**زر visibility في Input:**

- `min-touch-target ... p-2 -me-1`

---

التقرير المفصّل الكامل (جميع الأقسام والجداول والتوصيات الـ 15 وقائمة التغييرات الكاملة) موجود في: **`docs/UI-UX-Report-Auth-Screens.md`**.

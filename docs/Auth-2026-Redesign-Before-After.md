# Auth 2026 Redesign — Before/After + Screenshots Checklist

## Summary

- **أيقونات:** استبدال نصوص Material (`email`, `lock`, `person`, `visibility`, `shield_check`, `error`) بأيقونات **lucide-react** (Mail, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle).
- **RTL:** استخدام `start-3`, `end-3`, `ms-2`, `ps-12`, `pe-12`, `dir="rtl"` في الحقول والبطاقة.
- **البطاقة:** `shadow-elevation-3 border-2 border-primary/15 rounded-3xl bg-gradient-to-b from-white to-cream-bg/50 backdrop-blur-xl`.
- **الحقول:** `border-2 rounded-2xl`, `focus:ring-2 ring-primary/70 ring-offset-2`, `error:border-destructive bg-destructive/5`, `disabled:opacity-60 bg-muted`.
- **زر Google:** `backdrop-blur-md bg-white/80 border-primary/20 hover:shadow-glow hover:scale-105`, أيقونة `ms-2`.
- **الفاصل "أو":** خط بتدرج `via-primary/20`، نص `text-xs font-bold uppercase`.
- **زر الإرسال:** `bg-gradient-to-r from-primary to-primary-dark shadow-glow-xl hover:shadow-glow-2xl hover:scale-105`.
- **Focus عام:** `*:focus-visible` مع `ring` بمتغيرات + `.dark` في `globals.css`.

---

## Before / After Comparison Table

| العنصر | قبل | بعد |
|--------|-----|-----|
| **أيقونات الحقول** | نصوص داخل `material-symbols-outlined` (email, lock, person, visibility) | أيقونات Lucide: Mail, Lock, User, Eye, EyeOff |
| **رسالة الخطأ** | `<span class="material-symbols-outlined">error</span>` | `<AlertCircle className="size-4" />` من lucide |
| **بلوك الأمان (Register)** | `<span class="material-symbols-outlined">shield_check</span>` | `<ShieldCheck className="size-5 text-safe-green" />` من lucide |
| **اتجاه أيقونة Google** | `ml-2` (ثابت LTR) | `ms-2` (يحترم RTL) |
| **البطاقة** | `rounded-[2.5rem] border border-primary/10` | `rounded-3xl border-2 border-primary/15 bg-gradient-to-b from-white to-cream-bg/50 backdrop-blur-xl` |
| **العنوان** | `text-text-primary` | `bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent` |
| **زر Google** | `border-primary/10 hover:bg-primary/5` | `backdrop-blur-md bg-white/80 border-primary/20 hover:shadow-glow hover:scale-105` |
| **الفاصل "أو"** | `border-t border-primary/5` + `text-[10px] tracking-widest` | خط بتدرج `via-primary/20` + `text-xs font-bold uppercase tracking-wide` |
| **حقل الإدخال** | `border rounded-input ps-11 pe-11` | `border-2 rounded-2xl ps-12 pe-12` + `focus:ring-2 ring-primary/70 ring-offset-2`، `error:border-destructive bg-destructive/5`، `disabled:opacity-60 bg-muted` |
| **زر visibility** | `material-symbols-outlined` + `min-touch-target` | `Eye` / `EyeOff` + `p-2 rounded-full hover:bg-muted` |
| **زر تسجيل الدخول/إنشاء الحساب** | `shadow-button` | `bg-gradient-to-r from-primary to-primary-dark shadow-glow-xl hover:shadow-glow-2xl hover:scale-105` |
| **Focus عام (globals.css)** | `box-shadow: 0 0 0 2px white, 0 0 0 4px #c0841a` | `box-shadow` بمتغيرات `--color-background` و `--color-accent-primary` + `.dark` |

---

## Screenshots Checklist (6 صور)

التقاط لقطات الشاشة التالية بعد تشغيل `npm run dev` وفتح المنفذ المناسب (مثلاً 3000 أو 4000):

| # | الصفحة | الوضع | الوصف |
|---|--------|--------|--------|
| 1 | `/login` | Desktop, Light | البطاقة، العنوان المتدرج، زر Google، الحقول، زر تسجيل الدخول |
| 2 | `/login` | Desktop, Dark | نفس الصفحة في الوضع الداكن |
| 3 | `/login` | Mobile, Light | نفس الصفحة على عرض ضيق (مثلاً 375px) |
| 4 | `/register` | Desktop, Light | البطاقة، بلوك الأمان (ShieldCheck)، الحقول الأربعة، زر إنشاء الحساب |
| 5 | `/register` | Desktop, Dark | نفس الصفحة في الوضع الداكن |
| 6 | `/login` أو `/register` | تفاعل | لقطة عند **focus** على حقل (ring واضح) أو **hover** على زر Google (scale + glow) أو **error** على حقل (border أحمر + خلفية destructive/5) |

---

## التحقق

- [x] `npm run build` — نجح.
- [ ] Lighthouse 95+ (تشغيل يدوي على `/login` و `/register`).
- [ ] لقطات الشاشة الست أعلاه.
- [ ] اختبار يدوي: hover / focus / error / RTL؛ التأكد من عدم ظهور نصوص أيقونات.

---

## Git Commit

```bash
git add src/components/ui/input.tsx src/app/login/page.tsx src/app/register/page.tsx src/app/globals.css tailwind.config.ts docs/Auth-2026-Redesign-Before-After.md
git commit -m "feat(auth): 2026 premium redesign (shadcn trends)"
```

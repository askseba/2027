# فحص Validation — Login / Register

## 1. تشغيل السيرفر

```bash
npm run dev
```

ثم افتح: **http://localhost:3000/login** أو **http://localhost:4000/login** (حسب المنفذ).

---

## 2. اختبار Login (`/login`)

| # | الحالة | الإدخال | النتيجة المتوقعة | رسالة الخطأ |
|---|--------|---------|------------------|-------------|
| 1 | Email فارغ | Submit دون إدخال | رسالة خطأ تحت حقل البريد | "يرجى إدخال البريد الإلكتروني" |
| 2 | Email غير صالح | `abc` ثم Submit | رسالة تحت حقل البريد | "البريد الإلكتروني غير صحيح" |
| 3 | Email صحيح + Password فارغ | `test@example.com` فقط ثم Submit | رسالة تحت حقل كلمة المرور | "يرجى إدخال كلمة المرور" |
| 4 | Password < 8 أحرف | email صحيح + `123` ثم Submit | رسالة تحت حقل كلمة المرور | "كلمة المرور يجب أن تكون 8 أحرف على الأقل" |
| 5 | بيانات صحيحة + خطأ من السيرفر | email/ password صحيحان لكن غير مسجلين | رسالة عامة (بلوك أحمر) | رسالة من السيرفر (مثلاً "Invalid credentials") |

---

## 3. اختبار Register (`/register`)

| # | الحالة | الإدخال | النتيجة المتوقعة | رسالة الخطأ |
|---|--------|---------|------------------|-------------|
| 6 | Name فارغ | مسموح (الاسم اختياري) | لا خطأ على الاسم | — |
| 7 | Email فارغ | Submit دون بريد | رسالة تحت حقل البريد | "يرجى إدخال البريد الإلكتروني" |
| 8 | Email غير صالح | `abc` ثم Submit | رسالة تحت حقل البريد | "البريد الإلكتروني غير صحيح" |
| 9 | Password < 8 أحرف | كلمة مرور قصيرة ثم Submit | رسالة تحت حقل كلمة المرور | "كلمة المرور يجب أن تكون 8 أحرف على الأقل" |
| 10 | Confirm ≠ Password | كلمتا مرور مختلفتان ثم Submit | رسالة تحت حقل التأكيد | "كلمتا المرور غير متطابقتين" |

---

## 4. فحص الكود (grep)

```bash
# Login: error / validation
rg -n "error|validation|fieldErrors|EMAIL_REGEX" src/app/login/page.tsx

# Register: error / validation
rg -n "error|validation|errors\.|EMAIL_REGEX" src/app/register/page.tsx

# Input: error / aria-invalid
rg -n "error|aria-invalid" src/components/ui/input.tsx
```

### نتائج grep فعلية

**Login (`src/app/login/page.tsx`):**  
`EMAIL_REGEX`, `fieldErrors`, `error`, `setFieldErrors`, رسائل "يرجى إدخال البريد الإلكتروني" / "البريد الإلكتروني غير صحيح" / "يرجى إدخال كلمة المرور" / "كلمة المرور يجب أن تكون 8 أحرف على الأقل"، `error={fieldErrors.email}` و `error={fieldErrors.password}`.

**Register (`src/app/register/page.tsx`):**  
`EMAIL_REGEX`, `errors`, `setErrors`, تحقق email/password/confirmPassword، `error={errors.email}`, `error={errors.password}`, `error={errors.confirmPassword}`.

**Input (`src/components/ui/input.tsx`):**  
`error` prop، `aria-invalid={!!error}` (سطر 68)، `border-destructive` و `bg-destructive/5` عند `error`، عرض رسالة الخطأ تحت الحقل.

---

## 5. DOM Inspection

في المتصفح (F12 → Elements أو Console):

```js
// عناصر ذات حالة خطأ (بعد إظهار خطأ)
document.querySelectorAll('[aria-invalid="true"]')

// حدود خطأ (المشروع يستخدم border-destructive وليس border-danger-red)
document.querySelectorAll('input.border-destructive')
```

عند وجود خطأ في حقل: يُفترض أن يكون له `aria-invalid="true"` وكلاس `border-destructive`.

---

## 6. ملخص النتائج المطلوبة

| الاختبار | Input | النتيجة المتوقعة | النتيجة الفعلية |
|----------|--------|------------------|-----------------|
| Login Email فارغ | البريد فارغ | رسالة "يرجى إدخال البريد الإلكتروني" تحت الحقل | ✅ |
| Login Email غير صالح | abc | رسالة "البريد الإلكتروني غير صحيح" تحت الحقل | ✅ |
| Login Password فارغ | كلمة المرور فارغة | رسالة "يرجى إدخال كلمة المرور" تحت الحقل | ✅ |
| Login Password < 8 | أقل من 8 أحرف | رسالة "كلمة المرور يجب أن تكون 8 أحرف على الأقل" تحت الحقل | ✅ |
| Register Email فارغ/غير صالح | بريد فارغ أو abc | رسالة تحت حقل البريد | ✅ |
| Register Confirm ≠ Password | كلمتا مرور مختلفتان | "كلمتا المرور غير متطابقتين" تحت حقل التأكيد | ✅ |

---

## 7. التنفيذ الحالي (بدون react-hook-form + zod)

- **Login:** تحقق يدوي قبل `signIn`: صيغة البريد (`EMAIL_REGEX`)، إلزامية البريد وكلمة المرور، طول كلمة المرور ≥ 8. أخطاء الحقول في `fieldErrors` وعرضها عبر `error` على كل `Input`.
- **Register:** تحقق يدوي قبل `fetch`: إلزامية البريد وصيغته، طول كلمة المرور ≥ 8، تطابق كلمة المرور والتأكيد. أخطاء الحقول في `errors` وعرضها عبر `error` على كل `Input`.
- **Input:** عند `error` يُضاف `aria-invalid="true"` وكلاسات الخطأ (`border-destructive`, `bg-destructive/5`).

للاستبدال لاحقاً بـ **react-hook-form + zod**: إنشاء schema بـ zod وربط الحقول مع `useForm` ثم عرض `formState.errors` على كل `Input`.

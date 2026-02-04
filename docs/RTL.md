# RTL Support - دعم اللغة العربية

توثيق قواعد دعم اتجاه RTL (Right-to-Left) المطبقة في المشروع.

## المبادئ الأساسية

المشروع يستخدم **logical properties** من Tailwind CSS لضمان عمل التصميم بشكل صحيح في كلا الاتجاهين (LTR و RTL).

## القواعد المطبقة

### 1. Logical Spacing Properties

استبدال المسافات الثابتة بالمسافات المنطقية:

| القديم | الجديد | الوصف |
|--------|--------|-------|
| `ml-*` | `ms-*` | Margin Start (يسار في LTR، يمين في RTL) |
| `mr-*` | `me-*` | Margin End (يمين في LTR، يسار في RTL) |
| `pl-*` | `ps-*` | Padding Start |
| `pr-*` | `pe-*` | Padding End |

**مثال:**
```tsx
// ❌ قديم
<div className="ml-4 mr-2">

// ✅ جديد
<div className="ms-4 me-2">
```

### 2. Text Alignment

استخدام `text-start` و `text-end` بدلاً من `text-left` و `text-right`:

```tsx
// ❌ قديم
<div className="text-left">

// ✅ جديد
<div className="text-start">
```

### 3. Icon Rotation

الأيقونات الاتجاهية (ChevronLeft, ChevronRight, ArrowLeft, ArrowRight) تستخدم `rtl:rotate-180` لتدويرها تلقائياً في RTL:

```tsx
<ChevronRight className="w-5 h-5 rtl:rotate-180" />
<ChevronLeft className="w-5 h-5 rtl:rotate-180" />
```

**الملفات المطبقة فيها:**
- `src/app/quiz/step1-favorites/page.tsx`
- `src/app/quiz/step2-disliked/page.tsx`
- `src/app/results/page.tsx`
- `src/components/quiz/Step3Allergy.tsx`

### 4. HTML Direction Attribute

جميع الصفحات تستخدم `dir="rtl"` في العنصر الرئيسي:

```tsx
<div dir="rtl" className="...">
  {/* محتوى الصفحة */}
</div>
```

## الملفات المحدثة

- `src/app/quiz/step1-favorites/page.tsx`
- `src/app/quiz/step2-disliked/page.tsx`
- `src/app/results/page.tsx`
- `src/components/quiz/Step3Allergy.tsx`
- `src/components/ui/CTAButton.tsx`
- `src/components/ui/FilterSidebar.tsx`
- `src/components/ui/MobileFilterModal.tsx`
- `src/components/ui/PerfumeGrid.tsx`
- `src/components/ui/PerfumeTimeline.tsx`

## ملاحظات

- التغييرات تطبق فقط في ملفات `.tsx` و `.css` الخاصة بالمشروع
- لا يتم تعديل ملفات `node_modules`
- جميع الأيقونات الاتجاهية يجب أن تحتوي على `rtl:rotate-180` عند الحاجة

---

**آخر تحديث:** 6 يناير 2026

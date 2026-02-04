# 🏪 تحديث المتاجر - 7 متاجر سعودية جديدة

## الطريقة 1: استخدام Prisma Studio (يدوي)

### 1. افتح Prisma Studio:
```bash
npx prisma studio
```
افتح: http://localhost:5555

### 2. تعطيل المتاجر القديمة:
- اذهب إلى جدول `stores`
- حدد جميع المتاجر القديمة (5 متاجر)
- اضغط "Edit" → غير `isActive` إلى `false`
- أو احذفها مباشرة

### 3. أضف المتاجر الجديدة (Add Record لكل واحدة):

#### 1️⃣ FACES وجوه
```json
{
  "name": "FACES وجوه",
  "slug": "faces",
  "affiliateUrl": "https://www.faces.sa/?utm_source=askseba",
  "commission": 8.0,
  "isActive": true
}
```

#### 2️⃣ Nice One نايس ون
```json
{
  "name": "Nice One نايس ون",
  "slug": "niceone",
  "affiliateUrl": "https://niceonesa.com/?utm_source=askseba",
  "commission": 10.0,
  "isActive": true
}
```

#### 3️⃣ Golden Scent قولدن سنت
```json
{
  "name": "Golden Scent قولدن سنت",
  "slug": "goldenscent",
  "affiliateUrl": "https://www.goldenscent.com/?utm_source=askseba",
  "commission": 12.0,
  "isActive": true
}
```

#### 4️⃣ السلطان للعطور
```json
{
  "name": "السلطان للعطور",
  "slug": "sultan",
  "affiliateUrl": "https://sultanperfumes.net/?utm_source=askseba",
  "commission": 7.0,
  "isActive": true
}
```

#### 5️⃣ لوجا ستور
```json
{
  "name": "لوجا ستور",
  "slug": "lojastore",
  "affiliateUrl": "https://lojastoregt.com/?utm_source=askseba",
  "commission": 9.0,
  "isActive": true
}
```

#### 6️⃣ فانيلا للعطور
```json
{
  "name": "فانيلا للعطور",
  "slug": "vanilla",
  "affiliateUrl": "https://vanilla.sa/?utm_source=askseba",
  "commission": 8.5,
  "isActive": true
}
```

#### 7️⃣ أوناس السعودية
```json
{
  "name": "أوناس السعودية",
  "slug": "ounass-sa",
  "affiliateUrl": "https://saudi.ounass.com/?utm_source=askseba",
  "commission": 15.0,
  "isActive": true
}
```

### 4. Save All → Refresh → 7 متاجر جاهزة!

---

## الطريقة 2: استخدام Seed File (تلقائي)

تم تحديث `prisma/seed.ts` بالمتاجر الجديدة. شغّل:

```bash
npx prisma db seed
```

سيقوم بـ:
- تعطيل المتاجر القديمة (isActive=false)
- إضافة/تحديث المتاجر الجديدة (upsert)

---

## اختبار API:

```bash
npm run dev
```

افتح:
```
http://localhost:3000/api/prices/compare?perfumeId=1
```

يجب أن ترى قائمة بالأسعار من المتاجر الجديدة (إذا كانت موجودة في قاعدة البيانات).

---

## ملاحظات:

1. **Affiliate URLs**: جميع الروابط تحتوي على `?utm_source=askseba` للتتبع
2. **Commission**: نسب العمولة مختلفة لكل متجر (7% - 15%)
3. **Slugs**: فريدة لكل متجر (لا تكرار)
4. **isActive**: جميع المتاجر الجديدة مفعلة

---

**آخر تحديث:** 2026-01-14

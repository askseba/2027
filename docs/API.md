# API Documentation

توثيق واجهات برمجة التطبيق (API endpoints) المتاحة في المشروع.

## Base URL

جميع الـ endpoints متاحة على:
```
/api
```

## Endpoints

### GET /api/perfumes/search

البحث عن العطور بالاسم أو العلامة التجارية.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | No | `""` | مصطلح البحث (اسم العطر أو العلامة التجارية) |
| `limit` | number | No | `50` | الحد الأقصى لعدد النتائج |

**ملاحظة:** البحث يتم في حقل `name` و `brand` فقط، وهو غير حساس لحالة الأحرف (case-insensitive). النتائج مرتبة أبجدياً حسب اسم العطر.

#### Success Response

```json
{
  "perfumes": [
    {
      "id": "string",
      "name": "string",
      "brand": "string",
      "image": "string",
      "score": number,
      "matchPercentage": number,
      "status": "safe" | "warning" | "danger",
      "price": number,
      "originalPrice": number | null,
      "description": "string",
      "isSafe": boolean,
      "variant": "on-sale" | "just-arrived"
    }
  ],
  "total": number
}
```

**ملاحظة:** جميع الحقول ما عدا `id`, `name`, `brand`, `image` هي اختيارية (optional) وقد لا تظهر في جميع النتائج.

#### Example Request

```bash
GET /api/perfumes/search?q=oud&limit=10
```

#### Example Response

```json
{
  "perfumes": [
    {
      "id": "1",
      "name": "Oud Royal",
      "brand": "Brand Name",
      "image": "https://example.com/image.jpg",
      "score": 85,
      "matchPercentage": 85,
      "status": "safe",
      "isSafe": true,
      "description": "وصف العطر"
    }
  ],
  "total": 1
}
```

**ملاحظة:** قيمة `total` في الـ response تساوي عدد العناصر في مصفوفة `perfumes` بعد تطبيق `limit`.

#### Error Response

في حالة حدوث خطأ:

```json
{
  "error": "Internal server error"
}
```

**Status Code:** `500`

---

## ملاحظات

- جميع الـ endpoints تعمل مع البيانات المحلية (local data)
- البحث غير حساس لحالة الأحرف (case-insensitive)
- النتائج مرتبة أبجدياً حسب اسم العطر (ascending)
- يتم تطبيق `limit` على النتائج بعد التصفية والترتيب

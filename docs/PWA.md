# PWA Features - ميزات التطبيق التقدمي

توثيق ميزات Progressive Web App (PWA) المطبقة في المشروع.

## الملفات الموجودة

### 1. Manifest File

**الموقع:** `public/manifest.json`

يحتوي على:
- اسم التطبيق: "Ask Seba - عطرك المثالي"
- الأيقونات: `pwa-192.png` و `pwa-512.png`
- الألوان: `background_color: #F2F0EB`, `theme_color: #c0841a`
- الاتجاه: `dir: "rtl"`
- اللغة: `lang: "ar"`
- وضع العرض: `display: "standalone"`

### 2. Service Worker

**الموقع:** `public/sw.js`

يوفر:
- دعم وضع عدم الاتصال (offline support)
- تخزين مؤقت (caching) للموارد الأساسية:
  - `/`
  - `/dashboard`
  - `/manifest.json`
  - `/pwa-192.png`
  - `/pwa-512.png`

**اسم الـ Cache:** `ask-seba-v1`

## التسجيل

يتم تسجيل Service Worker من خلال مكون `PWARegister` الموجود في:
- `src/components/PWARegister.tsx`

## الأيقونات

الأيقونات المطلوبة موجودة في `public/`:
- `pwa-192.png` (192×192)
- `pwa-512.png` (512×512)
- `apple-touch-icon.png`
- `favicon-16x16.png`
- `favicon-32x32.png`

## الحالة الحالية

✅ **موجود:**
- Manifest file
- Service Worker
- الأيقونات المطلوبة

⚠️ **ملاحظات:**
- Service Worker يوفر دعم أساسي لوضع عدم الاتصال
- قد يحتاج إلى تحديثات مستقبلية لدعم المزيد من الموارد

---

**آخر تحديث:** 6 يناير 2026

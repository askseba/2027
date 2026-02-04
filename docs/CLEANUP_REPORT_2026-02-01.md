# تقرير تنظيف مشروع Ask Seba — 2026-02-01

**قواعد صارمة:** لا حذف قبل التقرير + الموافقة. Backup أولاً.

---

## 1) مخرجات أوامر الجرد (كاملة)

### 1.1 شجرة الملفات (جذر، بدون node_modules/.git/.next، عمق 3)

المخرجات محفوظة في: `docs/file-inventory-20260201.txt`

**ملخص:** الجذر يحتوي على:
- مجلدات: `.next`, `8files-manus`, `docs`, `node_modules`, `prisma`, `public`, `reports`, `scratch`, `scripts`, `src`, `tests`
- ملفات جذر: `package.json`, `tailwind.config.ts`, `tailwind.config.ts.backup`, `next.config.ts`, `next.config.ts.backup`, `eslint.config.mjs`, `tsconfig.json`, `vercel.json`, `vitest.config.ts`, `instrumentation.ts`, `test-auth.ts`, `ts-errors.txt`, وعدد كبير من `*.md` (تقارير)، `lighthouse-*.html`, `lighthouse-report.json`, `*.log`, إلخ.

### 1.2 ملفات Junk المحتملة

المخرجات محفوظة في: `docs/junk-candidates.txt`

```
*.bak / *.old / *.backup:
  src\app\globals.css.backup
  src\app\layout.tsx.backup
  src\components\landing\HeroSection.tsx.old
  src\middleware.backup
  next.config.ts.backup
  tailwind.config.ts.backup
  prisma\schema.prisma.backup_20260123_162103
  prisma\seed.ts.bak_20260123_163532

pho_*.html: (لا يوجد)
```

### 1.3 Imports الفعلية في src/ (HeroSection, CTASection, page.tsx, layout.tsx)

المخرجات محفوظة في: `docs/active-imports.txt`

- **مستورد في التطبيق:** `src/app/page.tsx` يستورد `HeroSection` و `CTASection` من `@/components/landing/HeroSection` و `CTASection`.
- **غير مستورد (نسخة احتياطية):** `src/components/landing/HeroSection.tsx.old` — لا يُستورد من أي مكان.

### 1.4 أحجام docs/

المخرجات محفوظة في: `docs/docs-sizes.txt`

أكبر الملفات في docs:
- `ui-snapshot/.../ask_logo.png` ≈ 1434 KB (نسخة في الأرشيف)
- `UI-UX-Report-Auth-Screens.md` ≈ 21.5 KB
- `Ask_Seba_-_Live_User_Journey_2026-01-28.md` ≈ 28.6 KB
- `Content Specification - ask.seba.md` ≈ 22.5 KB
- `file-inventory-20260201.txt` ≈ 10.2 KB

### 1.5 ملفات مكررة (HeroSection.tsx, page.tsx, layout.tsx)

المخرجات محفوظة في: `docs/duplicates.txt`

- **HeroSection.tsx:** 2 (src = إنتاج، docs/ui-snapshot = أرشيف).
- **layout.tsx:** 2 (src، docs/ui-snapshot).
- **page.tsx:** 24 (كلها في src/app أو docs/ui-snapshot أو 8files-manus؛ لا تكرار أسماء داخل نفس المسار).

---

## 2) جداول التصنيف

### جدول 1: ملفات الجذر + Backups

| File | Size | Modified | Imported? | Category | Reason | Action |
|------|------|----------|-----------|----------|--------|--------|
| package.json | - | - | N/A | KEEP | إدارة المشروع | KEEP |
| tailwind.config.ts | - | - | N/A | KEEP | config | KEEP |
| tailwind.config.ts.backup | - | - | No | DELETE | *.backup | DELETE |
| next.config.ts | - | - | N/A | KEEP | config | KEEP |
| next.config.ts.backup | - | - | No | DELETE | *.backup | DELETE |
| prisma/* (schema, seed, migrations) | - | - | N/A | KEEP | DB | KEEP |
| .env* | - | - | N/A | KEEP | secrets | KEEP |
| public/ask_logo.png | - | - | N/A | KEEP | ممنوع حذف | KEEP |
| public/perfume_transparent.webp | - | - | N/A | KEEP | ممنوع حذف | KEEP |
| src/** (بدون .backup/.old) | - | - | حسب import graph | KEEP | كود منشور | KEEP |
| test-auth.ts | - | - | No (root script) | ARCHIVE/optional | اختبار auth | ARCHIVE أو KEEP |
| ts-errors.txt | - | - | No | DELETE/ARCHIVE | مخرجات مؤقتة | DELETE أو ARCHIVE |
| lighthouse-*.html, lighthouse-report.json | - | - | No | ARCHIVE | تقارير | ARCHIVE |
| *.md (تقارير في الجذر) | - | - | No | ARCHIVE | توثيق/تقارير | نقل إلى docs/archive/2026-02 |
| dev_output.log, dev_server.log, build_output.txt | - | - | No | DELETE | logs | DELETE (إن وُجدت untracked) |
| 8files-manus/ | - | - | No | ARCHIVE | مسودات يدوية | نقل إلى docs/archive/2026-02 |

### جدول 2: مجلد docs/

| File / Folder | Size | Type | Production Value | Category | Action |
|---------------|------|------|------------------|----------|--------|
| docs/ui-snapshot/ | ~1.5 MB | Snapshot | مرجع فقط | ARCHIVE | نقل إلى docs/archive/2026-02/ |
| docs/core/ (ENV_SETUP, README-deploy, STRUCTURE) | KB | Doc | عالي | KEEP | KEEP |
| docs/technical/ | KB | Doc | عالي | KEEP | KEEP |
| docs/Content Specification - ask.seba.md | 22.5 KB | Spec | عالي | KEEP | KEEP |
| docs/API.md, DATABASE_SETUP.md, PWA.md, RTL.md, QUIZ_FLOW_DECISIONS.md | KB | Doc | عالي | KEEP | KEEP |
| docs/Auth-*.md, Header-*.md, Main-Page-Inventory.md, etc. | KB | تقارير | متوسط | KEEP أو ARCHIVE | حسب الحاجة |
| docs/landing-page-screenshot.png | 8.4 KB | Image | مرجع | KEEP | KEEP |
| docs/file-inventory-20260201.txt | 10.2 KB | Inventory | جرد | KEEP | KEEP |
| docs/junk-candidates.txt, active-imports.txt, duplicates.txt, docs-sizes.txt | KB | Inventory | جرد | KEEP | KEEP |
| docs/ux-audit/*.md | KB | Audit | تقارير نهائية | ARCHIVE | نقل إلى docs/archive/2026-02 |
| docs/ui/*.md (Live User Journey) | KB | UX | تقارير | ARCHIVE | نقل إلى docs/archive/2026-02 |

### جدول 3: ملفات مكررة

| File | Count | Locations | Keep Which? | Action |
|------|-------|-----------|-------------|--------|
| HeroSection.tsx | 2 | src/components/landing/, docs/ui-snapshot/.../ | Keep: src/ | أرشيف: docs/ui-snapshot (نقل المجلد بالكامل) |
| layout.tsx | 2 | src/app/, docs/ui-snapshot/.../ | Keep: src/app/ | أرشيف: docs/ui-snapshot |
| page.tsx | 24 | src/app/* (20), docs/ui-snapshot (3), 8files-manus (1) | Keep: كل src/app/; أرشيف: ui-snapshot + 8files-manus | لا إعادة تسمية — المسارات مختلفة. أرشيف المجلدات فقط. |

**ملاحظة:** لا حاجة إلى RENAME (page-v1, page-v2) لأن كل page.tsx في مسار مختلف (Next.js app router). الإجراء: أرشفة مجلدات ui-snapshot و 8files-manus.

---

## 3) التصنيف الموجز

- **KEEP:** src/, public/, package.json, tailwind.config.ts, next.config.ts, prisma/, .env*, ملفات config، كود منشور.
- **ARCHIVE:** docs/ui-snapshot/, تقارير audit ناجحة، docs/ux-audit/, docs/ui/, 8files-manus/, تقارير .md من الجذر → `docs/archive/2026-02/`.
- **RENAME:** غير مطلوب (النسخ المكررة في مسارات مختلفة؛ ننقل للمرشيف فقط).
- **DELETE:** *.bak, *.old, *.backup؛ صور >500KB غير مستخدمة (لا يوجد في public المطلوب حذفه؛ ask_logo.png و perfume_transparent.webp محميان). لا يوجد pho_*.html.

---

## 4) خطة التنفيذ — توقف حتى الموافقة

**لا تنفيذ قبل موافقتك.** بعد الموافقة يمكن تنفيذ السكربت الجاهز في الجذر:

- **السكربت:** `cleanup.sh` (في جذر المشروع) — جاهز للنسخ/التنفيذ على بيئة Unix (Git Bash / WSL / Linux).
- الخطوات فيه: Backup + Branch → إنشاء `docs/archive/YYYYMMDD` → نقل ui-snapshot و 8files-manus و ux-audit و ui → حذف آمن لـ *.backup و *.old → اختبار build/lint/dev → commit.
- على Windows: يمكن تنفيذ الخطوات يدوياً أو تشغيل `bash cleanup.sh` من Git Bash.

---

## 5) قائمة SAFE DELETE IMMEDIATELY (حد أقصى 3 ملفات)

يمكن حذف هذه الملفات فوراً دون تأثير على الـ import graph أو التشغيل:

| # | File | Reason |
|---|------|--------|
| 1 | `src/components/landing/HeroSection.tsx.old` | نسخة احتياطية؛ غير مستوردة. |
| 2 | `tailwind.config.ts.backup` | *.backup؛ الإصدار الفعلي هو tailwind.config.ts. |
| 3 | `next.config.ts.backup` | *.backup؛ الإصدار الفعلي هو next.config.ts. |

**ملاحظة:** لا يُحذف أي من: `public/ask_logo.png`, `public/perfume_transparent.webp`, `package.json`, `tailwind.config.ts`, `prisma/*`, `.env*`.

---

## 6) اختبار npm run dev / build — Checklist

بعد أي حذف أو نقل، نفّذ:

- [ ] `npm install` (إن لزم)
- [ ] `npm run build` — ينجح بدون أخطاء
- [ ] `npm run lint` — بدون أخطاء
- [ ] `npm run dev` — التشغيل يبدأ و الصفحة الرئيسية تُفتح (مثلاً http://localhost:3000)
- [ ] التحقق من أن الصفحة تعرض الشعار والـ CTA (HeroSection + CTASection)
- [ ] إن وُجدت: `npm run test` و/أو `npm run test:e2e` — تمر بنجاح

---

*انتهى التقرير. بانتظار موافقتك للمتابعة.*

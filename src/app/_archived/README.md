# Archived Routes - i18n Migration

## 📦 Archive Information

**Archive Date:** February 6, 2025
**Reason:** Routes migrated to [locale] structure for i18n support
**Migration:** PROMPT #9B
**Keep Until:** February 20, 2025

## 📂 Contents

Old routes from `src/app/` before i18n migration:

- `page.tsx` → Home page (now: `[locale]/page.tsx`)
- `about/` → About page (now: `[locale]/about/`)
- `faq/` → FAQ page (now: `[locale]/faq/`)
- `privacy/` → Privacy page (now: `[locale]/privacy/`)
- `quiz/` → Quiz flow (now: `[locale]/quiz/`)
- `login/` → Login page (now: `[locale]/login/`)
- `register/` → Register page (now: `[locale]/register/`)
- `dashboard/` → Dashboard (now: `[locale]/dashboard/`)
- `results/` → Results page (now: `[locale]/results/`)
- `profile/` → Profile page (now: `[locale]/profile/`)
- `feedback/` → Feedback page (now: `[locale]/feedback/`)
- `favorites/` → Favorites page (now: `[locale]/favorites/`)

## 🔄 Rollback Instructions

**If you need to restore old routes (emergency only):**
```powershell
# Move archived files back to app/
Move-Item src/app/_archived/pages/* src/app/ -Force

# Rebuild
npm run build
```

## 🗑️ Deletion Schedule

**Safe to delete when ALL conditions met:**

- [ ] [locale] routes stable in production for 2+ weeks
- [ ] No user-reported issues
- [ ] Analytics show normal traffic patterns
- [ ] Team approval obtained
- [ ] Git history preserved

**Recommended deletion date:** February 20, 2025

## ⚠️ Important Notes

- Archive is a safety measure, not permanent storage
- All functionality preserved in new [locale] routes
- Git history contains full pre-migration state
- Consult team before deletion

---

**Created:** February 6, 2025
**Migration completed by:** PROMPT #9 (i18n migration)

# Week 1 Final Manual Verification Guide
## Sentry Immediate + Defer + Rollback

**Prerequisite:** Dev server running with:
```bash
NEXT_PUBLIC_DEFER_SENTRY_EXTRAS=true npm run dev
```

---

## A) Immediate tracking check

1. Open: **http://localhost:3000/test-error.html**
2. Wait for the page to load (error fires after 100ms).
3. Within **60 seconds**, open your **Sentry dashboard**.
4. Confirm the event appears with message: **"Week1 Test Immediate Error"**

---

## B) Defer check (flag ON)

1. Open: **http://localhost:3000/**
2. Open **DevTools** → **Network** tab.
3. Reload the page (or clear and reload).
4. **Verify:**
   - **Core Sentry** (main SDK / init) loads **immediately** with the page.
   - **Replay / tracing** (deferred extras) load **after ~3 seconds** (not in the initial burst).

---

## C) Rollback (disable lazy load)

1. With the app open (e.g. http://localhost:3000/), open **DevTools** → **Console**.
2. Run:
   ```javascript
   localStorage.setItem('DISABLE_LAZY','true'); location.reload()
   ```
3. After reload, open **DevTools** → **Network**.
4. **Verify:** Replay/tracing scripts load **immediately** on page load (no ~3s delay).

---

## Checklist (fill YES/NO + timestamp)

| # | Check | Result (YES/NO) | Timestamp |
|---|--------|-----------------|-----------|
| A1 | Opened http://localhost:3000/test-error.html | | |
| A2 | Saw "Week1 Test Immediate Error" in Sentry within 60s | | |
| B1 | Opened http://localhost:3000/ with DevTools Network | | |
| B2 | Core Sentry loaded immediately | | |
| B3 | Replay/tracing loaded after ~3s (deferred) | | |
| C1 | Ran localStorage.setItem('DISABLE_LAZY','true'); location.reload() | | |
| C2 | Replay/tracing loaded immediately (no 3s delay) | | |

---

**Sign-off:** All above YES __________ Date __________

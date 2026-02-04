# PWA Installability Test

## 1. Start the app

```bash
npm run build && npm run start
```

If you get **EADDRINUSE** (port 3000 in use), free the port then start again:

**Windows (PowerShell):**
```powershell
# Find process on 3000
netstat -ano | findstr :3000

# Kill by PID (replace <PID> with the number from the last column)
taskkill /PID <PID> /F
```

Then run `npm run start` again.

---

## 2. Chrome DevTools → Application

1. Open **Chrome** and go to **http://localhost:3000**
2. Press **F12** (or right‑click → Inspect) to open DevTools
3. Open the **Application** tab (top bar of DevTools)

---

### 1. Manifest → Valid?

1. In the left sidebar, click **Manifest** (under "Application").
2. Check:
   - **App name:** Ask Seba / ask.seba
   - **Short name:** ask.seba
   - **Start URL:** /
   - **Theme color:** #c0841a (or your primary)
   - **Icons:** 192×192 and 512×512 listed
3. At the bottom, look for any **errors** (e.g. "Manifest failed to load" or icon issues).

**Valid?** No errors and all fields present → **Yes**

---

### 2. Service Workers → Running?

1. In the left sidebar, click **Service Workers** (under "Application").
2. You should see:
   - **Source:** `/sw.js`
   - **Status:** "activated and is running" (or "activated")
   - **Scope:** `http://localhost:3000/`
3. If you see "Stopped" or no worker, refresh the page (SW registers on `window.load`).

**Running?** Status is "activated" / "running" → **Yes**

---

### 3. + Icon → Install prompt?

1. In Chrome’s **address bar** (omnibox), look for the **install icon** (⊕ or computer-with-plus).
2. Or: **⋮** (three dots) → **Install ask.seba…** / **Install app**.
3. Click it; the install prompt (or install flow) should appear.

**Install prompt?** Icon or menu entry appears and install works → **Yes**

---

## Quick checklist

| Step | What to check | Result |
|------|----------------|--------|
| 1. Manifest | Application → Manifest: no errors, icons 192 & 512 | ☐ Valid |
| 2. Service Workers | Application → Service Workers: `/sw.js` activated | ☐ Running |
| 3. Install | Address bar ⊕ or menu "Install …" | ☐ Prompt shown |

---

**Note:** Install prompt can be suppressed if:
- The app was already installed,
- The visit is not over HTTPS (or localhost),
- Chrome’s installability criteria are not met (manifest + SW + HTTPS/localhost),
- Or the user has dismissed the prompt too many times (Chrome may hide it for a while).

For local testing, **localhost** counts as secure, so manifest + SW are enough for the prompt when criteria are met.

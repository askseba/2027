# Dark Mode – Live Test Report

## Setup Done

- **Hardcoded test div** added in `src/app/layout.tsx` (inside `ThemeProvider`):
  ```tsx
  <div className="bg-red-500 dark:bg-blue-500 h-20 w-20 fixed bottom-4 left-4 z-50 ...">
    HARDCODED TEST
  </div>
  ```
  Visible on every page (bottom-left).

---

## How to Run the Tests

1. **Start dev server** (stop any other Next dev first if needed):
   ```bash
   npm run dev
   ```
2. Open **http://localhost:3000** in the browser.
3. Open **DevTools** (F12) → **Console** and **Elements** (and **Network** for Test 4).

---

## TEST 1 – Hardcoded

- **Expect:** Small box bottom-left: **red** in light, **blue** in dark.
- **Steps:** Save (if needed) → Toggle dark (theme button) → Observe color change.
- **Screenshot:** One in light (red box), one in dark (blue box).

| Result | Screenshot |
|--------|------------|
| نعم / لا | _(paste or attach)_ |

---

## TEST 2 – Console

Run in Console:

**Light mode:**
```js
getComputedStyle(document.documentElement).getPropertyValue('--color-surface')
// Expected: "255 255 255" (or similar light value)
document.documentElement.classList.contains('dark')
// Expected: false
```

**Dark mode (after toggling):**
```js
getComputedStyle(document.documentElement).getPropertyValue('--color-surface')
// Expected: "15 23 42"
document.documentElement.classList.contains('dark')
// Expected: true
```

| Mode  | `--color-surface` | `classList.contains('dark')` | Screenshot |
|-------|-------------------|------------------------------|------------|
| Light | _paste result_    | _true/false_                  | _(attach)_ |
| Dark  | _paste result_    | _true/false_                  | _(attach)_ |

---

## TEST 3 – Semantic `bg-surface`

- **Elements:** Find first element with class `bg-surface` or `dark:bg-surface` (e.g. in Footer, or a card).
- **Computed:** Select that element → Computed → `background-color`.

| Mode  | First `bg-surface` element | Computed `background-color` | Screenshot |
|-------|----------------------------|-----------------------------|------------|
| Light | _selector or component_   | _e.g. rgb(255, 255, 255)_   | _(attach)_ |
| Dark  | _same_                     | _e.g. rgb(15, 23, 42)_      | _(attach)_ |

---

## TEST 4 – ThemeToggle + Network

- **Steps:** Open **Network** tab → Click theme button (sun/moon) to toggle dark.
- **Check:** Is there a request to **/api/theme**?
- **Note:** `next-themes` usually does **not** call `/api/theme`; it only toggles `class="dark"` on `<html>` in the client. So “no request” is normal.

| Question              | Answer |
|-----------------------|--------|
| Request to `/api/theme`? | نعم / لا |
| Response (if any)      | _e.g. status 200, body, or “no request”_ |
| Screenshot (Network)   | _(attach)_ |

---

## REPORT Summary

| Item | Result |
|------|--------|
| **Hardcoded test** (red → blue) | نعم / لا + screenshot |
| **Console Light** `--color-surface` | _value_ |
| **Console Dark** `--color-surface` | _value_ |
| **`<html class="dark">`** when dark? | نعم / لا |
| **Network /api/theme** | _response or “no request”_ |
| **First bg-surface computed (Light)** | _color_ |
| **First bg-surface computed (Dark)** | _color_ |

---

## Remove After Testing

Delete the hardcoded test div from `src/app/layout.tsx`:

```tsx
{/* Remove this block */}
<div className="bg-red-500 dark:bg-blue-500 h-20 w-20 fixed bottom-4 left-4 z-50 ...">
  HARDCODED TEST
</div>
```

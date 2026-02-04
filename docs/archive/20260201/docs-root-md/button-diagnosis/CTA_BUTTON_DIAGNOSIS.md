# "ابدأ الاختبار" Button Diagnosis

## Structure (Current vs Target)

| Target | Current Reality |
|--------|-----------------|
| Button "ابدأ الاختبار" below card #3 in QuestionsSection | **No such button exists** in QuestionsSection |
| | QuestionsSection = 3 cards only, no button (L39-78) |
| | CTA lives in **CTASection** (separate component below) |
| | CTASection button text = **"ابدأ الرحلة"** (not "ابدأ الاختبار") |

**Page flow:** `page.tsx` → HeroSection → QuestionsSection (3 cards) → CTASection (button)

---

## Line #: [file:line]

| Element | Location |
|---------|----------|
| CTA button (closest to "below card #3") | `src/components/landing/CTASection.tsx` **L76-111** |
| Button text span | **L107-110** |
| Parent motion.div (opacity controller) | **L66-75** |

---

## JSX: [Button Code]

```76:111:src/components/landing/CTASection.tsx
          <motion.button
            onClick={handleClick}
            disabled={isClicked}
            className="group relative w-[90%] max-w-[300px] overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-dark dark:from-amber-600 dark:to-amber-800 px-12 py-[18px] text-lg font-semibold text-white shadow-lg dark:shadow-amber-900/30 transition-all duration-300 disabled:opacity-70 md:w-auto"
            animate={{ boxShadow: shadowBreathing }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: shadowHover, ... }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 ..." />
            <span className="relative z-10">
              {isClicked ? 'جاري التحميل...' : 'ابدأ الرحلة'}
            </span>
          </motion.button>
```

**Parent wrapper (the opacity source):**

```66:75:src/components/landing/CTASection.tsx
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          className="flex justify-center"
        >
```

---

## Audit Findings

| Check | Result |
|-------|--------|
| Button className | `text-white` — no opacity/visibility hiders |
| Button style | None inline |
| Parent overflow/height/transform | Parent has `initial={{ opacity: 0 }}` + `whileInView` |
| State (disabled/loading) | `disabled={isClicked}` → opacity-70 when clicked; still visible |
| Conditional render | Button always rendered |
| Dark/light mode | `text-white` + `dark:from-amber-600` — should be visible |

---

## CSS Computed (When Invisible)

| Property | Value (when `whileInView` never fires) |
|----------|----------------------------------------|
| **opacity** | 0 (from parent motion.div `initial`) |
| **color** | rgb(255,255,255) |
| **display** | flex |
| **visibility** | visible |

The **parent** `motion.div` stays at `opacity: 0` → entire CTA (including button) is invisible. The button itself keeps `opacity: 1`; the parent makes it disappear.

---

## Root Cause

**One sentence:** The parent `motion.div` uses `initial={{ opacity: 0 }}` and `whileInView={{ opacity: 1 }}`; if the viewport intersection never fires (below fold, timing, or browser quirks), it remains at opacity 0, so the CTA button is invisible but still present and clickable in the DOM.

---

## Fix: [1 line / 1 change]

**File:** `src/components/landing/CTASection.tsx` — L67-69

**Option A — Trigger earlier (viewport margin):**

```diff
           whileInView={{ opacity: 1, scale: 1 }}
-          viewport={{ once: true }}
+          viewport={{ once: true, margin: '0px 0px -50px 0px' }}
```

**Option B — Guarantee visibility (animate on mount):**

```diff
-          initial={{ opacity: 0, scale: 0.9 }}
-          whileInView={{ opacity: 1, scale: 1 }}
-          viewport={{ once: true }}
+          initial={{ opacity: 0, scale: 0.9 }}
+          animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
```

**Option C — Add fallback opacity (safest):**

```diff
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
+          animate={{ opacity: 1 }}
           viewport={{ once: true, margin: '100px' }}
```

Recommended: **Option B** — use `animate` instead of `whileInView` so the CTA becomes visible on mount regardless of scroll position.

---

## Text Mismatch Note

- **Current button text:** "ابدأ الرحلة"
- **Expected (content.json / design):** "ابدأ الاختبار"

To match design: change L109 from `'ابدأ الرحلة'` to `'ابدأ الاختبار'`.

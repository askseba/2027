# CTA Button Emergency Audit — "ابدأ الاختبار" Still Invisible

## 1. Button JSX (EXACT + LINE)

```76:109:src/components/landing/CTASection.tsx
          <motion.button
            onClick={handleClick}
            disabled={isClicked}
            className="group relative w-[90%] max-w-[300px] overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-dark dark:from-amber-600 dark:to-amber-800 px-12 py-[18px] text-lg font-semibold text-white shadow-lg dark:shadow-amber-900/30 transition-all duration-300 disabled:opacity-70 md:w-auto"
            animate={{
              boxShadow: shadowBreathing,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: shadowHover, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent ..." />
            <span className="relative z-10">
              {isClicked ? 'جاري التحميل...' : 'ابدأ الاختبار'}
            </span>
          </motion.button>
```

---

## 2. Parent Wrapper (OPACITY SOURCE)

```66:75:src/components/landing/CTASection.tsx
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            type: 'spring' 
          }}
          className="flex justify-center"
        >
```

---

## 3. Computed CSS (Inferred)

| Element | opacity | color | display | visibility |
|---------|---------|-------|---------|------------|
| **Button** | 1 (inherits effective from parent) | rgb(255,255,255) | inline-flex | visible |
| **Parent motion.div** | **0** (stuck at initial) | — | flex | visible |

When parent stays at `opacity: 0`, the whole subtree (including the button) is invisible.

---

## 4. Parent Opacity Chain

| Ancestor | opacity | overflow | height |
|----------|---------|----------|--------|
| `<main>` | 1 | visible | min-h-screen |
| `<section className="py-12">` | 1 | visible | auto |
| `<div className="container mx-auto px-6">` | 1 | visible | auto |
| **`<motion.div initial={{opacity:0}} animate={{opacity:1}}>`** | **0 → 1** (may never reach 1) | visible | auto |
| `<motion.button>` | 1 | hidden | auto |

**Cause**: Parent `motion.div` starts at `opacity: 0`. If `animate` does not run correctly (hydration, timing, or Framer Motion quirk), it remains at 0 and hides the button.

---

## 5. Root Cause

**Exact property**: Parent `motion.div` `initial={{ opacity: 0 }}` — if the `animate` transition does not complete (e.g. hydration, `delay: 0.4`, or remount), the wrapper stays at `opacity: 0` and the button is invisible.

---

## 6. 1-Line Fix

**File:** `src/components/landing/CTASection.tsx` — L67

**Option A — Skip initial (render at full opacity immediately):**
```diff
-          initial={{ opacity: 0, scale: 0.9 }}
+          initial={false}
           animate={{ opacity: 1, scale: 1 }}
```

**Option B — Use a plain div (no animation):**
```diff
-        <motion.div
-          initial={{ opacity: 0, scale: 0.9 }}
-          animate={{ opacity: 1, scale: 1 }}
-          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
-          className="flex justify-center"
-        >
+        <div className="flex justify-center">
```
(and change closing `</motion.div>` to `</div>`)

**Option C — Force opacity via className (may not override Framer inline):**
```diff
-          className="flex justify-center"
+          className="flex justify-center opacity-100"
```
*(Note: Framer Motion inline styles usually override classes — Option A or B preferred.)*

---

**Recommended:** Option A (`initial={false}`) — keeps animation but prevents starting invisible.

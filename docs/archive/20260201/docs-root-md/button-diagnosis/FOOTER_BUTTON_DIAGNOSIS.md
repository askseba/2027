# Homepage Cards Button Diagnosis — "تشتري عطر ولا يعجبك؟"

## 1. LOCATION

| Item | Value |
|------|-------|
| **Page** | `src/app/page.tsx` — HomePage renders `QuestionsSection` (line 9) |
| **Component** | `src/components/landing/QuestionsSection.tsx` |
| **Section** | Cards section (3 cards, no separate button below) |
| **"Button"** | First card = `motion.div` styled as clickable (`cursor-pointer`) displaying "تشتري عطر ولا يعجبك؟" |
| **Text element** | `<p>` at **lines 66–68** |

---

## 2. BUTTON JSX (Code)

```66:68:src/components/landing/QuestionsSection.tsx
              <p className="relative z-10 text-[15px] font-medium text-dark-brown md:text-[17px]">
                {question}
              </p>
```

**Card wrapper (lines 52–72):**

```52:72:src/components/landing/QuestionsSection.tsx
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5, ... }}
              className="group relative w-[95%] max-w-[600px] cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-white/70 px-8 py-5 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl md:w-[90%]"
            >
              {/* Shimmer effect */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent ..." />
              <p className="relative z-10 text-[15px] font-medium text-dark-brown md:text-[17px]">
                {question}
              </p>
              <div className="absolute inset-0 rounded-2xl opacity-0 ring-2 ring-gold/50 ..." />
            </motion.div>
```

- **Content:** Text comes from `{question}` (first item: "تشتري عطر ولا يعجبك؟").
- **Interactivity:** No `onClick` or `href`; cards are visual only, despite `cursor-pointer`.

---

## 3. AUDIT FINDINGS

| Check | Result |
|-------|--------|
| **Button JSX text content** | Present — `{question}` renders "تشتري عطر ولا يعجبك؟" |
| **opacity-0 / invisible** | No — no opacity hiding the text |
| **text-transparent / color-transparent** | No |
| **font-size-0** | No — `text-[15px]` / `md:text-[17px]` |
| **hidden / sr-only / absolute off-screen** | No |
| **Conditional render (useState/useEffect)** | No — text always rendered |
| **RTL text-direction** | OK — `dir="rtl"` on layout |
| **Dark mode** | Problem — `text-dark-brown` has no `dark:` variant |

---

## 4. ROOT CAUSE

**Dark mode: `text-dark-brown` without `dark:` override**

- `text-dark-brown` → `#5B4233` (dark brown)
- In dark theme, when backgrounds are dark (or close to dark), this color blends in and becomes effectively invisible
- `QuestionsSection` has no dark mode styles (per `DARK_MODE_DIAGNOSTIC_REPORT.md`, `component_dependency_audit.md`)
- Card background `bg-white/70` has no `dark:` variant; in dark mode it can render very dark or low-contrast
- Result: dark brown text on dark background → invisible text

---

## 5. COMPUTED CSS (DevTools)

Expected in **light mode**:

- `color: rgb(91, 66, 51)` (#5B4233)
- `opacity: 1`
- `visibility: visible`
- `font-size: 15px` (17px on md+)

Expected in **dark mode** (without fix):

- Same `color: rgb(91, 66, 51)` — unchanged
- Same opacity/visibility — but low contrast against dark background
- Text may appear invisible or almost invisible

---

## 6. FIX PREDICTION (1 line)

**File:** `src/components/landing/QuestionsSection.tsx` — line 66  

**Change:** add a dark-mode text color:

```diff
- <p className="relative z-10 text-[15px] font-medium text-dark-brown md:text-[17px]">
+ <p className="relative z-10 text-[15px] font-medium text-dark-brown dark:text-text-primary md:text-[17px]">
```

**Optional (for better dark card contrast):**

- Add `dark:bg-surface/80` (or similar) to the card `className` on line 60 if the card background is too dark.

---

## 7. SUMMARY

| Issue | Severity | Location | Fix complexity |
|-------|----------|----------|----------------|
| Missing `dark:` text color on question cards | High | `QuestionsSection.tsx` L66 | Low (1 line) |
| Cards styled as buttons but not clickable | Low | `QuestionsSection.tsx` L52–72 | Medium (add Link/onClick) |

**Summary:** 1 high-risk issue before restructure — dark mode text invisibility on the first (and all) question cards.

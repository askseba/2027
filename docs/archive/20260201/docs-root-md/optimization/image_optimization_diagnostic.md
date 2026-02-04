# 📸 Image Optimization Diagnostic Report

**Date:** January 29, 2026  
**Project:** f9-new-optimized (Ask Seba)  
**Analysis Duration:** ~50 minutes

---

## Executive Summary

**Current State:**
- **Total images (public):** 13 files, **231 KB** (~0.23 MB)
- **next/image usage:** 100% (no native `<img>` in src)
- **Critical issues:** 2 (missing LCP priority on hero perfume; missing placeholder-user.png)
- **Performance impact:** Low–Moderate (LCP can improve; CLS risk low)

**Optimization Potential:**
- **Size reduction:** Limited (~15–25% on remaining PNGs via WebP/AVIF via Next.js)
- **LCP improvement:** ~100–300 ms (add `priority` + `sizes` on hero perfume)
- **CLS fix:** Already good (explicit dimensions / aspect containers)
- **Effort:** 2–4 hours (Phase 1 critical; Phase 2/3 optional)

**Recommendation:** **Proceed** — Fix LCP hero image and add missing placeholder; then optional format/advanced tweaks.

---

## Task 1: Image Inventory ✅

### File System Analysis

**Image Location(s):**

```
public/
├── (root)           ← all images (no subfolders)
│   ├── 1769558369917_logo.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── perfume_transparent.webp
│   ├── pwa-192.png
│   ├── pwa-512.png
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│   ├── placeholder-perfume.svg
│   └── (no images/ or perfumes/ subfolders)
```

**Dynamic/External images (not in public):**  
- Perfume images: `src/lib/data/perfumes.ts` uses Unsplash URLs; API/Fragella/Cloudinary used at runtime. All served via next/image with `remotePatterns` in next.config ✅  

**Total Image Count (public):** 13 files

**Breakdown by Type:**

| Type     | Count | Total Size |
|----------|-------|------------|
| PNG      | 6     | ~194 KB    |
| WebP     | 1     | 33.45 KB   |
| SVG      | 6     | ~3.7 KB    |
| JPG/JPEG | 0     | —          |
| GIF      | 0     | —          |

**Total Image Size:**
- **Total:** 231 KB (~0.23 MB)
- **Average per image:** ~17.8 KB
- **Largest folder:** public (root) — 231 KB

---

### Top 15 Largest Images

| # | File | Size | Dimensions | Format | Issue |
|---|------|------|------------|--------|-------|
| 1 | pwa-512.png | 73.33 KB | 512×512 | PNG | PWA icon; already optimized (per prior report) |
| 2 | pwa-192.png | 49.25 KB | 192×192 | PNG | PWA icon; consider WebP for non-manifest use |
| 3 | apple-touch-icon.png | 43.41 KB | — | PNG | Acceptable for touch icon |
| 4 | perfume_transparent.webp | 33.45 KB | — | WebP | ✅ LCP candidate; add priority + sizes |
| 5 | 1769558369917_logo.png | 25.35 KB | — | PNG | ✅ Already optimized (per prior report) |
| 6 | favicon-32x32.png | 1.86 KB | 32×32 | PNG | ✅ Small |
| 7 | next.svg | 1.34 KB | — | SVG | ✅ Small |
| 8 | globe.svg | 1.01 KB | — | SVG | ✅ Small |
| 9 | favicon-16x16.png | 0.67 KB | 16×16 | PNG | ✅ Small |
| 10 | placeholder-perfume.svg | 0.46 KB | — | SVG | ✅ Small |
| 11 | file.svg | 0.38 KB | — | SVG | ✅ Small |
| 12 | window.svg | 0.38 KB | — | SVG | ✅ Small |
| 13 | vercel.svg | 0.12 KB | — | SVG | ✅ Small |

---

### Format Analysis

**JPG Images:**
- Count: 0  
- No JPG in public.

**PNG Images:**
- Count: 6  
- Total size: ~194 KB  
- Average: ~32 KB  
- Issues:
  - [ ] pwa-512, pwa-192, apple-touch-icon: keep PNG for compatibility (PWA/manifest)
  - [ ] Logo: already optimized (report says WebP content with .png extension)
  - [ ] Favicons: acceptable size

**WebP Images:**
- Count: 1 (perfume_transparent.webp)
- Status: ✅ Already using WebP for main hero asset

**SVG Images:**
- Count: 6  
- Total size: ~3.7 KB  
- Status: Small; optional SVGO minification later

**GIF Images:**
- Count: 0  
- No GIFs.

---

### Critical Issues Identified

**🚨 High Priority:**
- [ ] **1** LCP candidate (hero perfume) without `priority` and without `sizes`
- [ ] **1** missing asset: `/placeholder-user.png` referenced in profile + dashboard (404 risk)

**⚠️ Medium Priority:**
- [ ] Hero perfume: add `sizes` for responsive srcset
- [ ] Profile/Dashboard avatar fallback: add `placeholder-user.png` or use inline/placeholder

**✅ Low Priority:**
- [ ] 11 small images <75 KB (acceptable)
- [ ] Icons/SVGs already light

---

### Estimated Savings Potential

**Current total (public):** 231 KB  

**If further optimized:**
- Next.js already serves AVIF/WebP from config; no manual conversion needed for static imports.
- Possible manual pre-optimization of pwa-192 / apple-touch-icon: ~20–30 KB saved (optional).
- **Total potential savings:** ~20–50 KB (~10–20%) — **low impact** due to already small asset set.

**Bandwidth impact:**
- Homepage (hero): logo ~25 KB + perfume ~33 KB ≈ **58 KB** above-fold (good).
- With `priority` on perfume: same size, faster discovery → **LCP improvement**, not size reduction.

---

## Task 2: Next.js Image Usage Analysis ✅

### Component Usage Statistics

**next/image Import:**
- Files using next/image: **8** files (excluding .backup / .old)
- Total Image components: **~12** instances (including SmartImage, dashboard placeholder, quiz cards)
- Usage rate: **100%** (no `<img>` in src)

**Native `<img>` Tags:**
- Files using `<img>`: **0**
- Total `<img>` tags: **0**
- ⚠️ Should be converted: **N/A** — none found

**Distribution:**

```
next/image:  12 (100%)  ████████████████████
<img> tags:   0 (0%)    
```

---

### Image Component Configuration Quality

**Proper usage examples**

```tsx
// HeroSection.tsx - Logo (priority, dimensions)
<Image 
  src="/1769558369917_logo.png" 
  alt="Ask Seba"
  width={180}
  height={72}
  priority
  className="mx-auto"
/>

// PerfumeCard.tsx - fill + aspect + sizes + priority/lazy
<div className="relative aspect-[4/5] w-full ...">
  <Image
    src={...}
    alt={displayName}
    fill
    className="object-contain ..."
    priority={priority}
    loading={priority ? undefined : "lazy"}
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
</div>
```

**Improper / improvable usage**

```tsx
// HeroSection.tsx - Perfume (LCP candidate): missing priority + sizes
<Image
  src="/perfume_transparent.webp"
  alt="Perfume Bottle"
  width={280}
  height={400}
  // ❌ Missing: priority (likely LCP)
  // ❌ Missing: sizes
  className="..."
/>

// profile/page.tsx & dashboard/page.tsx - Fallback 404
<Image 
  src={session?.user?.image || '/placeholder-user.png'}  // ❌ placeholder-user.png not in public
  alt="Profile" 
  fill 
  className="object-cover"
  // ⚠️ No sizes (acceptable for fixed 32×32 container)
/>
```

---

### next.config Image Settings

```typescript
// next.config.ts (excerpt)
images: {
  remotePatterns: [
    { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
    { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
    { protocol: "https", hostname: "ask.seba", pathname: "/**" },
    { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    { protocol: "https", hostname: "api.fragella.com", pathname: "/**" },
    { protocol: "https", hostname: "*.fragella.com", pathname: "/**" },
  ],
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Remote images:**  
- External domains: Unsplash, Google (avatar), Vercel Blob, Cloudinary, Fragella, ask.seba  
- Configuration: ✅ `remotePatterns` used (not deprecated `domains`)

---

### Critical Image Components Audit

**Hero / Landing:**
- Component: `src/components/landing/HeroSection.tsx`
- Implementation: next/image ✅  
- Logo: priority ✅, width/height ✅, sizes missing (acceptable for fixed 180×72)  
- Perfume: **priority missing** ❌, **sizes missing** ❌, width/height ✅  
- Issues: Hero perfume is likely LCP; add `priority` and `sizes`.

**Product / Perfume images:**
- Components: `PerfumeCard.tsx`, `PerfumeGrid.tsx`, quiz SelectedPerfumeCard, dashboard placeholder
- Implementation: next/image ✅  
- PerfumeCard: fill + aspect-[4/5], sizes, priority prop, lazy ✅  
- PerfumeGrid: fill + aspect-[3/4], sizes ✅  
- Quiz cards: fill + fixed 80×80, loading="lazy" ✅  
- Issues: None critical. Dashboard uses `/placeholder-perfume.svg` ✅ (exists).

**Profile / Dashboard avatar:**
- Components: `src/app/profile/page.tsx`, `src/app/dashboard/page.tsx`
- Fallback: `/placeholder-user.png` — **file not in public** → 404 when user has no image.

**Background images:**
- CSS `background-image` / image URLs: **0** in src.

---

### Issues by Priority

**🚨 Critical:**
- [x] **1** LCP candidate (hero perfume) without `priority`
- [x] **1** missing asset: `placeholder-user.png` (404 on profile/dashboard when no avatar)

**⚠️ Medium:**
- [ ] **1** hero perfume without `sizes` (responsive srcset)
- [ ] Profile/Dashboard Image: no `sizes` (low impact for fixed avatar)

**✅ Low:**
- [ ] Blur placeholder not used (optional)
- [ ] Quality not explicitly set (Next.js default 75 is fine)

---

### Conversion Checklist

**Native `<img>` → next/image:**  
- To convert: **0**  
- All images already use next/image.

**Estimated effort:**  
- LCP + placeholder fix: **~1 hour**  
- Optional sizes/quality/blur: **~30 min**

---

## Task 3: Performance Impact Analysis ✅

### LCP (Largest Contentful Paint) Analysis

**LCP image identified:**
- **File:** `/perfume_transparent.webp`  
- **Location:** `src/components/landing/HeroSection.tsx` (hero bottle)  
- **Size:** 33.45 KB  
- **Dimensions (rendered):** 280×400 px  
- **Format:** WebP ✅  

**LCP image configuration:**
- [x] next/image ✅  
- [ ] **priority** ❌ (not set → not preloaded)  
- [ ] **sizes** ❌ (missing → default srcset)  
- [x] width/height ✅ (280×400)

**Estimated LCP impact:**

| Metric        | Current     | Optimized (with priority + sizes) |
|---------------|------------|-----------------------------------|
| Image size    | 33.45 KB   | 33.45 KB (unchanged)              |
| Load time 3G  | ~45 ms     | ~45 ms                            |
| Discovery     | Normal     | Preloaded → **faster LCP**        |
| Improvement   | —          | **~100–300 ms** (earlier discovery) |

---

### CLS (Cumulative Layout Shift) Risk

**Images without dimensions:**  
- All `next/image` usages either have explicit `width`/`height` or `fill` inside fixed/aspect containers ✅  
- **Count of risky images:** 0  
- **Risk level:** **Low** ✅  

**Containers:**
- Hero: fixed width/height 280×400 ✅  
- PerfumeCard: `aspect-[4/5]` + fill ✅  
- PerfumeGrid: `aspect-[3/4]` + fill ✅  
- Profile/Dashboard: `w-32 h-32` / `w-24 h-24` / `w-20 h-20` + fill ✅  

**Estimated CLS:** Already good; no change required for CLS.

---

### Bandwidth & Loading Performance

**Current homepage (above-fold):**
- Logo: ~25 KB  
- Perfume: ~33 KB  
- **Total initial (images):** ~58 KB  

**After optimization (same assets, better behavior):**
- Same sizes; hero perfume preloaded → faster LCP.  
- Optional: blur placeholder for perfume (UX, not bandwidth).

**External/dynamic images:**
- Perfume data: Unsplash, Fragella API, etc. — optimized via next/image + remotePatterns.  
- Avatar: session?.user?.image or fallback; fix fallback to avoid 404.

---

### Mobile (3G) Simulation

- **Assumption:** 750 KB/s, 400 ms RTT  
- **Hero images:** 58 KB → ~80 ms transfer (+ RTT)  
- **Optimized:** Same size; `priority` reduces LCP by improving discovery order.

---

### Core Web Vitals Impact (Estimated)

| Metric | Current   | After Phase 1   | Improvement   |
|--------|-----------|-----------------|---------------|
| **LCP** | ~2.0–2.8 s | ~1.7–2.4 s      | ~100–300 ms   |
| **CLS** | <0.1     | <0.1           | —             |
| **FCP** | —         | —               | Slight (preload) |

**Overall:** Before: Good; After: **Good+** (LCP-focused).

---

## Task 4: Optimization Strategy ✅

### Current State Summary

**Image setup:**
- Total images (public): **13** files (**231 KB**)  
- next/image usage: **100%** ✅  
- Native `<img>`: **0%**  
- Formats: PNG ~84%, WebP ~14%, SVG ~2% (by size).

**Performance impact:**
- LCP: **Partially** (hero perfume not prioritized)  
- CLS risk: **Low** ✅  
- Page weight (images): **Light** (~58 KB above-fold) ✅  

**Critical issues:**  
- 🚨 **2** (LCP priority, missing placeholder)  
- ⚠️ **1** (sizes on hero)  
- ✅ Rest: minor/optional  

---

### Optimization Strategy

**Approach:** **Focused** — fix LCP and missing asset; keep optional phases for later.

**Recommended stack:**

```javascript
{
  "imageOptimization": "next/image (existing)",
  "formats": ["image/avif", "image/webp"],
  "tools": ["Next.js built-in Sharp", "optional: squoosh-cli for PWA icons"],
  "CDN": "Vercel Image Optimization (if on Vercel)"
}
```

**Why:**  
1. next/image already in use with AVIF/WebP and remotePatterns.  
2. Main gains: LCP (priority + sizes) and fixing 404 (placeholder-user).  
3. Pre-compression of remaining PNGs is optional (small total size).

---

### Implementation Phases

#### Phase 1: Critical Fixes (High Priority, ~1–1.5 h)

**1.1 Fix LCP image (hero perfume) — ~15 min**

```tsx
// File: src/components/landing/HeroSection.tsx
// Current:
<Image
  src="/perfume_transparent.webp"
  alt="Perfume Bottle"
  width={280}
  height={400}
  className="..."
/>

// Optimized:
<Image
  src="/perfume_transparent.webp"
  alt="Perfume Bottle"
  width={280}
  height={400}
  priority
  sizes="(max-width: 768px) 280px, 400px"
  className="..."
/>
```

- [ ] Add `priority`  
- [ ] Add `sizes`  
- [ ] Re-run Lighthouse / LCP check  

**Expected impact:** LCP **~100–300 ms** better.

---

**1.2 Add missing placeholder-user asset — ~15 min**

- Option A: Add `public/placeholder-user.png` (e.g. generic avatar, &lt;10 KB).  
- Option B: Use data URI or inline SVG placeholder in code.  
- Update references: `src/app/profile/page.tsx`, `src/app/dashboard/page.tsx` (no code change if file added).

- [ ] Create or choose placeholder  
- [ ] Place in `public/` or switch to data URI  
- [ ] Verify no 404 when user has no image  

**Expected impact:** No 404; better UX on profile/dashboard.

---

**1.3 Optional: Hero logo `sizes`**

- Logo is fixed 180×72; `sizes="180px"` is optional for consistency.

---

#### Phase 2: Format / Asset Tweaks (Optional, ~1–2 h)

**2.1 PWA / touch icons**

- Consider WebP versions for contexts that support it (e.g. non-manifest); keep PNG for manifest/favicon where required.  
- Or run squoosh-cli on pwa-192 / apple-touch-icon for smaller PNG.  

**2.2 next.config**

- Already has `formats: ['image/avif', 'image/webp']` and sensible deviceSizes/imageSizes.  
- Optional: `minimumCacheTTL` for remote images if needed.

**2.3 Resize**

- No oversized assets in public; dynamic/remote images are handled by next/image.

---

#### Phase 3: Advanced (Optional, ~30 min)

**3.1 Blur placeholder for hero perfume**

- Generate blurDataURL for `/perfume_transparent.webp` and add `placeholder="blur"` to reduce layout/visual pop.

**3.2 SVGO**

- Run SVGO on `public/*.svg` for minor size reduction.

**3.3 Responsive `sizes`**

- Already set on PerfumeCard, PerfumeGrid; hero perfume covered in Phase 1.

---

### Expected Results

**Before optimization:**  
- Total images: 231 KB  
- LCP: ~2.0–2.8 s (hero perfume not prioritized)  
- CLS: &lt;0.1 ✅  
- Placeholder-user: 404 when no avatar  

**After Phase 1:**  
- LCP: **~100–300 ms** improvement ✅  
- No 404 on profile/dashboard ✅  

**After Phase 2/3:**  
- Slight size reduction on PWA/icons; better UX with blur (optional).

---

### Files to Modify

**High priority:**  
1. `src/components/landing/HeroSection.tsx` — add `priority` + `sizes` to perfume Image.  
2. Add `public/placeholder-user.png` (or equivalent).

**Medium (optional):**  
3. `next.config.ts` — optional cache/format tweaks.  
4. PWA/icons — optional re-export as WebP or smaller PNG.

**Total:** 1–2 files for Phase 1; 2–4 if doing optional phases.

---

### Risk Assessment

**Low risk:**  
- Adding `priority` and `sizes` (non-breaking).  
- Adding placeholder-user asset.

**Medium risk:**  
- None for Phase 1.

**Mitigation:**  
- Test homepage LCP and profile/dashboard after changes.  
- Keep existing logo priority as-is (both logo and perfume can have priority if needed).

---

### Implementation Checklist

**Phase 1 (do first):**  
- [ ] Add `priority` to hero perfume Image  
- [ ] Add `sizes` to hero perfume Image  
- [ ] Add or fix `placeholder-user` asset  
- [ ] Measure LCP (e.g. Lighthouse) before/after  

**Phase 2 (optional):**  
- [ ] Optional PWA/icon optimization  
- [ ] Optional next.config cache  

**Phase 3 (optional):**  
- [ ] Blur placeholder for hero  
- [ ] SVGO on SVGs  

---

### Success Metrics

**Targets:**  
- LCP: &lt;2.5 s (goal &lt;2.0 s)  
- CLS: &lt;0.1  
- No 404 for placeholder-user  
- Image payload: already &lt;500 KB ✅  

**Checks:**  
- [ ] No visual regression  
- [ ] No broken images  
- [ ] No new layout shifts  

---

### Tools & Resources

- **Testing:** Lighthouse (Chrome DevTools), PageSpeed Insights  
- **Docs:** [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image), [web.dev Images](https://web.dev/fast/#optimize-your-images)  
- **Optional:** Squoosh (squoosh.app), SVGO  

---

## Quick Start Guide

**Immediate steps:**  
1. **Phase 1.1:** In `HeroSection.tsx`, add `priority` and `sizes` to the perfume `<Image>`.  
2. **Phase 1.2:** Add `public/placeholder-user.png` (or data URI) and confirm profile/dashboard no longer 404.  
3. Re-test LCP and Core Web Vitals.

**Timeline:**  
- Phase 1: **1–1.5 hours** (recommended now).  
- Phase 2–3: **1–2 hours** (optional, later).

---

**Report Status:** ✅ Complete and ready for implementation.

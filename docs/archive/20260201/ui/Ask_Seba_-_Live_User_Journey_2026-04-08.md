# Ask Seba Live User Journey (Repository Reflection)

## Last verified date
2026-04-08

## Version
`0.1.0`  
Evidence: `package.json`

## Scope of verification
This document reflects repository state only, based on audited files in:
- `src/app/[locale]/**`
- `src/app/layout.tsx`
- `src/app/api/**` endpoints used by journey pages/components
- `src/components/**` components rendered by journey pages
- `src/lib/**` and `src/i18n/**` files referenced by those flows
- `prisma/schema.prisma` and related Prisma scripts
- `messages/ar.json`, `messages/en.json`
- runtime config/assets: `package.json`, `next.config.ts`, `tsconfig.json`, `public/**` (relevant runtime files), and selected `scripts/**`

## Application structure (layout, providers, i18n)

### Root + locale layout
- Root layout file: `src/app/layout.tsx`
  - Renders `<html>` and `<body>`.
  - Resolves locale from header `x-next-intl-locale` or `getLocale()`.
  - Loads messages from `messages/${locale}.json`.
  - Wrap stack includes: `ThemeProvider`, `PostHogProviderWrapper`, `ErrorBoundary`, `SessionProvider`, `QuizProvider`, `NextIntlClientProvider`, `ConditionalLayout`, `Toaster`, `NetworkStatusToast`, `PWARegister`, `SentryLazyExtras`.
- Locale layout file: `src/app/[locale]/layout.tsx`
  - Validates locale against `routing.locales`.
  - Calls `setRequestLocale(locale)`.
  - Wraps children with `NextIntlClientProvider`.

### i18n routing/config
- `src/i18n/routing.ts`: locales `ar`, `en`; default `ar`; `localePrefix: 'always'`.
- `src/i18n/request.ts`: loads `messages/${locale}.json` and returns `{ locale, messages }`.

## User journey by route/page

### 1) Home
- URL pattern: `/{locale}`
- File: `src/app/[locale]/page.tsx`
- Components used:
  - `HeroSection`, `QuestionsSection`, `StatsSection`, `ValuePropSection`, `BenefitsSection`, `HeadlineSection`, `CTASection`
  - Files under `src/components/landing/*.tsx`
- Translation namespace:
  - metadata from `home` in page file
  - section-level namespaces in components (`home`, `home.questions`, `home.benefits`, `home.cta`)
- Auth/gating: none in page file
- Key interactions:
  - CTA route push to `/quiz/step1-favorites` via `@/i18n/routing` router in `src/components/landing/CTASection.tsx`

### 2) Login
- URL pattern: `/{locale}/login`
- File: `src/app/[locale]/login/page.tsx`
- Components used:
  - `Input`, `Button`, `BackButton`, `LoadingSpinner`
- Translation namespace: `auth`
- Auth/gating:
  - Sign-in flows via `next-auth` (`credentials`, `google`)
- Key interactions:
  - Credentials submit with client validation
  - Google sign-in
  - Redirect to callback URL on success
  - "forgot password" currently rendered as non-link text

### 3) Register
- URL pattern: `/{locale}/register`
- File: `src/app/[locale]/register/page.tsx`
- Components used:
  - `Input`, `Button`, `BackButton`
- Translation namespace: `auth`
- Auth/gating:
  - Calls `POST /api/auth/register`
  - Auto-sign-in after successful registration
- Key interactions:
  - Name/email/password/confirm validation
  - Google sign-in shortcut
  - Redirects to `/dashboard` or `/login?registered=true`

### 4) Quiz Step 1 (Favorites)
- URL pattern: `/{locale}/quiz/step1-favorites`
- File: `src/app/[locale]/quiz/step1-favorites/page.tsx`
- Components used:
  - `Input`, `Button`, `BackButton`, `VoiceMicButton`, `ErrorBoundary`
- Translation namespace: `quiz`
- Auth/gating:
  - No auth requirement in page
  - Uses quiz context (`useQuiz`)
- Key interactions:
  - Debounced search (300ms) to `/api/perfumes/search`
  - Add/remove selected perfumes
  - Next route to `/quiz/step2-disliked` when min selection met
  - Optional voice search when feature flag enabled

### 5) Quiz Step 2 (Disliked)
- URL pattern: `/{locale}/quiz/step2-disliked`
- File: `src/app/[locale]/quiz/step2-disliked/page.tsx`
- Components used:
  - `Input`, `Button`, `BackButton`, `ErrorBoundary`
- Translation namespace: `quiz`
- Auth/gating:
  - No auth requirement in page
  - Uses quiz context (`useQuiz`)
- Key interactions:
  - Debounced search (300ms) to `/api/perfumes/search`
  - Back to step1, next to step3, skip step behavior

### 6) Quiz Step 3 (Allergy)
- URL pattern: `/{locale}/quiz/step3-allergy`
- File: `src/app/[locale]/quiz/step3-allergy/page.tsx`
- Components used:
  - `Step3Allergy`, `LoadingSpinner`, `ErrorBoundary`
  - optional lazy import of `Step3Allergy` based on feature flag
- Translation namespace: `quiz`
- Auth/gating:
  - Step guard via `useQuizStepGuard(3)` in `src/hooks/useQuizStepGuard.ts`
- Key interactions:
  - Collect symptoms/families/ingredients and route to `/results`

### 7) Results
- URL pattern: `/{locale}/results`
- File: `src/app/[locale]/results/page.tsx`
- Components used:
  - `ResultsContent` (`src/components/results/ResultsContent.tsx`)
  - includes cards, compare bottom sheet, ingredients sheet, match sheet, upsell blocks
- Translation namespace: `results`
- Auth/gating:
  - Calls `POST /api/match`; result includes tier-based payload (`tier`, `blurredItems`)
- Key interactions:
  - Load scored perfumes
  - Compare mode selection and sheet
  - Price-hub mode per perfume

### 8) Pricing
- URL pattern: `/{locale}/pricing`
- File: `src/app/[locale]/pricing/page.tsx` (delegates to `src/app/pricing/page.tsx`)
- Components used:
  - pricing UI in `src/app/pricing/page.tsx`
- Translation namespace:
  - uses `nav` in pricing page
- Auth/gating:
  - If not authenticated: `signIn()`
  - If authenticated: creates checkout via `/api/payment/create-checkout`
- Key interactions:
  - Plan selection monthly/yearly
  - Recovery prefill via query `recover` and `/api/checkout-session/[recoverId]`

### 9) Pricing Success
- URL pattern: `/{locale}/pricing/success`
- File: `src/app/[locale]/pricing/success/page.tsx` (delegates to `src/app/pricing/success/page.tsx`)
- Components used:
  - success UI in `src/app/pricing/success/page.tsx`
- Translation namespace: none in file
- Auth/gating:
  - Validates payment/subscription through `/api/user/subscription/[externalId]`
- Key interactions:
  - Reads `paymentId` from query
  - Redirects to pricing with error when unconfirmed

### 10) Profile
- URL pattern: `/{locale}/profile`
- File: `src/app/[locale]/profile/page.tsx`
- Components used:
  - `BackButton`, `Button`, `Input`, `DeleteAccountDialog`, `VaultEntryCard`
- Translation namespace: `profile`, `common`
- Auth/gating:
  - Session required for full profile view
  - Calls `/api/user/tier` for subscription state
- Key interactions:
  - Displays tier info
  - Sign-out action
  - Vault entry card with premium gating

### 11) Settings
- URL pattern: `/{locale}/settings`
- File: `src/app/[locale]/settings/page.tsx`
- Components used:
  - `Button`, icon-only/settings-specific UI
- Translation namespace: `settings`, `common`
- Auth/gating:
  - Uses session data if available
  - Sign-out callback scoped to locale
- Key interactions:
  - Name sheet/dialog UI
  - Notifications toggles UI
  - Delete confirmation UI

### 12) Dashboard
- URL pattern: `/{locale}/dashboard`
- File: `src/app/[locale]/dashboard/page.tsx`
- Components used:
  - `BackButton`, `Button`, `LoadingSpinner`, `ErrorBoundary`, dynamic `RadarChart`
- Translation namespace: `dashboard`
- Auth/gating:
  - Redirects unauthenticated users to `/login`
- Key interactions:
  - Tabbed dashboard sections (overview/favorites/history)

### 13) Favorites
- URL pattern: `/{locale}/favorites`
- File: `src/app/[locale]/favorites/page.tsx`
- Components used:
  - `FavoritesContent` (`src/components/favorites/FavoritesContent.tsx`)
- Translation namespace: `favorites`
- Auth/gating:
  - View behavior differs by session state in `FavoritesContent`
- Key interactions:
  - Back target changes based on auth state
  - Explore action routes to `/results`

### 14) Feedback
- URL pattern: `/{locale}/feedback`
- File: `src/app/[locale]/feedback/page.tsx`
- Components used:
  - `FeedbackCard`, dynamic `FeedbackModal`, dynamic `AdminModal`, `BackButton`, `Button`
- Translation namespace: none for primary static strings in this file
- Auth/gating:
  - Redirects unauthenticated users to `/login`
- Key interactions:
  - Fetch suggestions
  - Submit suggestion
  - Vote updates

### 15) About / FAQ / Privacy
- URL patterns:
  - `/{locale}/about`
  - `/{locale}/faq`
  - `/{locale}/privacy`
- Files:
  - `src/app/[locale]/about/page.tsx`
  - `src/app/[locale]/faq/page.tsx`
  - `src/app/[locale]/privacy/page.tsx`
- Components used:
  - local page compositions with `BackButton`, motion UI, accordion where applicable
- Translation namespaces:
  - `about`, `faq`, `privacy`
- Auth/gating:
  - none in page files
- Key interactions:
  - content rendering from translation structures (`t.raw(...)`)
  - FAQ search filter
  - Privacy section navigation

## New features not in previous document
- Vault entry flow and premium gate:
  - `src/components/account/VaultEntryCard.tsx`
  - `src/app/api/vault/route.ts`
  - integrated in `src/app/[locale]/profile/page.tsx`
- Checkout recovery route and pricing prefill:
  - `src/app/api/checkout-session/[recoverId]/route.ts`
  - `src/app/pricing/page.tsx`
- Subscription verification on success page:
  - `src/app/api/user/subscription/[externalId]/route.ts`
  - `src/app/pricing/success/page.tsx`
- Webhook callback route path currently in repository:
  - `src/app/api/webhooks/moyasar/callback/route.ts`
- Price sync batch/sweep scripts affecting journey data freshness:
  - `scripts/sync-prices.ts`
  - `scripts/run-full-sweep.sh`
  - related validation scripts in `scripts/check-*.ts`

## API endpoints referenced in the journey
- `GET|POST /api/perfumes/search`
  - File: `src/app/api/perfumes/search/route.ts`
- `POST /api/match`
  - File: `src/app/api/match/route.ts`
- `POST /api/auth/register`
  - File: `src/app/api/auth/register/route.ts`
- `GET|POST /api/feedback/suggestions`
  - File: `src/app/api/feedback/suggestions/route.ts`
- `POST /api/feedback/suggestions/[id]/vote`
  - File: `src/app/api/feedback/suggestions/[id]/vote/route.ts`
- `GET /api/user/tier`
  - File: `src/app/api/user/tier/route.ts`
- `GET /api/vault`
  - File: `src/app/api/vault/route.ts`
- `POST /api/payment/create-checkout`
  - File: `src/app/api/payment/create-checkout/route.ts`
- `GET|PATCH /api/checkout-session/[recoverId]`
  - File: `src/app/api/checkout-session/[recoverId]/route.ts`
- `GET /api/user/subscription/[externalId]`
  - File: `src/app/api/user/subscription/[externalId]/route.ts`
- `POST /api/webhooks/moyasar/callback`
  - File: `src/app/api/webhooks/moyasar/callback/route.ts`

## Data model (Prisma models relevant to journey)
Evidence: `prisma/schema.prisma`

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `UserPreference`
- `UserFavorite`
- `Perfume`
- `Store`
- `Price`
- `FragellaPerfume`
- `FragellaCache`
- `Suggestion`
- `Vote`
- `IfraMaterial`
- `SymptomIngredientMapping`
- `PerfumeIngredient`
- `PriceAlert`
- `Subscription`
- `TestHistory`
- `ConversionEvent`
- `CheckoutSession`
- `UserVault`
- `VaultPerfume`

## i18n namespace inventory
Top-level keys in `messages/ar.json` and `messages/en.json`:
- `nav`
- `auth`
- `settings`
- `profile`
- `favorites`
- `notFound`
- `home`
- `about`
- `faq`
- `quiz`
- `privacy`
- `footer`
- `results`
- `dashboard`
- `common`
- `errorBoundary`
- `vault`

Vault namespace exists in both locale files.

## Items not verifiable from repository alone
- Production readiness level.
- Numerical quality/completion scores.
- Lighthouse/performance benchmark outcomes as operational truth.
- Deployment state and runtime environment health.
- User counts/satisfaction/conversion outcomes.
- Security guarantees stated as organizational/process claims.

For all items above: **Cannot verify from repository alone**

## Changelog vs previous document version
- Removed unsupported metrics, completion percentages, and benchmark claims.
- Replaced legacy endpoint references with current repository paths.
- Replaced narrative/milestone marketing sections with code-traceable route and architecture mapping.
- Added currently implemented vault, checkout recovery, and webhook callback coverage.
- Normalized language to factual repository reflection.

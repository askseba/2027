export const voiceSearchEnabled = process.env.NEXT_PUBLIC_VOICE_SEARCH_ENABLED === 'true';

/**
 * Feature Flags for Code Splitting (Manus V4 - Day 1)
 * يقرأ من process.env.NEXT_PUBLIC_... مع دعم التراجع الطارئ عبر localStorage
 */

// Flags الأساسية المطلوبة للأسبوع الأول
export const FLAGS = {
  /** PriceComparisonTable Lazy Load */
  LAZY_PRICE_TABLE: process.env.NEXT_PUBLIC_LAZY_PRICE_TABLE === 'true',

  /** Step3Allergy Route Lazy Load */
  LAZY_STEP3_ALLERGY: process.env.NEXT_PUBLIC_LAZY_STEP3_ALLERGY === 'true',

  /** PostHog Defer Init */
  DEFER_POSTHOG: process.env.NEXT_PUBLIC_DEFER_POSTHOG === 'true',

  /** Sentry Extras Defer (Replay/Tracing) */
  DEFER_SENTRY_EXTRAS: process.env.NEXT_PUBLIC_DEFER_SENTRY_EXTRAS === 'true',
} as const;

export type FeatureFlag = keyof typeof FLAGS;

/**
 * التحقق من تفعيل Flag مع دعم التراجع الطارئ عبر localStorage
 * @param flag - اسم الـ Flag
 * @returns boolean - هل الـ Flag مفعل؟
 */
export function isLazyEnabled(flag: FeatureFlag): boolean {
  if (typeof window === 'undefined') {
    return FLAGS[flag];
  }

  // التراجع الطارئ: تعطيل كل الـ Lazy
  const emergencyDisable = window.localStorage.getItem('DISABLE_LAZY');
  if (emergencyDisable === 'true') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[FeatureFlags] Emergency disable active for: ${flag}`);
    }
    return false;
  }

  // تعطيل Flag محدد
  const specificDisable = window.localStorage.getItem(`DISABLE_LAZY_${flag}`);
  if (specificDisable === 'true') {
    return false;
  }

  // Override محلي (للتجربة)
  const override = window.localStorage.getItem(`OVERRIDE_${flag}`);
  if (override === 'true') return true;
  if (override === 'false') return false;

  return FLAGS[flag];
}

/**
 * تفعيل/تعطيل Flag في Runtime (للتجربة فقط)
 */
export function setLazyOverride(flag: FeatureFlag, value: boolean): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`OVERRIDE_${flag}`, value.toString());
  }
}

/**
 * قراءة Override محلي إن وُجد
 */
export function getLocalOverride(flag: FeatureFlag): boolean | null {
  if (typeof window === 'undefined') return null;
  const val = window.localStorage.getItem(`OVERRIDE_${flag}`);
  if (val === 'true') return true;
  if (val === 'false') return false;
  return null;
}

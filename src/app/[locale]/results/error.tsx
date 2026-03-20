'use client'

import { useLocale, useTranslations } from 'next-intl'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ResultsError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('results')
  const locale = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-bg dark:!bg-surface gap-6 px-4" dir={direction}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">
          {t('errorMessage')}
        </h2>
        <p className="text-text-secondary dark:text-text-muted mb-6">
          {t('errorDefault')}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent
text-base font-medium rounded-md shadow-sm
text-slate-900 bg-cream-50 hover:bg-cream-100
dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700
focus:outline-none focus:ring-2 focus:ring-offset-2
focus:ring-gold-500"
          >
            {t('retry')}
          </button>
          <Link
            href="/dashboard"
            className="ml-3 inline-flex items-center px-4 py-2
border border-slate-300 text-sm font-medium rounded-md
text-slate-700 bg-white hover:bg-slate-50
dark:border-slate-600 dark:text-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800
focus:outline-none focus:ring-2 focus:ring-offset-2
focus:ring-gold-500"
          >
            {t('backToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}

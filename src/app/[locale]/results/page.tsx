import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { ResultsContent } from '@/components/results/ResultsContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'results' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    robots: { index: false },
  }
}

export default async function ResultsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ResultsContent />
}

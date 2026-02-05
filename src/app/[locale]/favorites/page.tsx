import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { FavoritesContent } from '@/components/favorites/FavoritesContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'favorites' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default async function FavoritesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <FavoritesContent />
}

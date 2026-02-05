import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'quiz.step3' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default function Step3AllergyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

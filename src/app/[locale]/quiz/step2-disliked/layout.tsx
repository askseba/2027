import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'quiz.step2' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default function Step2DislikedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

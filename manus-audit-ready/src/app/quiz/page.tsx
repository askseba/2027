import { Metadata } from 'next'
import { QuizLandingContent } from '@/components/quiz/QuizLandingContent'

export const metadata: Metadata = {
  title: 'اختبار صبا - اكتشف عطرك المثالي',
  description: 'اختبار ذكي يستغرق 3 دقائق فقط لاكتشاف العطور المثالية لك بناءً على تفضيلاتك وحالتك الصحية',
}

export default function QuizPage() {
  return <QuizLandingContent />
}

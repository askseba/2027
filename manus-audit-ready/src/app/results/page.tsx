import { Metadata } from 'next'
import { ResultsContent } from '@/components/results/ResultsContent'

export const metadata: Metadata = {
  title: 'نتائج اختبارك - بصمتك العطرية',
  description: 'اكتشف العطور المثالية لك بناءً على تحليل شخصيتك وتفضيلاتك',
  robots: {
    index: false, // لا نريد فهرسة صفحات النتائج الشخصية
  },
}

export default function ResultsPage() {
  return <ResultsContent />
}

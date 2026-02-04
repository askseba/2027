"use client"
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { isLazyEnabled } from '@/lib/feature-flags'
import dynamic from 'next/dynamic'
import { Step3Allergy, type Step3AllergyProps } from '@/components/quiz/Step3Allergy'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useQuiz } from '@/contexts/QuizContext'
import { useQuizStepGuard } from '@/hooks/useQuizStepGuard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import content from '@/content'

const Step3AllergyLazy = dynamic<Step3AllergyProps>(
  () => import('@/components/quiz/Step3Allergy').then(m => ({ default: m.Step3Allergy })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary dark:border-amber-500" />
      </div>
    ),
  }
)

interface AllergyData {
  level1: string[]
  level2: string[]
  level3: string[]
}

export default function Step3AllergyPage() {
  useQuizStepGuard(3) // Ensure steps 1 and 2 are completed
  const router = useRouter()
  const { data, setStep } = useQuiz()
  const [isPending, startTransition] = useTransition()
  
  // Convert context format to component format
  const [allergy, setAllergy] = useState<AllergyData>(() => ({
    level1: data.step3_allergy?.symptoms || [],
    level2: data.step3_allergy?.families || [],
    level3: data.step3_allergy?.ingredients || []
  }))

  const updateAllergy = (newAllergy: AllergyData) => {
    setAllergy(newAllergy)
    // Update context
    setStep('step3_allergy', {
      symptoms: newAllergy.level1,
      families: newAllergy.level2,
      ingredients: newAllergy.level3
    })
  }

  const handleNext = () => {
    startTransition(() => {
      router.push('/results')
    })
  }

  const handleBack = () => {
    startTransition(() => {
      router.push('/quiz/step2-disliked')
    })
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-cream-bg dark:bg-background" dir="rtl">
      {isPending && (
        <div className="fixed inset-0 bg-cream-bg/80 dark:bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner type={3} message={content.quiz.step3.transitioning} size="lg" />
        </div>
      )}
      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicator - Step 3/3 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-primary dark:bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-primary dark:bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-primary dark:bg-amber-500" />
        </div>

        {/* Step 3 Allergy Component */}
        {isLazyEnabled('LAZY_STEP3_ALLERGY') ? (
          <Step3AllergyLazy
            allergy={allergy}
            updateAllergy={updateAllergy}
            onNext={handleNext}
            onBack={handleBack}
            isPending={isPending}
          />
        ) : (
          <Step3Allergy
            allergy={allergy}
            updateAllergy={updateAllergy}
            onNext={handleNext}
            onBack={handleBack}
            isPending={isPending}
          />
        )}
      </div>
    </div>
    </ErrorBoundary>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuiz } from '@/contexts/QuizContext'
import logger from '@/lib/logger'

/**
 * Hook to guard quiz steps and prevent users from skipping steps
 * Redirects to the appropriate earlier step if required data is missing
 * 
 * @param requiredStep - The current step (1, 2, or 3)
 * @example
 * export default function Step2Page() {
 *   useQuizStepGuard(2) // Ensures step 1 is completed
 *   // ... rest of component
 * }
 */
export function useQuizStepGuard(requiredStep: 1 | 2 | 3) {
  const router = useRouter()
  const { data } = useQuiz()

  useEffect(() => {
    // Step 1 doesn't require any prerequisites
    if (requiredStep === 1) {
      return
    }

    // Step 2 requires at least 3 liked perfumes from step 1
    if (requiredStep >= 2) {
      if (!data.step1_liked || data.step1_liked.length < 3) {
        logger.warn('Quiz Step Guard: Redirecting to step 1 - insufficient liked perfumes')
        router.push('/quiz/step1-favorites')
        return
      }
    }

    // Step 3 requires at least 3 disliked perfumes from step 2
    if (requiredStep >= 3) {
      if (!data.step2_disliked || data.step2_disliked.length < 3) {
        logger.warn('Quiz Step Guard: Redirecting to step 2 - insufficient disliked perfumes')
        router.push('/quiz/step2-disliked')
        return
      }
    }
  }, [requiredStep, data, router])
}

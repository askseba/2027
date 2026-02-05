'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
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
  const { data, isHydrated } = useQuiz()

  useEffect(() => {
    // Step 1 doesn't require any prerequisites
    if (requiredStep === 1) {
      return
    }

    // Don't redirect until context has hydrated from sessionStorage (avoids redirect to step 1 on step 3)
    if (!isHydrated) {
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

    // Step 3 requires step 2 to be "done": either >= 3 disliked OR skipped (0). Don't require 3.
    if (requiredStep >= 3) {
      const disliked = data.step2_disliked ?? []
      const step2Done = disliked.length >= 3 || disliked.length === 0
      if (!step2Done) {
        logger.warn('Quiz Step Guard: Redirecting to step 2 - step 2 incomplete (1–2 selections)')
        router.push('/quiz/step2-disliked')
        return
      }
    }
  }, [requiredStep, data, isHydrated, router])
}

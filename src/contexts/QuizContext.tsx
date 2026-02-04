"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import logger from '@/lib/logger'

interface QuizData {
  step1_liked: string[]
  step2_disliked: string[]
  step3_allergy: {
    symptoms: string[]
    families: string[]
    ingredients: string[]
  }
}

interface QuizContextType {
  data: QuizData
  setStep: <K extends keyof QuizData>(step: K, value: QuizData[K]) => void
  clearQuiz: () => void
  isComplete: boolean
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

const defaultData: QuizData = {
  step1_liked: [],
  step2_disliked: [],
  step3_allergy: {
    symptoms: [],
    families: [],
    ingredients: []
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  // ✅ FIX: Always start with defaultData to match server render (prevents hydration mismatch)
  const [data, setData] = useState<QuizData>(defaultData)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from sessionStorage after mount (client-only, prevents hydration mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('quizData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setData({
            step1_liked: parsed.step1_liked || [],
            step2_disliked: parsed.step2_disliked || [],
            step3_allergy: parsed.step3_allergy || {
              symptoms: [],
              families: [],
              ingredients: []
            }
          })
        } catch (e) {
          logger.error('Failed to load quiz data:', e)
        }
      }
      setIsHydrated(true)
    }
  }, []) // Run once on mount

  // Save to sessionStorage whenever data changes (session persistence)
  // Only save after hydration to avoid unnecessary writes during initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      sessionStorage.setItem('quizData', JSON.stringify(data))
    }
  }, [data, isHydrated])

  const setStep = <K extends keyof QuizData>(step: K, value: QuizData[K]) => {
    setData(prev => ({
      ...prev,
      [step]: value
    }))
  }

  const clearQuiz = () => {
    setData(defaultData)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('quizData')
    }
  }

  const isComplete = 
    data.step1_liked.length >= 3 &&
    data.step2_disliked.length >= 0 && // Optional
    (data.step3_allergy.symptoms.length > 0 ||
     data.step3_allergy.families.length > 0 ||
     data.step3_allergy.ingredients.length > 0)

  return (
    <QuizContext.Provider
      value={{
        data,
        setStep,
        clearQuiz,
        isComplete
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}

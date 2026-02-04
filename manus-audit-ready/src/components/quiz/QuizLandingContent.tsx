'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import content from '@/content'

export function QuizLandingContent() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-surface dark:to-background flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-brown-text dark:text-text-primary mb-6">{content.quiz.title}</h1>
      <p className="text-xl text-brown-text/80 dark:text-text-muted mb-12 max-w-md text-center leading-relaxed">
        {content.quiz.subtitle}
      </p>
      <Button
        variant="primary"
        size="lg"
        href="/quiz/step1-favorites"
        className="bg-gradient-to-r from-primary to-accent-yellow dark:from-amber-600 dark:to-amber-700 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1"
      >
        {content.quiz.startButton}
        <ChevronLeft className="w-6 h-6 mr-2" />
      </Button>
    </div>
  )
}

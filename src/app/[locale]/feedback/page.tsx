'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import FeedbackCard from '@/components/FeedbackCard'
import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/button'
import { safeFetch, validateArray } from '@/lib/utils/api-helpers'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import logger from '@/lib/logger'

const FeedbackModal = dynamic(() => import('@/components/FeedbackModal'), {
  ssr: false,
  loading: () => null
})

const AdminModal = dynamic(() => import('@/components/AdminModal'), {
  ssr: false,
  loading: () => null
})

interface Suggestion {
  id: string
  title: string
  description: string
  publicStatus: 'planned' | 'in_progress' | 'under_review' | 'done'
  votes: number
  hasVoted: boolean
  userId: string
  isMine: boolean
  category: string
}

interface FeedbackResponse {
  suggestions: Suggestion[]
  doneCount: number
}

export default function FeedbackPage() {
  const locale = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const { data: session, status } = useSession()
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [doneCount, setDoneCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSuggestions()
    }
  }, [status])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const response = await safeFetch<FeedbackResponse>('/api/feedback/suggestions')

      if (!response || typeof response !== 'object' || Array.isArray(response)) {
        throw new Error('استجابة غير صحيحة من الخادم')
      }

      const validatedData = response as FeedbackResponse
      const suggestionsArray = validatedData.suggestions
        ? validateArray<Suggestion>(validatedData.suggestions, 'الاقتراحات يجب أن تكون مصفوفة')
        : []

      setSuggestions(suggestionsArray)
      setDoneCount(typeof validatedData.doneCount === 'number' ? validatedData.doneCount : 0)
    } catch (error) {
      logger.error('Error fetching suggestions:', error)
      setSuggestions([])
      setDoneCount(0)
      const errorMessage = error instanceof Error ? error.message : 'تأكد من اتصالك بالإنترنت'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVoteUpdate = (data: { votes: number; hasVoted: boolean; suggestionId: string }) => {
    setSuggestions(prev =>
      prev.map(s =>
        s.id === data.suggestionId
          ? { ...s, votes: data.votes, hasVoted: data.hasVoted }
          : s
      )
    )
  }

  const handleAddSuggestion = async (title: string, description: string, category: string) => {
    if (!title.trim() || !description.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    try {
      const response = await safeFetch<{ success: boolean; suggestion?: unknown; message?: string; error?: string }>(
        '/api/feedback/suggestions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, category }),
        }
      )

      if (response.success) {
        logger.info('Suggestion added:', { suggestion: response.suggestion })
        toast.success(response.message || 'تم إرسال اقتراحك بنجاح! سيتم مراجعته قريباً 🎉')
        setShowAddModal(false)
        fetchSuggestions()
      } else {
        throw new Error(response.error || 'واجهنا مشكلة في حفظ اقتراحك')
      }
    } catch (error) {
      logger.error('Error adding suggestion:', error)
      const errorMessage = error instanceof Error ? error.message : 'تأكد من اتصالك بالإنترنت'
      toast.error(errorMessage)
    }
  }

  const isAdmin = (session?.user as { role?: string })?.role === 'admin' || false

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-bg dark:!bg-surface flex items-center justify-center">
        <div className="text-brand-brown dark:text-text-primary text-xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background/95 dark:!bg-surface p-6" dir={direction}>
      <div className="max-w-2xl mx-auto">
        <BackButton variant="link" className="mb-6" />
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown dark:text-text-primary mb-3 leading-tight">
            ساعدنا نكون أفضل لأجلك
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={doneCount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400/10 to-emerald-400/10 dark:from-green-500/20 dark:to-emerald-500/20
                         text-green-700 dark:text-green-300 border-2 border-green-200/50 dark:border-green-500/40 px-6 py-3 rounded-2xl w-fit mx-auto shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-lg font-bold">
                {doneCount > 0
                  ? `بفضلكم.. ${doneCount} فكرة منكم أصبحت واقعاً! 🏆`
                  : 'لم ننفّذ اقتراحات بعد... كن الأول 💡'}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              size="lg"
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto shadow-lg bg-brand-gold hover:bg-brand-gold-dark dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
            >
              وش ناقصنا؟ 💡
            </Button>
            {isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setShowAdminModal(true)}
                      className="shadow-sm w-full sm:w-auto"
                    >
                      👤 Admin [📋]
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>لوحة المراجعة (للإدارة فقط)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-brand-brown/60 dark:text-slate-300"
            >
              لا توجد اقتراحات حالياً. كن أول من يقترح تحسينًا!
            </motion.div>
          ) : (
            suggestions.map((suggestion, index) => (
              <FeedbackCard
                key={suggestion.id}
                suggestion={suggestion}
                isTopVoted={index === 0 && suggestion.votes > 0}
                onVote={handleVoteUpdate}
              />
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <FeedbackModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSuggestion}
        />
      )}

      {showAdminModal && isAdmin && (
        <AdminModal
          onClose={() => setShowAdminModal(false)}
          onRefresh={fetchSuggestions}
        />
      )}
    </div>
  )
}

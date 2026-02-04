'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Sparkles } from 'lucide-react' // Changed Fire to Flame as it's more common in lucide
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { safeFetch, validateObject } from '@/lib/utils/api-helpers'
import logger from '@/lib/logger'

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

interface FeedbackCardProps {
  suggestion: Suggestion
  isTopVoted: boolean
  onVote?: (data: { votes: number; hasVoted: boolean; suggestionId: string }) => void
}

const statusMap = {
  done: 'تم الإنجاز ✅',
  in_progress: 'شغالين عليها حالياً 🛠️',
  planned: 'قادمة قريباً 🚀',
  under_review: 'قيد المراجعة ⏳',
}

const statusColorMap = {
  done: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600/50',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600/50',
  planned: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600/50',
  under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600/50',
}

export default function FeedbackCard({ suggestion, isTopVoted, onVote }: FeedbackCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const isMyInProgress = suggestion.isMine && suggestion.publicStatus === 'in_progress'

  const handleVote = async () => {
    setIsVoting(true)
    try {
      const data = await safeFetch<{ votes: number; hasVoted: boolean; error?: string }>(
        `/api/feedback/suggestions/${suggestion.id}/vote`,
        {
          method: 'POST',
        }
      )

      // Validate response structure
      if (typeof data.votes === 'number' && typeof data.hasVoted === 'boolean') {
        toast.success('تسلم! صوتك وصل وبيصنع فرق ❤️', {
          duration: 3500,
          position: 'top-center',
        })
        onVote?.({
          votes: data.votes,
          hasVoted: data.hasVoted,
          suggestionId: suggestion.id,
        })
      } else {
        throw new Error(data.error || 'استجابة غير صحيحة من الخادم')
      }
    } catch (error) {
      logger.error('Error voting:', error)
      const errorMessage = error instanceof Error ? error.message : 'ودنا نسمع صوتك! تأكد من اتصالك بالإنترنت'
      toast.error(errorMessage)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        isMyInProgress
          ? 'ring-4 ring-amber-400/30 dark:ring-amber-500/40 bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/40 dark:to-orange-900/30 shadow-2xl border-2 border-amber-400 dark:border-amber-500/60'
          : 'border-brand-brown/10 dark:border-border-subtle bg-white dark:bg-surface-muted shadow-sm'
      )}
    >
      {/* 🔥 Top Voted Badge */}
      {isTopVoted && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mb-4 bg-gradient-to-r from-orange-400/20 to-red-400/20 dark:from-orange-500/25 dark:to-red-500/25 
                     border-2 border-orange-300/50 dark:border-orange-500/40 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-xl shadow-lg w-fit"
        >
          <Flame className="w-4 h-4" />
          <span className="font-bold text-sm">الأكثر طلباً</span>
        </motion.div>
      )}

      {/* ✨ My Suggestion Highlight */}
      {isMyInProgress && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-4 flex items-center gap-2 bg-gradient-to-r from-amber-400/25 via-orange-400/25 to-amber-400/25 dark:from-amber-600/30 dark:via-orange-600/30 dark:to-amber-600/30 
                     text-amber-800 dark:text-amber-200 border-2 border-amber-300/60 dark:border-amber-500/50 px-4 py-2.5 rounded-xl shadow-lg w-fit mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">فكرتك تحت التنفيذ، شكراً لمشاركتنا!</span>
        </motion.div>
      )}

      {/* Card Content */}
      <div className="space-y-3">
        {/* Title + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl md:text-2xl font-bold text-brand-brown dark:text-text-primary leading-tight flex-1">
            {suggestion.title}
          </h3>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap',
              statusColorMap[suggestion.publicStatus]
            )}
          >
            {statusMap[suggestion.publicStatus]}
          </span>
        </div>

        {/* Description */}
        <p className="text-brand-brown/70 dark:text-text-muted text-sm leading-relaxed">
          {suggestion.description}
        </p>

        {/* Vote Section */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-brown/10 dark:border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-brown dark:text-text-primary">↑</span>
            <span className="text-sm font-semibold text-brand-brown/80 dark:text-text-secondary">
              {suggestion.votes} مهتم
            </span>
          </div>
          <Button
            onClick={handleVote}
            disabled={isVoting}
            className={cn(
              'min-touch-target min-touch-target px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 touch-manipulation',
              suggestion.hasVoted
                ? 'bg-brand-gold text-white hover:bg-brand-gold-dark dark:bg-amber-600 dark:hover:bg-amber-700 shadow-md'
                : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 border border-brand-gold/30 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30 dark:border-amber-500/40'
            )}
          >
            {isVoting ? 'جاري...' : suggestion.hasVoted ? 'أتفق 👍' : 'أتفق 👍'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

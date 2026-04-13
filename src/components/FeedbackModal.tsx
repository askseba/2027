'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lightbulb, MessageSquare, Tag, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import logger from '@/lib/logger'

interface FeedbackModalProps {
  onClose: () => void
  onSubmit: (title: string, description: string, category: string) => Promise<void>
}

const categories = [
  { id: 'quiz', label: 'اختبار العطور', icon: '🧪' },
  { id: 'matching', label: 'خوارزمية التطابق', icon: '🎯' },
  { id: 'perfumes', label: 'قاعدة البيانات', icon: '✨' },
  { id: 'ui', label: 'واجهة المستخدم', icon: '🎨' },
  { id: 'other', label: 'اقتراح آخر', icon: '💡' },
]

export default function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Trap focus within modal
  useFocusTrap(true, modalRef)

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    // Cleanup: remove event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !category) {
      toast.error('العنوان والوصف مطلوبان')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(title, description, category)
    } catch (error) {
      logger.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-surface-elevated w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-gold to-brand-gold-dark dark:from-amber-700 dark:to-amber-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 dark:bg-white/10 p-2 rounded-xl">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">وش ناقصنا؟</h2>
          </div>
          <p className="text-white/80 text-sm">
            اقتراحك اليوم قد يكون ميزة نستخدمها جميعاً غداً. شاركنا أفكارك!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-brown dark:text-text-primary flex items-center gap-2">
              <Tag className="w-4 h-4" />
              عنوان الاقتراح
            </label>
            <input
              type="text"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: إضافة فلتر للعائلات العطرية"
              className="w-full px-4 py-3 rounded-xl border border-brand-brown/10 dark:border-border-subtle focus:border-brand-gold dark:focus:border-amber-500 focus:ring-2 focus:ring-brand-gold/20 dark:focus:ring-amber-500/20 outline-none transition-all bg-white dark:bg-surface text-brand-brown dark:text-text-primary"
              required
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-brown dark:text-text-primary flex items-center gap-2">
              <Tag className="w-4 h-4" />
              التصنيف
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5",
                    category === cat.id
                      ? "bg-brand-gold dark:bg-amber-600 text-white border-brand-gold dark:border-amber-600 shadow-md"
                      : "bg-white dark:bg-surface text-brand-brown/70 dark:text-slate-300 border-brand-brown/10 dark:border-border-subtle hover:border-brand-gold/30 dark:hover:border-amber-500/50"
                  )}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-brown dark:text-text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              اشرح لنا أكثر
            </label>
            <textarea
              autoComplete="off"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="كيف يمكن لهذه الميزة أن تحسن تجربتك في Ask Seba؟"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-brand-brown/10 dark:border-border-subtle focus:border-brand-gold dark:focus:border-amber-500 focus:ring-2 focus:ring-brand-gold/20 dark:focus:ring-amber-500/20 outline-none transition-all resize-none bg-white dark:bg-surface text-brand-brown dark:text-text-primary"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!title?.trim() || !description?.trim() || isSubmitting}
            className="w-full py-6 rounded-2xl bg-brand-gold dark:bg-amber-600 hover:bg-brand-gold-dark dark:hover:bg-amber-700 text-white font-bold text-lg shadow-xl shadow-brand-gold/20 dark:shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                إرسال الاقتراح
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-brand-brown/40 dark:text-slate-300">
            بإرسالك لهذا الاقتراح، فإنك توافق على أن يتم مراجعته ونشره للعامة للتصويت عليه.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

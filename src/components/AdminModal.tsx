import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { safeFetch, validateArray, validateObject } from '@/lib/utils/api-helpers'
import logger from '@/lib/logger'

interface PendingSuggestion {
  id: string
  title: string
  description: string
  category: string
  userName?: string
  createdAt: string
}

interface AdminModalProps {
  onClose: () => void
  onRefresh?: () => void
}

export default function AdminModal({ onClose, onRefresh }: AdminModalProps) {
  const [pendingSuggestions, setPendingSuggestions] = useState<PendingSuggestion[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchPendingSuggestions()
  }, [])

  const fetchPendingSuggestions = async () => {
    try {
      setLoading(true)
      const response = await safeFetch<{ pendingSuggestions?: PendingSuggestion[]; error?: string }>('/api/admin/suggestions')
      
      if (response.pendingSuggestions) {
        const suggestions = validateArray<PendingSuggestion>(
          response.pendingSuggestions,
          'الاقتراحات يجب أن تكون مصفوفة'
        )
        setPendingSuggestions(suggestions)
      } else {
        setPendingSuggestions([])
        if (response.error) {
          toast.error(response.error)
        }
      }
    } catch (error) {
      logger.error('Error fetching pending suggestions:', error)
      setPendingSuggestions([])
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في التحميل'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await safeFetch<{ success?: boolean; error?: string }>(
        `/api/admin/suggestions/${id}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (response.success !== false) {
        logger.info('Suggestion approved:', { id })
        toast.success('تمت الموافقة على الاقتراح ✅')
        setPendingSuggestions((prev) => prev.filter((s) => s.id !== id))
        onRefresh?.()
      } else {
        throw new Error(response.error || 'فشلت الموافقة')
      }
    } catch (error) {
      logger.error('Error approving suggestion:', error)
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ'
      toast.error(errorMessage)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await safeFetch<{ success?: boolean; error?: string }>(
        `/api/admin/suggestions/${id}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (response.success !== false) {
        logger.info('Suggestion rejected:', { id })
        toast.success('تم رفض الاقتراح')
        setPendingSuggestions((prev) => prev.filter((s) => s.id !== id))
      } else {
        throw new Error(response.error || 'فشل الرفض')
      }
    } catch (error) {
      logger.error('Error rejecting suggestion:', error)
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-6">لوحة إدارة الاقتراحات</h2>

        {loading ? (
          <div className="text-center py-8 text-brand-brown/60">جاري التحميل...</div>
        ) : (
          <>
            {/* Pending Suggestions */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-brand-brown/80 mb-3">
                قيد المراجعة ({pendingSuggestions.length})
              </h3>

              {pendingSuggestions.length === 0 ? (
                <div className="text-center py-8 text-brand-brown/60">
                  لا توجد اقتراحات قيد المراجعة
                </div>
              ) : (
                pendingSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-yellow-50 p-4 rounded-xl border border-yellow-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg md:text-xl font-bold text-brand-brown">{suggestion.title}</h4>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="text-sm text-brand-brown/70 mb-2">{suggestion.description}</p>
                    {suggestion.userName && (
                      <p className="text-xs text-brand-brown/50 mb-3">
                        من: {suggestion.userName}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(suggestion.id)}
                        className="bg-green-600 text-white hover:bg-green-700"
                        size="sm"
                      >
                        ✓ موافقة
                      </Button>
                      <Button
                        onClick={() => handleReject(suggestion.id)}
                        variant="danger"
                        size="sm"
                      >
                        ✗ رفض
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              إغلاق
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
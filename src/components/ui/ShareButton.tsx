'use client'
import { useState, useEffect, useRef } from 'react'
import { Share2, Check, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logger from '@/lib/logger'
import { Button } from './button'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'icon'
}

export function ShareButton({ 
  title = 'عطر مثالي لك!',
  text,
  url,
  className = '',
  variant = 'primary'
}: ShareButtonProps) {
  const [isShared, setIsShared] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = text || `صبا اختارت لي ${title} 🎯 ✅ آمن تماماً`

  // Cleanup function to clear any pending timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl
        })
        setIsShared(true)
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setIsShared(false)
          timeoutRef.current = null
        }, 2000)
      } catch (error) {
        logger.info('Share cancelled or failed:', { error })
        fallbackCopy()
      }
    } else {
      fallbackCopy()
    }
  }

  const fallbackCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        .then(() => {
          setIsCopied(true)
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false)
            timeoutRef.current = null
          }, 2000)
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = `${shareText}\n${shareUrl}`
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setIsCopied(true)
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false)
            timeoutRef.current = null
          }, 2000)
        })
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant={variant === 'icon' ? 'ghost' : variant}
      size={variant === 'icon' ? 'icon' : 'md'}
      className={className}
      aria-label="شارك النتيجة"
    >
      <AnimatePresence mode="wait">
        {isShared ? (
          <motion.div
            key="shared"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>تم المشاركة!</span>
          </motion.div>
        ) : isCopied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Copy className="w-5 h-5" />
            <span>تم النسخ!</span>
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            {variant !== 'icon' && <span>شارك</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

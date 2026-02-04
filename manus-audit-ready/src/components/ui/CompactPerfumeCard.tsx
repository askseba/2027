'use client'
import { BarChart3 } from 'lucide-react'

interface CompactPerfumeCardProps {
  perfume: {
    id: string
    name: string
    brand: string
    matchPercentage?: number
    isSafe?: boolean
  }
  onAdd: () => void
  disabled?: boolean
}

export function CompactPerfumeCard({ 
  perfume, 
  onAdd,
  disabled = false 
}: CompactPerfumeCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5 transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-brown-text text-xl md:text-2xl truncate">
            {perfume.name}
          </h3>
          {perfume.isSafe !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              perfume.isSafe 
                ? 'bg-green-100 text-green-700 border-green-500' 
                : 'bg-amber-100 text-amber-700 border-amber-500'
            }`}>
              {perfume.isSafe ? '🛡 آمن' : '⚠ تحذير'}
            </span>
          )}
        </div>
        <p className="text-sm text-brown-text/85 truncate">{perfume.brand}</p>
        {perfume.matchPercentage !== undefined && (
          <p className="text-xs text-primary font-medium mt-1">
            تطابق: {perfume.matchPercentage}%
          </p>
        )}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) onAdd()
        }}
        disabled={disabled}
        className={`
          min-touch-target min-touch-target flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all touch-manipulation
          bg-primary text-white hover:bg-primary/90
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <BarChart3 className="w-4 h-4" />
        <span>أضف للتحليل</span>
      </button>
    </div>
  )
}

export default CompactPerfumeCard

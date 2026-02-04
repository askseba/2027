'use client'
import React from 'react'
import Image from 'next/image'

interface Perfume {
  id: string
  name: string
  brand: string
  image: string
  matchPercentage?: number
  price?: number
}

interface PerfumeGridProps {
  perfumes: Perfume[]
  columns?: 2 | 3 | 4
  onPerfumeClick?: (perfume: Perfume) => void
  className?: string
}

export function PerfumeGrid({ 
  perfumes, 
  columns = 3,
  onPerfumeClick,
  className = '' 
}: PerfumeGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {perfumes.map((perfume) => (
        <div
          key={perfume.id}
          onClick={() => onPerfumeClick?.(perfume)}
          className="bg-white dark:bg-surface rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-border-subtle transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          tabIndex={onPerfumeClick ? 0 : undefined}
          role={onPerfumeClick ? "button" : undefined}
          aria-label={`عرض تفاصيل ${perfume.name} من ${perfume.brand}`}
          onKeyDown={onPerfumeClick ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onPerfumeClick(perfume)
            }
          } : undefined}
        >
          {/* Image */}
          <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-surface-muted dark:to-surface">
            <Image
              src={perfume.image}
              alt={`${perfume.name} - ${perfume.brand}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Match Badge */}
            {perfume.matchPercentage !== undefined && (
              <div className="absolute top-2 left-2 z-10">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-yellow-400 text-sm">analytics</span>
                  <span dir="ltr">{perfume.matchPercentage}% Match</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-neutral-900 dark:text-text-primary text-xl md:text-2xl font-bold leading-tight truncate">
                  {perfume.name}
                </h3>
                <p className="text-neutral-500 dark:text-text-muted text-sm mt-1">{perfume.brand}</p>
              </div>
              <button 
                className="text-neutral-400 dark:text-text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors ms-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-1"
                aria-label={`إضافة ${perfume.name} إلى المفضلة`}
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">favorite_border</span>
              </button>
            </div>

            {perfume.price !== undefined && (
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-primary dark:text-amber-500 text-xl font-bold">{perfume.price}</span>
                <span className="text-primary dark:text-amber-500 text-sm font-bold">ر.س</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PerfumeGrid

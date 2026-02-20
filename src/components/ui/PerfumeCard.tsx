"use client"
import React, { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/classnames"
import { RadarGauge } from "./RadarGauge"
import type { ScoredPerfume } from "@/lib/matching"

interface PerfumeCardProps {
  id: string
  name?: string
  title?: string // Backward compatibility
  brand: string
  finalScore?: number
  matchPercentage?: number // Backward compatibility
  image?: string
  imageUrl?: string // Backward compatibility
  description?: string | null
  isSafe?: boolean
  showCompare?: boolean
  isComparing?: boolean
  onCompare?: () => void
  rarity?: "common" | "rare" | "exclusive"
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock"
  variant?: "on-sale" | "just-arrived" | string | null // Backward compatibility
  priority?: boolean // ✅ prop جديد لتحسين LCP
  ifraScore?: number
  symptomTriggers?: string[]
  ifraWarnings?: string[]
  source?: string
  /** Highlight as first match (first result) */
  isFirst?: boolean
  /** Callback when "Show Ingredients" is clicked */
  onShowIngredients?: () => void
  /** Callback when "Show Match" is clicked */
  onShowMatch?: () => void
  /** Callback when "Price Compare" is clicked; receives full perfume for Price Hub */
  onPriceCompare?: (perfume: ScoredPerfume) => void
  /** Full perfume data to pass to callbacks (required when callbacks are used) */
  perfumeData?: ScoredPerfume
}

export function PerfumeCard({
  id,
  name,
  title,
  brand,
  finalScore,
  matchPercentage,
  image,
  imageUrl,
  description,
  isSafe = true,
  showCompare = false,
  isComparing = false,
  onCompare,
  rarity = "rare",
  stockStatus = "in-stock",
  priority = false,
  ifraScore,
  symptomTriggers,
  ifraWarnings,
  source,
  isFirst = false,
  onShowIngredients,
  onShowMatch,
  onPriceCompare,
  perfumeData,
}: PerfumeCardProps) {
  const t = useTranslations("results.card")
  const displayName = name || title || t("unknownPerfume")
  const displayScore = finalScore ?? matchPercentage ?? 0
  const displayImage = image || imageUrl

  const [imageError, setImageError] = useState(false)

  // External URLs (Unsplash, etc.) must bypass Next.js image optimizer
  // because Next.js fetches them server-side — Unsplash blocks server requests.
  const isExternalUrl = Boolean(
    displayImage &&
      !imageError &&
      (displayImage.startsWith("http://") || displayImage.startsWith("https://"))
  )

  // Extract scores from perfumeData if available, otherwise use props
  const tasteScore =
    perfumeData?.tasteScore ?? Math.round(displayScore * 0.7) // Fallback estimate
  const safetyScore = perfumeData?.safetyScore ?? (isSafe ? 100 : 0)
  const finalScoreValue = finalScore ?? displayScore

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`${displayName} - ${finalScoreValue}% ${t("match")}`}
      className={cn(
        "bg-white dark:bg-surface rounded-3xl shadow-elevation-1 dark:shadow-black/20 border border-primary/5 dark:border-border-subtle overflow-hidden flex flex-col h-[360px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      )}
    >
      {/* Header: صورة + Radar + Badge */}
      <div className="relative h-[200px] bg-cream-bg dark:bg-background p-5">
        {/* Radar صغير - الزاوية اليمنى العلوية */}
        <div className="absolute top-3 end-3 z-10">
          <RadarGauge
            finalScore={finalScoreValue}
            tasteScore={tasteScore}
            safetyScore={safetyScore}
            size="sm"
          />
        </div>

        {/* Badge أفضل تطابق - الزاوية اليسرى العلوية */}
        {isFirst && (
          <div className="absolute top-3 start-3 z-10">
            <span className="text-xs font-bold text-white bg-primary dark:bg-amber-500 px-2.5 py-1 rounded-full shadow-sm">
              {t("topMatch")}
            </span>
          </div>
        )}

        {/* صورة العطر */}
        <Image
          src={imageError || !displayImage ? "/placeholder-perfume.svg" : displayImage}
          alt={displayName}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          unoptimized={isExternalUrl}
          onError={() => setImageError(true)}
        />
      </div>

      {/* معلومات */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-text-muted dark:text-text-muted mb-1">{brand}</p>
        <h3 className="text-base font-bold text-text-primary dark:text-text-primary line-clamp-2 mb-auto">
          {displayName}
        </h3>
      </div>

      {/* 3 أزرار */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onShowIngredients?.()
          }}
          className="flex-1 py-2.5 text-xs font-medium text-gray-700 dark:text-slate-200 bg-gray-200 dark:bg-slate-600 rounded-xl hover:bg-gray-300 dark:hover:bg-slate-500 transition text-center border-0"
        >
          {t("ingredientsBtn")}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onShowMatch?.()
          }}
          className="flex-1 py-2.5 text-xs font-medium text-gray-700 dark:text-slate-200 bg-gray-200 dark:bg-slate-600 rounded-xl hover:bg-gray-300 dark:hover:bg-slate-500 transition text-center border-0"
        >
          {t("matchBtn")}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            if (onPriceCompare && perfumeData) {
              onPriceCompare(perfumeData)
            }
          }}
          className="flex-1 py-2.5 text-xs font-medium text-white bg-primary dark:bg-amber-600 rounded-xl hover:opacity-90 transition text-center border-0"
        >
          {t("pricesBtn")}
        </button>
      </div>
    </div>
  )
}

"use client"
import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/classnames"
import type { ScoredPerfume } from "@/lib/matching"
import { translateNote } from '@/lib/utils/family'

interface IngredientsSheetProps {
  perfume: ScoredPerfume
  onClose: () => void
  locale?: string
}

export function IngredientsSheet({ perfume, onClose, locale = "ar" }: IngredientsSheetProps) {
  const t = useTranslations("results.ingredients")
  const [imageError, setImageError] = useState(false)
  const isRtl = locale === "ar"
  console.log("perfume.families", perfume.families)
  const uniqueFamilies = [...new Set(perfume.families ?? [])]

  try {
    const pyramidRaw = (perfume as any).scentPyramid
    const hasPyramid = Array.isArray(pyramidRaw) || !!pyramidRaw

    const pyramid = Array.isArray(pyramidRaw)
      ? pyramidRaw
      : pyramidRaw
        ? [
            {
              stage: "top",
              stageAr: t("pyramid.top"),
              notes: pyramidRaw.top ?? [],
              color: "#FFE5B4"
            },
            {
              stage: "heart",
              stageAr: t("pyramid.heart"),
              notes: pyramidRaw.heart ?? [],
              color: "#FFC0CB"
            },
            {
              stage: "base",
              stageAr: t("pyramid.base"),
              notes: pyramidRaw.base ?? [],
              color: "#DEB887"
            }
          ]
        : []

    const mapLongevityToKey = (value: unknown): string | null => {
      if (typeof value !== "string") return null
      const normalized = value.trim().toLowerCase().replace(/\s+/g, " ")
      const noSpace = normalized.replace(/\s+/g, "")

      const map: Record<string, string> = {
        "very weak": "veryWeak",
        "weak": "weak",
        "moderate": "moderate",
        "long lasting": "longLasting",
        "longlasting": "longLasting",
        "very long lasting": "veryLongLasting",
        "verylonglasting": "veryLongLasting",
        "eternal": "eternal"
      }

      return map[normalized] ?? map[noSpace] ?? null
    }

    const mapSillageToKey = (value: unknown): string | null => {
      if (typeof value !== "string") return null
      const normalized = value.trim().toLowerCase().replace(/\s+/g, " ")
      const noSpace = normalized.replace(/\s+/g, "")

      const map: Record<string, string> = {
        "intimate": "intimate",
        "moderate": "moderate",
        "strong": "strong",
        "enormous": "enormous"
      }

      return map[normalized] ?? map[noSpace] ?? null
    }

    const rawLongevity = (perfume as any).longevity as unknown
    const rawSillage = (perfume as any).sillage as unknown

    const longevityKey = mapLongevityToKey(rawLongevity)
    const sillageKey = mapSillageToKey(rawSillage)

    console.log("scentPyramid", JSON.stringify(perfume.scentPyramid))
    console.log("perfume.ingredients", perfume.ingredients?.slice(0, 5))

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50" dir={isRtl ? "rtl" : "ltr"}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-auto max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-700"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-border dark:bg-border-subtle rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-primary/5 dark:border-slate-700 flex items-center gap-4 bg-cream-bg dark:bg-slate-800 sticky top-0 z-10">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-bg dark:bg-background border border-primary/10 dark:border-border-subtle flex-shrink-0">
                <Image
                  src={imageError || !perfume.image ? "/placeholder-perfume.svg" : perfume.image}
                  alt={perfume.name}
                  fill
                  className="object-contain p-2"
                  sizes="64px"
                  onError={() => setImageError(true)}
                  unoptimized={!!perfume.image && perfume.image.startsWith('http')}
                />
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-text-primary dark:text-text-primary line-clamp-1">
                  {perfume.name}
                </h2>
                <p className="text-xs text-text-muted dark:text-text-muted">{perfume.brand}</p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/5 dark:hover:bg-surface-muted rounded-full transition-colors flex-shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-6 h-6 text-text-primary dark:text-text-primary" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* القسم 1: هرم النوتات أو المكونات */}
              {hasPyramid ? (
                <div className="px-6 py-4">
                  <h3 className="text-sm font-bold text-text-secondary dark:text-text-muted mb-3">
                    {t("pyramid.title")}
                  </h3>

                  <div className="space-y-4">
                    {pyramid.map((stageObj: any, idx: number) => {
                      const stage = stageObj?.stage ?? idx
                      const stageAr = stageObj?.stageAr ?? stageObj?.stage ?? ""
                      const notes = stageObj?.notes ?? []
                      const color = stageObj?.color

                      const hex = typeof color === "string" && color.startsWith("#") ? color : null
                      const bg = hex ? `${hex}22` : undefined
                      const border = hex ? `${hex}66` : undefined

                      return (
                        <div key={stage} style={{ ["--pyramid-color" as any]: color }}>
                          <p className="text-xs font-bold text-text-muted dark:text-text-muted mb-2 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            {stageAr}
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {(notes || []).map((note: string, i: number) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-xs px-2.5 py-1 rounded-full border transition-all",
                                  stage === "top" &&
                                    "bg-amber-50/80 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-500/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50",
                                  stage === "heart" &&
                                    "bg-rose-50/80 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-500/30 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-800/50",
                                  stage === "base" &&
                                    "bg-gold/20 border-gold/30 text-gold-dark dark:bg-gold-dark/20 dark:border-gold-light/30 dark:text-gold-light hover:bg-gold/30 dark:hover:bg-gold-dark/50"
                                )}
                              >
                                {t.has(`notes.${note}`) ? t(`notes.${note}`) : translateNote(note)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {((perfume as any).longevity || (perfume as any).sillage) && (
                <div className="flex flex-wrap gap-2 mt-3 mb-3">
                  {(perfume as any).longevity && (
                    <span
                      className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    >
                      ⏱️ {longevityKey && t.has(`longevity.${longevityKey}`) ? t(`longevity.${longevityKey}`) : (perfume as any).longevity}
                    </span>
                  )}
                  {(perfume as any).sillage && (
                    <span
                      className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                    >
                      💨 {sillageKey && t.has(`sillage.${sillageKey}`) ? t(`sillage.${sillageKey}`) : (perfume as any).sillage}
                    </span>
                  )}
                </div>
              )}

              <div className="px-6 py-4">
                <details className="mt-4">
                  <summary
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none"
                  >
                    المكونات الكيميائية (للحساسية) ▾
                  </summary>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(() => {
                        const field = perfume.ingredients ?? []
                        console.log("Before map", field, field?.length)
                        return field.map((ing, i) => (
                          <span
                            key={i}
                            className="text-xs bg-cream-bg dark:bg-surface-muted text-text-secondary dark:text-text-muted px-2.5 py-1 rounded-full"
                          >
                            {ing}
                          </span>
                        ))
                      })()}
                    </div>
                  </div>
                </details>
              </div>

              {/* القسم 2: العائلات العطرية */}
              {uniqueFamilies.length > 0 && (
                <div className="px-6 py-4 border-t border-primary/5 dark:border-border-subtle">
                  <h3 className="text-sm font-bold text-text-secondary dark:text-text-muted mb-3">
                    {t("familiesTitle")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      const field = uniqueFamilies
                      console.log("Before map", field, field?.length)
                      return field.map((fam, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary/10 dark:bg-amber-500/10 text-primary dark:text-amber-500 px-2.5 py-1 rounded-full font-medium"
                        >
                          {t.has(`families.${fam}`) ? t(`families.${fam}`) : fam}
                        </span>
                      ))
                    })()}
                  </div>
                </div>
              )}

              {/* القسم 3: حالة الأمان */}
              <div className="px-6 py-4 border-t border-primary/5 dark:border-border-subtle">
                <h3 className="text-sm font-bold text-text-secondary dark:text-text-muted mb-3">
                  {t("safetyTitle")}
                </h3>

                {/* IFRA Score */}
                {perfume.ifraScore !== undefined && (
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white",
                        perfume.ifraScore >= 70
                          ? "bg-safe-green"
                          : perfume.ifraScore >= 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                      )}
                    >
                      {perfume.ifraScore}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary dark:text-text-primary">
                        {perfume.isSafe ? t("safeLabel") : t("warningLabel")}
                      </p>
                      <p className="text-xs text-text-muted">
                        {t("ifraScore")}: {perfume.ifraScore}/100
                      </p>
                    </div>
                  </div>
                )}

                {/* IFRA Warnings */}
                {perfume.ifraWarnings && perfume.ifraWarnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-500/5 rounded-xl p-3 border border-amber-200 dark:border-amber-500/20 mb-3">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                      {t("warningsTitle")}
                    </p>
                    <ul className="space-y-1">
                      {(() => {
                        const field = perfume.ifraWarnings
                        console.log("Before map", field, field?.length)
                        return field.map((w, i) => (
                          <li key={i} className="text-xs text-amber-600 dark:text-amber-300">
                            - {w}
                          </li>
                        ))
                      })()}
                    </ul>
                  </div>
                )}

                {/* Symptom Triggers */}
                {perfume.symptomTriggers && perfume.symptomTriggers.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-500/5 rounded-xl p-3 border border-red-200 dark:border-red-500/20">
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                      {t("triggersTitle")}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const field = perfume.symptomTriggers
                        console.log("Before map", field, field?.length)
                        return field.map((trigger, i) => (
                          <span
                            key={i}
                            className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full"
                          >
                            {trigger}
                          </span>
                        ))
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    )
  } catch (error) {
    console.error("IngredientsSheet render crash", error)
    throw error
  }
}

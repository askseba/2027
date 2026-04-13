"use client"
import { cn } from "@/lib/utils"

interface RadarGaugeProps {
  finalScore: number // 0-100
  tasteScore: number // 0-100
  safetyScore: number // 0 أو 100
  size?: "sm" | "lg" // sm=48px (بطاقة), lg=120px (sheet)
  showBreakdown?: boolean // true في Sheet فقط
  locale?: string
}

// ZONES (ديناميكية — سهلة التعديل)
const ZONES = {
  red: { from: 0, to: 39 }, // 180° → 109.8°
  orange: { from: 40, to: 69 }, // 108° → 55.8°
  green: { from: 70, to: 100 }, // 54° → 0°
}

// الدوال المطلوبة
function percentToAngle(percent: number): number {
  return 180 - (percent / 100) * 180 // 0%=180°(يسار), 100%=0°(يمين)
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function RadarGauge({
  finalScore,
  tasteScore,
  safetyScore,
  size = "sm",
  showBreakdown = false,
  locale = "ar",
}: RadarGaugeProps) {
  const isSmall = size === "sm"
  const w = isSmall ? 48 : 120
  const h = isSmall ? 28 : 70
  const cx = w / 2
  const cy = h
  const r = isSmall ? 20 : 50
  const sw = isSmall ? 4 : 8

  // زوايا المناطق (ديناميكية)
  const redStart = percentToAngle(ZONES.red.from) // 180°
  const redEnd = percentToAngle(ZONES.red.to) // 109.8°
  const orangeStart = percentToAngle(ZONES.orange.from) // 108°
  const orangeEnd = percentToAngle(ZONES.orange.to) // 55.8°
  const greenStart = percentToAngle(ZONES.green.from) // 54°
  const greenEnd = percentToAngle(ZONES.green.to) // 0°

  // المؤشر
  const needleAngle = percentToAngle(finalScore)
  const needleEnd = polarToCartesian(cx, cy, r - 4, needleAngle)
  const color =
    finalScore >= 70
      ? "#22C55E"
      : finalScore >= 40
        ? "#F59E0B"
        : "#EF4444"

  // i18n (جاهز لـ P6-2)
  const labels =
    locale === "ar"
      ? {
          taste: "الذوق",
          safety: "الأمان",
          overall: "الإجمالي",
        }
      : {
          taste: "Taste",
          safety: "Safety",
          overall: "Overall",
        }

  return (
    <div className="flex flex-col items-center" dir="rtl">
      <svg
        width={w}
        height={h + 4}
        viewBox={`0 0 ${w} ${h + 4}`}
        role="img"
        aria-label={`مقياس الأداء: ${finalScore}%`}
      >
        {/* المناطق */}
        <path
          d={describeArc(cx, cy, r, redStart, redEnd)}
          stroke="#FEE2E2"
          strokeWidth={sw}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={describeArc(cx, cy, r, orangeStart, orangeEnd)}
          stroke="#FEF3C7"
          strokeWidth={sw}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={describeArc(cx, cy, r, greenStart, greenEnd)}
          stroke="#DCFCE7"
          strokeWidth={sw}
          fill="none"
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke={color}
          strokeWidth={isSmall ? 2 : 3}
          strokeLinecap="round"
          style={{
            transition: "stroke 0.3s ease",
          }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={isSmall ? 2 : 4}
          fill={color}
          style={{
            transition: "fill 0.3s ease",
          }}
        />
      </svg>

      {/* النسبة المئوية */}
      <span
        className={cn(
          "font-black",
          isSmall ? "text-xs" : "text-lg",
          finalScore >= 70
            ? "text-safe-green"
            : finalScore >= 40
              ? "text-amber-500"
              : "text-red-500"
        )}
      >
        {finalScore}%
      </span>

      {/* Breakdown (للحجم الكبير فقط) */}
      {showBreakdown && !isSmall && (
        <div className="mt-4 w-full space-y-2">
          {/* الذوق */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {labels.taste}:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-2 bg-cream-bg dark:bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-primary to-primary-dark dark:from-accent-primary dark:to-accent-primary-dark rounded-full transition-all duration-500"
                  style={{ width: `${tasteScore}%` }}
                />
              </div>
              <span className="text-xs font-black text-text-primary dark:text-text-primary min-w-[35px] text-left">
                {tasteScore}%
              </span>
            </div>
          </div>

          {/* الأمان */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {labels.safety}:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-2 bg-cream-bg dark:bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    safetyScore === 100
                      ? "bg-safe-green"
                      : "bg-danger-red"
                  )}
                  style={{ width: `${safetyScore}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-black min-w-[35px] text-left",
                  safetyScore === 100
                    ? "text-safe-green"
                    : "text-danger-red"
                )}
              >
                {safetyScore === 100 ? "🟢" : "🔴"} {safetyScore}%
              </span>
            </div>
          </div>

          {/* الإجمالي */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {labels.overall}:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-2 bg-cream-bg dark:bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    finalScore >= 70
                      ? "bg-safe-green"
                      : finalScore >= 40
                        ? "bg-amber-500"
                        : "bg-danger-red"
                  )}
                  style={{ width: `${finalScore}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-black min-w-[35px] text-left",
                  finalScore >= 70
                    ? "text-safe-green"
                    : finalScore >= 40
                      ? "text-amber-500"
                      : "text-danger-red"
                )}
              >
                {finalScore >= 70 ? "🟢" : finalScore >= 40 ? "🟠" : "🔴"}{" "}
                {finalScore}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

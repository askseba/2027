"use client"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { Info } from "lucide-react"

interface RadarPoint {
  name: string
  score: number
  color: string
}

interface RadarChartProps {
  data?: RadarPoint[]
  size?: number
  className?: string
  title?: string
}

export function RadarChart({ data, size = 400, className = "", title = "بصمة ذوقك العطرية" }: RadarChartProps) {
  const points = useMemo(() => {
    if (!data || data.length === 0) return []
    const radius = size * 0.35
    const center = size / 2
    return data.map((item, i) => {
      const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2
      return {
        ...item,
        x: center + (item.score / 100) * radius * Math.cos(angle),
        y: center + (item.score / 100) * radius * Math.sin(angle),
        labelX: center + (radius + 40) * Math.cos(angle),
        labelY: center + (radius + 40) * Math.sin(angle),
        angle,
      }
    })
  }, [data, size])

  if (!data || data.length === 0) return null

  const radius = size * 0.35
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(" ")

  return (
    <div className={`relative bg-white dark:bg-surface rounded-3xl p-8 shadow-elevation-2 border border-primary/5 dark:border-border-subtle ${className}`} dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-text-primary dark:text-text-primary">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">تحليل دقيق لتوزيع العائلات العطرية في ذوقك</p>
        </div>
        <div className="bg-primary/10 dark:bg-amber-500/20 p-2 rounded-full">
          <Info className="w-5 h-5 text-primary dark:text-amber-500" />
        </div>
      </div>

      <div className="w-full aspect-square flex items-center justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {[0.2, 0.4, 0.6, 0.8, 1].map((level, idx) => (
            <circle
              key={`grid-${idx}`}
              cx={size / 2}
              cy={size / 2}
              r={radius * level}
              fill="none"
              stroke="var(--color-text-primary)"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          ))}
          {points.map((point, i) => (
            <line
              key={`axis-${i}`}
              x1={size / 2}
              y1={size / 2}
              x2={size / 2 + radius * Math.cos(point.angle)}
              y2={size / 2 + radius * Math.sin(point.angle)}
              stroke="var(--color-text-primary)"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}
          <motion.polygon
            points={polygonPath}
            fill="rgba(192, 132, 26, 0.15)"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {points.map((point, i) => (
            <g key={`point-${i}`}>
              <circle cx={point.x} cy={point.y} r="5" fill="var(--color-primary)" className="shadow-sm" />
              <text x={point.labelX} y={point.labelY} textAnchor="middle" dominantBaseline="middle" fill="var(--color-text-primary)" className="text-[14px] font-bold">
                {point.name}
              </text>
              <text x={point.labelX} y={point.labelY + 18} textAnchor="middle" dominantBaseline="middle" fill={point.color} className="text-[12px] font-black">
                {point.score}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

// src/lib/safety-display.ts
// المصدر الوحيد لمنطق عرض السلامة — لا ملف UI يُكرر هذا المنطق

export type SafetySeverity = 'low' | 'medium' | 'high'

export interface SafetyDisplay {
  color: string       // hex
  label: string       // النص العربي الافتراضي
  labelEn: string     // النص الإنجليزي
  badge: string       // الأيقونة
  showWarning: boolean
}

const config: Record<SafetySeverity, SafetyDisplay> = {
  low:    { color: '#22c55e', label: 'آمن',   labelEn: 'Safe',    badge: '✓', showWarning: false },
  medium: { color: '#f59e0b', label: 'تنبيه', labelEn: 'Caution', badge: '⚠', showWarning: true  },
  high:   { color: '#ef4444', label: 'تحذير', labelEn: 'Warning', badge: '✕', showWarning: true  },
}

export function getSafetyDisplay(severity: SafetySeverity): SafetyDisplay {
  return config[severity]
}

export function severityFromScore(score: 0 | 50 | 100): SafetySeverity {
  if (score === 0) return 'high'
  if (score === 50) return 'medium'
  return 'low'
}

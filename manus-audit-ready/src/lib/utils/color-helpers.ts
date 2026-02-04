/**
 * Theme-aware color resolution for inline styles (e.g. dynamic family colors).
 * Use for elements that need JS-based colors that respect light/dark mode.
 */

export type ThemeMode = 'light' | 'dark' | undefined

/** Map of known CSS variable names to dark-mode hex equivalents (visible, not harsh) */
const DARK_MODE_COLORS: Record<string, string> = {
  'var(--color-primary)': '#a67c2e',
  'var(--color-safe-green)': '#16a34a',
  'var(--color-warning-amber)': '#d97706',
  'var(--color-accent-pink)': '#db2777',
  'var(--color-danger-red)': '#dc2626',
}

/**
 * Returns a theme-appropriate color for inline styles.
 * In light mode returns the color as-is; in dark mode returns a darker/readable variant.
 */
export function getThemedColor(
  color: string | undefined,
  theme: ThemeMode
): string {
  if (!color) return 'var(--color-primary)'
  if (theme !== 'dark') return color

  const trimmed = color.trim()
  const dark = DARK_MODE_COLORS[trimmed]
  if (dark) return dark

  // Fallback: if it's a hex, use as-is (caller may pass already-appropriate color)
  return color
}

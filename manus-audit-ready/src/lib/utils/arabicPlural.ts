/**
 * Formats Arabic text with correct pluralization rules
 * @param count - The number to format
 * @param singular - Singular form (1): "عطر مثالي"
 * @param dual - Dual form (2): "عطرين مثاليين"
 * @param plural - Plural form (3-10): "عطور مثالية"
 * @param collective - Collective form (11+): "عطرًا مثاليًا"
 * @returns Formatted string with correct Arabic pluralization
 */
export function formatArabicPlural(
  count: number,
  singular: string,
  dual: string,
  plural: string,
  collective: string
): string {
  if (count === 0) {
    return `لا ${plural}`
  }
  
  if (count === 1) {
    return `${count} ${singular}`
  }
  
  if (count === 2) {
    return `${count} ${dual}`
  }
  
  if (count >= 3 && count <= 10) {
    return `${count} ${plural}`
  }
  
  // 11 and above
  return `${count} ${collective}`
}

/**
 * Formats Arabic perfume results title
 */
export function formatPerfumeResultsTitle(count: number): string {
  return formatArabicPlural(
    count,
    'عطر مثالي لك',
    'عطرين مثاليين لك',
    'عطور مثالية لك',
    'عطرًا مثاليًا لك'
  )
}

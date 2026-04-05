// ============================================================
// Central family/note normalization and translation utilities
// ============================================================

/**
 * Canonical normalization map.
 * Conflict resolutions vs prior local copies:
 *   - aquatic → aquatic  (was: fresh)
 *   - amber   → amber    (was: oriental)
 *   - sweet   → gourmand (was: sweet)
 *   - gourmand→ gourmand (was: sweet)
 */
export const FAMILY_NORMALIZE_MAP: Record<string, string> = {
  // Arabic inputs
  'خشبي':    'woody',
  'شرقي':    'oriental',
  'زهري':    'floral',
  'منعش':    'fresh',
  'حمضيات':  'citrus',
  'برتقال':  'citrus',
  'ليمون':   'citrus',
  'توابل':   'spicy',
  'سويتي':   'gourmand',
  // English inputs
  'woody':    'woody',
  'wood':     'woody',
  'oriental': 'oriental',
  'amber':    'amber',
  'floral':   'floral',
  'flower':   'floral',
  'fresh':    'fresh',
  'aquatic':  'aquatic',
  'citrus':   'citrus',
  'spicy':    'spicy',
  'sweet':    'gourmand',
  'gourmand': 'gourmand',
}

export function normalizeFamily(family: string | null | undefined): string {
  if (!family) return ''
  const key = family.toLowerCase().trim()
  return FAMILY_NORMALIZE_MAP[key] ?? key
}

// ─── Arabic display translations ────────────────────────────

export const FAMILY_AR_MAP: Record<string, string> = {
  'woody':        'خشبي',
  'floral':       'زهري',
  'oriental':     'شرقي',
  'fresh':        'منعش',
  'citrus':       'حمضيات',
  'spicy':        'توابل',
  'gourmand':     'غورماند',
  'sweet':        'حلوة',
  'amber':        'عنبر',
  'aquatic':      'مائي',
  'leather':      'جلدي',
  'aromatic':     'عطري',
  'green':        'أخضر',
  'musky':        'مسكي',
  'earthy':       'ترابي',
  'mossy':        'طحلبي',
  'powdery':      'ببودري',
  'ozonic':       'أوزوني',
  'aldehydic':    'الدهيدي',
  'herbal':       'عشبي',
  'rose':         'وردي',
  'lavender':     'لافندر',
  'white floral': 'زهور بيضاء',
  'fresh spicy':  'توابل منعشة',
  'soft spicy':   'توابل ناعمة',
  'warm spicy':   'توابل دافئة',
}

export function translateFamily(family: string): string {
  const key = family.toLowerCase().trim()
  return FAMILY_AR_MAP[key] ?? family
}

export function translateCompoundFamily(primary: string, secondary?: string | null): string {
  const primaryAr = translateFamily(primary)
  if (!secondary) return primaryAr
  const secondaryAr = translateFamily(secondary)
  return `${primaryAr} ${secondaryAr}`
}

// ─── Note translations ───────────────────────────────────────

export const NOTE_AR_MAP: Record<string, string> = {
  'jasmine':    'ياسمين',
  'rose':       'ورد',
  'oud':        'عود',
  'sandalwood': 'صندل',
  'vanilla':    'فانيليا',
  'musk':       'مسك',
  'amber':      'عنبر',
  'patchouli':  'باتشولي',
  'lavender':   'لافندر',
  'bergamot':   'برغموت',
  'pepper':          'فلفل',
  'leather':         'جلد',
  'vetiver':         'فيتيفر',
  'haitian vetiver': 'فيتيفر هايتي',
  'iris':            'أيريس',
  'ambergris':       'عنبر رمادي',
  'tonka bean':      'فول تونكا',
  'pink pepper':     'فلفل وردي',
  'mandarin orange': 'ماندرين برتقال',
}

export function translateNote(note: string): string {
  const key = note.toLowerCase().trim()
  return NOTE_AR_MAP[key] ?? note
}

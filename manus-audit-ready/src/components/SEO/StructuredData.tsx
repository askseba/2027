/**
 * JSON-LD structured data for SEO: Organization (PerfumeStore), WebSite, SearchAction.
 * Rendered in layout <head> for rich results and site search.
 */
const SITE_URL = 'https://askseba.com';

export function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Store'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Ask Seba',
    description: 'اكتشف عطرك المثالي | مساعد العطور الذكي. اختبار ذكي لاكتشاف العطور المثالية لك.',
    url: SITE_URL,
    logo: `${SITE_URL}/pwa-192.png`,
    sameAs: [],
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Ask Seba',
    description: 'اكتشف عطرك المفضل من خلال اختبار ذكي يحلل شخصيتك وذوقك.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/results?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}

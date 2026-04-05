/**
 * scripts/phase-b-runner.mjs
 * Executes Phase B operations via Neon HTTP SQL API (port 443).
 * Equivalent to running backfill-slugs.ts + fill-prices.ts + end-to-end verify.
 * Used because port 5432 is blocked in this local environment.
 */

const NEON_CONN = 'postgresql://neondb_owner:npg_QZ5idMnFjhC9@ep-super-band-al749d4e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'
const NEON_URL  = 'https://ep-super-band-al749d4e-pooler.c-3.eu-central-1.aws.neon.tech/sql'

async function neon(query, params = []) {
  const res = await fetch(NEON_URL, {
    method: 'POST',
    headers: { 'neon-connection-string': NEON_CONN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params })
  })
  const data = await res.json()
  if (data.message) throw new Error(`Neon SQL error: ${data.message}\nQuery: ${query}`)
  return data
}

// ─── Slug formula (canonical, from convertSimilarToScoredPerfume) ────────────
function buildSlug(brand, name) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ─── Seed prerequisite data (stores + perfumes) ──────────────────────────────
async function seedStores() {
  console.log('\n=== [seed] Inserting stores ===')
  const stores = [
    ['FACES', 'faces', 'https://www.faces.sa/?utm_source=askseba', 8.0, '/stores/faces.svg'],
    ['Nice One', 'niceone', 'https://niceonesa.com/?utm_source=askseba', 10.0, '/stores/niceone.svg'],
    ['Golden Scent', 'goldenscent', 'https://www.goldenscent.com/?utm_source=askseba', 12.0, '/stores/goldenscent.svg'],
    ['Sultan Perfumes', 'sultan', 'https://sultanperfumes.net/?utm_source=askseba', 7.0, '/stores/sultan.svg'],
    ['Loja Store', 'lojastore', 'https://lojastoregt.com/?utm_source=askseba', 9.0, '/stores/lojastore.svg'],
    ['Vanilla', 'vanilla', 'https://vanilla.sa/?utm_source=askseba', 8.5, '/stores/vanilla.svg'],
    ['Ounass SA', 'ounass-sa', 'https://saudi.ounass.com/?utm_source=askseba', 15.0, '/stores/ounass.svg'],
  ]
  for (const [name, slug, affiliateUrl, commission, logoUrl] of stores) {
    await neon(
      `INSERT INTO stores (name, slug, "affiliateUrl", commission, "isActive", "logoUrl", created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, "isActive"=true, "logoUrl"=EXCLUDED."logoUrl", updated_at=NOW()`,
      [name, slug, affiliateUrl, commission, logoUrl]
    )
    console.log(`  ✅ store: ${slug}`)
  }
}

async function seedPerfumes() {
  console.log('\n=== [seed] Inserting perfumes ===')
  const perfumes = [
    { id:'1',  name:'Bleu de Chanel',   brand:'Chanel',         baseScore:92, price:450, isSafe:true, status:'safe',    families:['citrus','woody'],       ingredients:['bergamot','sandalwood','lavender'], symptomTriggers:[] },
    { id:'2',  name:'Aventus',          brand:'Creed',          baseScore:88, price:550, isSafe:true, status:'safe',    families:['citrus','woody'],       ingredients:['bergamot','patchouli','musk'],      symptomTriggers:[] },
    { id:'3',  name:'Oud Wood',         brand:'Tom Ford',       baseScore:85, price:650, isSafe:true, status:'safe',    families:['woody','floral'],       ingredients:['oud','rose','sandalwood'],          symptomTriggers:['headache'] },
    { id:'4',  name:'Sauvage',          brand:'Dior',           baseScore:87, price:480, isSafe:true, status:'safe',    families:['spicy','citrus'],       ingredients:['pepper','bergamot','amber'],        symptomTriggers:['sneeze'] },
    { id:'5',  name:"Terre d'Hermes",   brand:'Hermes',         baseScore:90, price:520, isSafe:true, status:'safe',    families:['citrus','woody'],       ingredients:['bergamot','sandalwood','patchouli'],symptomTriggers:[] },
    { id:'6',  name:'Flowerbomb',       brand:'Viktor Rolf',    baseScore:45, price:380, isSafe:false,status:'danger',  families:['floral','gourmand'],    ingredients:['jasmine','rose','vanilla'],         symptomTriggers:['sneeze','headache','nausea'] },
    { id:'7',  name:'Black Opium',      brand:'YSL',            baseScore:38, price:420, isSafe:false,status:'danger',  families:['gourmand','floral'],    ingredients:['vanilla','jasmine','amber'],        symptomTriggers:['headache','nausea'] },
    { id:'8',  name:'Noir',             brand:'Tom Ford',       baseScore:82, price:680, isSafe:true, status:'warning', families:['spicy','leather'],      ingredients:['pepper','leather','vanilla'],       symptomTriggers:['sneeze'],            variant:'just-arrived' },
    { id:'9',  name:'Baccarat Rouge',   brand:'Maison Francis', baseScore:75, price:750, isSafe:true, status:'warning', families:['floral','woody'],       ingredients:['jasmine','amber','sandalwood'],     symptomTriggers:[],                    variant:'just-arrived' },
    { id:'10', name:'Santal 33',        brand:'Le Labo',        baseScore:88, price:620, isSafe:true, status:'safe',    families:['woody','gourmand'],     ingredients:['sandalwood','vanilla','leather'],   symptomTriggers:[] },
    { id:'11', name:'Creed Aventus',    brand:'Creed',          baseScore:90, price:580, isSafe:true, status:'safe',    families:['citrus','woody'],       ingredients:['bergamot','patchouli','musk'],      symptomTriggers:[] },
    { id:'12', name:'Amouage',          brand:'Amouage',        baseScore:85, price:720, isSafe:true, status:'safe',    families:['floral','woody'],       ingredients:['rose','oud','amber'],               symptomTriggers:['headache'] },
    { id:'13', name:'Byredo',           brand:'Byredo',         baseScore:80, price:590, isSafe:true, status:'warning', families:['gourmand','woody'],     ingredients:['vanilla','sandalwood','musk'],      symptomTriggers:[],                    variant:'just-arrived' },
    { id:'14', name:'Diptyque',         brand:'Diptyque',       baseScore:78, price:540, isSafe:true, status:'warning', families:['floral'],               ingredients:['rose','musk','jasmine'],           symptomTriggers:['sneeze','rash'],     variant:'just-arrived' },
    { id:'15', name:'Penhaligon',       brand:'Penhaligon',     baseScore:83, price:650, isSafe:true, status:'safe',    families:['floral','citrus'],      ingredients:['lavender','bergamot','musk'],       symptomTriggers:[] },
    { id:'16', name:'Maison Margiela',  brand:'MM',             baseScore:77, price:580, isSafe:true, status:'warning', families:['leather','spicy'],      ingredients:['leather','pepper','patchouli'],     symptomTriggers:['sneeze','nausea'],   variant:'just-arrived' },
    { id:'17', name:'Kilian',           brand:'Kilian',         baseScore:81, price:690, isSafe:true, status:'safe',    families:['gourmand'],             ingredients:['vanilla','amber','musk'],           symptomTriggers:[] },
    { id:'18', name:'Roja',             brand:'Roja',           baseScore:79, price:850, isSafe:true, status:'warning', families:['woody','floral'],       ingredients:['oud','rose','amber'],               symptomTriggers:['headache'],          variant:'just-arrived' },
    { id:'19', name:'Xerjoff',          brand:'Xerjoff',        baseScore:84, price:780, isSafe:true, status:'safe',    families:['woody','oriental'],     ingredients:['oud','vanilla','sandalwood'],       symptomTriggers:[] },
  ]
  for (const p of perfumes) {
    await neon(
      `INSERT INTO perfumes (id, name, brand, image, price, "baseScore", families, ingredients, symptom_triggers, "isSafe", status, variant, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        p.id, p.name, p.brand,
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop',
        p.price, p.baseScore,
        JSON.stringify(p.families), JSON.stringify(p.ingredients), JSON.stringify(p.symptomTriggers),
        p.isSafe, p.status, p.variant ?? null
      ]
    )
    console.log(`  ✅ perfume: ${p.brand} ${p.name}`)
  }
}

// ─── Phase A closure: DB sample BEFORE writes ────────────────────────────────
async function dbSampleBeforeWrites() {
  console.log('\n=== [backfill] DB sample BEFORE any writes ===')
  const r = await neon(
    `SELECT id, name, brand, "fragellaSlug" FROM perfumes ORDER BY id LIMIT 20`
  )
  const rows = r.rows
  console.log(JSON.stringify(rows, null, 2))

  const nullCount    = rows.filter(p => p.fragellaSlug === null).length
  const nonNullCount = rows.filter(p => p.fragellaSlug !== null).length
  console.log(`[backfill] ${nullCount}/${rows.length} have null fragellaSlug`)
  console.log(`[backfill] ${nonNullCount}/${rows.length} already have fragellaSlug`)

  if (nonNullCount > 0) {
    console.log('[backfill] WARNING: checking existing values against canonical formula...')
    for (const p of rows.filter(p => p.fragellaSlug !== null)) {
      const expected = buildSlug(p.brand, p.name)
      const matches  = p.fragellaSlug === expected
      console.log(`  - ${p.name} (${p.brand}): stored="${p.fragellaSlug}" expected="${expected}" ${matches ? '✅' : '❌ MISMATCH'}`)
      if (!matches) {
        console.error('[backfill] BLOCKER: Mismatch detected. Stopping.')
        process.exit(1)
      }
    }
  }
  return { nullCount, nonNullCount, total: rows.length }
}

// ─── Backfill fragellaSlug ────────────────────────────────────────────────────
async function backfillSlugs() {
  console.log('\n=== [backfill] Running backfill ===')

  // Get all perfumes with null fragellaSlug
  const r = await neon(`SELECT id, name, brand FROM perfumes WHERE "fragellaSlug" IS NULL`)
  const nullPerfumes = r.rows
  console.log(`[backfill] Total with null fragellaSlug: ${nullPerfumes.length}`)

  // Get existing slugs to detect conflicts
  const existingR = await neon(`SELECT "fragellaSlug" FROM perfumes WHERE "fragellaSlug" IS NOT NULL`)
  const existingSlugs = new Set(existingR.rows.map(p => p.fragellaSlug))

  const stats = { scanned: nullPerfumes.length, updated: 0, skippedConflict: 0, errors: 0 }
  const pendingSlugs = new Set()

  for (const p of nullPerfumes) {
    const slug = buildSlug(p.brand, p.name)

    if (existingSlugs.has(slug) || pendingSlugs.has(slug)) {
      console.warn(`[backfill] CONFLICT — skip id=${p.id} "${p.brand} ${p.name}": slug="${slug}" exists`)
      stats.skippedConflict++
      continue
    }

    try {
      await neon(`UPDATE perfumes SET "fragellaSlug"=$1, updated_at=NOW() WHERE id=$2`, [slug, p.id])
      pendingSlugs.add(slug)
      console.log(`[backfill] Updated id=${p.id} "${p.brand} ${p.name}" → "${slug}"`)
      stats.updated++
    } catch (err) {
      console.error(`[backfill] ERROR on id=${p.id}:`, err.message)
      stats.errors++
    }
  }

  console.log('\n[backfill] === Final Stats ===')
  console.log(`  scanned:         ${stats.scanned}`)
  console.log(`  updated:         ${stats.updated}`)
  console.log(`  skippedConflict: ${stats.skippedConflict}`)
  console.log(`  errors:          ${stats.errors}`)
  return stats
}

// ─── Fill prices ─────────────────────────────────────────────────────────────
async function fillPrices() {
  console.log('\n=== [fill-prices] Seeding prices ===')

  const storesR = await neon(`SELECT id, slug, name FROM stores WHERE "isActive"=true`)
  const storeBySlug = Object.fromEntries(storesR.rows.map(s => [s.slug, s]))
  console.log(`[fill-prices] Active stores: ${storesR.rows.map(s => s.slug).join(', ')}`)

  const targets = [
    {
      fragellaSlug: 'creed-aventus',
      stores: [
        { slug: 'goldenscent', price: 595, url: 'https://www.goldenscent.com/en/creed-aventus-edp-100ml/p-1001' },
        { slug: 'niceone',     price: 579, url: 'https://niceonesa.com/en/creed-aventus-edp-100ml/p-2001' },
        { slug: 'faces',       price: 620, url: 'https://www.faces.sa/en/creed-aventus-edp-100ml/p-3001' }
      ]
    },
    {
      fragellaSlug: 'chanel-bleu-de-chanel',
      stores: [
        { slug: 'goldenscent', price: 460, url: 'https://www.goldenscent.com/en/chanel-bleu-de-chanel-edp-100ml/p-1002' },
        { slug: 'niceone',     price: 445, url: 'https://niceonesa.com/en/chanel-bleu-de-chanel-edp-100ml/p-2002' }
      ]
    },
    {
      fragellaSlug: 'tom-ford-oud-wood',
      stores: [
        { slug: 'goldenscent', price: 680, url: 'https://www.goldenscent.com/en/tom-ford-oud-wood-edp-50ml/p-1003' },
        { slug: 'faces',       price: 710, url: 'https://www.faces.sa/en/tom-ford-oud-wood-edp-50ml/p-3003' }
      ]
    }
  ]

  let totalUpserted = 0, totalSkipped = 0

  for (const target of targets) {
    const perfR = await neon(`SELECT id, name, brand FROM perfumes WHERE "fragellaSlug"=$1`, [target.fragellaSlug])
    if (!perfR.rows.length) {
      console.warn(`[fill-prices] SKIP — no perfume with fragellaSlug="${target.fragellaSlug}"`)
      totalSkipped++
      continue
    }
    const perf = perfR.rows[0]
    console.log(`\n[fill-prices] "${perf.brand} ${perf.name}" (slug="${target.fragellaSlug}")`)

    for (const entry of target.stores) {
      const store = storeBySlug[entry.slug]
      if (!store) { console.warn(`  SKIP "${entry.slug}" not found`); continue }

      // Upsert on (perfumeId, storeId)
      await neon(
        `INSERT INTO prices (perfume_id, store_id, price, currency, "listingUrl", "isAvailable", updated_at)
         VALUES ($1, $2, $3, 'SAR', $4, true, NOW())
         ON CONFLICT (perfume_id, store_id) DO UPDATE
           SET price=$3, currency='SAR', "listingUrl"=$4, "isAvailable"=true, updated_at=NOW()`,
        [perf.id, store.id, entry.price, entry.url]
      )
      console.log(`  ✅ ${store.name} (id=${store.id}) @ SAR ${entry.price}`)
      totalUpserted++
    }
  }

  console.log('\n[fill-prices] === Final Stats ===')
  console.log(`  Price rows upserted:                  ${totalUpserted}`)
  console.log(`  Perfumes skipped (no fragellaSlug):   ${totalSkipped}`)
}

// ─── End-to-end verify ───────────────────────────────────────────────────────
async function verifyEndToEnd(fragellaSlug) {
  console.log(`\n=== [verify] /api/store-prices?fragellaSlug=${fragellaSlug} ===`)

  const perfR = await neon(`SELECT id FROM perfumes WHERE "fragellaSlug"=$1`, [fragellaSlug])
  if (!perfR.rows.length) {
    console.error(`[verify] No perfume found with fragellaSlug="${fragellaSlug}"`)
    return
  }
  const perfumeId = perfR.rows[0].id

  const pricesR = await neon(
    `SELECT p.price, p.currency, p."listingUrl", s.name, s.slug, s."logoUrl", s."discountCode", s."discountLabel"
     FROM prices p
     JOIN stores s ON s.id = p.store_id
     WHERE p.perfume_id=$1 AND p."isAvailable"=true AND p."listingUrl" IS NOT NULL AND s."isActive"=true
     ORDER BY p.price ASC, s.priority DESC`,
    [perfumeId]
  )

  const stores = pricesR.rows.map(r => ({
    name: r.name,
    slug: r.slug,
    price: r.price,
    currency: r.currency || 'SAR',
    url: r.listingUrl,
    discountCode: r.discountCode,
    discountLabel: r.discountLabel,
    logoUrl: r.logoUrl
  }))

  const response = {
    stores,
    meta: {
      fragellaSlug,
      count: stores.length,
      lastUpdated: stores.length > 0 ? new Date().toISOString() : null
    }
  }

  console.log('[verify] API response:')
  console.log(JSON.stringify(response, null, 2))
  if (stores.length > 0) {
    console.log(`\n[verify] ✅ SUCCESS — ${stores.length} store(s) returned`)
  } else {
    console.log('\n[verify] ❌ FAIL — stores array is empty')
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // Step 0: Seed prerequisite data (DB is empty — seed never ran)
  const countR = await neon('SELECT COUNT(*) as c FROM perfumes')
  const count  = parseInt(countR.rows[0].c, 10)
  if (count === 0) {
    console.log('[runner] DB is empty — running prerequisite seed first...')
    await seedStores()
    await seedPerfumes()
  } else {
    console.log(`[runner] DB has ${count} perfumes — skipping seed`)
  }

  // Step 1: DB sample (Phase A closure)
  const { nullCount } = await dbSampleBeforeWrites()

  if (nullCount === 0) {
    console.log('[backfill] All sampled perfumes already have fragellaSlug.')
  } else {
    // Step 2: Backfill slugs
    await backfillSlugs()
  }

  // Step 3: Fill prices
  await fillPrices()

  // Step 4: End-to-end verify
  await verifyEndToEnd('creed-aventus')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })

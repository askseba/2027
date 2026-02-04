// prisma/seed.ts
// Seed script to populate database with initial perfume data
// Run: npx prisma db seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error']
})

// Sample scent pyramids for each perfume
const scentPyramids: Record<string, { top: string[], heart: string[], base: string[] }> = {
  '1': { top: ['bergamot', 'lemon', 'mint'], heart: ['ginger', 'nutmeg', 'jasmine'], base: ['sandalwood', 'cedar', 'vetiver'] },
  '2': { top: ['pineapple', 'bergamot', 'apple'], heart: ['birch', 'patchouli', 'jasmine'], base: ['musk', 'oak moss', 'ambergris'] },
  '3': { top: ['rosewood', 'cardamom'], heart: ['oud', 'sandalwood', 'vetiver'], base: ['tonka bean', 'amber'] },
  '4': { top: ['bergamot', 'pepper'], heart: ['lavender', 'geranium', 'elemi'], base: ['ambroxan', 'cedar', 'labdanum'] },
  '5': { top: ['orange', 'grapefruit'], heart: ['pepper', 'geranium', 'flint'], base: ['cedar', 'vetiver', 'benzoin'] },
  '6': { top: ['bergamot', 'tea'], heart: ['jasmine', 'orchid', 'rose'], base: ['patchouli', 'musk'] },
  '7': { top: ['pink pepper', 'orange blossom', 'pear'], heart: ['coffee', 'jasmine', 'bitter almond'], base: ['vanilla', 'patchouli', 'cedar'] },
  '8': { top: ['bergamot', 'verbena', 'pink pepper'], heart: ['nutmeg', 'clove', 'rose'], base: ['amber', 'vanilla', 'oud', 'leather'] },
  '9': { top: ['saffron', 'jasmine'], heart: ['amberwood', 'ambergris'], base: ['fir resin', 'cedar'] },
  '10': { top: ['violet', 'cardamom'], heart: ['iris', 'violet leaf', 'ambrox'], base: ['sandalwood', 'leather', 'cedar'] },
  '11': { top: ['pineapple', 'bergamot', 'blackcurrant'], heart: ['birch', 'patchouli', 'moroccan jasmine'], base: ['musk', 'oak moss', 'ambergris', 'vanilla'] },
  '12': { top: ['frankincense', 'coriander'], heart: ['rose', 'jasmine', 'orris'], base: ['oud', 'sandalwood', 'musk'] },
  '13': { top: ['cardamom', 'carrot'], heart: ['iris', 'violet'], base: ['sandalwood', 'leather', 'cedar', 'musk'] },
  '14': { top: ['bergamot', 'pink pepper'], heart: ['rose', 'iris', 'patchouli'], base: ['white musk', 'sandalwood'] },
  '15': { top: ['lavender', 'bergamot', 'lime'], heart: ['geranium', 'jasmine'], base: ['sandalwood', 'musk', 'amber'] },
  '16': { top: ['clove', 'pink pepper'], heart: ['leather', 'tobacco'], base: ['patchouli', 'vanilla', 'tonka bean'] },
  '17': { top: ['bergamot', 'lemon'], heart: ['orange blossom', 'jasmine'], base: ['vanilla', 'tonka bean', 'musk', 'amber'] },
  '18': { top: ['bergamot', 'lemon', 'mandarin'], heart: ['rose', 'jasmine', 'orris'], base: ['oud', 'sandalwood', 'musk', 'amber'] },
  '19': { top: ['bergamot', 'galbanum'], heart: ['oud', 'rose', 'saffron'], base: ['sandalwood', 'musk', 'amber'] },
}

// Import perfume data from Step 1.2 (with families, ingredients, symptomTriggers)
const perfumesData = [
  {
    id: '1',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop&crop=center',
    baseScore: 92,
    price: 450,
    isSafe: true,
    status: 'safe',
    description: 'عطر فاخر يجمع بين الحمضيات والأخشاب',
    families: ['citrus', 'woody'],
    ingredients: ['bergamot', 'sandalwood', 'lavender'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '2',
    name: 'Aventus',
    brand: 'Creed',
    image: 'https://images.unsplash.com/photo-1594035910387-f4d5fb3a8a1a?w=300&h=400&fit=crop&crop=center',
    baseScore: 88,
    price: 550,
    isSafe: true,
    status: 'safe',
    description: 'عطر ملكي بلمسات من الأناناس والبرغموت',
    families: ['citrus', 'woody'],
    ingredients: ['bergamot', 'patchouli', 'musk'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '3',
    name: 'Oud Wood',
    brand: 'Tom Ford',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=400&fit=crop&crop=center',
    baseScore: 85,
    price: 650,
    isSafe: true,
    status: 'safe',
    description: 'مزيج فاخر من العود والورد',
    families: ['woody', 'floral'],
    ingredients: ['oud', 'rose', 'sandalwood'],
    symptomTriggers: ['headache'],
    variant: null
  },
  {
    id: '4',
    name: 'Sauvage',
    brand: 'Dior',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=300&h=400&fit=crop&crop=center',
    baseScore: 87,
    price: 480,
    isSafe: true,
    status: 'safe',
    description: 'عطر قوي بلمسات من الفلفل والبرغموت',
    families: ['spicy', 'citrus'],
    ingredients: ['pepper', 'bergamot', 'amber'],
    symptomTriggers: ['sneeze'],
    variant: null
  },
  {
    id: '5',
    name: "Terre d'Hermès",
    brand: 'Hermès',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83d34b48?w=300&h=400&fit=crop&crop=center',
    baseScore: 90,
    price: 520,
    isSafe: true,
    status: 'safe',
    description: 'عطر ترابي بلمسات من البرتقال والفلين',
    families: ['citrus', 'woody'],
    ingredients: ['bergamot', 'sandalwood', 'patchouli'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '6',
    name: 'Flowerbomb',
    brand: 'Viktor & Rolf',
    image: 'https://images.unsplash.com/photo-1595425970377-c97073cce242?w=300&h=400&fit=crop&crop=center',
    baseScore: 45,
    price: 380,
    isSafe: false,
    status: 'danger',
    description: 'عطر زهري قوي قد لا يناسب الجميع',
    families: ['floral', 'gourmand'],
    ingredients: ['jasmine', 'rose', 'vanilla'],
    symptomTriggers: ['sneeze', 'headache', 'nausea'],
    variant: null
  },
  {
    id: '7',
    name: 'Black Opium',
    brand: 'YSL',
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e3ab?w=300&h=400&fit=crop&crop=center',
    baseScore: 38,
    price: 420,
    isSafe: false,
    status: 'danger',
    description: 'عطر حلو قوي بلمسات من الفانيليا والقهوة',
    families: ['gourmand', 'floral'],
    ingredients: ['vanilla', 'jasmine', 'amber'],
    symptomTriggers: ['headache', 'nausea'],
    variant: null
  },
  {
    id: '8',
    name: 'Noir',
    brand: 'Tom Ford',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=300&h=400&fit=crop&crop=center',
    baseScore: 82,
    price: 680,
    isSafe: true,
    status: 'warning',
    description: 'عطر ليلي فاخر بلمسات من التوابل',
    families: ['spicy', 'leather'],
    ingredients: ['pepper', 'leather', 'vanilla'],
    symptomTriggers: ['sneeze'],
    variant: 'just-arrived'
  },
  {
    id: '9',
    name: 'Baccarat Rouge',
    brand: 'Maison Francis',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=400&fit=crop&crop=center',
    baseScore: 75,
    price: 750,
    isSafe: true,
    status: 'warning',
    description: 'عطر فاخر بلمسات من الزعفران والعنبر',
    families: ['floral', 'woody'],
    ingredients: ['jasmine', 'amber', 'sandalwood'],
    symptomTriggers: [],
    variant: 'just-arrived'
  },
  {
    id: '10',
    name: 'Santal 33',
    brand: 'Le Labo',
    image: 'https://images.unsplash.com/photo-1594035910387-f4d5fb3a8a1a?w=300&h=400&fit=crop&crop=center',
    baseScore: 88,
    price: 620,
    isSafe: true,
    status: 'safe',
    description: 'عطر خشبي بلمسات من الصندل والفانيليا',
    families: ['woody', 'gourmand'],
    ingredients: ['sandalwood', 'vanilla', 'leather'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '11',
    name: 'Creed Aventus',
    brand: 'Creed',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop&crop=center',
    baseScore: 90,
    price: 580,
    isSafe: true,
    status: 'safe',
    description: 'نسخة محدودة من Aventus الكلاسيكي',
    families: ['citrus', 'woody'],
    ingredients: ['bergamot', 'patchouli', 'musk'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '12',
    name: 'Amouage',
    brand: 'Amouage',
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e3ab?w=300&h=400&fit=crop&crop=center',
    baseScore: 85,
    price: 720,
    isSafe: true,
    status: 'safe',
    description: 'عطر عماني فاخر بلمسات من اللبان والورد',
    families: ['floral', 'woody'],
    ingredients: ['rose', 'oud', 'amber'],
    symptomTriggers: ['headache'],
    variant: null
  },
  {
    id: '13',
    name: 'Byredo',
    brand: 'Byredo',
    image: 'https://images.unsplash.com/photo-1595425970377-c97073cce242?w=300&h=400&fit=crop&crop=center',
    baseScore: 80,
    price: 590,
    isSafe: true,
    status: 'warning',
    description: 'عطر سويدي معاصر بلمسات من الفانيليا',
    families: ['gourmand', 'woody'],
    ingredients: ['vanilla', 'sandalwood', 'musk'],
    symptomTriggers: [],
    variant: 'just-arrived'
  },
  {
    id: '14',
    name: 'Diptyque',
    brand: 'Diptyque',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83d34b48?w=300&h=400&fit=crop&crop=center',
    baseScore: 78,
    price: 540,
    isSafe: true,
    status: 'warning',
    description: 'عطر فرنسي بلمسات من الورد والمسك',
    families: ['floral'],
    ingredients: ['rose', 'musk', 'jasmine'],
    symptomTriggers: ['sneeze', 'rash'],
    variant: 'just-arrived'
  },
  {
    id: '15',
    name: 'Penhaligon',
    brand: 'Penhaligon',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=300&h=400&fit=crop&crop=center',
    baseScore: 83,
    price: 650,
    isSafe: true,
    status: 'safe',
    description: 'عطر بريطاني كلاسيكي بلمسات من الخزامى',
    families: ['floral', 'citrus'],
    ingredients: ['lavender', 'bergamot', 'musk'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '16',
    name: 'Maison Margiela',
    brand: 'MM',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=400&fit=crop&crop=center',
    baseScore: 77,
    price: 580,
    isSafe: true,
    status: 'warning',
    description: 'عطر معاصر بلمسات من الجلد والتبغ',
    families: ['leather', 'spicy'],
    ingredients: ['leather', 'pepper', 'patchouli'],
    symptomTriggers: ['sneeze', 'nausea'],
    variant: 'just-arrived'
  },
  {
    id: '17',
    name: 'Kilian',
    brand: 'Kilian',
    image: 'https://images.unsplash.com/photo-1594035910387-f4d5fb3a8a1a?w=300&h=400&fit=crop&crop=center',
    baseScore: 81,
    price: 690,
    isSafe: true,
    status: 'safe',
    description: 'عطر فاخر بلمسات من الفانيليا والكاكاو',
    families: ['gourmand'],
    ingredients: ['vanilla', 'amber', 'musk'],
    symptomTriggers: [],
    variant: null
  },
  {
    id: '18',
    name: 'Roja',
    brand: 'Roja',
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e3ab?w=300&h=400&fit=crop&crop=center',
    baseScore: 79,
    price: 850,
    isSafe: true,
    status: 'warning',
    description: 'عطر فاخر بلمسات من العود والورد',
    families: ['woody', 'floral'],
    ingredients: ['oud', 'rose', 'amber'],
    symptomTriggers: ['headache'],
    variant: 'just-arrived'
  },
  {
    id: '19',
    name: 'Xerjoff',
    brand: 'Xerjoff',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop&crop=center',
    baseScore: 84,
    price: 780,
    isSafe: true,
    status: 'safe',
    description: 'عطر إيطالي فاخر بلمسات من العود والمسك',
    families: ['woody'],
    ingredients: ['oud', 'musk', 'sandalwood'],
    symptomTriggers: [],
    variant: null
  }
]

// Store data - 7 متاجر سعودية
const storesData = [
  {
    name: 'FACES وجوه',
    slug: 'faces',
    affiliateUrl: 'https://www.faces.sa/?utm_source=askseba',
    commission: 8.0,
    isActive: true
  },
  {
    name: 'Nice One نايس ون',
    slug: 'niceone',
    affiliateUrl: 'https://niceonesa.com/?utm_source=askseba',
    commission: 10.0,
    isActive: true
  },
  {
    name: 'Golden Scent قولدن سنت',
    slug: 'goldenscent',
    affiliateUrl: 'https://www.goldenscent.com/?utm_source=askseba',
    commission: 12.0,
    isActive: true
  },
  {
    name: 'السلطان للعطور',
    slug: 'sultan',
    affiliateUrl: 'https://sultanperfumes.net/?utm_source=askseba',
    commission: 7.0,
    isActive: true
  },
  {
    name: 'لوجا ستور',
    slug: 'lojastore',
    affiliateUrl: 'https://lojastoregt.com/?utm_source=askseba',
    commission: 9.0,
    isActive: true
  },
  {
    name: 'فانيلا للعطور',
    slug: 'vanilla',
    affiliateUrl: 'https://vanilla.sa/?utm_source=askseba',
    commission: 8.5,
    isActive: true
  },
  {
    name: 'أوناس السعودية',
    slug: 'ounass-sa',
    affiliateUrl: 'https://saudi.ounass.com/?utm_source=askseba',
    commission: 15.0,
    isActive: true
  }
]

async function main() {
  console.log('🌱 Starting seed...')
  
  // Clear existing data
  await prisma.price.deleteMany()
  // Delete old stores or set isActive=false
  await prisma.store.updateMany({
    where: { isActive: true },
    data: { isActive: false }
  })
  console.log('🗑️  Deactivated old stores')
  
  // Clear perfumes (optional - comment out if you want to keep existing perfumes)
  await prisma.perfume.deleteMany()
  console.log('🗑️  Cleared existing perfumes')
  
  // Seed stores (upsert to avoid duplicates)
  console.log('\n🏪 Seeding stores...')
  for (const store of storesData) {
    await prisma.store.upsert({
      where: { slug: store.slug },
      update: {
        name: store.name,
        affiliateUrl: store.affiliateUrl,
        commission: store.commission,
        isActive: store.isActive
      },
      create: store
    })
    console.log(`✅ Created/Updated store: ${store.name}`)
  }
  
  // Seed perfumes
  console.log('\n🌸 Seeding perfumes...')
  for (const perfume of perfumesData) {
    const pyramid = scentPyramids[perfume.id] || { top: [], heart: [], base: [] }
    
    await prisma.perfume.create({
      data: {
        id: perfume.id,
        name: perfume.name,
        brand: perfume.brand,
        image: perfume.image,
        description: perfume.description,
        price: perfume.price,
        baseScore: perfume.baseScore,
        scentPyramid: JSON.stringify(pyramid),
        families: JSON.stringify(perfume.families),
        ingredients: JSON.stringify(perfume.ingredients),
        symptomTriggers: JSON.stringify(perfume.symptomTriggers),
        isSafe: perfume.isSafe,
        status: perfume.status,
        variant: perfume.variant
      }
    })
    console.log(`✅ Created: ${perfume.name}`)
  }
  
  console.log(`\n🎉 Seeded ${storesData.length} stores and ${perfumesData.length} perfumes successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

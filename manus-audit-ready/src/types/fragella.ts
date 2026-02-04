export interface FragellaSearchResponse {
  success: boolean
  data: FragellaPerfume[]
  count: number
  remaining: number
}

export interface FragellaPerfume {
  Name: string
  Brand: string
  'Image URL': string
  Notes?: string
  Gender?: string
  // يمكن إضافة حقول أخرى حسب response
}

/** تحويل Fragella إلى format الواجهة (id, name, brand, image) */
export function convertFragellaToLocal(fragella: FragellaPerfume): {
  id: string
  name: string
  brand: string
  image: string
} {
  return {
    id: fragella.Name.toLowerCase().replace(/\s+/g, '-'), // temporary ID
    name: fragella.Name,
    brand: fragella.Brand,
    image: fragella['Image URL'] || '/placeholder-perfume.png'
  }
}

import { useState } from 'react'

export interface ResultsFilters {
  matchPercentage: number
  maxPrice: number
  families: string[]
}

export function useResultsFilters() {
  const [filters, setFilters] = useState<ResultsFilters>({
    matchPercentage: 0,
    maxPrice: 5000,
    families: []
  })

  return { filters, setFilters }
}

'use client'

import { useState, useEffect } from 'react'

interface LatLng { lat: number; lng: number }

const cache: Record<string, LatLng[] | null> = {}

export function useRouteShape(lineNumber: string | null): LatLng[] | null {
  const [coords, setCoords] = useState<LatLng[] | null>(null)

  useEffect(() => {
    if (!lineNumber) { setCoords(null); return }

    // Los archivos usan formato 3 dígitos: "1" → "001", "109" → "109"
    const padded = lineNumber.padStart(3, '0')

    if (padded in cache) { setCoords(cache[padded]); return }

    fetch(`/routes/${padded}.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: LatLng[] | null) => {
        cache[padded] = data
        setCoords(data)
      })
      .catch(() => {
        cache[padded] = null
        setCoords(null)
      })
  }, [lineNumber])

  return coords
}

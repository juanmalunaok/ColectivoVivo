'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY = 'cv_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setFavorites(JSON.parse(raw))
    } catch (_) {}
  }, [])

  const persist = useCallback((next: string[]) => {
    setFavorites(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch (_) {}
  }, [])

  const toggle = useCallback((lineNumber: string) => {
    setFavorites((prev) => {
      const next = prev.includes(lineNumber)
        ? prev.filter((n) => n !== lineNumber)
        : [...prev, lineNumber]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch (_) {}
      return next
    })
  }, [])

  const has = useCallback((lineNumber: string) => favorites.includes(lineNumber), [favorites])

  return { favorites, toggle, has, set: persist }
}

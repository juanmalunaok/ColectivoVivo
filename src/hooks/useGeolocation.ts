'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface GeoState {
  lat: number | null
  lng: number | null
  heading: number | null
  speed: number | null       // m/s desde la API, convertimos a km/h
  error: string | null
  loading: boolean
}

interface UseGeolocationOptions {
  enabled: boolean
  onUpdate?: (lat: number, lng: number, heading: number | null, speedKmh: number | null) => void
  intervalMs?: number
}

export function useGeolocation({
  enabled,
  onUpdate,
  intervalMs = 5000,
}: UseGeolocationOptions): GeoState {
  const [state, setState] = useState<GeoState>({
    lat: null, lng: null, heading: null, speed: null, error: null, loading: false,
  })

  const watchIdRef = useRef<number | null>(null)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude, heading, speed } = pos.coords
    const speedKmh = speed != null ? Math.round(speed * 3.6) : null

    setState({
      lat: latitude,
      lng: longitude,
      heading: heading ?? null,
      speed: speedKmh,
      error: null,
      loading: false,
    })

    onUpdateRef.current?.(latitude, longitude, heading ?? null, speedKmh)
  }, [])

  const handleError = useCallback((err: GeolocationPositionError) => {
    const messages: Record<number, string> = {
      1: 'Permiso de ubicación denegado. Habilitá el GPS para compartir tu posición.',
      2: 'No se pudo obtener la ubicación. Verificá que el GPS esté activo.',
      3: 'Tiempo de espera agotado al obtener la ubicación.',
    }
    setState((prev) => ({
      ...prev,
      error: messages[err.code] ?? 'Error desconocido de geolocalización.',
      loading: false,
    }))
  }, [])

  useEffect(() => {
    if (!enabled) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      setState({ lat: null, lng: null, heading: null, speed: null, error: null, loading: false })
      return
    }

    if (!('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        error: 'Tu dispositivo no soporta geolocalización.',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true }))

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge:         intervalMs,
        timeout:            10_000,
      },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [enabled, handleSuccess, handleError, intervalMs])

  return state
}

'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Solicita un Screen Wake Lock mientras `enabled` sea true.
 * Mantiene la pantalla encendida para que el rastreo GPS no se corte.
 * En Android Chrome también permite que la geolocalización siga corriendo
 * cuando la app está minimizada (el navegador queda activo en background).
 * En iOS Safari el Wake Lock no está soportado; el rastreo se pausará
 * si la pantalla se apaga.
 */
export function useWakeLock(enabled: boolean) {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const [active, setActive] = useState(false)
  const lockRef = useRef<{ release: () => Promise<void> } | null>(null)

  useEffect(() => {
    if (!enabled || !supported) return

    let released = false

    async function acquire() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wl = await (navigator as any).wakeLock.request('screen')
        if (released) { wl.release(); return }
        lockRef.current = wl
        setActive(true)
        wl.addEventListener('release', () => setActive(false))
      } catch {
        // El usuario denegó el permiso o no está soportado
      }
    }

    acquire()

    // Re-adquirir al volver al tab/app (el lock se libera automáticamente al ir a background)
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      released = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      lockRef.current?.release().catch(() => {})
      lockRef.current = null
      setActive(false)
    }
  }, [enabled, supported])

  return { supported, active }
}

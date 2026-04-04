'use client'

import { useEffect, useRef, useState } from 'react'

export type KeepAwakeMethod = 'wakeLock' | 'audio' | 'none'

function detectIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Mantiene la pantalla encendida mientras `enabled` sea true.
 *
 * - Android / Chrome: usa Screen Wake Lock API.
 * - iOS Safari / PWA: reproduce silencio en loop con AudioContext.
 *   El AudioContext requiere un gesto del usuario previo; si no fue desbloqueado
 *   todavía, espera el primer `touchstart`.
 *
 * En ambos casos el GPS sigue corriendo mientras la pantalla esté encendida.
 * El rastreo se pausa si la pantalla se apaga (limitación del sistema).
 */
export function useKeepAwake(enabled: boolean) {
  const [ios]     = useState(detectIOS)
  const wlOk      = !ios && typeof navigator !== 'undefined' && 'wakeLock' in navigator

  const [active, setActive]   = useState(false)
  const [method, setMethod]   = useState<KeepAwakeMethod>('none')

  const lockRef  = useRef<{ release: () => Promise<void> } | null>(null)
  const audioRef = useRef<AudioContext | null>(null)

  // ── Wake Lock (Android / Desktop) ──────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !wlOk) return
    let gone = false

    async function acquire() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wl = await (navigator as any).wakeLock.request('screen')
        if (gone) { wl.release(); return }
        lockRef.current = wl
        setActive(true)
        setMethod('wakeLock')
        wl.addEventListener('release', () => { if (!gone) setActive(false) })
      } catch { /* permiso denegado */ }
    }

    acquire()

    function onVis() { if (document.visibilityState === 'visible') acquire() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      gone = true
      document.removeEventListener('visibilitychange', onVis)
      lockRef.current?.release().catch(() => {})
      lockRef.current = null
      setActive(false)
      setMethod('none')
    }
  }, [enabled, wlOk])

  // ── AudioContext silent loop (iOS) ─────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !ios) return
    let gone = false

    function startAudio() {
      if (gone || audioRef.current) return
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AC = window.AudioContext ?? (window as any).webkitAudioContext
        if (!AC) return
        const ctx = new AC() as AudioContext

        ctx.resume().then(() => {
          if (gone || ctx.state !== 'running') { ctx.close(); return }

          // Buffer de 1 segundo con silencio (valor mínimo para que iOS no lo descarte)
          const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
          const src = ctx.createBufferSource()
          src.buffer = buf
          src.loop   = true
          src.connect(ctx.destination)
          src.start()

          audioRef.current = ctx
          setActive(true)
          setMethod('audio')
        }).catch(() => { ctx.close() })
      } catch { /* no soportado */ }
    }

    // Intenta inmediatamente (funciona si ya hubo un gesto de usuario)
    startAudio()

    // Fallback: espera el primer toque si el contexto no pudo abrirse aún
    window.addEventListener('touchstart', startAudio, { once: true })

    return () => {
      gone = true
      window.removeEventListener('touchstart', startAudio)
      audioRef.current?.close().catch(() => {})
      audioRef.current = null
      setActive(false)
      setMethod('none')
    }
  }, [enabled, ios])

  return {
    active,
    method,
    ios,
    /** true si el dispositivo tiene algún mecanismo disponible */
    supported: wlOk || ios,
  }
}

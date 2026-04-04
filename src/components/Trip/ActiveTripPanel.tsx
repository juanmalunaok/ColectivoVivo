'use client'

import { useEffect, useState } from 'react'
import type { TripState } from '@/types'

interface Props {
  trip:     TripState
  speed:    number | null
  geoError: string | null
  onStop:   () => Promise<void>
}

export function ActiveTripPanel({ trip, speed, geoError, onStop }: Props) {
  const [elapsed,  setElapsed]  = useState(0)
  const [stopping, setStopping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  function formatTime(s: number) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  async function handleStop() {
    setStopping(true)
    try { await onStop() } finally { setStopping(false) }
  }

  const border = 'rgba(255,255,255,0.07)'

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      <div className="mx-4 mb-6 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
        style={{ background: '#0f0f1a', border: `1px solid ${border}` }}>

        {/* Barra de estado */}
        <div className="flex items-center gap-2.5 px-4 py-2.5"
          style={{ background: 'rgba(99,102,241,0.12)', borderBottom: `1px solid rgba(99,102,241,0.2)` }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#4ade80' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#22c55e' }} />
          </span>
          <span className="text-xs font-semibold" style={{ color: '#818cf8' }}>
            Viaje activo · {formatTime(elapsed)}
          </span>
        </div>

        <div className="px-4 py-4">
          {/* Info de línea */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl text-white font-black text-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
              {trip.lineNumber}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-base leading-tight">Línea {trip.lineNumber}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#64748b' }}>{trip.branchName}</p>
            </div>
            {speed !== null && (
              <div className="text-right flex-shrink-0 rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${border}` }}>
                <p className="text-xl font-black text-white leading-none">{speed}</p>
                <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>km/h</p>
              </div>
            )}
          </div>

          {geoError && (
            <div className="rounded-xl px-3 py-2 mb-3 text-xs"
              style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
              {geoError}
            </div>
          )}

          <button
            onClick={handleStop}
            disabled={stopping}
            className="w-full py-3 rounded-2xl text-sm font-bold transition disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {stopping ? 'Terminando...' : 'Terminar viaje'}
          </button>
        </div>
      </div>
    </div>
  )
}

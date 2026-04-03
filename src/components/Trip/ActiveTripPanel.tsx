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
  const [elapsed,  setElapsed]  = useState(0)   // segundos
  const [stopping, setStopping] = useState(false)

  // Cronómetro del viaje
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
    try {
      await onStop()
    } finally {
      setStopping(false)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 pt-2 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden pointer-events-auto">
        {/* Barra de estado activo */}
        <div className="flex items-center gap-2 bg-blue-600 px-4 py-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-xs font-semibold">Viaje activo · {formatTime(elapsed)}</span>
        </div>

        <div className="px-4 py-3">
          {/* Línea seleccionada */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {trip.lineNumber}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Línea {trip.lineNumber}</p>
              <p className="text-xs text-gray-500 truncate">{trip.branchName}</p>
            </div>
            {speed !== null && (
              <div className="ml-auto text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-800">{speed}</p>
                <p className="text-xs text-gray-400">km/h</p>
              </div>
            )}
          </div>

          {/* Error de GPS */}
          {geoError && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              {geoError}
            </div>
          )}

          {/* Botón terminar */}
          <button
            onClick={handleStop}
            disabled={stopping}
            className="mt-3 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition disabled:opacity-60"
          >
            {stopping ? 'Terminando...' : 'Terminar viaje'}
          </button>
        </div>
      </div>
    </div>
  )
}

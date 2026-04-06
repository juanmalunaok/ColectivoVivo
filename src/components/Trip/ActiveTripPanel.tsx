'use client'

import { useEffect, useState } from 'react'
import type { TripState, Occupancy } from '@/types'
import type { KeepAwakeMethod } from '@/hooks/useKeepAwake'

const OCCUPANCY_OPTIONS: {
  value: Occupancy
  label: string
  icon: string
}[] = [
  { value: 'empty',    label: 'Vacío',  icon: 'person'  },
  { value: 'moderate', label: 'Normal', icon: 'group'   },
  { value: 'full',     label: 'Lleno',  icon: 'groups'  },
]

interface Props {
  trip:               TripState
  speed:              number | null
  geoError:           string | null
  keepAwakeActive?:   boolean
  keepAwakeMethod?:   KeepAwakeMethod
  isIOS?:             boolean
  onStop:             () => Promise<void>
  onOccupancyChange:  (o: Occupancy) => Promise<void>
}

export function ActiveTripPanel({ trip, speed, geoError, keepAwakeActive, keepAwakeMethod, isIOS, onStop, onOccupancyChange }: Props) {
  const [elapsed,   setElapsed]   = useState(0)
  const [stopping,  setStopping]  = useState(false)
  const [occupancy, setOccupancy] = useState<Occupancy | null>(null)
  const [savingOcc, setSavingOcc] = useState(false)

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

  async function handleOccupancy(value: Occupancy) {
    if (savingOcc) return
    setSavingOcc(true)
    try {
      await onOccupancyChange(value)
      setOccupancy(value)
    } finally {
      setSavingOcc(false)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      <div className="pointer-events-auto shadow-2xl"
        style={{ background: '#000000', borderTop: '1px solid #1a1919', borderRadius: '14px 14px 0 0' }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#262626' }} />
        </div>

        {/* Destino / status bar */}
        <div className="flex items-center gap-3 px-5 py-3 mx-4 mb-3 rounded-[14px]"
          style={{ background: '#141414' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl font-headline font-extrabold text-black text-base flex-shrink-0"
            style={{ background: '#ff5e07' }}>
            {trip.lineNumber}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase font-headline font-bold tracking-widest leading-none mb-0.5"
              style={{ color: '#adaaaa' }}>En camino</p>
            <p className="font-headline font-bold text-white text-sm leading-tight truncate">{trip.branchName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-headline font-bold text-sm" style={{ color: '#ff9064' }}>{formatTime(elapsed)}</p>
            <p className="text-xs uppercase tracking-tighter" style={{ color: '#adaaaa' }}>Activo</p>
          </div>
        </div>

        <div className="px-4 pb-6">
          {/* Velocidad */}
          {speed !== null && (
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-xs font-bold font-headline" style={{ color: '#adaaaa' }}>VELOCIDAD</span>
              <span className="font-headline font-black text-white text-sm">{speed} km/h</span>
            </div>
          )}

          {/* Ocupación */}
          <div className="mb-4">
            <p className="text-xs uppercase font-headline font-bold tracking-widest mb-2 px-1"
              style={{ color: '#adaaaa' }}>Estado de ocupación</p>
            <div className="grid grid-cols-3 gap-2 p-2 rounded-[14px]"
              style={{ background: '#141414' }}>
              {OCCUPANCY_OPTIONS.map((opt) => {
                const selected = occupancy === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleOccupancy(opt.value)}
                    disabled={savingOcc}
                    className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition disabled:opacity-50"
                    style={{
                      background: selected ? '#ff5e07' : 'transparent',
                      color:      selected ? '#000000' : '#adaaaa',
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={selected ? 2.5 : 1.5}>
                      {opt.value === 'empty'    && <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                      {opt.value === 'moderate' && <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
                      {opt.value === 'full'     && <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM5 20v-2a4 4 0 014-4h.5" />}
                    </svg>
                    <span className="font-headline text-xs font-bold uppercase">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Indicador pantalla activa */}
          {keepAwakeActive ? (
            <div className="rounded-xl px-3 py-2 mb-3 text-xs flex items-center gap-2"
              style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)' }}>
              <span>🔒</span>
              <span>
                {keepAwakeMethod === 'wakeLock'
                  ? 'Pantalla activa — podés usar otras apps y el rastreo continúa'
                  : 'Pantalla activa — el GPS sigue funcionando mientras no la apagues'}
              </span>
            </div>
          ) : isIOS ? (
            <div className="rounded-xl px-3 py-2 mb-3 text-xs flex items-center gap-2"
              style={{ background: 'rgba(255,183,77,0.08)', color: '#ffb74d', border: '1px solid rgba(255,183,77,0.15)' }}>
              <span>⚠️</span>
              <span>Dejá la pantalla encendida — en iOS el GPS se pausa si se apaga</span>
            </div>
          ) : (
            <div className="rounded-xl px-3 py-2 mb-3 text-xs flex items-center gap-2"
              style={{ background: 'rgba(255,183,77,0.08)', color: '#ffb74d', border: '1px solid rgba(255,183,77,0.15)' }}>
              <span>⚠️</span>
              <span>Manteniendo pantalla activa...</span>
            </div>
          )}

          {geoError && (
            <div className="rounded-xl px-3 py-2 mb-3 text-xs"
              style={{ background: 'rgba(255,113,108,0.08)', color: '#ff716c', border: '1px solid rgba(255,113,108,0.15)' }}>
              {geoError}
            </div>
          )}

          <button
            onClick={handleStop}
            disabled={stopping}
            className="w-full py-4 rounded-full text-sm font-headline font-bold uppercase tracking-tight transition disabled:opacity-50"
            style={{ background: '#ff716c', color: '#ffffff' }}
          >
            {stopping ? 'Terminando...' : 'Dejar de compartir'}
          </button>
        </div>
      </div>
    </div>
  )
}

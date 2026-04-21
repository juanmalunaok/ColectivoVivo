'use client'

import { useEffect, useState } from 'react'
import type { TripState, Occupancy } from '@/types'
import type { KeepAwakeMethod } from '@/hooks/useKeepAwake'

const OCCUPANCY_OPTIONS: { value: Occupancy; label: string; n: number; color: string }[] = [
  { value: 'empty',    label: 'Vacío',  n: 1, color: 'oklch(72% 0.15 145)' },
  { value: 'moderate', label: 'Normal', n: 2, color: 'oklch(78% 0.13 85)' },
  { value: 'full',     label: 'Lleno',  n: 3, color: 'oklch(68% 0.17 25)' },
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

function OccupancyDots({ n, color, size = 6 }: { n: number; color: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{
          width: size, height: size, borderRadius: size,
          background: i <= n ? color : '#2a2a32',
          display: 'inline-block',
        }} />
      ))}
    </span>
  )
}

function Metric({ label, value, unit, icon }: { label: string; value: string | number; unit: string; icon: React.ReactNode }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 14, background: '#141418', border: '0.5px solid #1f1f26' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon}
        <span style={{ fontSize: 11, color: '#a1a1aa', fontWeight: 500, letterSpacing: -0.1 }}>{label}</span>
      </div>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span className="font-headline cv-tabular" style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, color: '#f5f5f7' }}>
          {value}
        </span>
        <span style={{ fontSize: 11, color: '#6b6b75', fontWeight: 500 }}>{unit}</span>
      </div>
    </div>
  )
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
    const m = Math.floor(s / 60)
    const sec = s % 60
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
    <div
      className="absolute bottom-0 left-0 right-0 z-20"
      style={{
        background: '#0a0a0c',
        borderRadius: '22px 22px 0 0',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.06), 0 -20px 40px rgba(0,0,0,0.5)',
        animation: 'cv-sheet-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        paddingBottom: 34,
      }}
    >
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
        <div style={{ width: 36, height: 5, borderRadius: 100, background: '#2a2a32' }} />
      </div>

      {/* EN VIVO + tiempo */}
      <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: 'oklch(72% 0.15 145 / 0.16)',
        }}>
          <span className="cv-dot-live" />
          <span className="cv-mono" style={{ fontSize: 10, color: 'oklch(85% 0.13 145)', fontWeight: 500, letterSpacing: 0.3 }}>
            EN VIVO
          </span>
        </div>
        <span className="font-headline cv-tabular" style={{ fontSize: 13, color: '#a1a1aa', fontWeight: 600 }}>
          {formatTime(elapsed)}
        </span>
      </div>

      {/* Línea + ramal */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span className="font-headline" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          minWidth: 64, height: 52, padding: '0 16px',
          borderRadius: 999,
          background: 'oklch(72% 0.15 145)', color: '#001b0a',
          fontWeight: 800, fontSize: 24, letterSpacing: -0.5,
          flexShrink: 0,
        }}>
          {trip.lineNumber}
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <div style={{ fontSize: 11, color: 'oklch(85% 0.13 145)', letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600 }}>
            Tu viaje
          </div>
          <div className="font-headline" style={{
            fontSize: 19, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.15,
            marginTop: 1, color: '#f5f5f7',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {trip.branchName}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: '16px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <Metric
          label="Velocidad"
          value={speed ?? 0}
          unit="km/h"
          icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b6b75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l4-4M4 14a8 8 0 0116 0"/></svg>}
        />
        <Metric
          label="Duración"
          value={Math.floor(elapsed / 60)}
          unit="min"
          icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b6b75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
        />
        <Metric
          label="Estado"
          value={occupancy ? (occupancy === 'empty' ? 'Vacío' : occupancy === 'moderate' ? 'OK' : 'Lleno') : '—'}
          unit=""
          icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b6b75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><circle cx="5" cy="10" r="2.5"/><circle cx="19" cy="10" r="2.5"/><path d="M7 20c0-2.5 2-4.5 5-4.5s5 2 5 4.5"/></svg>}
        />
      </div>

      {/* Ocupación selector */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: '#a1a1aa',
          letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6,
        }}>
          ¿Cómo viene el bondi?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {OCCUPANCY_OPTIONS.map((opt) => {
            const active = occupancy === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => handleOccupancy(opt.value)}
                disabled={savingOcc}
                style={{
                  padding: '10px 6px', borderRadius: 12,
                  background: active ? 'oklch(72% 0.15 145 / 0.18)' : '#141418',
                  border: `0.5px solid ${active ? 'oklch(72% 0.15 145)' : '#1f1f26'}`,
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  opacity: savingOcc ? 0.5 : 1,
                }}
              >
                <OccupancyDots n={opt.n} color={opt.color} />
                <div className="font-headline" style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: -0.1,
                  color: active ? 'oklch(85% 0.13 145)' : '#f5f5f7',
                }}>
                  {opt.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Indicador pantalla activa */}
      <div style={{ padding: '14px 20px 0' }}>
        {keepAwakeActive ? (
          <div style={{
            padding: '8px 12px', borderRadius: 12,
            background: 'oklch(72% 0.15 145 / 0.10)',
            color: 'oklch(82% 0.12 145)',
            border: '0.5px solid oklch(72% 0.15 145 / 0.25)',
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>
              {keepAwakeMethod === 'wakeLock'
                ? 'Pantalla activa — podés usar otras apps'
                : 'Pantalla activa — el GPS sigue funcionando'}
            </span>
          </div>
        ) : (
          <div style={{
            padding: '8px 12px', borderRadius: 12,
            background: 'oklch(45% 0.15 70 / 0.10)',
            color: 'oklch(80% 0.13 70)',
            border: '0.5px solid oklch(45% 0.15 70 / 0.25)',
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h0M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <span>{isIOS ? 'Dejá la pantalla encendida — iOS pausa el GPS si se apaga' : 'Manteniendo pantalla activa...'}</span>
          </div>
        )}

        {geoError && (
          <div style={{
            marginTop: 8,
            padding: '8px 12px', borderRadius: 12,
            background: 'oklch(35% 0.15 25 / 0.15)',
            color: 'oklch(72% 0.18 25)',
            border: '0.5px solid oklch(50% 0.18 25 / 0.25)',
            fontSize: 12,
          }}>
            {geoError}
          </div>
        )}
      </div>

      {/* Stop button */}
      <div style={{ padding: '16px 20px 0' }}>
        <button
          onClick={handleStop}
          disabled={stopping}
          className="font-headline"
          style={{
            width: '100%', height: 52, borderRadius: 14,
            background: 'oklch(35% 0.15 25)', color: '#fff',
            border: '0.5px solid oklch(50% 0.18 25 / 0.4)',
            cursor: stopping ? 'wait' : 'pointer',
            fontSize: 15, fontWeight: 700, letterSpacing: -0.2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: stopping ? 0.6 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 21V4M5 4h12l-2 4 2 4H5"/>
          </svg>
          {stopping ? 'Terminando...' : 'Terminar viaje'}
        </button>
      </div>
    </div>
  )
}

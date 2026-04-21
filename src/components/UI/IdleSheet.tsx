'use client'

import { useState } from 'react'
import type { ActiveTrip, Occupancy } from '@/types'

interface Props {
  trips:      ActiveTrip[]
  favorites:  string[]
  isFav:      (lineNumber: string) => boolean
  toggleFav:  (lineNumber: string) => void
  onStartTrip: () => void
  onLineTap:  (lineNumber: string) => void
}

const OCC_COLOR: Record<Occupancy, string> = {
  empty:    'oklch(72% 0.15 145)',
  moderate: 'oklch(78% 0.13 85)',
  full:     'oklch(68% 0.17 25)',
}
const OCC_LABEL: Record<Occupancy, string> = {
  empty: 'Vacío', moderate: 'Normal', full: 'Lleno',
}
const OCC_N: Record<Occupancy, number> = { empty: 1, moderate: 2, full: 3 }

function OccupancyDots({ level, size = 5 }: { level: Occupancy; size?: number }) {
  const n = OCC_N[level]
  const c = OCC_COLOR[level]
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{
          width: size, height: size, borderRadius: size,
          background: i <= n ? c : '#2a2a32',
          display: 'inline-block',
        }} />
      ))}
    </span>
  )
}

function LineBadge({ number, size = 'md' }: { number: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? { h: 22, px: 7, fs: 12, min: 30 }
          : size === 'lg' ? { h: 36, px: 12, fs: 17, min: 46 }
          : { h: 28, px: 9, fs: 14, min: 36 }
  return (
    <span
      className="font-headline"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: s.h, padding: `0 ${s.px}px`, minWidth: s.min,
        borderRadius: 999, background: '#fff', color: '#000',
        fontWeight: 800, fontSize: s.fs, letterSpacing: -0.03 * s.fs,
      }}
    >
      {number}
    </span>
  )
}

export function IdleSheet({ trips, favorites, isFav, toggleFav, onStartTrip, onLineTap }: Props) {
  const [expanded, setExpanded] = useState(false)
  const PEEK = 288
  const MAX = '82%'

  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        zIndex: 18,
        background: '#0a0a0c',
        borderRadius: '22px 22px 0 0',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.06), 0 -20px 40px rgba(0,0,0,0.5)',
        animation: 'cv-sheet-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        height: expanded ? MAX : PEEK,
        maxHeight: MAX,
        display: 'flex', flexDirection: 'column',
        paddingBottom: 34,
        transition: 'height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Drag handle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex', justifyContent: 'center', padding: '8px 0 4px',
          flexShrink: 0, background: 'transparent', border: 0, cursor: 'pointer',
        }}
        aria-label={expanded ? 'Contraer' : 'Expandir'}
      >
        <div style={{ width: 36, height: 5, borderRadius: 100, background: '#2a2a32' }} />
      </button>

      {/* Title */}
      <div style={{ padding: '2px 20px 12px' }}>
        <div className="font-headline" style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.6, color: '#f5f5f7' }}>
          ¿Qué línea tomás?
        </div>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 1, letterSpacing: -0.1 }}>
          Compartí tu viaje o seguí uno en vivo.
        </div>
      </div>

      {/* Start trip CTA */}
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={onStartTrip}
          className="font-headline"
          style={{
            width: '100%', height: 52, borderRadius: 14,
            background: 'oklch(72% 0.15 145)', color: '#001b0a',
            border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 16, fontWeight: 700, letterSpacing: -0.3,
            boxShadow: '0 4px 14px oklch(72% 0.15 145 / 0.4)',
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="5" width="16" height="13" rx="3"/>
            <path d="M4 11h16"/>
            <circle cx="8" cy="18" r="1.2" fill="currentColor"/>
            <circle cx="16" cy="18" r="1.2" fill="currentColor"/>
            <path d="M4 5l-1 -1M20 5l1 -1"/>
          </svg>
          Iniciar viaje
        </button>
      </div>

      {/* Scrollable content */}
      <div className="cv-scroll" style={{ padding: '16px 20px 0', flex: 1, overflowY: 'auto' }}>
        {/* Favoritos */}
        {favorites.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 600, color: '#a1a1aa',
              letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8,
            }}>
              Tus favoritos
            </div>
            <div
              className="cv-scroll"
              style={{
                display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
                margin: '0 -20px', paddingLeft: 20, paddingRight: 20,
              }}
            >
              {favorites.map((num) => {
                const count = trips.filter((t) => t.lineNumber === num).length
                return (
                  <button
                    key={num}
                    onClick={() => onLineTap(num)}
                    style={{
                      flexShrink: 0, width: 104, padding: '10px 12px',
                      borderRadius: 14, background: '#141418',
                      border: '0.5px solid #2a2a32',
                      display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start',
                      cursor: 'pointer', color: '#fff', textAlign: 'left',
                    }}
                  >
                    <LineBadge number={num} size="lg" />
                    <div>
                      <div style={{ fontSize: 11, color: '#a1a1aa', letterSpacing: -0.1 }}>
                        {count > 0 ? `${count} en vivo` : 'Sin datos'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Cerca tuyo */}
        <div style={{
          marginTop: favorites.length > 0 ? 20 : 0,
          fontSize: 11, fontWeight: 600, color: '#a1a1aa',
          letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6,
        }}>
          {trips.length > 0 ? 'Cerca tuyo' : 'Todavía no hay colectivos'}
        </div>
        {trips.slice(0, 10).map((t) => {
          const fav = isFav(t.lineNumber)
          return (
            <div
              key={t.tripId}
              style={{
                width: '100%', padding: '11px 0',
                borderBottom: '0.5px solid #1f1f26',
                display: 'flex', alignItems: 'center', gap: 12,
                color: '#fff',
              }}
            >
              <button
                onClick={() => onLineTap(t.lineNumber)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  flex: 1, minWidth: 0, background: 'transparent', border: 0,
                  cursor: 'pointer', color: '#fff', textAlign: 'left', padding: 0,
                }}
              >
                <LineBadge number={t.lineNumber} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="font-headline"
                    style={{
                      fontSize: 14, fontWeight: 600, letterSpacing: -0.3,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                  >
                    {t.branchName}
                  </div>
                  <div style={{
                    fontSize: 11, color: '#a1a1aa', marginTop: 2,
                    display: 'flex', gap: 6, alignItems: 'center',
                  }}>
                    {t.occupancy && (
                      <>
                        <OccupancyDots level={t.occupancy} />
                        <span>{OCC_LABEL[t.occupancy]}</span>
                      </>
                    )}
                    {t.speed != null && (
                      <>
                        <span style={{ color: '#3a3a44' }}>·</span>
                        <span className="cv-tabular">{t.speed} km/h</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => toggleFav(t.lineNumber)}
                aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: 'transparent', border: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: fav ? 'oklch(78% 0.13 85)' : '#6b6b75',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={fav ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l2.7 5.5 6.1 0.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-0.9z"/>
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

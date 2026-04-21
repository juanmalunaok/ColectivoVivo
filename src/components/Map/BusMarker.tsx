'use client'

import { useState } from 'react'
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { reportTrip, endTrip } from '@/lib/realtimeDb'
import type { ActiveTrip, Occupancy } from '@/types'

const OCCUPANCY: Record<Occupancy, { label: string; color: string; n: number }> = {
  empty:    { label: 'Vacío',  color: 'oklch(72% 0.15 145)', n: 1 },
  moderate: { label: 'Normal', color: 'oklch(78% 0.13 85)',  n: 2 },
  full:     { label: 'Lleno',  color: 'oklch(68% 0.17 25)',  n: 3 },
}

interface Props {
  trip:          ActiveTrip
  currentUserId?: string
  isFollowed?:   boolean
  isAdmin?:      boolean
  onFollow?:     () => void
  onUnfollow?:   () => void
}

function OccupancyDots({ level, size = 5 }: { level: Occupancy; size?: number }) {
  const info = OCCUPANCY[level]
  return (
    <span style={{ display: 'inline-flex', gap: 2, verticalAlign: 'middle' }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{
          width: size, height: size, borderRadius: size,
          background: i <= info.n ? info.color : '#2a2a32',
          display: 'inline-block',
        }} />
      ))}
    </span>
  )
}

export function BusMarker({ trip, currentUserId, isFollowed, isAdmin, onFollow, onUnfollow }: Props) {
  const [open, setOpen]           = useState(false)
  const [reported, setReported]   = useState(false)
  const [reporting, setReporting] = useState(false)
  const [deleting, setDeleting]   = useState(false)

  const isOwn = trip.userId === currentUserId

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      await endTrip(trip.tripId)
      setOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  async function handleReport() {
    if (reported || reporting) return
    setReporting(true)
    try {
      await reportTrip(trip.tripId)
      setReported(true)
    } finally {
      setReporting(false)
      setOpen(false)
    }
  }

  const position = { lat: trip.lat, lng: trip.lng }

  return (
    <>
      <AdvancedMarker position={position} onClick={() => setOpen(true)}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {(isOwn || isFollowed) && (
            <div style={{
              position: 'absolute', inset: -6, borderRadius: 999,
              background: 'oklch(72% 0.15 145 / 0.28)',
              animation: 'cv-ping 1.8s cubic-bezier(0,0,0.2,1) infinite',
            }} />
          )}
          <div
            className={`cv-marker ${isOwn ? 'own' : ''} ${reported ? 'reported' : ''} ${isFollowed ? 'followed' : ''}`}
            title={`Línea ${trip.lineNumber} — ${trip.branchName}`}
            style={{ position: 'relative' }}
          >
            {trip.lineNumber}
          </div>
          {/* Punta inferior */}
          <div style={{
            position: 'absolute',
            left: '50%', bottom: -3,
            transform: 'translateX(-50%) rotate(45deg)',
            width: 6, height: 6,
            background: (isOwn || isFollowed) ? 'oklch(72% 0.15 145)' : '#fff',
          }} />
        </div>
      </AdvancedMarker>

      {open && (
        <InfoWindow
          position={position}
          onCloseClick={() => setOpen(false)}
          pixelOffset={[0, -28]}
        >
          <div style={{
            background: '#141418',
            borderRadius: 14,
            padding: '14px 16px',
            minWidth: 210,
            border: '0.5px solid #2a2a32',
            fontFamily: 'var(--font-body), Inter, sans-serif',
          }}>
            {/* EN VIVO badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 9px', borderRadius: 999,
              background: 'oklch(72% 0.15 145 / 0.16)',
              marginBottom: 10,
            }}>
              <span className="cv-dot-live" />
              <span className="cv-mono" style={{ fontSize: 10, color: 'oklch(85% 0.13 145)', fontWeight: 500, letterSpacing: 0.3 }}>
                EN VIVO
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="font-headline" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 46, height: 36, padding: '0 12px',
                borderRadius: 999,
                background: isOwn ? 'oklch(72% 0.15 145)' : '#fff',
                color: isOwn ? '#001b0a' : '#000',
                fontWeight: 800, fontSize: 17, letterSpacing: -0.5,
              }}>
                {trip.lineNumber}
              </span>
              {isOwn && (
                <span className="font-headline" style={{ fontSize: 12, color: 'oklch(85% 0.13 145)', fontWeight: 700 }}>
                  Sos vos
                </span>
              )}
            </div>

            <p className="font-headline" style={{ fontSize: 14, color: '#f5f5f7', fontWeight: 600, margin: '0 0 6px', letterSpacing: -0.2 }}>
              {trip.branchName}
            </p>

            {trip.occupancy && (
              <p style={{
                fontSize: 11, color: '#a1a1aa', margin: '0 0 4px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <OccupancyDots level={trip.occupancy} />
                <span>{OCCUPANCY[trip.occupancy].label}</span>
                {trip.speed != null && (
                  <>
                    <span style={{ color: '#3a3a44' }}>·</span>
                    <span className="cv-tabular">{trip.speed} km/h</span>
                  </>
                )}
              </p>
            )}

            <button
              onClick={() => {
                if (isFollowed) { onUnfollow?.() } else { onFollow?.() }
                setOpen(false)
              }}
              className="font-headline"
              style={{
                marginTop: 10, width: '100%',
                height: 38, borderRadius: 12,
                fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
                cursor: 'pointer',
                background: isFollowed ? '#1c1c22' : '#fff',
                color: isFollowed ? '#f5f5f7' : '#000',
                border: isFollowed ? '0.5px solid #2a2a32' : '0',
              }}
            >
              {isFollowed ? 'Dejar de seguir' : 'Seguir este'}
            </button>

            {!isOwn && (
              <button
                onClick={handleReport}
                disabled={reported || reporting}
                style={{
                  marginTop: 6, width: '100%',
                  height: 32, borderRadius: 10,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: reported ? '#1c1c22' : 'transparent',
                  color: reported ? '#6b6b75' : '#a1a1aa',
                  border: '0.5px solid #2a2a32',
                  opacity: reported ? 0.5 : 1,
                }}
              >
                {reported ? 'Reportado' : reporting ? 'Reportando...' : 'Reportar marcador'}
              </button>
            )}

            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="font-headline"
                style={{
                  marginTop: 6, width: '100%',
                  height: 32, borderRadius: 10,
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: 'oklch(30% 0.15 25 / 0.4)',
                  color: 'oklch(72% 0.18 25)',
                  border: '0.5px solid oklch(50% 0.18 25 / 0.4)',
                  opacity: deleting ? 0.4 : 1,
                }}
              >
                {deleting ? 'Eliminando...' : 'Eliminar (admin)'}
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

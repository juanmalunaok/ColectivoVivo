'use client'

import { useState } from 'react'
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { reportTrip, endTrip } from '@/lib/realtimeDb'
import type { ActiveTrip, Occupancy } from '@/types'

const OCCUPANCY_LABEL: Record<Occupancy, { emoji: string; label: string; color: string }> = {
  empty:    { emoji: '🟢', label: 'Vacío',  color: '#4ade80' },
  moderate: { emoji: '🟡', label: 'Normal', color: '#fbbf24' },
  full:     { emoji: '🔴', label: 'Lleno',  color: '#f87171' },
}

interface Props {
  trip:          ActiveTrip
  currentUserId?: string
  isFollowed?:   boolean
  isAdmin?:      boolean
  onFollow?:     () => void
  onUnfollow?:   () => void
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
          <div
            className={`bus-marker ${isOwn ? 'own' : ''} ${reported ? 'reported' : ''} ${isFollowed ? 'followed' : ''}`}
            title={`Línea ${trip.lineNumber} — ${trip.branchName}`}
          >
            {trip.lineNumber}
          </div>
          {trip.occupancy && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              fontSize: 11, lineHeight: 1,
            }}>
              {OCCUPANCY_LABEL[trip.occupancy].emoji}
            </span>
          )}
        </div>
      </AdvancedMarker>

      {open && (
        <InfoWindow
          position={position}
          onCloseClick={() => setOpen(false)}
          pixelOffset={[0, -24]}
        >
          <div style={{ background: '#141414', borderRadius: 14, padding: '14px 16px', minWidth: 170, border: '1px solid #262626' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-headline font-black inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-sm text-black"
                style={{ background: isOwn ? '#ff9064' : '#ff5e07' }}>
                {trip.lineNumber}
              </span>
              {isOwn && (
                <span className="text-xs font-bold font-headline" style={{ color: '#ff9064' }}>Sos vos</span>
              )}
            </div>

            <p className="text-xs mb-1 font-medium" style={{ color: '#adaaaa' }}>{trip.branchName}</p>

            {trip.occupancy && (
              <p className="text-xs mb-1" style={{ color: OCCUPANCY_LABEL[trip.occupancy].color }}>
                {OCCUPANCY_LABEL[trip.occupancy].emoji} {OCCUPANCY_LABEL[trip.occupancy].label}
              </p>
            )}

            {trip.speed != null && (
              <p className="text-xs" style={{ color: '#adaaaa' }}>{trip.speed} km/h</p>
            )}

            <button
              onClick={() => {
                if (isFollowed) { onUnfollow?.() } else { onFollow?.() }
                setOpen(false)
              }}
              className="mt-3 w-full text-xs font-headline font-bold py-2 rounded-full transition uppercase tracking-tight"
              style={{
                background: isFollowed ? 'rgba(255,94,7,0.15)' : 'rgba(255,94,7,0.1)',
                color: '#ff9064',
                border: `1px solid ${isFollowed ? 'rgba(255,94,7,0.4)' : 'rgba(255,94,7,0.2)'}`,
              }}
            >
              {isFollowed ? 'Dejar de seguir' : 'Seguir'}
            </button>

            {!isOwn && (
              <button
                onClick={handleReport}
                disabled={reported || reporting}
                className="mt-1.5 w-full text-xs font-medium py-1.5 rounded-full transition disabled:opacity-40"
                style={{
                  background: reported ? 'rgba(75,85,99,0.2)' : 'rgba(255,113,108,0.1)',
                  color: reported ? '#6b7280' : '#ff716c',
                  border: `1px solid ${reported ? 'rgba(75,85,99,0.2)' : 'rgba(255,113,108,0.2)'}`,
                }}
              >
                {reported ? 'Reportado' : reporting ? 'Reportando...' : 'Reportar marcador'}
              </button>
            )}

            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="mt-1.5 w-full text-xs font-bold py-1.5 rounded-full transition disabled:opacity-40"
                style={{
                  background: 'rgba(255,113,108,0.2)',
                  color: '#ff716c',
                  border: '1px solid rgba(255,113,108,0.4)',
                }}
              >
                {deleting ? 'Eliminando...' : '🗑 Eliminar (admin)'}
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

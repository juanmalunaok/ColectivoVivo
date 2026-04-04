'use client'

import { useState } from 'react'
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { reportTrip } from '@/lib/realtimeDb'
import type { ActiveTrip } from '@/types'

interface Props {
  trip:          ActiveTrip
  currentUserId?: string
  isFollowed?:   boolean
  onFollow?:     () => void
  onUnfollow?:   () => void
}

export function BusMarker({ trip, currentUserId, isFollowed, onFollow, onUnfollow }: Props) {
  const [open, setOpen]           = useState(false)
  const [reported, setReported]   = useState(false)
  const [reporting, setReporting] = useState(false)

  const isOwn = trip.userId === currentUserId

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
        <div
          className={`bus-marker ${isOwn ? 'own' : ''} ${reported ? 'reported' : ''} ${isFollowed ? 'followed' : ''}`}
          title={`Línea ${trip.lineNumber} — ${trip.branchName}`}
        >
          {trip.lineNumber}
        </div>
      </AdvancedMarker>

      {open && (
        <InfoWindow
          position={position}
          onCloseClick={() => setOpen(false)}
          pixelOffset={[0, -20]}
        >
          <div style={{ background: '#0f0f1a', borderRadius: 12, padding: '12px 14px', minWidth: 160, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                style={{ background: isOwn ? '#06b6d4' : '#6366f1' }}>
                {trip.lineNumber}
              </span>
              {isOwn && (
                <span className="text-xs font-medium" style={{ color: '#06b6d4' }}>Sos vos</span>
              )}
            </div>

            <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>{trip.branchName}</p>

            {trip.speed != null && (
              <p className="text-xs" style={{ color: '#4b5563' }}>{trip.speed} km/h</p>
            )}

            <button
              onClick={() => {
                if (isFollowed) { onUnfollow?.() } else { onFollow?.() }
                setOpen(false)
              }}
              className="mt-3 w-full text-xs font-medium py-1.5 rounded-lg transition"
              style={{
                background: isFollowed ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                color: '#818cf8',
                border: `1px solid ${isFollowed ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.2)'}`,
              }}
            >
              {isFollowed ? 'Dejar de seguir' : 'Seguir'}
            </button>

            {!isOwn && (
              <button
                onClick={handleReport}
                disabled={reported || reporting}
                className="mt-1.5 w-full text-xs font-medium py-1.5 rounded-lg transition disabled:opacity-40"
                style={{
                  background: reported ? 'rgba(75,85,99,0.3)' : 'rgba(239,68,68,0.1)',
                  color: reported ? '#6b7280' : '#f87171',
                  border: `1px solid ${reported ? 'rgba(75,85,99,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                {reported ? 'Reportado' : reporting ? 'Reportando...' : 'Reportar marcador'}
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

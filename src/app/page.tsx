'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback, useEffect } from 'react'
import dynamicImport from 'next/dynamic'
import { ProtectedRoute } from '@/components/UI/ProtectedRoute'
import { Header } from '@/components/UI/Header'
import { LineSelector } from '@/components/Trip/LineSelector'
import { ConsentModal } from '@/components/Trip/ConsentModal'
import { ActiveTripPanel } from '@/components/Trip/ActiveTripPanel'
import { useAuth } from '@/context/AuthContext'
import { useActiveTrips } from '@/hooks/useActiveTrips'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useTrip } from '@/hooks/useTrip'
import { useWakeLock } from '@/hooks/useWakeLock'
import type { BusLine, Branch } from '@/types'

const MapView = dynamicImport(
  () => import('@/components/Map/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#080810' }} /> },
)

type FlowStep = 'idle' | 'selectingLine' | 'confirmingConsent' | 'active'

export default function HomePage() {
  const { user }               = useAuth()
  const { trips }              = useActiveTrips()
  const { trip, startTrip, updateLocation, stopTrip } = useTrip(user?.uid)

  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [pending,  setPending]  = useState<{ line: BusLine; branch: Branch } | null>(null)
  const [filterLine,     setFilterLine]     = useState<string | null>(null)
  const [followedTripId, setFollowedTripId] = useState<string | null>(null)

  const geoEnabled = flowStep === 'active'
  const { active: wakeLockActive, supported: wakeLockSupported } = useWakeLock(geoEnabled)
  const { lat, lng, speed, error: geoError } = useGeolocation({
    enabled: geoEnabled,
    onUpdate: updateLocation,
    intervalMs: 5000,
  })

  function openLineSelector() { setFlowStep('selectingLine') }

  function handleLineSelected(line: BusLine, branch: Branch) {
    setPending({ line, branch })
    setFlowStep('confirmingConsent')
  }

  async function handleConsentAccepted() {
    const fallback = { lat: -34.6037, lng: -58.3816 }
    await startTrip(
      pending!.line.number,
      pending!.branch.id,
      pending!.branch.name,
      lat ?? fallback.lat,
      lng ?? fallback.lng,
    )
    setFlowStep('active')
    setPending(null)
  }

  function handleConsentCancelled() {
    setPending(null)
    setFlowStep('idle')
  }

  const handleStopTrip = useCallback(async () => {
    await stopTrip()
    setFlowStep('idle')
  }, [stopTrip])

  // Auto-cancel follow when the trip disappears
  useEffect(() => {
    if (followedTripId && !trips.find((t) => t.tripId === followedTripId)) {
      setFollowedTripId(null)
    }
  }, [trips, followedTripId])

  const activeCount = filterLine
    ? trips.filter((t) => t.lineNumber === filterLine).length
    : trips.length

  return (
    <ProtectedRoute>
      <div className="relative w-full h-full" style={{ background: '#080810' }}>
        {/* Mapa */}
        <MapView
          trips={trips}
          currentUserId={user?.uid}
          selfLat={lat}
          selfLng={lng}
          filterLine={filterLine}
          followedTripId={followedTripId}
          onFollow={setFollowedTripId}
          onUnfollow={() => setFollowedTripId(null)}
        />

        {/* Banner "Siguiendo línea X" */}
        {followedTripId && (() => {
          const ft = trips.find((t) => t.tripId === followedTripId)
          return ft ? (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold pointer-events-auto"
              style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)', backdropFilter: 'blur(12px)', color: '#818cf8', whiteSpace: 'nowrap' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#6366f1' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#6366f1' }} />
              </span>
              Siguiendo línea {ft.lineNumber}
              <button onClick={() => setFollowedTripId(null)} className="ml-1 opacity-60 hover:opacity-100 transition" style={{ lineHeight: 1 }}>✕</button>
            </div>
          ) : null
        })()}

        {/* Header */}
        <Header
          filterLine={filterLine}
          onFilterClear={() => setFilterLine(null)}
          tripActive={flowStep === 'active'}
          onStartTrip={openLineSelector}
        />

        {/* Selector de línea */}
        {flowStep === 'selectingLine' && (
          <LineSelector
            onSelect={handleLineSelected}
            onCancel={() => setFlowStep('idle')}
          />
        )}

        {/* Consentimiento GPS */}
        {flowStep === 'confirmingConsent' && pending && (
          <ConsentModal
            lineNumber={pending.line.number}
            branchName={pending.branch.name}
            onAccept={handleConsentAccepted}
            onCancel={handleConsentCancelled}
          />
        )}

        {/* Panel viaje activo */}
        {flowStep === 'active' && (
          <ActiveTripPanel
            trip={trip}
            speed={speed}
            geoError={geoError}
            wakeLockActive={wakeLockActive}
            wakeLockSupported={wakeLockSupported}
            onStop={handleStopTrip}
          />
        )}

        {/* Barra inferior — estado idle */}
        {flowStep === 'idle' && (
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 pointer-events-none">
            <div className="rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
              style={{ background: 'rgba(15,15,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}>

              {/* Contador de colectivos */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="relative flex h-1.5 w-1.5">
                  {trips.length > 0 && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ background: '#22c55e' }} />
                  )}
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: trips.length > 0 ? '#22c55e' : '#374151' }} />
                </span>
                <span className="text-xs" style={{ color: '#4b5563' }}>
                  {activeCount > 0
                    ? `${activeCount} colectivo${activeCount !== 1 ? 's' : ''} en el mapa${filterLine ? ` · Línea ${filterLine}` : ''}`
                    : 'Sin colectivos activos en este momento'}
                </span>
              </div>

              <div className="px-4 py-3 flex items-center gap-2">
                {/* Buscar línea */}
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#374151' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    inputMode="numeric"
                    placeholder="Buscar línea..."
                    value={filterLine ?? ''}
                    onChange={(e) => setFilterLine(e.target.value || null)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                </div>

                {/* Botón principal */}
                <button
                  onClick={openLineSelector}
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white whitespace-nowrap flex-shrink-0 transition"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Estoy en un colectivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

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
import { useKeepAwake } from '@/hooks/useKeepAwake'
import type { BusLine, Branch } from '@/types'

const MapView = dynamicImport(
  () => import('@/components/Map/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#0e0e0e' }} /> },
)

type FlowStep = 'idle' | 'selectingLine' | 'confirmingConsent' | 'active'

export default function HomePage() {
  const { user }               = useAuth()
  const isAdmin = user?.email === 'juanma.lunaok@gmail.com'
  const { trips }              = useActiveTrips()
  const { trip, startTrip, updateLocation, setOccupancy, stopTrip } = useTrip(user?.uid)

  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [pending,  setPending]  = useState<{ line: BusLine; branch: Branch } | null>(null)
  const [filterLine,     setFilterLine]     = useState<string | null>(null)
  const [followedTripId, setFollowedTripId] = useState<string | null>(null)

  const geoEnabled = flowStep === 'active'
  const { active: keepAwakeActive, method: keepAwakeMethod, ios: isIOS } = useKeepAwake(geoEnabled)
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

    // Obtener posición real antes de crear el viaje.
    // useGeolocation está inactivo hasta que flowStep='active', por eso
    // pedimos la posición explícitamente para evitar que el marcador
    // aparezca en las coordenadas de fallback (centro de CABA).
    let initialLat = lat ?? fallback.lat
    let initialLng = lng ?? fallback.lng

    if (!lat && 'geolocation' in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
          }),
        )
        initialLat = pos.coords.latitude
        initialLng = pos.coords.longitude
      } catch (_) {}
    }

    await startTrip(
      pending!.line.number,
      pending!.branch.id,
      pending!.branch.name,
      initialLat,
      initialLng,
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
      <div className="relative w-full h-full" style={{ background: '#0e0e0e' }}>
        {/* Mapa */}
        <MapView
          trips={trips}
          currentUserId={user?.uid}
          isAdmin={isAdmin}
          selfLat={lat}
          selfLng={lng}
          filterLine={filterLine}
          followedTripId={followedTripId}
          activeLine={flowStep === 'active' ? trip.lineNumber : null}
          onFollow={setFollowedTripId}
          onUnfollow={() => setFollowedTripId(null)}
        />

        {/* Banner "Siguiendo línea X" */}
        {followedTripId && (() => {
          const ft = trips.find((t) => t.tripId === followedTripId)
          return ft ? (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-headline font-bold pointer-events-auto uppercase tracking-tight"
              style={{ background: 'rgba(255,94,7,0.15)', border: '1px solid rgba(255,94,7,0.35)', color: '#ff9064', whiteSpace: 'nowrap' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff5e07' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#ff5e07' }} />
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
            keepAwakeActive={keepAwakeActive}
            keepAwakeMethod={keepAwakeMethod}
            isIOS={isIOS}
            onStop={handleStopTrip}
            onOccupancyChange={setOccupancy}
          />
        )}

        {/* Barra inferior — estado idle */}
        {flowStep === 'idle' && (
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 pointer-events-none">
            <div className="pointer-events-auto shadow-2xl overflow-hidden"
              style={{ background: '#0e0e0e', border: '1px solid #1a1919', borderRadius: 14 }}>

              {/* Contador de colectivos */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ borderBottom: '1px solid #1a1919' }}>
                <span className="relative flex h-1.5 w-1.5">
                  {trips.length > 0 && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ background: '#22c55e' }} />
                  )}
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: trips.length > 0 ? '#22c55e' : '#262626' }} />
                </span>
                <span className="text-xs font-headline font-bold uppercase tracking-widest" style={{ color: '#adaaaa' }}>
                  {activeCount > 0
                    ? `${activeCount} colectivo${activeCount !== 1 ? 's' : ''} en el mapa${filterLine ? ` · Línea ${filterLine}` : ''}`
                    : 'Sin colectivos activos'}
                </span>
              </div>

              <div className="px-3 py-3 flex items-center gap-2">
                {/* Buscar línea */}
                <div className="flex-1 relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#adaaaa' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    inputMode="numeric"
                    placeholder="Buscar línea..."
                    value={filterLine ?? ''}
                    onChange={(e) => setFilterLine(e.target.value || null)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-full text-sm text-white placeholder-gray-600 outline-none font-headline"
                    style={{ background: '#141414', border: '1px solid #262626' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#ff5e07')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
                  />
                </div>

                {/* Botón principal */}
                <button
                  onClick={openLineSelector}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-headline font-bold text-black whitespace-nowrap flex-shrink-0 transition uppercase"
                  style={{ background: '#ff5e07', boxShadow: '0 4px 12px rgba(255,94,7,0.4)' }}
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

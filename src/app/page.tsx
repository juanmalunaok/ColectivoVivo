'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback, useEffect } from 'react'
import dynamicImport from 'next/dynamic'
import { ProtectedRoute } from '@/components/UI/ProtectedRoute'
import { Header } from '@/components/UI/Header'
import { FilterChips } from '@/components/UI/FilterChips'
import { IdleSheet } from '@/components/UI/IdleSheet'
import { LineSelector } from '@/components/Trip/LineSelector'
import { ActiveTripPanel } from '@/components/Trip/ActiveTripPanel'
import { useAuth } from '@/context/AuthContext'
import { useActiveTrips } from '@/hooks/useActiveTrips'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useTrip } from '@/hooks/useTrip'
import { useKeepAwake } from '@/hooks/useKeepAwake'
import { useFavorites } from '@/hooks/useFavorites'
import type { BusLine, Branch } from '@/types'

const MapView = dynamicImport(
  () => import('@/components/Map/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#0a0a0c' }} /> },
)

type FlowStep = 'idle' | 'selectingLine' | 'active'
type FilterMode = 'near' | 'fav' | 'all' | 'empty'

export default function HomePage() {
  const { user }               = useAuth()
  const isAdmin = user?.email === 'juanma.lunaok@gmail.com'
  const { trips }              = useActiveTrips()
  const { trip, startTrip, updateLocation, setOccupancy, stopTrip } = useTrip(user?.uid)
  const { favorites, toggle: toggleFav, has: isFav } = useFavorites()

  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [filterLine,     setFilterLine]     = useState<string | null>(null)
  const [filterMode,     setFilterMode]     = useState<FilterMode>('all')
  const [followedTripId, setFollowedTripId] = useState<string | null>(null)

  const geoEnabled = flowStep === 'active'
  const { active: keepAwakeActive, method: keepAwakeMethod, ios: isIOS } = useKeepAwake(geoEnabled)
  const { lat, lng, speed, error: geoError } = useGeolocation({
    enabled: geoEnabled,
    onUpdate: updateLocation,
    intervalMs: 5000,
  })

  function openLineSelector() { setFlowStep('selectingLine') }

  async function handleStartTrip(line: BusLine, branch: Branch) {
    const fallback = { lat: -34.6037, lng: -58.3816 }

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

    await startTrip(line.number, branch.id, branch.name, initialLat, initialLng)
    setFlowStep('active')
  }

  const handleStopTrip = useCallback(async () => {
    await stopTrip()
    setFlowStep('idle')
  }, [stopTrip])

  useEffect(() => {
    if (followedTripId && !trips.find((t) => t.tripId === followedTripId)) {
      setFollowedTripId(null)
    }
  }, [trips, followedTripId])

  // Filtered trips by search + mode
  const filteredTrips = trips.filter((t) => {
    if (filterLine && !t.lineNumber.includes(filterLine)) return false
    if (filterMode === 'fav' && !favorites.includes(t.lineNumber)) return false
    if (filterMode === 'empty' && t.occupancy !== 'empty') return false
    return true
  })

  const visibleLineForMap = filterLine || null

  return (
    <ProtectedRoute>
      <div className="relative w-full h-full" style={{ background: '#0a0a0c' }}>
        {/* Mapa */}
        <MapView
          trips={trips}
          currentUserId={user?.uid}
          isAdmin={isAdmin}
          selfLat={lat}
          selfLng={lng}
          hasActiveTrip={flowStep === 'active'}
          filterLine={visibleLineForMap}
          followedTripId={followedTripId}
          activeLine={flowStep === 'active' ? trip.lineNumber : null}
          onFollow={setFollowedTripId}
          onUnfollow={() => setFollowedTripId(null)}
        />

        {/* Banner "Siguiendo línea X" */}
        {followedTripId && (() => {
          const ft = trips.find((t) => t.tripId === followedTripId)
          return ft ? (
            <div
              className="absolute z-30 flex items-center gap-2 rounded-full px-3 py-1.5 pointer-events-auto"
              style={{
                top: 170, left: '50%', transform: 'translateX(-50%)',
                background: 'oklch(30% 0.08 145 / 0.92)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '0.5px solid oklch(72% 0.15 145 / 0.4)',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="cv-dot-live" />
              <span className="font-headline" style={{
                fontSize: 12, fontWeight: 600, color: 'oklch(85% 0.13 145)', letterSpacing: -0.1,
              }}>
                Siguiendo línea {ft.lineNumber}
              </span>
              <button
                onClick={() => setFollowedTripId(null)}
                style={{
                  marginLeft: 2, background: 'transparent', border: 0,
                  color: 'oklch(85% 0.13 145)', opacity: 0.7, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}
                aria-label="Dejar de seguir"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6l-12 12"/>
                </svg>
              </button>
            </div>
          ) : null
        })()}

        {/* Header */}
        <Header
          filterLine={filterLine}
          onFilterChange={setFilterLine}
          tripActive={flowStep === 'active'}
        />

        {/* Filter chips + live counter */}
        {flowStep !== 'active' && (
          <FilterChips
            mode={filterMode}
            onChange={setFilterMode}
            liveCount={filteredTrips.length}
          />
        )}

        {/* Flujo de inicio de viaje (línea → ramal → consent) */}
        {flowStep === 'selectingLine' && (
          <LineSelector
            onConfirm={handleStartTrip}
            onCancel={() => setFlowStep('idle')}
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

        {/* Bottom sheet — estado idle */}
        {flowStep === 'idle' && (
          <IdleSheet
            trips={filteredTrips}
            favorites={favorites}
            isFav={isFav}
            toggleFav={toggleFav}
            onStartTrip={openLineSelector}
            onLineTap={(lineNumber) => setFilterLine(lineNumber)}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

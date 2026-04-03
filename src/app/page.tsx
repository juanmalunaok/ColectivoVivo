'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback } from 'react'
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
import type { BusLine, Branch } from '@/types'

// Importación dinámica del mapa para evitar SSR (usa APIs del browser)
const MapView = dynamicImport(
  () => import('@/components/Map/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> },
)

// ─── Estado del flujo de activación ──────────────────────────────────────────
type FlowStep = 'idle' | 'selectingLine' | 'confirmingConsent' | 'active'

export default function HomePage() {
  const { user }               = useAuth()
  const { trips }              = useActiveTrips()
  const { trip, startTrip, updateLocation, stopTrip } = useTrip(user?.uid)

  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [pending,  setPending]  = useState<{ line: BusLine; branch: Branch } | null>(null)
  const [filterLine, setFilterLine] = useState<string | null>(null)

  // GPS activo solo cuando hay viaje en curso
  const geoEnabled = flowStep === 'active'

  const { lat, lng, speed, error: geoError } = useGeolocation({
    enabled:   geoEnabled,
    onUpdate:  updateLocation,
    intervalMs: 5000,
  })

  // ── Flujo de activación ────────────────────────────────────────────────────

  function openLineSelector() {
    setFlowStep('selectingLine')
  }

  function handleLineSelected(line: BusLine, branch: Branch) {
    setPending({ line, branch })
    setFlowStep('confirmingConsent')
  }

  async function handleConsentAccepted() {
    if (!pending || !lat || !lng) {
      // Pedimos GPS primero antes de activar
      // Si no tenemos posición inicial, activamos igualmente y el primer
      // update del watchPosition lo colocará en el mapa
      const fallback = { lat: -34.6037, lng: -58.3816 } // CABA centro como fallback
      await startTrip(
        pending!.line.number,
        pending!.branch.id,
        pending!.branch.name,
        lat ?? fallback.lat,
        lng ?? fallback.lng,
      )
    } else {
      await startTrip(
        pending!.line.number,
        pending!.branch.id,
        pending!.branch.name,
        lat,
        lng,
      )
    }
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute>
      <div className="relative w-full h-full">
        {/* Mapa de fondo — ocupa toda la pantalla */}
        <MapView
          trips={trips}
          currentUserId={user?.uid}
          selfLat={lat}
          selfLng={lng}
          filterLine={filterLine}
        />

        {/* Header superpuesto */}
        <Header
          filterLine={filterLine}
          onFilterClear={() => setFilterLine(null)}
          tripActive={flowStep === 'active'}
          onStartTrip={openLineSelector}
        />

        {/* Selector de línea (modal) */}
        {flowStep === 'selectingLine' && (
          <LineSelector
            onSelect={handleLineSelected}
            onCancel={() => setFlowStep('idle')}
          />
        )}

        {/* Modal de consentimiento GPS */}
        {flowStep === 'confirmingConsent' && pending && (
          <ConsentModal
            lineNumber={pending.line.number}
            branchName={pending.branch.name}
            onAccept={handleConsentAccepted}
            onCancel={handleConsentCancelled}
          />
        )}

        {/* Panel de viaje activo */}
        {flowStep === 'active' && (
          <ActiveTripPanel
            trip={trip}
            speed={speed}
            geoError={geoError}
            onStop={handleStopTrip}
          />
        )}

        {/* Buscador rápido de línea (observador) — solo cuando no hay viaje activo */}
        {flowStep === 'idle' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 mb-1.5">¿Qué línea querés seguir?</p>
              <div className="flex gap-2">
                <input
                  type="search"
                  inputMode="numeric"
                  placeholder="Número de línea (ej: 109)"
                  value={filterLine ?? ''}
                  onChange={(e) => setFilterLine(e.target.value || null)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {filterLine && (
                  <button
                    onClick={() => setFilterLine(null)}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
              {trips.length > 0 && (
                <p className="text-xs text-gray-400 mt-1.5">
                  {filterLine
                    ? `${trips.filter((t) => t.lineNumber === filterLine).length} colectivo(s) de la línea ${filterLine} en el mapa`
                    : `${trips.length} colectivo(s) activo(s) en el mapa`}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

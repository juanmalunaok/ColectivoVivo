'use client'

import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'
import { BusMarker } from './BusMarker'
import type { ActiveTrip } from '@/types'

const CABA_CENTER = { lat: -34.6037, lng: -58.3816 }
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

// ─── Subcomponente que centra el mapa en la posición propia ──────────────────

function SelfCentering({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    if (map && lat && lng) {
      map.panTo({ lat, lng })
    }
  }, [map, lat, lng])

  return null
}

// ─── Componente principal ────────────────────────────────────────────────────

interface Props {
  trips:          ActiveTrip[]
  currentUserId?: string
  selfLat?:       number | null
  selfLng?:       number | null
  filterLine?:    string | null
}

export function MapView({ trips, currentUserId, selfLat, selfLng, filterLine }: Props) {
  const visibleTrips = filterLine
    ? trips.filter((t) => t.lineNumber === filterLine)
    : trips

  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <Map
        mapId="colectivo-vivo-map"
        defaultCenter={CABA_CENTER}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
        // Estilo de mapa limpio para mayor legibilidad
        styles={[
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit.station', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
        ]}
      >
        {/* Centra el mapa en el usuario viajando */}
        {selfLat && selfLng && (
          <SelfCentering lat={selfLat} lng={selfLng} />
        )}

        {/* Marcadores de todos los viajes activos */}
        {visibleTrips.map((trip) => (
          <BusMarker
            key={trip.tripId}
            trip={trip}
            currentUserId={currentUserId}
          />
        ))}
      </Map>
    </APIProvider>
  )
}

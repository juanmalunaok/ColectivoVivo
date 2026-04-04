'use client'

import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'
import { BusMarker } from './BusMarker'
import type { ActiveTrip } from '@/types'

const CABA_CENTER = { lat: -34.6037, lng: -58.3816 }
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const MAP_ID = process.env.NEXT_PUBLIC_MAPS_ID ?? ''

const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d0d1a' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5a6480' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0d1a' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#14142a' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#8892b0' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#1a1a30' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0d0d1a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#3d4460' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#20203a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#252545' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a30' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#5a6480' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#14142a' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#6366f1' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#04040e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1e2033' }] },
]

function SelfCentering({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    if (map && lat && lng) map.panTo({ lat, lng })
  }, [map, lat, lng])
  return null
}

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
        mapId={MAP_ID}
        defaultCenter={CABA_CENTER}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
        style={{ width: '100%', height: '100%' }}
        styles={DARK_STYLE}
      >
        {selfLat && selfLng && <SelfCentering lat={selfLat} lng={selfLng} />}
        {visibleTrips.map((trip) => (
          <BusMarker key={trip.tripId} trip={trip} currentUserId={currentUserId} />
        ))}
      </Map>
    </APIProvider>
  )
}

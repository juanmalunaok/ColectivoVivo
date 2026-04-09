'use client'

import { APIProvider, Map, Polyline, useMap, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useEffect, useCallback, useState, useRef } from 'react'
import { BusMarker } from './BusMarker'
import { useRouteShape } from '@/hooks/useRouteShape'
import type { ActiveTrip } from '@/types'

function FollowCentering({ trips, followedTripId }: { trips: ActiveTrip[]; followedTripId: string }) {
  const map = useMap()
  const followed = trips.find((t) => t.tripId === followedTripId)
  useEffect(() => {
    if (map && followed) map.panTo({ lat: followed.lat, lng: followed.lng })
  }, [map, followed?.lat, followed?.lng]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

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
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#ff5e07' }] },
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

function AutoCenterOnLoad({ pos }: { pos: { lat: number; lng: number } | null }) {
  const map = useMap()
  const centeredRef = useRef(false)
  useEffect(() => {
    if (map && pos && !centeredRef.current) {
      map.panTo(pos)
      map.setZoom(15)
      centeredRef.current = true
    }
  }, [map, pos])
  return null
}

function CenterButton({ cachedPos }: { cachedPos: { lat: number; lng: number } | null }) {
  const map = useMap()
  const handleCenter = useCallback(() => {
    if (!map) return
    if (cachedPos) {
      map.panTo(cachedPos)
      map.setZoom(15)
      return
    }
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        map.setZoom(15)
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [map, cachedPos])

  return (
    <button
      onClick={handleCenter}
      aria-label="Centrar en mi ubicación"
      style={{
        position: 'absolute',
        bottom: '180px',
        right: '16px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#141414',
        border: '1px solid #262626',
        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5e07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        <circle cx="12" cy="12" r="8" strokeOpacity="0.3"/>
      </svg>
    </button>
  )
}

interface Props {
  trips:            ActiveTrip[]
  currentUserId?:   string
  isAdmin?:         boolean
  selfLat?:         number | null
  selfLng?:         number | null
  filterLine?:      string | null
  followedTripId?:  string | null
  activeLine?:      string | null
  hasActiveTrip?:   boolean
  onFollow?:        (tripId: string) => void
  onUnfollow?:      () => void
}

function UserPositionMarker({ pos }: { pos: { lat: number; lng: number } | null }) {
  if (!pos) return null

  return (
    <AdvancedMarker position={pos} zIndex={20}>
      <div style={{ position: 'relative', width: 36, height: 36 }}>
        {/* Pulso exterior */}
        <div style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          background: 'rgba(255,94,7,0.15)',
          animation: 'ping 1.8s cubic-bezier(0,0,0.2,1) infinite',
        }} />
        {/* Contenedor circular */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#141414',
          border: '2.5px solid #ff5e07',
          boxShadow: '0 2px 10px rgba(255,94,7,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Ícono persona */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff5e07">
            <circle cx="12" cy="6" r="4" />
            <path d="M12 13c-4.5 0-7 2.7-7 5v1h14v-1c0-2.3-2.5-5-7-5z" />
          </svg>
        </div>
      </div>
    </AdvancedMarker>
  )
}

function RoutePolyline({ lineNumber }: { lineNumber: string }) {
  const coords = useRouteShape(lineNumber)
  if (!coords || coords.length < 2) return null
  return (
    <Polyline
      path={coords}
      strokeColor="#ff5e07"
      strokeOpacity={0.7}
      strokeWeight={5}
    />
  )
}

export function MapView({ trips, currentUserId, isAdmin, selfLat, selfLng, filterLine, followedTripId, activeLine, hasActiveTrip, onFollow, onUnfollow }: Props) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)

  // Seguimiento de posición siempre activo (para el botón centrar y AutoCenterOnLoad)
  useEffect(() => {
    if (!('geolocation' in navigator)) return
    const watchId = navigator.geolocation.watchPosition(
      (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const visibleTrips = filterLine
    ? trips.filter((t) => t.lineNumber === filterLine)
    : trips

  // Línea a mostrar: viaje propio activo > seguido > filtro
  const followedLine = followedTripId
    ? trips.find((t) => t.tripId === followedTripId)?.lineNumber ?? null
    : null
  const routeLine = activeLine ?? followedLine ?? filterLine ?? null

  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Map
          mapId={MAP_ID}
          defaultCenter={CABA_CENTER}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI
          style={{ width: '100%', height: '100%' }}
          styles={DARK_STYLE}
        >
          {!hasActiveTrip && <UserPositionMarker pos={userPos} />}
          <AutoCenterOnLoad pos={userPos} />
          {selfLat && selfLng && !followedTripId && <SelfCentering lat={selfLat} lng={selfLng} />}
          {followedTripId && <FollowCentering trips={trips} followedTripId={followedTripId} />}
          {routeLine && <RoutePolyline lineNumber={routeLine} />}
          {visibleTrips.map((trip) => (
            <BusMarker
              key={trip.tripId}
              trip={trip}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              isFollowed={trip.tripId === followedTripId}
              onFollow={onFollow ? () => onFollow(trip.tripId) : undefined}
              onUnfollow={onUnfollow}
            />
          ))}
        </Map>
        <CenterButton cachedPos={userPos} />
      </div>
    </APIProvider>
  )
}

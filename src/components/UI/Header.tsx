'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Props {
  filterLine:    string | null
  onFilterClear: () => void
  tripActive:    boolean
  onStartTrip:   () => void
}

export function Header({ filterLine, onFilterClear, tripActive, onStartTrip }: Props) {
  const { user, signOut }      = useAuth()
  const router                 = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 pointer-events-none">
      {/* Logo */}
      <div className="bg-white rounded-full shadow-md px-3 py-1.5 flex items-center gap-1.5 pointer-events-auto">
        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">CV</span>
        </div>
        <span className="text-sm font-bold text-gray-800">ColectivoVivo</span>
        {filterLine && (
          <button
            onClick={onFilterClear}
            className="ml-1 flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium"
          >
            Línea {filterLine}
            <span className="text-blue-400">✕</span>
          </button>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Botón "Estoy en un colectivo" si no hay viaje activo */}
        {!tripActive && (
          <button
            onClick={onStartTrip}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full px-3 py-2 shadow-md transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Estoy en un colectivo
          </button>
        )}

        {/* Avatar / menú de usuario */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100"
          >
            <span className="text-sm font-bold text-blue-700">
              {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
            </span>
          </button>

          {menuOpen && (
            <>
              {/* Overlay para cerrar */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-11 z-20 bg-white rounded-xl shadow-xl border border-gray-100 w-48 py-2 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {user?.displayName ?? 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

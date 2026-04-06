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
  const { user, signOut }       = useAuth()
  const router                  = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  const initial = user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, rgba(14,14,14,0.92) 0%, transparent 100%)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#ff5e07' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M8 6h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="black" strokeWidth="2"/>
              <circle cx="9" cy="17" r="1.5" fill="black"/>
              <circle cx="15" cy="17" r="1.5" fill="black"/>
              <path d="M6 10h12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-headline text-base font-black tracking-tighter uppercase italic text-white">
            COLECTIVO VIVO
          </span>
        </div>

        {filterLine && (
          <button
            onClick={onFilterClear}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition"
            style={{ background: 'rgba(255,94,7,0.15)', color: '#ff9064', border: '1px solid rgba(255,94,7,0.3)' }}
          >
            Línea {filterLine}
            <span style={{ color: '#ff5e07' }}>✕</span>
          </button>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {!tripActive && (
          <button
            onClick={onStartTrip}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-black transition"
            style={{ background: '#ff5e07', boxShadow: '0 4px 14px rgba(255,94,7,0.4)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Estoy en un colectivo
          </button>
        )}

        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition"
            style={{ background: '#1a1919', border: '1px solid #262626', color: '#ff9064' }}
          >
            {initial}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 rounded-2xl shadow-2xl w-48 py-2 overflow-hidden"
                style={{ background: '#141414', border: '1px solid #262626' }}>
                <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #1a1919' }}>
                  <p className="text-xs font-semibold text-white truncate">{user?.displayName ?? 'Usuario'}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#adaaaa' }}>{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm transition"
                  style={{ color: '#ff716c' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,113,108,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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

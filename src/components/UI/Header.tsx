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
      style={{ background: 'linear-gradient(to bottom, rgba(8,8,16,0.85) 0%, transparent 100%)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
          style={{ background: 'rgba(15,15,26,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path d="M8 6h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="white" strokeWidth="2"/>
              <circle cx="9" cy="17" r="1.5" fill="white"/>
              <circle cx="15" cy="17" r="1.5" fill="white"/>
              <path d="M6 10h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">ColectivoVivo</span>
        </div>

        {filterLine && (
          <button
            onClick={onFilterClear}
            className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(12px)' }}
          >
            Línea {filterLine}
            <span style={{ color: '#6366f1' }}>✕</span>
          </button>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {!tripActive && (
          <button
            onClick={onStartTrip}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition"
            style={{ background: 'rgba(15,15,26,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', color: '#818cf8' }}
          >
            {initial}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 rounded-2xl shadow-2xl w-48 py-2 overflow-hidden"
                style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-semibold text-white truncate">{user?.displayName ?? 'Usuario'}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#4b5563' }}>{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm transition"
                  style={{ color: '#f87171' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
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

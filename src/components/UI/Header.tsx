'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Props {
  filterLine:    string | null
  onFilterChange: (value: string | null) => void
  tripActive:    boolean
}

export function Header({ filterLine, onFilterChange }: Props) {
  const { user, signOut }       = useAuth()
  const router                  = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  const initials = (user?.displayName?.slice(0, 2) ?? user?.email?.slice(0, 2) ?? 'JM').toUpperCase()

  return (
    <header
      className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
      style={{ padding: '60px 14px 0' }}
    >
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Search pill */}
        <div
          style={{
            flex: 1, height: 48, borderRadius: 999,
            background: 'rgba(20,20,24,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '0.5px solid #2a2a32',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-5-5"/>
          </svg>
          <input
            type="search"
            inputMode="numeric"
            placeholder="Buscar línea o ramal"
            value={filterLine ?? ''}
            onChange={(e) => onFilterChange(e.target.value || null)}
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              color: '#f5f5f7', fontSize: 15, letterSpacing: -0.2,
              fontFamily: 'var(--font-body), Inter, sans-serif',
            }}
          />
          {filterLine && (
            <button
              onClick={() => onFilterChange(null)}
              style={{
                background: 'transparent', border: 0, color: '#6b6b75', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: 0,
              }}
              aria-label="Limpiar búsqueda"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6l-12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Avatar button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="font-headline"
            style={{
              width: 48, height: 48, borderRadius: 999,
              background: 'rgba(20,20,24,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '0.5px solid #2a2a32',
              color: '#f5f5f7',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              fontSize: 15, fontWeight: 700, letterSpacing: -0.3,
            }}
            aria-label="Cuenta"
          >
            {initials}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-12 z-20 overflow-hidden"
                style={{
                  width: 220,
                  background: 'rgba(10,10,12,0.95)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '0.5px solid #2a2a32',
                  borderRadius: 18,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  animation: 'cv-fade-up 0.2s',
                }}
              >
                <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #2a2a32' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f7', letterSpacing: -0.2, margin: 0 }}>
                    {user?.displayName ?? 'Usuario'}
                  </p>
                  <p style={{ fontSize: 11, color: '#a1a1aa', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 14px',
                    background: 'transparent', border: 0,
                    color: 'oklch(72% 0.18 25)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'var(--font-body), Inter, sans-serif',
                  }}
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

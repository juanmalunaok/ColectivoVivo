'use client'

import { useState, useEffect } from 'react'

function shouldShow() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false
  const isIOS        = /iPad|iPhone|iPod/.test(navigator.userAgent)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isStandalone = (window.navigator as any).standalone === true
  return isIOS && !isStandalone
}

/**
 * Banner que aparece en iOS Safari (no instalado como PWA) indicando
 * cómo agregar la app al inicio para que el GPS funcione correctamente.
 * Se descarta con un toque y se recuerda en localStorage.
 */
export function IOSInstallBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('ios-banner-dismissed')) return
    setVisible(shouldShow())
  }, [])

  function dismiss() {
    localStorage.setItem('ios-banner-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="absolute top-16 left-0 right-0 z-30 px-4 pointer-events-none">
      <div
        className="rounded-2xl p-3.5 pointer-events-auto"
        style={{
          background:    'rgba(99,102,241,0.13)',
          border:        '1px solid rgba(99,102,241,0.28)',
          backdropFilter:'blur(14px)',
        }}
      >
        <div className="flex items-start gap-3">
          {/* Icono compartir de iOS */}
          <div className="flex-shrink-0 mt-0.5" style={{ color: '#818cf8' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-snug" style={{ color: '#a5b4fc' }}>
              Agregá ColectivoVivo al inicio
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#818cf8' }}>
              Tocá el botón{' '}
              <span className="font-semibold" style={{ color: '#c7d2fe' }}>Compartir</span>
              {' '}→{' '}
              <span className="font-semibold" style={{ color: '#c7d2fe' }}>"Agregar a la pantalla de inicio"</span>
              {' '}para que el GPS siga funcionando sin perder el mapa.
            </p>
          </div>

          <button
            onClick={dismiss}
            className="flex-shrink-0 opacity-50 active:opacity-100 transition-opacity"
            style={{ color: '#818cf8', lineHeight: 1, paddingTop: 2 }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

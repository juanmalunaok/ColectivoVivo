'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { searchLines } from '@/lib/busLines'
import type { BusLine, Branch } from '@/types'

interface Props {
  onSelect: (line: BusLine, branch: Branch) => void
  onCancel: () => void
}

export function LineSelector({ onSelect, onCancel }: Props) {
  const [query,          setQuery]          = useState('')
  const [selectedLine,   setSelectedLine]   = useState<BusLine | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = useMemo(() => searchLines(query), [query])

  function handleConfirm() {
    if (selectedLine && selectedBranch) onSelect(selectedLine, selectedBranch)
  }

  const surface   = '#0f0f1a'
  const surface2  = '#16162a'
  const border    = 'rgba(255,255,255,0.07)'
  const textMuted = '#4b5563'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-[420px] flex flex-col rounded-t-3xl shadow-2xl"
        style={{ background: surface, border: `1px solid ${border}`, borderBottom: 'none', maxHeight: '88vh' }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">¿En qué colectivo estás?</h2>
            <button onClick={onCancel} className="w-7 h-7 rounded-lg flex items-center justify-center transition"
              style={{ background: surface2, color: textMuted }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              inputMode="numeric"
              placeholder="Número de línea (ej: 60, 109, 500)..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedLine(null); setSelectedBranch(null) }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition"
              style={{ background: surface2, border: `1px solid ${border}` }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.currentTarget.style.borderColor = border)}
            />
          </div>
        </div>

        {/* Lista de líneas */}
        {!selectedLine && (
          <ul className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <li className="px-5 py-10 text-center text-sm" style={{ color: textMuted }}>
                No se encontró ninguna línea
              </li>
            )}
            {filtered.map((line) => (
              <li key={line.number} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                <button
                  onClick={() => setSelectedLine(line)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="inline-flex items-center justify-center min-w-[44px] h-8 rounded-xl text-white font-bold text-sm flex-shrink-0 px-2"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                    {line.number}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm text-white font-medium">{line.name}</span>
                    <p className="text-xs mt-0.5 truncate" style={{ color: textMuted }}>
                      {line.branches.length} ramal{line.branches.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  <svg className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Lista de ramales */}
        {selectedLine && !selectedBranch && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <button
              onClick={() => setSelectedLine(null)}
              className="flex items-center gap-2 px-5 py-3 text-sm transition flex-shrink-0"
              style={{ color: '#818cf8', borderBottom: `1px solid ${border}` }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver · <span className="font-bold">Línea {selectedLine.number}</span>
            </button>
            <p className="px-5 py-2 text-xs" style={{ color: textMuted }}>Seleccioná el ramal:</p>
            <ul className="overflow-y-auto flex-1">
              {selectedLine.branches.map((branch) => (
                <li key={branch.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                  <button
                    onClick={() => setSelectedBranch(branch)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left transition"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <svg className="w-4 h-4" style={{ color: '#6366f1' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white">{branch.name}</span>
                    <svg className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confirmación */}
        {selectedLine && selectedBranch && (
          <div className="px-5 py-5 flex-shrink-0" style={{ borderTop: `1px solid ${border}` }}>
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="inline-flex items-center justify-center min-w-[48px] h-10 rounded-xl text-white font-bold text-base px-2"
                style={{ background: '#6366f1' }}>
                {selectedLine.number}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium mb-0.5" style={{ color: '#818cf8' }}>Seleccionado</p>
                <p className="text-sm text-white font-semibold truncate">{selectedBranch.name}</p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}
            >
              Estoy en este colectivo
            </button>
            <button
              onClick={() => setSelectedBranch(null)}
              className="w-full mt-2 py-2 text-sm transition"
              style={{ color: textMuted }}
            >
              Cambiar ramal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

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
  const [vpHeight, setVpHeight] = useState<number>(
    typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 700
  )

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => setVpHeight(vv.height)
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  const filtered = useMemo(() => searchLines(query), [query])

  function handleConfirm() {
    if (selectedLine && selectedBranch) onSelect(selectedLine, selectedBranch)
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex items-end justify-center"
      style={{ height: vpHeight, background: 'rgba(0,0,0,0.75)' }}
    >
      <div className="w-full max-w-[420px] flex flex-col shadow-2xl"
        style={{ background: '#0a0a0c', borderRadius: '22px 22px 0 0', borderTop: '0.5px solid #2a2a32', maxHeight: Math.round(vpHeight * 0.92) }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: '#2a2a32' }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 flex-shrink-0" style={{ borderBottom: '0.5px solid #1f1f26' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline font-black text-3xl tracking-tighter uppercase text-white leading-none">
              ¿EN QUÉ<br/><span style={{ color: 'oklch(72% 0.15 145)' }}>COLECTIVO?</span>
            </h2>
            <button onClick={onCancel}
              className="w-9 h-9 rounded-full flex items-center justify-center transition"
              style={{ background: '#1c1c22', color: '#a1a1aa' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a1a1aa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              inputMode="numeric"
              placeholder="Número de línea (ej: 60, 109)..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedLine(null); setSelectedBranch(null) }}
              className="w-full pl-11 pr-4 py-3 rounded-full text-sm text-white placeholder-gray-600 outline-none transition"
              style={{ background: '#141418', border: '0.5px solid #2a2a32' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'oklch(72% 0.15 145)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a32')}
            />
          </div>
        </div>

        {/* Lista de líneas */}
        {!selectedLine && (
          <ul className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <li className="px-5 py-10 text-center text-sm" style={{ color: '#a1a1aa' }}>
                No se encontró ninguna línea
              </li>
            )}
            {filtered.map((line) => (
              <li key={line.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <button
                  onClick={() => setSelectedLine(line)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left transition"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(72% 0.15 145 / 0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="font-headline font-black text-3xl tracking-tighter leading-none flex-shrink-0 w-14 text-right"
                    style={{ color: '#ffffff' }}>
                    {line.number}
                  </span>
                  <div className="min-w-0 flex-1" style={{ borderLeft: '2px solid #1f1f26', paddingLeft: '16px' }}>
                    <span className="text-sm text-white font-bold font-headline uppercase tracking-tight">{line.name}</span>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#a1a1aa' }}>
                      {line.branches.length} ramal{line.branches.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#a1a1aa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="flex items-center gap-2 px-5 py-3.5 text-sm transition flex-shrink-0 font-headline font-bold uppercase"
              style={{ color: 'oklch(85% 0.13 145)', borderBottom: '0.5px solid #1f1f26' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Línea {selectedLine.number}
            </button>
            <p className="px-5 py-2 text-xs uppercase font-headline font-bold tracking-widest" style={{ color: '#a1a1aa' }}>Seleccioná el ramal:</p>
            <ul className="overflow-y-auto flex-1">
              {selectedLine.branches.map((branch) => (
                <li key={branch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <button
                    onClick={() => setSelectedBranch(branch)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left transition"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(72% 0.15 145 / 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'oklch(72% 0.15 145 / 0.12)', border: '0.5px solid oklch(72% 0.15 145 / 0.3)' }}>
                      <svg className="w-4 h-4" style={{ color: 'oklch(72% 0.15 145)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white font-medium">{branch.name}</span>
                    <svg className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: '#a1a1aa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="px-5 py-5 flex-shrink-0" style={{ borderTop: '0.5px solid #1f1f26' }}>
            <div className="rounded-[14px] p-4 mb-4 flex items-center gap-3"
              style={{ background: 'oklch(72% 0.15 145 / 0.12)', border: '0.5px solid oklch(72% 0.15 145 / 0.3)' }}>
              <span className="flex items-center justify-center w-12 h-12 rounded-xl font-headline font-black text-xl text-black flex-shrink-0"
                style={{ background: 'oklch(72% 0.15 145)' }}>
                {selectedLine.number}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-headline font-bold uppercase tracking-widest mb-0.5" style={{ color: 'oklch(85% 0.13 145)' }}>Seleccionado</p>
                <p className="text-sm text-white font-semibold truncate">{selectedBranch.name}</p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-full text-sm font-headline font-bold text-black uppercase tracking-tight transition"
              style={{ background: 'oklch(72% 0.15 145)', color: '#001b0a', boxShadow: '0 4px 14px oklch(72% 0.15 145 / 0.4)' }}
            >
              Estoy en este colectivo
            </button>
            <button
              onClick={() => setSelectedBranch(null)}
              className="w-full mt-2 py-2 text-sm transition"
              style={{ color: '#a1a1aa' }}
            >
              Cambiar ramal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

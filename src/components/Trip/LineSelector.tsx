'use client'

import { useState, useMemo } from 'react'
import { BUS_LINES, searchLines } from '@/lib/busLines'
import type { BusLine, Branch } from '@/types'

interface Props {
  onSelect: (line: BusLine, branch: Branch) => void
  onCancel: () => void
}

export function LineSelector({ onSelect, onCancel }: Props) {
  const [query,         setQuery]         = useState('')
  const [selectedLine,  setSelectedLine]  = useState<BusLine | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const filtered = useMemo(() => searchLines(query), [query])

  function handleConfirm() {
    if (selectedLine && selectedBranch) {
      onSelect(selectedLine, selectedBranch)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">¿En qué colectivo estás?</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>
          <input
            type="search"
            inputMode="numeric"
            placeholder="Buscar por número (ej: 109)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedLine(null)
              setSelectedBranch(null)
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lista de líneas */}
        {!selectedLine && (
          <ul className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {filtered.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-gray-400">
                No se encontró ninguna línea.
              </li>
            )}
            {filtered.map((line) => (
              <li key={line.number}>
                <button
                  onClick={() => setSelectedLine(line)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-blue-50 transition"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                    {line.number}
                  </span>
                  <span className="text-sm text-gray-700">{line.name}</span>
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
              className="flex items-center gap-1 px-5 py-2.5 text-sm text-blue-600 hover:text-blue-800"
            >
              ← Volver a líneas
            </button>
            <p className="px-5 text-xs text-gray-500 mb-1">Seleccioná el ramal:</p>
            <ul className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {selectedLine.branches.map((branch) => (
                <li key={branch.id}>
                  <button
                    onClick={() => setSelectedBranch(branch)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-blue-50 transition"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-700">{branch.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confirmación */}
        {selectedLine && selectedBranch && (
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-blue-600 font-medium">Seleccionado:</p>
              <p className="text-sm font-bold text-blue-900 mt-0.5">Línea {selectedLine.number}</p>
              <p className="text-xs text-blue-700">{selectedBranch.name}</p>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
            >
              Estoy en este colectivo
            </button>
            <button
              onClick={() => setSelectedBranch(null)}
              className="w-full mt-1.5 py-1.5 text-gray-400 text-sm hover:text-gray-600"
            >
              Cambiar ramal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

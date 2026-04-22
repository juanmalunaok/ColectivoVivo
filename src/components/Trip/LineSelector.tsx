'use client'

import { useState, useMemo, useRef, useEffect, ReactNode } from 'react'
import { searchLines, BUS_LINES } from '@/lib/busLines'
import { CVIcon } from '@/components/UI/CVIcon'
import type { BusLine, Branch } from '@/types'

interface Props {
  onConfirm: (line: BusLine, branch: Branch) => Promise<void> | void
  onCancel:  () => void
}

function LineBadge({ number, size = 'md', style }: { number: string; size?: 'sm' | 'md' | 'lg'; style?: React.CSSProperties }) {
  const s = size === 'sm' ? { h: 22, px: 7, fs: 12, min: 30 }
          : size === 'lg' ? { h: 36, px: 12, fs: 17, min: 46 }
          : { h: 28, px: 9, fs: 14, min: 36 }
  return (
    <span
      className="font-headline"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: s.h, padding: `0 ${s.px}px`, minWidth: s.min,
        borderRadius: 999, background: '#fff', color: '#000',
        fontWeight: 800, fontSize: s.fs, letterSpacing: -0.03 * s.fs,
        ...style,
      }}
    >
      {number}
    </span>
  )
}

function StepScreen({
  title, subtitle, onBack, onCancel, stepIdx, heroLine, children,
}: {
  title: string
  subtitle?: string | null
  onBack?: () => void
  onCancel: () => void
  stepIdx: 0 | 1 | 2
  heroLine?: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        animation: 'cv-fade-in 0.25s',
      }}
    >
      {/* Header */}
      <div style={{ padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack || onCancel}
          style={{
            width: 40, height: 40, borderRadius: 999,
            background: '#141418', border: '0.5px solid #2a2a32',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label={onBack ? 'Volver' : 'Cerrar'}
        >
          <CVIcon name={onBack ? 'chevL' : 'close'} size={18} />
        </button>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: i === stepIdx ? 20 : 6, height: 6, borderRadius: 999,
              background: i <= stepIdx ? '#f5f5f7' : '#2a2a32',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        {onBack ? (
          <button
            onClick={onCancel}
            style={{
              height: 40, padding: '0 12px', borderRadius: 999,
              background: 'transparent', border: 0, color: '#a1a1aa',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-body), Inter, sans-serif',
            }}
          >
            Cancelar
          </button>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>

      {/* Title */}
      <div style={{ padding: '24px 20px 16px' }}>
        {heroLine && <div style={{ marginBottom: 12 }}><LineBadge number={heroLine} size="lg" /></div>}
        <h1 className="font-headline" style={{
          fontSize: 28, fontWeight: 700, margin: 0,
          letterSpacing: -1.1, lineHeight: 1.1, color: '#fff',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ marginTop: 6, fontSize: 15, color: '#a1a1aa', letterSpacing: -0.2 }}>
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  )
}

function ConsentItem({ icon, title, body }: { icon: 'locate' | 'shield' | 'flag'; title: string; body: string }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '12px 14px', borderRadius: 14,
      background: '#0a0a0c', border: '0.5px solid #1f1f26',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: 'oklch(72% 0.15 145 / 0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'oklch(82% 0.12 145)',
      }}>
        <CVIcon name={icon} size={17} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="font-headline" style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2, color: '#f5f5f7' }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 2, letterSpacing: -0.1, lineHeight: 1.4 }}>
          {body}
        </div>
      </div>
    </div>
  )
}

export function LineSelector({ onConfirm, onCancel }: Props) {
  const [step, setStep] = useState<'line' | 'branch' | 'consent'>('line')
  const [query, setQuery] = useState('')
  const [selectedLine, setSelectedLine] = useState<BusLine | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [step])

  const filtered = useMemo(() => (query ? searchLines(query) : BUS_LINES), [query])

  async function handleStart() {
    if (!selectedLine || !selectedBranch || submitting) return
    setSubmitting(true)
    try {
      await onConfirm(selectedLine, selectedBranch)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Step 0: line grid ──────────────────────────────────────────
  if (step === 'line') {
    return (
      <StepScreen
        title="¿Qué línea vas a tomar?"
        subtitle="Buscá por número o nombre."
        onCancel={onCancel}
        stepIdx={0}
      >
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{
            height: 48, borderRadius: 14, background: '#141418',
            border: '0.5px solid #2a2a32',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          }}>
            <CVIcon name="search" size={18} color="#a1a1aa" />
            <input
              ref={inputRef}
              type="search"
              inputMode="numeric"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: 60, 152, 29..."
              style={{
                flex: 1, background: 'transparent', border: 0, outline: 'none',
                color: '#f5f5f7', fontSize: 16,
                fontFamily: 'var(--font-body), Inter, sans-serif',
                letterSpacing: -0.2,
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'transparent', border: 0, color: '#6b6b75', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                aria-label="Limpiar"
              >
                <CVIcon name="close" size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="cv-scroll" style={{ padding: '16px 20px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#a1a1aa',
            letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 8,
          }}>
            {query ? 'Resultados' : 'Todas las líneas'}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#a1a1aa', fontSize: 14 }}>
              No se encontró ninguna línea
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {filtered.map((line) => (
                <button
                  key={line.number}
                  onClick={() => {
                    setSelectedLine(line)
                    if (line.branches.length === 1) {
                      setSelectedBranch(line.branches[0])
                      setStep('consent')
                    } else {
                      setStep('branch')
                    }
                  }}
                  style={{
                    aspectRatio: '1', borderRadius: 14,
                    background: '#141418', border: '0.5px solid #1f1f26',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 4,
                    cursor: 'pointer', color: '#fff', padding: 4,
                  }}
                >
                  <LineBadge number={line.number} size="md" />
                  <div style={{ fontSize: 10, color: '#6b6b75', marginTop: 2 }}>
                    {line.branches.length} {line.branches.length === 1 ? 'ramal' : 'ramales'}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div style={{ height: 24 }} />
        </div>
      </StepScreen>
    )
  }

  // ── Step 1: branch cards ───────────────────────────────────────
  if (step === 'branch' && selectedLine) {
    return (
      <StepScreen
        title={`Línea ${selectedLine.number}`}
        subtitle="Elegí el ramal que estás tomando."
        onCancel={onCancel}
        onBack={() => setStep('line')}
        stepIdx={1}
        heroLine={selectedLine.number}
      >
        <div className="cv-scroll" style={{ padding: '12px 20px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selectedLine.branches.map((b) => {
              const letter = (b.id.split('-')[1] ?? '·').toUpperCase()
              const shortName = b.name.split(' - ')[1] || b.name
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b)
                    setStep('consent')
                  }}
                  style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: '#141418', border: '0.5px solid #1f1f26',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', color: '#fff', textAlign: 'left',
                  }}
                >
                  <div
                    className="font-headline"
                    style={{
                      width: 34, height: 34, borderRadius: 999,
                      background: '#1c1c22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700, color: '#f5f5f7',
                    }}
                  >
                    {letter}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="font-headline"
                      style={{
                        fontSize: 15, fontWeight: 600, letterSpacing: -0.3,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                    >
                      {shortName}
                    </div>
                  </div>
                  <CVIcon name="chevR" size={16} color="#6b6b75" />
                </button>
              )
            })}
          </div>
          <div style={{ height: 24 }} />
        </div>
      </StepScreen>
    )
  }

  // ── Step 2: consent ────────────────────────────────────────────
  if (step === 'consent' && selectedLine && selectedBranch) {
    return (
      <StepScreen
        title="Antes de empezar"
        subtitle={null}
        onCancel={onCancel}
        onBack={() => setStep(selectedLine.branches.length === 1 ? 'line' : 'branch')}
        stepIdx={2}
        heroLine={selectedLine.number}
      >
        <div style={{ padding: '8px 20px 0' }}>
          <div style={{
            padding: '14px 16px', borderRadius: 14,
            background: '#141418', border: '0.5px solid #1f1f26',
            marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LineBadge number={selectedLine.number} size="lg" />
              <div style={{ flex: 1 }}>
                <div className="font-headline" style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, color: '#f5f5f7' }}>
                  {selectedBranch.name}
                </div>
                <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 1 }}>
                  Vas a compartir este viaje
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ConsentItem
              icon="locate"
              title="Ubicación en vivo"
              body="Mientras compartís, mostramos tu ubicación anónima en el mapa para otros pasajeros."
            />
            <ConsentItem
              icon="shield"
              title="Sin datos personales"
              body="Nadie ve tu nombre, email ni dispositivo. Solo el punto en el mapa."
            />
            <ConsentItem
              icon="flag"
              title="Terminás cuando querés"
              body="Podés finalizar el viaje en cualquier momento. Se frena automáticamente si bajás del bondi."
            />
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '16px 20px 20px' }}>
          <button
            onClick={handleStart}
            disabled={submitting}
            className="font-headline"
            style={{
              width: '100%', height: 56, borderRadius: 16,
              background: submitting ? '#2a2a32' : 'oklch(72% 0.15 145)',
              color: submitting ? '#a1a1aa' : '#001b0a',
              border: 0,
              cursor: submitting ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: 17, fontWeight: 700, letterSpacing: -0.3,
              boxShadow: submitting ? 'none' : '0 4px 14px oklch(72% 0.15 145 / 0.4)',
            }}
          >
            {!submitting && <span className="cv-dot-live" style={{ background: '#001b0a' }} />}
            {submitting ? 'Iniciando…' : 'Empezar a compartir'}
          </button>
          <p style={{
            marginTop: 12, fontSize: 12, color: '#6b6b75', textAlign: 'center',
            letterSpacing: -0.1, lineHeight: 1.4,
          }}>
            Podés cambiar estos permisos en Ajustes →<br />Privacidad en cualquier momento.
          </p>
        </div>
      </StepScreen>
    )
  }

  return null
}

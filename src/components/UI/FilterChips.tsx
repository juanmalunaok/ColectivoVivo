'use client'

type FilterMode = 'near' | 'fav' | 'all' | 'empty'

interface Props {
  mode: FilterMode
  onChange: (mode: FilterMode) => void
  liveCount: number
}

interface ChipProps {
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
  children: React.ReactNode
}

function Chip({ active, onClick, icon, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 12px', borderRadius: 999,
        background: active ? '#f5f5f7' : 'rgba(28,28,34,0.9)',
        color: active ? '#000' : '#f5f5f7',
        border: `0.5px solid ${active ? '#f5f5f7' : '#2a2a32'}`,
        fontFamily: 'var(--font-body), Inter, sans-serif',
        fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
        cursor: 'pointer',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {icon}
      {children}
    </button>
  )
}

export function FilterChips({ mode, onChange, liveCount }: Props) {
  return (
    <div
      className="cv-scroll"
      style={{
        position: 'absolute',
        top: 120,
        left: 0, right: 0,
        zIndex: 19,
        display: 'flex', gap: 6, padding: '6px 14px',
        overflowX: 'auto', whiteSpace: 'nowrap', alignItems: 'center',
        pointerEvents: 'auto',
      }}
    >
      <Chip
        active={mode === 'near'}
        onClick={() => onChange('near')}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <circle cx="12" cy="12" r="8"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          </svg>
        }
      >
        Cerca mío
      </Chip>
      <Chip active={mode === 'fav'} onClick={() => onChange('fav')}>Favoritos</Chip>
      <Chip active={mode === 'all'} onClick={() => onChange('all')}>Todos</Chip>
      <Chip active={mode === 'empty'} onClick={() => onChange('empty')}>Vacíos</Chip>

      {/* Live counter */}
      <div
        style={{
          marginLeft: 4, padding: '6px 10px', borderRadius: 999,
          background: 'rgba(20,20,24,0.9)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid #2a2a32',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          flexShrink: 0,
        }}
      >
        <span className="cv-dot-live" />
        <span
          className="cv-tabular"
          style={{ fontSize: 12, fontWeight: 600, color: '#f5f5f7', letterSpacing: -0.1 }}
        >
          {liveCount} en vivo
        </span>
      </div>
    </div>
  )
}

'use client'

interface Props {
  lineNumber: string
  branchName: string
  onAccept:  () => void
  onCancel:  () => void
}

export function ConsentModal({ lineNumber, branchName, onAccept, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-[420px] p-6 shadow-2xl"
        style={{
          background: '#0a0a0c',
          borderTop: '0.5px solid #2a2a32',
          borderRadius: '22px 22px 0 0',
          animation: 'cv-sheet-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-1.5 rounded-full" style={{ background: '#2a2a32' }} />
        </div>

        {/* Badge EN VIVO */}
        <div
          className="mx-auto mb-4"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'oklch(72% 0.15 145 / 0.14)',
            border: '0.5px solid oklch(72% 0.15 145 / 0.3)',
          }}
        >
          <span className="cv-dot-live" />
          <span className="cv-mono" style={{ fontSize: 11, color: 'oklch(85% 0.13 145)', fontWeight: 500, letterSpacing: 0.3 }}>
            COMPARTIR UBICACIÓN
          </span>
        </div>

        <h2
          className="font-headline"
          style={{
            fontSize: 26, fontWeight: 700, color: '#f5f5f7',
            textAlign: 'center', margin: '0 0 6px', letterSpacing: -0.04 * 26, lineHeight: 1.1,
          }}
        >
          Vas a compartir tu viaje
        </h2>
        <p
          style={{
            fontSize: 14, color: '#a1a1aa', textAlign: 'center',
            margin: '0 0 20px', letterSpacing: -0.1,
          }}
        >
          Línea{' '}
          <span className="font-headline" style={{ color: 'oklch(85% 0.13 145)', fontWeight: 700 }}>
            {lineNumber}
          </span>
          {' · '}
          {branchName}
        </p>

        {/* Info */}
        <div
          style={{
            background: '#141418',
            border: '0.5px solid #2a2a32',
            borderRadius: 14,
            padding: 16, marginBottom: 20,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}
        >
          {[
            'Tu ubicación es 100% anónima. Nadie ve tu nombre ni foto.',
            'El marcador desaparece automáticamente al terminar el viaje.',
            'Podés cancelar en cualquier momento tocando "Dejar de compartir".',
            'Los datos de ubicación no se almacenan tras finalizar el viaje.',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'oklch(72% 0.15 145 / 0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="oklch(78% 0.16 145)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 12, lineHeight: 1.5, color: '#a1a1aa' }}>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onAccept}
          className="font-headline"
          style={{
            width: '100%', height: 54, borderRadius: 14,
            background: 'oklch(72% 0.15 145)', color: '#001b0a',
            border: 0, cursor: 'pointer',
            fontSize: 16, fontWeight: 700, letterSpacing: -0.3,
            boxShadow: '0 4px 14px oklch(72% 0.15 145 / 0.4)',
            marginBottom: 8,
          }}
        >
          Activar viaje
        </button>
        <button
          onClick={onCancel}
          style={{
            width: '100%', height: 44, borderRadius: 14,
            background: 'transparent', border: 0, cursor: 'pointer',
            color: '#a1a1aa', fontSize: 14, fontWeight: 500,
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

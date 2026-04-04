'use client'

interface Props {
  lineNumber: string
  branchName: string
  onAccept:  () => void
  onCancel:  () => void
}

export function ConsentModal({ lineNumber, branchName, onAccept, onCancel }: Props) {
  const border = 'rgba(255,255,255,0.07)'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[420px] rounded-t-3xl p-6 shadow-2xl"
        style={{ background: '#0f0f1a', border: `1px solid ${border}`, borderBottom: 'none' }}>

        {/* Handle */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Icono */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
          <svg className="w-7 h-7" style={{ color: '#818cf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-white text-center mb-1">Compartir ubicación GPS</h2>
        <p className="text-sm text-center mb-5" style={{ color: '#64748b' }}>
          Vas a compartir tu posición en el{' '}
          <span className="font-semibold" style={{ color: '#818cf8' }}>colectivo {lineNumber}</span>
          {' '}— {branchName}
        </p>

        {/* Info */}
        <div className="rounded-2xl p-4 space-y-3 mb-5"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
          {[
            'Tu ubicación es 100% anónima. Nadie ve tu nombre ni foto.',
            'El marcador desaparece automáticamente al terminar el viaje.',
            'Podés cancelar en cualquier momento tocando "Terminar viaje".',
            'Los datos de ubicación no se almacenan tras finalizar el viaje.',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(99,102,241,0.3)' }}>
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onAccept}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white mb-2 transition"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}
        >
          Acepto — Activar viaje
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2.5 rounded-2xl text-sm transition"
          style={{ color: '#4b5563' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

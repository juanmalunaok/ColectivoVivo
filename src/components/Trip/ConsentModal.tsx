'use client'

interface Props {
  lineNumber: string
  branchName: string
  onAccept:  () => void
  onCancel:  () => void
}

export function ConsentModal({ lineNumber, branchName, onAccept, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-[420px] p-6 shadow-2xl"
        style={{ background: '#000000', borderTop: '1px solid #1a1919', borderRadius: '14px 14px 0 0' }}>

        {/* Handle */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 rounded-full" style={{ background: '#262626' }} />
        </div>

        {/* Icono */}
        <div className="flex items-center justify-center w-14 h-14 rounded-xl mx-auto mb-5"
          style={{ background: 'rgba(255,94,7,0.15)', border: '1px solid rgba(255,94,7,0.25)' }}>
          <svg className="w-7 h-7" style={{ color: '#ff5e07' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <h2 className="font-headline font-bold text-xl text-white text-center mb-1 uppercase tracking-tight">
          Compartir ubicación GPS
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: '#adaaaa' }}>
          Vas a compartir tu posición en el{' '}
          <span className="font-bold" style={{ color: '#ff9064' }}>colectivo {lineNumber}</span>
          {' '}— {branchName}
        </p>

        {/* Info */}
        <div className="rounded-xl p-4 space-y-3 mb-6"
          style={{ background: '#141414', border: '1px solid #262626' }}>
          {[
            'Tu ubicación es 100% anónima. Nadie ve tu nombre ni foto.',
            'El marcador desaparece automáticamente al terminar el viaje.',
            'Podés cancelar en cualquier momento tocando "Dejar de compartir".',
            'Los datos de ubicación no se almacenan tras finalizar el viaje.',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(255,94,7,0.25)' }}>
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="#ff5e07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: '#adaaaa' }}>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onAccept}
          className="w-full py-4 rounded-full font-headline font-bold text-black text-sm uppercase tracking-tight mb-2 transition active:scale-95"
          style={{ background: '#ff5e07', boxShadow: '0 4px 14px rgba(255,94,7,0.4)' }}
        >
          Acepto — Activar viaje
        </button>
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-full text-sm font-headline transition active:scale-95"
          style={{ color: '#adaaaa' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

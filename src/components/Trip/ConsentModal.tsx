'use client'

interface Props {
  lineNumber: string
  branchName: string
  onAccept:  () => void
  onCancel:  () => void
}

export function ConsentModal({ lineNumber, branchName, onAccept, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        {/* Icono */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-gray-900 text-center">
          Compartir ubicación GPS
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2">
          Vas a compartir tu posición mientras viajás en el{' '}
          <strong>colectivo {lineNumber}</strong>{' '}
          ({branchName}).
        </p>

        <div className="mt-4 bg-blue-50 rounded-xl p-3 space-y-2 text-xs text-blue-800">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">✓</span>
            <span>Tu ubicación es <strong>100% anónima</strong>. Nadie verá tu nombre ni foto.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">✓</span>
            <span>El marcador <strong>desaparece</strong> automáticamente cuando terminás el viaje.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">✓</span>
            <span>Podés <strong>cancelar en cualquier momento</strong> tocando "Terminar viaje".</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">✓</span>
            <span>Los datos de ubicación <strong>no se almacenan</strong> después de finalizado el viaje.</span>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <button
            onClick={onAccept}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
          >
            Acepto — Activar viaje
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

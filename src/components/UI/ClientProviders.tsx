'use client'

/**
 * Wrapper de providers que solo se monta en el cliente.
 * Al importarse con ssr:false desde el layout, Firebase NUNCA
 * se inicializa durante el render del servidor.
 */
import { useEffect } from 'react'
import { AuthProvider } from '@/context/AuthContext'

function ServiceWorkerUpdater() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    // Cuando el SW nuevo toma el control (después de skipWaiting),
    // recargamos la página para que sirva los assets actualizados.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }, [])
  return null
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServiceWorkerUpdater />
      {children}
    </AuthProvider>
  )
}

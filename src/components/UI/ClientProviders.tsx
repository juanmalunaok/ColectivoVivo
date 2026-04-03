'use client'

/**
 * Wrapper de providers que solo se monta en el cliente.
 * Al importarse con ssr:false desde el layout, Firebase NUNCA
 * se inicializa durante el render del servidor.
 */
import { AuthProvider } from '@/context/AuthContext'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

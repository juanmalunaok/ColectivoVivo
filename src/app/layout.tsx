import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const ClientProviders = dynamic(
  () => import('@/components/UI/ClientProviders'),
  { ssr: false },
)

export const metadata: Metadata = {
  title: 'ColectivoVivo',
  description: 'Colectivos de Buenos Aires en tiempo real — datos abiertos BA Data',
  manifest: '/manifest.json',
  icons: {
    icon:  '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable:       true,
    statusBarStyle: 'black-translucent',
    title:         'ColectivoVivo',
  },
}

export const viewport: Viewport = {
  width:                'device-width',
  initialScale:         1,
  maximumScale:         1,
  userScalable:         false,
  themeColor:           '#080810',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

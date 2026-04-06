import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Manrope } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-body' })

const ClientProviders = dynamic(
  () => import('@/components/UI/ClientProviders'),
  { ssr: false },
)

export const metadata: Metadata = {
  title: 'ColectivoVivo',
  description: 'Colectivos de Buenos Aires en tiempo real — datos abiertos BA Data',
  manifest: '/manifest.json',
  icons: {
    icon:  [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
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
  themeColor:           '#0e0e0e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body style={{ fontFamily: 'var(--font-body), sans-serif' }}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

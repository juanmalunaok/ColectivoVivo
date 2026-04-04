'use client'

export const dynamic = 'force-dynamic'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const router = useRouter()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms]       = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!terms) { setError('Debés aceptar los Términos y Condiciones.'); return }
    setError(null)
    setSubmitting(true)
    try {
      await signUpWithEmail(email, password, name)
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/email-already-in-use') setError('Ya existe una cuenta con ese email.')
      else if (code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres.')
      else setError('Error al crear la cuenta. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    if (!terms) { setError('Debés aceptar los Términos y Condiciones.'); return }
    try {
      await signInWithGoogle()
      router.push('/')
    } catch {
      setError('No se pudo registrar con Google.')
    }
  }

  const inputStyle = {
    background: '#16162a',
    border: '1px solid rgba(255,255,255,0.07)',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8" style={{ background: '#080810' }}>
      <div className="w-full max-w-[360px]">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M8 6h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="white" strokeWidth="1.5"/>
              <circle cx="9" cy="17" r="1.5" fill="white"/>
              <circle cx="15" cy="17" r="1.5" fill="white"/>
              <path d="M6 10h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Crear cuenta</h1>
          <p className="text-sm mt-1" style={{ color: '#4b5563' }}>Unite a la comunidad</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <form onSubmit={handleRegister} className="space-y-3.5">
            {[
              { label: 'Nombre', id: 'name', type: 'text', value: name, set: setName, placeholder: 'Tu nombre', auto: 'name' },
              { label: 'Email', id: 'email', type: 'email', value: email, set: setEmail, placeholder: 'tu@email.com', auto: 'email' },
              { label: 'Contraseña', id: 'password', type: 'password', value: password, set: setPassword, placeholder: 'Mínimo 6 caracteres', auto: 'new-password' },
            ].map(({ label, id, type, value, set, placeholder, auto }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  required
                  autoComplete={auto}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  minLength={type === 'password' ? 6 : undefined}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
              </div>
            ))}

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded flex items-center justify-center transition"
                  style={{
                    background: terms ? '#6366f1' : '#16162a',
                    border: terms ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {terms && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                Acepto los{' '}
                <Link href="/terms" style={{ color: '#818cf8' }}>Términos</Link>{' '}
                y la{' '}
                <Link href="/privacy" style={{ color: '#818cf8' }}>Política de Privacidad</Link>
                , incluyendo compartir ubicación GPS de forma <strong className="text-white/60">anónima</strong>.
              </span>
            </label>

            {error && (
              <div className="rounded-xl px-3.5 py-2.5 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color: '#374151' }}>o</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition"
            style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.07)', color: '#e2e8f0' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Registrarse con Google
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: '#4b5563' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#818cf8' }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

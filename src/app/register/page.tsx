'use client'

export const dynamic = 'force-dynamic'

import { useState, FormEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { CVIcon } from '@/components/UI/CVIcon'

function CVField({
  label, value, onChange, type = 'text', placeholder, trailing, autoComplete, minLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  trailing?: ReactNode
  autoComplete?: string
  minLength?: number
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      position: 'relative', background: '#0a0a0c',
      border: `0.5px solid ${focused ? 'oklch(72% 0.15 145)' : '#2a2a32'}`,
      borderRadius: 14, padding: '10px 14px',
      transition: 'border-color 0.15s',
    }}>
      <div style={{
        fontSize: 11,
        color: focused ? 'oklch(82% 0.12 145)' : '#6b6b75',
        fontWeight: 500, letterSpacing: 0.2, textTransform: 'uppercase',
        transition: 'color 0.15s',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 0, outline: 'none',
            color: '#f5f5f7', fontSize: 16,
            fontFamily: 'var(--font-body), Inter, sans-serif',
            padding: '4px 0 2px', letterSpacing: -0.2,
          }}
        />
        {trailing}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth() as {
    signUpWithEmail?: (email: string, password: string, name: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
  }
  const router = useRouter()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [terms, setTerms]         = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!terms) { setError('Tenés que aceptar los Términos y la Política de Privacidad.'); return }
    setSubmitting(true)
    try {
      if (signUpWithEmail) {
        await signUpWithEmail(email, password, name)
      }
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/email-already-in-use') setError('Este email ya está registrado.')
      else if (code === 'auth/invalid-email') setError('Email inválido.')
      else if (code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres.')
      else setError('Error al crear la cuenta. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '68px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/login"
          style={{
            width: 40, height: 40, borderRadius: 999,
            border: '0.5px solid #2a2a32',
            background: 'transparent', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none',
          }}
          aria-label="Volver"
        >
          <CVIcon name="chevL" size={20} />
        </Link>
      </div>

      {/* Title */}
      <div style={{ padding: '28px 20px 0' }}>
        <h1 className="font-headline" style={{
          fontSize: 32, fontWeight: 700, margin: 0,
          letterSpacing: -1.2, lineHeight: 1.05, color: '#fff',
        }}>
          Creá tu cuenta.
        </h1>
        <p style={{ marginTop: 8, fontSize: 15, color: '#a1a1aa', letterSpacing: -0.2 }}>
          Solo necesitás un email. Tu ubicación<br />nunca se asocia con tu nombre.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CVField label="Nombre" value={name} onChange={setName} placeholder="Cómo te llamás" autoComplete="name" />
        <CVField label="Email" value={email} onChange={setEmail} type="email" placeholder="tu@email.com" autoComplete="email" />
        <CVField label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" minLength={8} />

        {/* Terms box */}
        <button
          type="button"
          onClick={() => setTerms((v) => !v)}
          style={{
            marginTop: 10, padding: '12px 14px', borderRadius: 14,
            background: '#0a0a0c', border: '0.5px solid #2a2a32',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: 5, flexShrink: 0,
            background: terms ? 'oklch(72% 0.15 145)' : 'transparent',
            border: terms ? 'none' : '1.5px solid #2a2a32',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {terms && <CVIcon name="check" size={12} color="#001b0a" />}
          </div>
          <span style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.45 }}>
            Acepto los <b style={{ color: '#f5f5f7' }}>Términos</b> y la{' '}
            <b style={{ color: '#f5f5f7' }}>Política de Privacidad</b>. Entiendo que mi
            ubicación solo se comparte cuando inicio un viaje.
          </span>
        </button>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 12,
            background: 'oklch(35% 0.15 25 / 0.15)',
            color: 'oklch(72% 0.18 25)',
            border: '0.5px solid oklch(50% 0.18 25 / 0.25)',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="font-headline"
          style={{
            marginTop: 14, height: 54, borderRadius: 16, border: 0,
            background: submitting ? '#2a2a32' : '#fff',
            color: submitting ? '#a1a1aa' : '#000',
            fontSize: 17, fontWeight: 700, letterSpacing: -0.3,
            cursor: submitting ? 'wait' : 'pointer',
          }}
        >
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <div style={{ flex: 1, minHeight: 40 }} />

      <div style={{ padding: '0 20px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#a1a1aa', letterSpacing: -0.2 }}>
          ¿Ya tenés cuenta?{' '}
          <Link
            href="/login"
            style={{
              color: 'oklch(82% 0.12 145)', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  )
}

'use client'

export const dynamic = 'force-dynamic'

import { useState, FormEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { CVIcon } from '@/components/UI/CVIcon'

function CVField({
  label, value, onChange, type = 'text', placeholder, trailing, autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  trailing?: ReactNode
  autoComplete?: string
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

function CVSocial({ icon, label, onClick }: { icon: 'apple' | 'google'; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 48, borderRadius: 14, border: '0.5px solid #2a2a32',
        background: '#0a0a0c', color: '#fff',
        fontSize: 15, fontWeight: 600, letterSpacing: -0.2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer',
        fontFamily: 'var(--font-body), Inter, sans-serif',
      }}
    >
      <CVIcon name={icon} size={18} />
      {label}
    </button>
  )
}

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const router = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signInWithEmail(email, password)
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos.')
      } else {
        setError('Error al iniciar sesión. Intentá de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    try {
      await signInWithGoogle()
      router.push('/')
    } catch {
      setError('No se pudo iniciar sesión con Google.')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Header back button */}
      <div style={{ padding: '68px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/register"
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
          Bienvenido<br />de nuevo.
        </h1>
        <p style={{ marginTop: 8, fontSize: 15, color: '#a1a1aa', letterSpacing: -0.2 }}>
          Ingresá para empezar a compartir<br />o seguir colectivos.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CVField label="Email" value={email} onChange={setEmail} type="email" placeholder="tu@email.com" autoComplete="email" />
        <CVField
          label="Contraseña"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />

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
            marginTop: 8, height: 54, borderRadius: 16, border: 0,
            background: submitting ? '#2a2a32' : '#fff',
            color: submitting ? '#a1a1aa' : '#000',
            fontSize: 17, fontWeight: 700, letterSpacing: -0.3,
            cursor: submitting ? 'wait' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 4px' }}>
          <div style={{ flex: 1, height: 0.5, background: '#2a2a32' }} />
          <span style={{ fontSize: 12, color: '#6b6b75', letterSpacing: -0.1 }}>o continuar con</span>
          <div style={{ flex: 1, height: 0.5, background: '#2a2a32' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <CVSocial icon="apple" label="Apple" onClick={handleGoogle} />
          <CVSocial icon="google" label="Google" onClick={handleGoogle} />
        </div>
      </form>

      <div style={{ flex: 1, minHeight: 40 }} />

      <div style={{ padding: '0 20px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#a1a1aa', letterSpacing: -0.2 }}>
          ¿No tenés cuenta?{' '}
          <Link
            href="/register"
            style={{
              color: 'oklch(82% 0.12 145)', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}

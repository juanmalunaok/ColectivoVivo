'use client'

type IconName =
  | 'bus' | 'search' | 'plus' | 'close' | 'check' | 'chevR' | 'chevL' | 'chevD'
  | 'pin' | 'nav' | 'locate' | 'clock' | 'star' | 'user' | 'users' | 'users3'
  | 'speed' | 'shield' | 'flag' | 'settings' | 'back' | 'google' | 'apple'

interface Props {
  name:     IconName
  size?:    number
  color?:   string
  strokeWidth?: number
}

export function CVIcon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8 }: Props) {
  const s = { width: size, height: size, display: 'inline-block', flexShrink: 0 }
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (name) {
    case 'bus':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><rect x="4" y="5" width="16" height="13" rx="3"/><path d="M4 11h16"/><circle cx="8" cy="18" r="1.2" fill={color}/><circle cx="16" cy="18" r="1.2" fill={color}/><path d="M4 5l-1 -1M20 5l1 -1"/></g></svg>
    case 'search':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></g></svg>
    case 'plus':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 5v14M5 12h14"/></g></svg>
    case 'close':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M6 6l12 12M18 6l-12 12"/></g></svg>
    case 'check':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M5 12l4 4L19 6"/></g></svg>
    case 'chevR':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M9 6l6 6-6 6"/></g></svg>
    case 'chevL':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M15 6l-6 6 6 6"/></g></svg>
    case 'chevD':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M6 9l6 6 6-6"/></g></svg>
    case 'pin':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></g></svg>
    case 'nav':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 11l18-8-8 18-2-8-8-2z"/></g></svg>
    case 'locate':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></g></svg>
    case 'clock':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></svg>
    case 'star':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 3l2.7 5.5 6.1 0.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-0.9z"/></g></svg>
    case 'user':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></g></svg>
    case 'users':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/><circle cx="17" cy="7" r="3"/><path d="M22 19c0-2.8-2.2-5-5-5"/></g></svg>
    case 'users3':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="8" r="3"/><circle cx="5" cy="10" r="2.5"/><circle cx="19" cy="10" r="2.5"/><path d="M7 20c0-2.5 2-4.5 5-4.5s5 2 5 4.5M2 20c0-2 1.3-3.8 3-4M22 20c0-2-1.3-3.8-3-4"/></g></svg>
    case 'speed':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 14l4-4M4 14a8 8 0 0116 0"/></g></svg>
    case 'shield':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/></g></svg>
    case 'flag':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></g></svg>
    case 'settings':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></g></svg>
    case 'back':
      return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></g></svg>
    case 'google':
      return <svg viewBox="0 0 24 24" style={s}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    case 'apple':
      return <svg viewBox="0 0 24 24" style={s}><path fill={color === 'currentColor' ? '#fff' : color} d="M17.05 12.54c-.02-2.65 2.16-3.92 2.26-3.98-1.23-1.8-3.15-2.05-3.83-2.08-1.63-.16-3.18.96-4.01.96-.84 0-2.11-.94-3.47-.91-1.79.03-3.44 1.04-4.36 2.64-1.86 3.23-.48 8.01 1.33 10.64.89 1.29 1.94 2.73 3.33 2.68 1.34-.05 1.84-.86 3.46-.86s2.08.86 3.48.84c1.44-.02 2.35-1.31 3.22-2.6 1.02-1.49 1.44-2.94 1.46-3.01-.03-.01-2.8-1.08-2.82-4.32zM14.28 4.83c.74-.89 1.23-2.13 1.1-3.36-1.06.04-2.35.71-3.11 1.6-.68.78-1.28 2.04-1.12 3.25 1.18.09 2.39-.6 3.13-1.49z"/></svg>
  }
}

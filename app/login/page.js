'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return setMensaje('Rellena todos los campos')
    setLoading(true)
    setMensaje('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMensaje('Email o contraseña incorrectos')
    const { data } = await supabase.from('usuarios').select('is_admin').eq('id', (await supabase.auth.getUser()).data.user.id).single()
window.location.href = data?.is_admin ? '/admin' : '/perfil'
  }

  const inputStyle = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#fff',
    fontFamily: 'inherit',
    marginBottom: '12px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '20px 28px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: '#fff', textDecoration: 'none' }}>
          Todo<span style={{ color: '#16a34a' }}>Verdes</span>
        </a>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 28px' }}>
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '380px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', fontWeight: '600', marginBottom: '8px' }}>Bienvenido</p>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '28px' }}>Iniciar sesión</h1>

          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inputStyle, marginBottom: '20px' }}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', background: '#fff', color: '#080808', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px' }}
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>

          <p style={{ fontSize: '13px', color: '#555', textAlign: 'center' }}>
            ¿No tienes cuenta?{' '}
            <a href="/registro" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '600' }}>Regístrate</a>
          </p>

          {mensaje && (
            <p style={{ fontSize: '13px', marginTop: '16px', textAlign: 'center', color: '#ef4444' }}>{mensaje}</p>
          )}
        </div>
      </main>
    </div>
  )
}

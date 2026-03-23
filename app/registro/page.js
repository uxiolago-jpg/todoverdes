'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

function generarCodigo(email) {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)
  const num = Math.floor(Math.random() * 900) + 100
  return base + num
}

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [modo, setModo] = useState('registro')

  const handleRegistro = async () => {
    if (!email || !password) return setMensaje('Rellena todos los campos')
    if (password.length < 6) return setMensaje('La contraseña debe tener al menos 6 caracteres')
    setLoading(true)
    setMensaje('')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setLoading(false)
      return setMensaje('Error: ' + error.message)
    }

    const codigo = generarCodigo(email)
    await supabase.from('usuarios').insert({
      id: data.user.id,
      email: email,
      codigo_referido: codigo,
      saldo_acumulado: 0,
    })

    setLoading(false)
    setMensaje('Cuenta creada. Tu código de referido es: ' + codigo)
  }

  const handleLogin = async () => {
    if (!email || !password) return setMensaje('Rellena todos los campos')
    setLoading(true)
    setMensaje('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) return setMensaje('Email o contraseña incorrectos')
    window.location.href = '/perfil'
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

          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', fontWeight: '600', marginBottom: '8px' }}>
            {modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '28px' }}>
            {modo === 'registro' ? 'Únete a TodoVerdes' : 'Bienvenido de nuevo'}
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (modo === 'registro' ? handleRegistro() : handleLogin())}
            style={{ ...inputStyle, marginBottom: '20px' }}
          />

          <button
            onClick={modo === 'registro' ? handleRegistro : handleLogin}
            disabled={loading}
            style={{ width: '100%', background: '#fff', color: '#080808', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px' }}
          >
            {loading ? 'Cargando...' : modo === 'registro' ? 'Crear cuenta' : 'Entrar'}
          </button>

          <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => { setModo(modo === 'registro' ? 'login' : 'registro'); setMensaje('') }}>
            {modo === 'registro' ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </p>

          {mensaje && (
            <p style={{ fontSize: '13px', marginTop: '16px', textAlign: 'center', color: mensaje.includes('Error') || mensaje.includes('incorrectos') ? '#ef4444' : '#16a34a', lineHeight: '1.5' }}>
              {mensaje}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
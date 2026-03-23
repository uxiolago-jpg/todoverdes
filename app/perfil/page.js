'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Perfil() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/registro'
        return
      }
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single()
      setUsuario(data)
      setLoading(false)
    }
    cargarPerfil()
  }, [])

  const copiarCodigo = () => {
    navigator.clipboard.writeText(usuario.codigo_referido)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#555', fontSize: '14px' }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '20px 28px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: '#fff', textDecoration: 'none' }}>
          Todo<span style={{ color: '#16a34a' }}>Verdes</span>
        </a>
        <button
          onClick={cerrarSesion}
          style={{ background: 'transparent', border: '1px solid #222', color: '#555', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Cerrar sesión
        </button>
      </nav>

      <main style={{ flex: 1, padding: '48px 28px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', fontWeight: '600', marginBottom: '8px' }}>Tu perfil</p>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '32px' }}>Hola, {usuario?.email?.split('@')[0]}</h1>

        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '28px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tu código de referido</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', letterSpacing: '3px', flex: 1 }}>
              {usuario?.codigo_referido}
            </p>
            <button
              onClick={copiarCodigo}
              style={{ background: copiado ? '#14532d' : '#1a1a1a', border: '1px solid #222', color: copiado ? '#16a34a' : '#888', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            >
              {copiado ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#444', marginTop: '12px', lineHeight: '1.6' }}>
            Comparte este código con tus amigos. Cada vez que lo usen al comprar un pronóstico, tú ganas 0,50€.
          </p>
        </div>

        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '28px' }}>
          <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Saldo acumulado</p>
          <p style={{ fontSize: '40px', fontWeight: '700', color: '#fff' }}>
            {Number(usuario?.saldo_acumulado || 0).toFixed(2)}€
          </p>
          <p style={{ fontSize: '12px', color: '#444', marginTop: '8px', lineHeight: '1.6' }}>
            Se transfiere a tu PayPal a final de cada mes si superas 1€.
          </p>
        </div>
      </main>
    </div>
  )
}

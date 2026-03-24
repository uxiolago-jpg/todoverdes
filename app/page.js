'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [hovered, setHovered] = useState(false)
  const [pronostico, setPronostico] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [codigoValido, setCodigoValido] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0]
    supabase
      .from('pronosticos')
      .select('*')
      .eq('fecha', hoy)
      .single()
      .then(({ data }) => setPronostico(data))

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('usuarios').select('*').eq('id', user.id).single()
          .then(({ data }) => setUsuario(data))
      }
    })
  }, [])

  const validarCodigo = async () => {
    if (!codigo.trim()) return
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('codigo_referido', codigo.toUpperCase().trim())
      .single()
    setCodigoValido(data ? true : false)
  }

  const precio = codigoValido ? '4,50€' : '5€'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <nav style={{ padding: '20px 28px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: '#fff' }}>
          Todo<span style={{ color: '#16a34a' }}>Verdes</span>
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          {usuario ? (
            <a href="/perfil" style={{ background: '#14532d', border: '1px solid #16a34a44', color: '#16a34a', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              Mi perfil
            </a>
          ) : (
            <>
              <a href="/login" style={{ background: 'transparent', border: '1px solid #222', color: '#888', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}>
                Iniciar sesión
              </a>
              <a href="/registro" style={{ background: '#fff', border: 'none', color: '#080808', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                Registrarse
              </a>
            </>
          )}
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 28px' }}>

        <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', fontWeight: '600', marginBottom: '20px' }}>
          Pronósticos con IA
        </p>

        <h1 style={{ fontSize: '46px', fontWeight: '700', color: '#fff', lineHeight: '1.1', letterSpacing: '-1px', marginBottom: '12px' }}>
          Solo datos.<br />Estadística pura.
        </h1>

        <p style={{ fontSize: '14px', color: '#444', marginBottom: '40px' }}>
          Sin magia. Sin humo. Solo números.
        </p>

        {pronostico ? (
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px 28px', marginBottom: '32px', maxWidth: '400px', width: '100%' }}>
            <p style={{ fontSize: '11px', color: '#16a34a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Pronóstico disponible hoy</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Desbloquea para ver los picks de hoy</p>
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px 28px', marginBottom: '32px', maxWidth: '400px', width: '100%' }}>
            <p style={{ fontSize: '14px', color: '#555' }}>Pronóstico disponible cada día a las 10h</p>
          </div>
        )}

        <div style={{ maxWidth: '400px', width: '100%', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="¿Tienes código de amigo?"
              value={codigo}
              onChange={e => { setCodigo(e.target.value); setCodigoValido(null) }}
              style={{ flex: 1, background: '#0d0d0d', border: `1px solid ${codigoValido === true ? '#16a34a' : codigoValido === false ? '#ef4444' : '#222'}`, borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={validarCodigo}
              style={{ background: '#1a1a1a', border: '1px solid #222', color: '#888', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              Aplicar
            </button>
          </div>
          {codigoValido === true && <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px' }}>Código aplicado — 0,50€ de descuento</p>}
          {codigoValido === false && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px' }}>Código no válido</p>}
        </div>
<a href="https://uxiolago.gumroad.com/l/wmuzl" style={{ textDecoration: 'none' }}></a>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: '#ffffff',
            color: '#080808',
            border: 'none',
            borderRadius: '14px',
            padding: '22px 56px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'inherit',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            opacity: hovered ? '0.9' : '1',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
        >
          Conseguir pronóstico
          <span style={{ background: '#1a1a1a', color: '#16a34a', fontSize: '15px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' }}>
            {precio}
          </span>
        </button>

        <p style={{ fontSize: '11px', color: '#2a2a2a', marginTop: '48px' }}>
          Apuesta con responsabilidad. Nada está garantizado.
        </p>

      </main>
    </div>
  )
}
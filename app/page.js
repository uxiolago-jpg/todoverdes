'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [hovered, setHovered] = useState(false)
  const [pronostico, setPronostico] = useState(null)

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0]
    supabase
      .from('pronosticos')
      .select('*')
      .eq('fecha', hoy)
      .single()
      .then(({ data }) => setPronostico(data))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <nav style={{ padding: '20px 28px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: '#fff' }}>
          Todo<span style={{ color: '#16a34a' }}>Verdes</span>
        </span>
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
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px 28px', marginBottom: '40px', maxWidth: '400px', width: '100%' }}>
            <p style={{ fontSize: '11px', color: '#16a34a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{pronostico.liga}</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{pronostico.partido}</p>
            <p style={{ fontSize: '13px', color: '#555' }}>Hoy · {pronostico.hora}</p>
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px 28px', marginBottom: '40px', maxWidth: '400px', width: '100%' }}>
            <p style={{ fontSize: '14px', color: '#555' }}>Pronóstico disponible cada día a las 10h</p>
          </div>
        )}

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
            5€
          </span>
        </button>

        <p style={{ fontSize: '11px', color: '#2a2a2a', marginTop: '48px' }}>
          Apuesta con responsabilidad. Nada está garantizado.
        </p>

      </main>
    </div>
  )
}
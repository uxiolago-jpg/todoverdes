'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = 'Muntaner439'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    pronostico_seguro: '',
    pronostico_sonador: '',
  })

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '40px', width: '320px' }}>
          <p style={{ color: '#16a34a', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Admin · TodoVerdes</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setLoggedIn(true)}
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', fontFamily: 'inherit', marginBottom: '12px', outline: 'none' }}
          />
          <button
            onClick={() => password === ADMIN_PASSWORD ? setLoggedIn(true) : setMensaje('Contraseña incorrecta')}
            style={{ width: '100%', background: '#fff', color: '#080808', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Entrar
          </button>
          {mensaje && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>{mensaje}</p>}
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setMensaje('')
    const { error } = await supabase
      .from('pronosticos')
      .upsert(form, { onConflict: 'fecha' })
    setLoading(false)
    if (error) {
      setMensaje('Error al guardar: ' + error.message)
    } else {
      setMensaje('Pronóstico guardado correctamente')
    }
  }

  const textareaStyle = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '14px',
    color: '#fff',
    fontFamily: 'inherit',
    marginBottom: '24px',
    outline: 'none',
    resize: 'vertical',
    lineHeight: '1.6',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', padding: '40px 28px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ color: '#16a34a', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Admin · TodoVerdes</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>Pronóstico del día</h1>

        <label style={{ color: '#555', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Fecha</label>
        <input
          type="date"
          value={form.fecha}
          onChange={e => setForm({ ...form, fecha: e.target.value })}
          style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', fontFamily: 'inherit', marginBottom: '24px', outline: 'none' }}
        />

        <div style={{ height: '1px', background: '#1a1a1a', marginBottom: '24px' }} />

        <label style={{ color: '#16a34a', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
          Pronóstico seguro
        </label>
        <p style={{ color: '#444', fontSize: '12px', marginBottom: '10px' }}>El más probable. Cuotas bajas, más fiable.</p>
        <textarea
          rows={6}
          placeholder="ej. Real Madrid vs Barcelona — Más de 1.5 goles @ 1.45&#10;Atlético vs Sevilla — X2 @ 1.30"
          value={form.pronostico_seguro}
          onChange={e => setForm({ ...form, pronostico_seguro: e.target.value })}
          style={textareaStyle}
        />

        <label style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
          Pronóstico soñador
        </label>
        <p style={{ color: '#444', fontSize: '12px', marginBottom: '10px' }}>Combinada con más riesgo y más premio.</p>
        <textarea
          rows={6}
          placeholder="ej. Real Madrid gana 3-0 @ 8.00&#10;+ Mbappé marca @ 2.50&#10;Combinada total @ 20.00"
          value={form.pronostico_sonador}
          onChange={e => setForm({ ...form, pronostico_sonador: e.target.value })}
          style={textareaStyle}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', background: '#fff', color: '#080808', border: 'none', borderRadius: '10px', padding: '16px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {loading ? 'Guardando...' : 'Guardar pronóstico'}
        </button>

        {mensaje && (
          <p style={{ fontSize: '13px', marginTop: '16px', textAlign: 'center', color: mensaje.includes('Error') ? '#ef4444' : '#16a34a' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
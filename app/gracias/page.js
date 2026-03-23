'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Gracias() {
  const [pronostico, setPronostico] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0]
    supabase
      .from('pronosticos')
      .select('*')
      .eq('fecha', hoy)
      .single()
      .then(({ data }) => {
        setPronostico(data)
        setLoading(false)
      })
  }, [])

  const descargarPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFillColor(8, 8, 8)
    doc.rect(0, 0, pageWidth, 297, 'F')

    doc.setTextColor(22, 163, 74)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TODOVERDES · PRONÓSTICOS CON IA', pageWidth / 2, 20, { align: 'center' })

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('Pronóstico del día', pageWidth / 2, 36, { align: 'center' })

    const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    doc.setTextColor(85, 85, 85)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(fecha, pageWidth / 2, 46, { align: 'center' })

    doc.setDrawColor(26, 26, 26)
    doc.line(20, 54, pageWidth - 20, 54)

    doc.setFillColor(13, 13, 13)
    doc.roundedRect(20, 62, pageWidth - 40, 10, 2, 2, 'F')
    doc.setTextColor(22, 163, 74)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('PRONÓSTICO SEGURO', 28, 69)

    doc.setTextColor(200, 200, 200)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const seguroLines = doc.splitTextToSize(pronostico.pronostico_seguro, pageWidth - 56)
    doc.text(seguroLines, 28, 82)

    const seguroHeight = seguroLines.length * 7
    const sonadorY = 82 + seguroHeight + 16

    doc.setFillColor(13, 13, 13)
    doc.roundedRect(20, sonadorY, pageWidth - 40, 10, 2, 2, 'F')
    doc.setTextColor(245, 158, 11)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('PRONÓSTICO SOÑADOR', 28, sonadorY + 7)

    doc.setTextColor(200, 200, 200)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const sonadorLines = doc.splitTextToSize(pronostico.pronostico_sonador, pageWidth - 56)
    doc.text(sonadorLines, 28, sonadorY + 20)

    doc.setDrawColor(26, 26, 26)
    doc.line(20, 260, pageWidth - 20, 260)

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('Esto es puro análisis estadístico. Nada está garantizado. Apuesta siempre con responsabilidad.', pageWidth / 2, 270, { align: 'center' })
    doc.text('© TodoVerdes · todoverdes.vercel.app', pageWidth / 2, 278, { align: 'center' })

    doc.setTextColor(20, 20, 20)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('TODOVERDES', pageWidth / 2, 290, { align: 'center' })

    doc.save(`todoverdes-${new Date().toISOString().split('T')[0]}.pdf`)
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

      <nav style={{ padding: '20px 28px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: '#fff' }}>
          Todo<span style={{ color: '#16a34a' }}>Verdes</span>
        </span>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 28px', textAlign: 'center' }}>

        <div style={{ width: '48px', height: '48px', background: '#14532d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', fontWeight: '600', marginBottom: '12px' }}>Pago confirmado</p>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: '1.1' }}>Tu pronóstico está listo</h1>
        <p style={{ fontSize: '14px', color: '#444', marginBottom: '48px', maxWidth: '360px' }}>Descarga el PDF con los dos pronósticos de hoy — el seguro y el soñador.</p>

        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '24px 28px', maxWidth: '440px', width: '100%', marginBottom: '32px', textAlign: 'left' }}>
          <p style={{ fontSize: '11px', color: '#16a34a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Pronóstico seguro</p>
          <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{pronostico?.pronostico_seguro}</p>

          <div style={{ height: '1px', background: '#1a1a1a', margin: '20px 0' }} />

          <p style={{ fontSize: '11px', color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Pronóstico soñador</p>
          <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{pronostico?.pronostico_sonador}</p>
        </div>

        <button
          onClick={descargarPDF}
          style={{ background: '#ffffff', color: '#080808', border: 'none', borderRadius: '14px', padding: '20px 48px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
        >
          Descargar PDF
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        <p style={{ fontSize: '11px', color: '#2a2a2a', marginTop: '32px' }}>Apuesta con responsabilidad. Nada está garantizado.</p>

      </main>
    </div>
  )
}
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'TodoVerdes',
  description: 'Pronósticos con IA. Solo datos y estadística.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  )
}
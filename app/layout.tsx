import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Vakansiya.az - Azərbaycanda iş tap',
  description: 'Azərbaycanda №1 iş axtarış platforması. Minglərlə aktiv vakansiya arasından sizə uyğun işi tapın.',
  keywords: 'vakansiya, iş, Azerbaijan, Bakı, iş elanları, iş axtarış',
  authors: [{ name: 'Vakansiya.az' }],
  openGraph: {
    title: 'Vakansiya.az - Azərbaycanda iş tap',
    description: 'Minglərlə aktiv vakansiya arasından sizə uyğun işi tapın',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

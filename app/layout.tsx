import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

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
      <body className={poppins.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#000',
              border: '1px solid #e5e7eb',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

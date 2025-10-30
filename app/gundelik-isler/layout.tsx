import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gündəlik İşlər - Qısa müddətli iş elanları | Vakansiya.az',
  description: 'Azərbaycanda gündəlik işlər və qısa müddətli iş imkanları. Kuryer, təmizlik, tikinti, bağban və digər işlər.',
  keywords: 'gündəlik işlər, qısa müddətli iş, kuryer, təmizlik, tikinti, Bakı gündəlik işlər',
  openGraph: {
    title: 'Gündəlik İşlər - Qısa müddətli işlər',
    description: 'Gündəlik qazanc və qısa müddətli iş imkanları',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function GundelikIslerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

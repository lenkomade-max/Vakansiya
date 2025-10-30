import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Əlaqə - Bizimlə əlaqə saxlayın | Vakansiya.az',
  description: 'Vakansiya.az ilə əlaqə. Suallarınız və təklifləriniz üçün bizimlə əlaqə saxlayın.',
  keywords: 'əlaqə, Vakansiya.az əlaqə, dəstək, məlumat, telefon',
  openGraph: {
    title: 'Əlaqə - Vakansiya.az',
    description: 'Bizimlə əlaqə saxlayın',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

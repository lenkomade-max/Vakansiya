import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Şirkətlər - Azərbaycanda fəaliyyət göstərən şirkətlər | Vakansiya.az',
  description: 'Azərbaycanda fəaliyyət göstərən şirkətlər və onların aktiv vakansiyaları. İT, maliyyə, marketinq şirkətləri.',
  keywords: 'şirkətlər, Bakı şirkətləri, işəgötürənlər, IT şirkətləri, vakansiya verən şirkətlər',
  openGraph: {
    title: 'Şirkətlər - İşəgötürənlər',
    description: 'Azərbaycanda fəaliyyət göstərən şirkətlər və vakansiyalar',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

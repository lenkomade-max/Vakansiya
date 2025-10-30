import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haqqımızda - Vakansiya.az platforması',
  description: 'Vakansiya.az - Azərbaycanda №1 iş axtarış platforması. Missiyamız və xidmətlərimiz haqqında məlumat.',
  keywords: 'haqqımızda, Vakansiya.az, iş platforması, Azərbaycan iş saytı',
  openGraph: {
    title: 'Haqqımızda - Vakansiya.az',
    description: 'Azərbaycanda №1 iş axtarış platforması',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

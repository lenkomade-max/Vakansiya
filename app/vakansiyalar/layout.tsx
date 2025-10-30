import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vakansiyalar - Azərbaycanda iş elanları | Vakansiya.az',
  description: 'Azərbaycanda minlərlə aktiv iş elanı. İT, marketinq, dizayn, satış, maliyyə və digər sahələrdə iş tap.',
  keywords: 'vakansiya, iş elanı, Bakı işlər, IT vakansiyalar, marketinq işləri',
  openGraph: {
    title: 'Vakansiyalar - Azərbaycanda iş tap',
    description: 'Minlərlə aktiv vakansiya arasından sizə uyğun işi tapın',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function VakansiyalarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

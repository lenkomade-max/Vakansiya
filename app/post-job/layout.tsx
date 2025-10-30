import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Elan yerləşdir - Vakansiya və Gündəlik İş | Vakansiya.az',
  description: 'Pulsuz vakansiya və gündəlik iş elanı yerləşdirin. Tez bir zamanda işçi tapın.',
  keywords: 'elan yerləşdir, vakansiya yerləşdir, iş elanı, işəgötürənlər, pulsuz elan',
  openGraph: {
    title: 'Elan yerləşdir - Vakansiya.az',
    description: 'Pulsuz vakansiya və iş elanı yerləşdirin',
    type: 'website',
    locale: 'az_AZ',
  },
}

export default function PostJobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

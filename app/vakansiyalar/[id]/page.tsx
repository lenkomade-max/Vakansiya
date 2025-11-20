import { getJob } from '@/lib/api/jobs'
import { redirect } from 'next/navigation'
import VakansiyaDetailClient from '@/components/VakansiyaDetail/VakansiyaDetailClient'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function VakansiyaDetailPage({ params }: Props) {
  const { id: jobId } = await params

  // Загружаем данные на сервере
  const vakansiya = await getJob(jobId)

  // Redirect if job not found
  if (!vakansiya) {
    redirect('/vakansiyalar')
  }

  // Передаем данные в клиентский компонент
  return <VakansiyaDetailClient initialVakansiya={vakansiya} jobId={jobId} />
}

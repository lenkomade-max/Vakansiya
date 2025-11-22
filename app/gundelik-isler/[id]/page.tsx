import { getJob } from '@/lib/api/jobs'
import { redirect } from 'next/navigation'
import GundelikDetailClient from '@/components/short-jobs/GundelikDetailClient'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function GundelikDetailPage({ params }: Props) {
  const { id: jobId } = await params

  // Загружаем данные на сервере (SSR)
  const job = await getJob(jobId)

  // Redirect if job not found
  if (!job) {
    redirect('/gundelik-isler')
  }

  // Передаем данные в клиентский компонент
  return <GundelikDetailClient initialJob={job} jobId={jobId} />
}

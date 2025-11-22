import { getActiveJobsPaginated } from '@/lib/api/jobs'
import GundelikIslerClient from '@/components/short-jobs/GundelikIslerClient'

export default async function GundelikIslerPage() {
  // Загружаем initial данные на сервере (SSR)
  const result = await getActiveJobsPaginated({
    jobType: 'gundelik',
    page: 1,
    limit: 20
  })

  // Передаем данные в клиентский компонент  
  return (
    <GundelikIslerClient
      initialJobs={result.jobs}
      initialHasMore={result.hasMore}
    />
  )
}

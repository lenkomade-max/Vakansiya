import { getActiveJobsPaginated } from '@/lib/api/jobs'
import VakansiyalarClient from '@/components/job/VakansiyalarClient'

export default async function VakansiyalarPage() {
  // Загружаем initial данные на сервере (SSR)
  const result = await getActiveJobsPaginated({
    jobType: 'vakansiya',
    page: 1,
    limit: 20
  })

  // Передаем данные в клиентский компонент
  return (
    <VakansiyalarClient
      initialJobs={result.jobs}
      initialHasMore={result.hasMore}
    />
  )
}

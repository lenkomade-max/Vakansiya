import { getActiveJobsPaginated } from '@/lib/api/jobs'
import { getCities, getParentCategories } from '@/lib/api/categories'
import HomePageClient from '@/components/HomePage/HomePageClient'

export default async function HomePage() {
  // Загружаем initial data на сервере (SSR оптимизация)
  const [
    citiesData,
    vakansiyaCats,
    gundelikCats,
    vakansiyalarResult,
    gundelikResult
  ] = await Promise.all([
    getCities(),
    getParentCategories('vacancy'),
    getParentCategories('short_job'),
    getActiveJobsPaginated({
      jobType: 'vakansiya',
      page: 1,
      limit: 16  // 4 ряда по 4 (десктоп) или 8 рядов по 2 (мобильный)
    }),
    getActiveJobsPaginated({
      jobType: 'gundelik',
      page: 1,
      limit: 8  // 4 ряда по 2 (мобильный) или 2 ряда по 4 (десктоп)
    })
  ])

  // Передаем данные в клиентский компонент
  return (
    <HomePageClient
      initialJobs={vakansiyalarResult.jobs}
      initialShortJobs={gundelikResult.jobs}
      initialCities={citiesData}
      initialVakansiyaCategories={vakansiyaCats}
      initialGundelikCategories={gundelikCats}
    />
  )
}

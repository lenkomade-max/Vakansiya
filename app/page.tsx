import { getActiveJobsPaginated } from '@/lib/api/jobs'
import { getCities, getParentCategories } from '@/lib/api/categories'
import HomePageClient from '@/components/HomePage/HomePageClient'

export default async function HomePage() {
  // Загружаем initial data на сервере
  const [
    citiesData,
    vakansiyaCats,
    gundelikCats,
    vakansiyalarResult
  ] = await Promise.all([
    getCities(),
    getParentCategories('vacancy'),
    getParentCategories('short_job'),
    getActiveJobsPaginated({
      jobType: 'vakansiya',
      page: 1,
      limit: 15
    })
  ])

  // Передаем данные в клиентский компонент
  return (
    <HomePageClient
      initialJobs={vakansiyalarResult.jobs}
      initialCities={citiesData}
      initialVakansiyaCategories={vakansiyaCats}
      initialGundelikCategories={gundelikCats}
    />
  )
}

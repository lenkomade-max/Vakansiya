'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import SearchBar from '@/components/ui/SearchBar'
import CategoryDashboard from '@/components/ui/CategoryDashboard'
import JobCard from '@/components/job/JobCard'
import { ShortJobCard } from '@/components/short-jobs/ShortJobCard'
import { BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline'
import { signInWithGoogle, getCurrentUser } from '@/lib/auth'
import { getActiveJobsPaginated, Job as DBJob } from '@/lib/api/jobs'
import { Category } from '@/lib/api/categories'
import { SearchFilters } from '@/components/ui/SearchBar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import HeroSlogan from '@/components/tapla/HeroSlogan'
import AnimatedJobFeed from '@/components/tapla/AnimatedJobFeed'
import Marquee from '@/components/tapla/Marquee'
import CareerSection from '@/components/tapla/CareerSection'
import FooterCTA from '@/components/tapla/FooterCTA'

type HomePageClientProps = {
    initialJobs: DBJob[]
    initialCities: string[]
    initialVakansiyaCategories: Category[]
    initialGundelikCategories: Category[]
}

export default function HomePageClient({
    initialJobs,
    initialCities,
    initialVakansiyaCategories,
    initialGundelikCategories
}: HomePageClientProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'vakansiyalar' | 'gundelik'>('vakansiyalar')
    const [jobs, setJobs] = useState<DBJob[]>(initialJobs)
    const [shortJobs, setShortJobs] = useState<DBJob[]>([])
    const [allJobs, setAllJobs] = useState<DBJob[]>(initialJobs) // Все вакансии (для фильтрации)
    const [allShortJobs, setAllShortJobs] = useState<DBJob[]>([]) // Все gundəlik (для фильтрации)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [cities] = useState<string[]>(initialCities)
    const [vakansiyaCategories] = useState<Category[]>(initialVakansiyaCategories)
    const [gundelikCategories] = useState<Category[]>(initialGundelikCategories)
    const [vakansiyalarPage, setVakansiyalarPage] = useState(1)
    const [gundelikPage, setGundelikPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [gundelikLoaded, setGundelikLoaded] = useState(false) // Флаг для lazy loading
    const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null) // Активные фильтры для серверной фильтрации
    const observerTarget = useRef(null)

    // Lazy loading для Gündəlik işlər - грузим только при клике на вкладку
    const loadGundelikData = async () => {
        if (gundelikLoaded) return // Уже загружены

        setLoading(true)

        const gundelikResult = await getActiveJobsPaginated({
            jobType: 'gundelik',
            page: 1,
            limit: 8  // 4 ряда по 2 (мобильный) или 2 ряда по 4 (десктоп)
        })

        setShortJobs(gundelikResult.jobs)
        setAllShortJobs(gundelikResult.jobs)
        setGundelikLoaded(true)

        setLoading(false)
    }

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser()
            setIsAuthenticated(!!user)
        }
        checkAuth()
    }, [])

    // Infinite scroll с Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    loadMore()
                }
            },
            { threshold: 0.1 }  // Грузим заранее когда пользователь на 90% доскроллил
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [loading, hasMore, activeTab])

    const loadMore = async () => {
        if (loading || !hasMore) return

        setLoading(true)

        if (activeTab === 'vakansiyalar') {
            const nextPage = vakansiyalarPage + 1
            const result = await getActiveJobsPaginated({
                jobType: 'vakansiya',
                page: nextPage,
                limit: 8,
                // Применяем активные фильтры (если есть)
                location: activeFilters?.location || undefined,
                employmentType: activeFilters?.employmentType || undefined,
                experience: activeFilters?.experience || undefined,
                searchQuery: activeFilters?.query || undefined,
            })

            let newJobs = result.jobs

            // Применяем клиентский фильтр по зарплате (если есть)
            if (activeFilters?.salaryMin || activeFilters?.salaryMax) {
                newJobs = newJobs.filter(job => {
                    if (!job.salary) return false
                    const salaryNumbers = job.salary.match(/\d+/g)
                    if (!salaryNumbers || salaryNumbers.length === 0) return false
                    const jobSalary = parseInt(salaryNumbers[0])
                    if (activeFilters.salaryMin && jobSalary < activeFilters.salaryMin) return false
                    if (activeFilters.salaryMax && jobSalary > activeFilters.salaryMax) return false
                    return true
                })
            }

            setJobs((prev) => [...prev, ...newJobs])
            setVakansiyalarPage(nextPage)
            setHasMore(result.hasMore)
        } else {
            const nextPage = gundelikPage + 1
            const result = await getActiveJobsPaginated({
                jobType: 'gundelik',
                page: nextPage,
                limit: 8,
                // Применяем активные фильтры (если есть)
                location: activeFilters?.location || undefined,
                employmentType: activeFilters?.employmentType || undefined,
                experience: activeFilters?.experience || undefined,
                searchQuery: activeFilters?.query || undefined,
            })

            let newJobs = result.jobs

            // Применяем клиентский фильтр по зарплате (если есть)
            if (activeFilters?.salaryMin || activeFilters?.salaryMax) {
                newJobs = newJobs.filter(job => {
                    if (!job.salary) return false
                    const salaryNumbers = job.salary.match(/\d+/g)
                    if (!salaryNumbers || salaryNumbers.length === 0) return false
                    const jobSalary = parseInt(salaryNumbers[0])
                    if (activeFilters.salaryMin && jobSalary < activeFilters.salaryMin) return false
                    if (activeFilters.salaryMax && jobSalary > activeFilters.salaryMax) return false
                    return true
                })
            }

            setShortJobs((prev) => [...prev, ...newJobs])
            setGundelikPage(nextPage)
            setHasMore(result.hasMore)
        }

        setLoading(false)
    }

    const handleSearch = async (filters: SearchFilters) => {
        // ОПТИМИЗАЦИЯ: Серверная фильтрация вместо клиентской
        setLoading(true)
        setActiveFilters(filters) // Сохраняем фильтры для infinite scroll

        // Если фильтры пустые - загружаем все
        const hasFilters = filters.query || filters.location || filters.employmentType || filters.experience

        if (!hasFilters && !filters.salaryMin && !filters.salaryMax) {
            // Нет фильтров - показываем все из начальной загрузки
            if (activeTab === 'vakansiyalar') {
                setJobs(allJobs)
            } else {
                setShortJobs(allShortJobs)
            }
            setLoading(false)
            return
        }

        // Серверные фильтры (все кроме зарплаты)
        const result = await getActiveJobsPaginated({
            jobType: activeTab === 'vakansiyalar' ? 'vakansiya' : 'gundelik',
            location: filters.location || undefined,
            employmentType: filters.employmentType || undefined,
            experience: filters.experience || undefined,
            searchQuery: filters.query || undefined,
            page: 1,
            limit: 15
        })

        let filteredJobs = result.jobs

        // Фильтр по зарплате (КЛИЕНТСКИЙ - т.к. salary это строка)
        if (filters.salaryMin || filters.salaryMax) {
            filteredJobs = filteredJobs.filter(job => {
                if (!job.salary) return false

                // Извлекаем числа из строки зарплаты
                const salaryNumbers = job.salary.match(/\d+/g)
                if (!salaryNumbers || salaryNumbers.length === 0) return false

                const jobSalary = parseInt(salaryNumbers[0])

                // Проверяем диапазон
                if (filters.salaryMin && jobSalary < filters.salaryMin) return false
                if (filters.salaryMax && jobSalary > filters.salaryMax) return false

                return true
            })
        }

        // Обновляем вакансии и pagination
        if (activeTab === 'vakansiyalar') {
            setJobs(filteredJobs)
            setVakansiyalarPage(1)
        } else {
            setShortJobs(filteredJobs)
            setGundelikPage(1)
        }

        setHasMore(result.hasMore)
        setLoading(false)
    }

    const handleLogin = () => {
        signInWithGoogle()
    }

    const handlePostJob = () => {
        if (!isAuthenticated) {
            // Если пользователь не авторизован, редирект на Google вход с returnTo параметром
            signInWithGoogle('/post-job')
            return
        }
        router.push('/post-job')
    }

    const handleApply = (jobId: string) => {
        router.push(`/vakansiyalar/${jobId}`)
    }

    const handleCategorySelect = async (categoryNameAz: string) => {
        console.log('[handleCategorySelect] Selected category:', categoryNameAz)
        setSelectedCategory(categoryNameAz)
        setActiveFilters(null) // Сбрасываем фильтры при выборе категории
        setLoading(true)

        // НОВАЯ ЛОГИКА: Фильтруем по category.parent_id
        // Находим parent_id категории и показываем только вакансии из подкатегорий
        if (activeTab === 'vakansiyalar') {
            if (!categoryNameAz) {
                setJobs(allJobs) // Показываем все
            } else {
                // Находим главную категорию по name_az
                const parentCategory = vakansiyaCategories.find(
                    cat => cat.name_az?.toLowerCase() === categoryNameAz.toLowerCase()
                )

                if (parentCategory) {
                    console.log('[handleCategorySelect] Parent category ID:', parentCategory.id)

                    // Фильтруем вакансии где category_info.parent_id === выбранная категория
                    const filtered = allJobs.filter(job => {
                        const categoryInfo = (job as any).category_info
                        const matchesParent = categoryInfo?.parent_id === parentCategory.id
                        return matchesParent
                    })

                    console.log('[handleCategorySelect] Filtered jobs count:', filtered.length)
                    setJobs(filtered)
                } else {
                    setJobs([])
                }
            }
        } else {
            if (!categoryNameAz) {
                setShortJobs(allShortJobs) // Показываем все
            } else {
                const parentCategory = gundelikCategories.find(
                    cat => cat.name_az?.toLowerCase() === categoryNameAz.toLowerCase()
                )

                if (parentCategory) {
                    const filtered = allShortJobs.filter(job => {
                        const categoryInfo = (job as any).category_info
                        return categoryInfo?.parent_id === parentCategory.id
                    })
                    setShortJobs(filtered)
                } else {
                    setShortJobs([])
                }
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Навигация */}
            <Navigation
                onLogin={handleLogin}
                onPostJob={handlePostJob}
                isAuthenticated={isAuthenticated}
            />

            {/* Hero Section */}
            <section className="bg-white py-6 md:py-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Левая часть: Слоган + Поиск */}
                        <div className="lg:col-span-7">
                            {/* Слоган */}
                            <HeroSlogan />

                            {/* Поиск */}
                            <SearchBar onSearch={handleSearch} cities={cities} />

                            {/* Табы - переключение между Vakansiyalar и Gündəlik işlər */}
                            <div className="mt-6 flex items-center gap-2 bg-gray-100 p-1 rounded-xl max-w-md">
                                <button
                                    onClick={() => setActiveTab('vakansiyalar')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'vakansiyalar'
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-600 hover:text-black'
                                        }`}
                                >
                                    <BriefcaseIcon className="w-5 h-5" />
                                    Vakansiyalar
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('gundelik')
                                        loadGundelikData() // Lazy load при переключении
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'gundelik'
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-600 hover:text-black'
                                        }`}
                                >
                                    <ClockIcon className="w-5 h-5" />
                                    Gündəlik İş
                                </button>
                            </div>
                        </div>

                        {/* Правая часть: Animated Feed (скрыт на мобильных) */}
                        <div className="lg:col-span-5">
                            <AnimatedJobFeed
                                vakansiyalar={jobs.slice(0, 6)}
                                gundelik={gundelikLoaded ? shortJobs.slice(0, 6) : []}
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* Marquee */}
            <Marquee />

            {/* Category Dashboard */}
            <CategoryDashboard
                activeTab={activeTab}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                vakansiyaCategories={vakansiyaCategories}
                gundelikCategories={gundelikCategories}
            />

            {/* Vakansiyalar - показываем только если выбран таб vakansiyalar */}
            <section className={`py-6 md:py-12 bg-gray-50 ${activeTab !== 'vakansiyalar' ? 'hidden' : ''}`}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-xl md:text-3xl font-bold text-black">Vakansiyalar</h2>
                    </div>

                    {/* СЕТКА: 2 колонки на мобилке, 3-4 на десктопе */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                id={job.id}
                                title={job.title}
                                company={job.company || ''}
                                location={job.location}
                                salary={job.salary}
                                postedAt={new Date(job.created_at).toLocaleDateString('az-AZ')}
                                categoryName={(job as any).category_info?.name}
                                categoryImageUrl={(job as any).category_info?.image_url}
                                category={job.category as any}
                                isRemote={job.location.toLowerCase().includes('distant') || job.location.toLowerCase().includes('uzaqdan')}
                                isVIP={job.is_vip}
                                isUrgent={job.is_urgent}
                                onApply={() => handleApply(job.id)}
                            />
                        ))}
                    </div>

                    {/* Кнопка "Показать больше" (после 30 вакансий) */}
                    {jobs.length >= 30 && hasMore && (
                        <div className="text-center py-8">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Yüklənir...' : 'Daha çox göstər'}
                            </button>
                        </div>
                    )}

                    {/* Observer для автозагрузки (если меньше 30) */}
                    {jobs.length < 30 && (
                        <div ref={observerTarget} className="py-4">
                            {loading && <LoadingSpinner />}
                        </div>
                    )}
                </div>
            </section>

            {/* Career Section (только для vakansiyalar) */}
            {activeTab === 'vakansiyalar' && jobs.length >= 30 && <CareerSection />}

            {/* Gündəlik İşlər - показываем только если выбран таб gundelik */}
            <section className={`py-6 md:py-12 bg-white ${activeTab !== 'gundelik' ? 'hidden' : ''}`}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-xl md:text-3xl font-bold text-black">Gündəlik İşlər</h2>
                        <a href="/gundelik-isler" className="text-sm md:text-base text-gray-600 hover:text-black transition-colors">
                            Hamısına bax →
                        </a>
                    </div>

                    {/* СЕТКА: 2 колонки на мобилке, 3-4 на десктопе */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                        {shortJobs.map((job) => (
                            <ShortJobCard
                                key={job.id}
                                id={job.id}
                                title={job.title}
                                category={job.category as any}
                                categoryName={(job as any).category_info?.name}
                                categoryImageUrl={(job as any).category_info?.image_url}
                                location={job.location}
                                salary={job.salary || ''}
                                startDate={job.start_date || ''}
                                duration={job.duration}
                                isVIP={job.is_vip}
                                isUrgent={job.is_urgent}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-black text-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                        İşəgötürənsiniz?
                    </h2>
                    <p className="text-sm md:text-xl text-white/80 mb-6 md:mb-8">
                        Vakansiyalarınızı yerləşdirin və minlərlə işaxtaran arasından uyğun namizədləri tapın
                    </p>
                    <button
                        onClick={handlePostJob}
                        className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all text-sm md:text-base"
                    >
                        Pulsuz vakansiya yerləşdir →
                    </button>
                </div>
            </section>

            {/* Footer CTA */}
            <FooterCTA />

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">V</span>
                                </div>
                                <span className="text-base md:text-xl font-bold text-black">VAKANSIYA.AZ</span>
                            </div>
                            <p className="text-xs md:text-sm text-gray-600">
                                Azərbaycanda №1 iş axtarış platforması
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşaxtaranlar</h3>
                            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                                <li><a href="/vakansiyalar">Vakansiyalar</a></li>
                                <li><a href="/gundelik-isler">Gündəlik işlər</a></li>
                                <li><a href="/companies">Şirkətlər</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşəgötürənlər</h3>
                            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                                <li><a href="/post-job">Elan yerləşdir</a></li>
                                <li><a href="/pricing">Qiymətlər</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-3 text-sm md:text-base">Haqqımızda</h3>
                            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                                <li><a href="/about">Biz kimik</a></li>
                                <li><a href="/contact">Əlaqə</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-600">
                        © 2025 Vakansiya.az
                    </div>
                </div>
            </footer>
        </div>
    )
}

'use client'

import { BriefcaseIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

const FeatureCard = ({
    icon,
    title,
    desc,
    cta,
    onClick
}: {
    icon: React.ReactNode
    title: string
    desc: string
    cta: string
    onClick: () => void
}) => (
    <div
        onClick={onClick}
        className="group p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
        {/* Иконка в черном кружке */}
        <div className="w-12 h-12 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <div className="text-white">
                {icon}
            </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-black">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
            {desc}
        </p>
        <div className="flex items-center gap-2 text-black font-bold text-sm group-hover:gap-3 transition-all">
            {cta}
            <ArrowRightIcon className="w-4 h-4" />
        </div>
    </div>
)

export default function CareerSection() {
    const router = useRouter()

    const handleVakansiyalar = () => {
        router.push('/vakansiyalar')
    }

    const handleGundelik = () => {
        router.push('/gundelik-isler')
    }

    const handlePostJob = async () => {
        const user = await getCurrentUser()
        if (!user) {
            alert('Elan yerləşdirmək üçün daxil olmalısınız')
            return
        }
        router.push('/post-job')
    }

    return (
        <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-black">
                        Karyera Yolu
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg">
                        Biz iş axtarışını sadələşdirdik. Mürəkkəb formalar yoxdur, sadəcə real fürsətlər və şəffaf proses.
                    </p>
                </div>

                {/* 3 CTA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* CTA 1: Для ищущих работу */}
                    <FeatureCard
                        icon={<BriefcaseIcon className="w-6 h-6 md:w-7 md:h-7" />}
                        title="Sürətli Nəticə"
                        desc="Müraciət etdikdən sonra şirkətlərdən tez bir zamanda geri dönüş alın. Vaxt itirməyin."
                        cta="Vakansiyalara bax"
                        onClick={handleVakansiyalar}
                    />

                    {/* CTA 2: Для ищущих подработку */}
                    <FeatureCard
                        icon={<ClockIcon className="w-6 h-6 md:w-7 md:h-7" />}
                        title="Asan Müraciət"
                        desc="CV-nizi bir dəfə yükləyin və istədiyiniz vakansiyaya bir kliklə müraciət edin."
                        cta="Gündəlik işlər"
                        onClick={handleGundelik}
                    />

                    {/* CTA 3: Для работодателей */}
                    <FeatureCard
                        icon={<UserGroupIcon className="w-6 h-6 md:w-7 md:h-7" />}
                        title="Güvənli Platforma"
                        desc="Bütün şirkətlər və vakansiyalar yoxlanılır. Təhlükəsiz iş axtarış təcrübəsi."
                        cta="Elan yerləşdir"
                        onClick={handlePostJob}
                    />
                </div>
            </div>
        </section>
    )
}

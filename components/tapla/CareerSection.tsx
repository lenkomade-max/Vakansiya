import { BriefcaseIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const FeatureCard = ({
    icon,
    title,
    desc,
    cta,
    gradient
}: {
    icon: React.ReactNode
    title: string
    desc: string
    cta: string
    gradient: string
}) => (
    <div className={`group p-6 md:p-8 ${gradient} rounded-2xl md:rounded-3xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden`}>
        {/* Декоративный элемент */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
                {desc}
            </p>
            <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                {cta}
                <ArrowRightIcon className="w-4 h-4" />
            </div>
        </div>
    </div>
)

export default function CareerSection() {
    return (
        <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                        Hər Kəs Üçün <span className="text-gray-400">Fürsət</span>
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg">
                        İstər karyera qurmaq, istərsə əlavə gəlir əldə etmək, istərsə də komanda böyütmək - hamısı burada.
                    </p>
                </div>

                {/* 3 CTA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* CTA 1: Для ищущих работу */}
                    <FeatureCard
                        icon={<BriefcaseIcon className="w-5 h-5 md:w-6 md:h-6" />}
                        title="Karyeranı Qur"
                        desc="Minlərlə vakansiya arasından özünə uyğun olanı tap. Ən yaxşı şirkətlərdə işlə və inkişaf et."
                        cta="Vakansiyalara bax"
                        gradient="bg-gradient-to-br from-blue-600 to-blue-800"
                    />

                    {/* CTA 2: Для ищущих подработку */}
                    <FeatureCard
                        icon={<ClockIcon className="w-5 h-5 md:w-6 md:h-6" />}
                        title="Əlavə Gəlir Qazan"
                        desc="Gündəlik işlərlə əlavə pul qazan. Çevik qrafik, sürətli ödəniş, heç bir öhdəlik."
                        cta="Gündəlik işlər"
                        gradient="bg-gradient-to-br from-purple-600 to-purple-800"
                    />

                    {/* CTA 3: Для работодателей */}
                    <FeatureCard
                        icon={<UserGroupIcon className="w-5 h-5 md:w-6 md:h-6" />}
                        title="Komandanı Böyüt"
                        desc="Ən yaxşı mütəxəssisləri tap və komandanı gücləndir. İlk elan tamamilə pulsuzdur."
                        cta="Elan yerləşdir"
                        gradient="bg-gradient-to-br from-orange-600 to-orange-800"
                    />
                </div>
            </div>
        </section>
    )
}

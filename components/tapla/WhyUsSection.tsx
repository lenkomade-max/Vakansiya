import { CheckCircleIcon } from '@heroicons/react/24/solid'

const BenefitCard = ({ title, desc }: { title: string; desc: string }) => (
    <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-md transition-shadow">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white">
            <CheckCircleIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-black">{title}</h3>
        <p className="text-gray-600 leading-relaxed">
            {desc}
        </p>
    </div>
)

const StatItem = ({ number, label }: { number: string; label: string }) => (
    <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-black mb-2">{number}</div>
        <div className="text-gray-500 font-medium">{label}</div>
    </div>
)

export default function WhyUsSection() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Заголовок */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-black">
                        Niyə Vakansiya.az?
                    </h2>
                </div>

                {/* Карточки преимуществ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <BenefitCard
                        title="Pulsuz elanlar"
                        desc="Hər ay pulsuz vakansiya və gündəlik iş elanı yerləşdirə bilərsiniz"
                    />
                    <BenefitCard
                        title="Geniş auditoriya"
                        desc="Minlərlə aktiv işaxtaran və işəgötürən platformamızdan istifadə edir"
                    />
                    <BenefitCard
                        title="Gündəlik işlər"
                        desc="Qısa müddətli işlər və gündəlik qazanc üçün xüsusi bölmə"
                    />
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-gray-100 pt-16">
                    <StatItem number="10,000+" label="Vakansiya" />
                    <StatItem number="5,000+" label="Şirkət" />
                    <StatItem number="50,000+" label="İstifadəçi" />
                    <StatItem number="1,000+" label="Gündəlik iş" />
                </div>
            </div>
        </section>
    )
}

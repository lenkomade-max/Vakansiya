'use client'

export default function Marquee() {
    return (
        <div className="bg-black py-3 md:py-4 overflow-hidden border-y border-black">
            <div className="flex animate-marquee whitespace-nowrap">
                {/* Дублируем контент для бесконечного цикла */}
                {[...Array(3)].map((_, groupIndex) => (
                    <div key={groupIndex} className="flex items-center text-white/90 font-bold text-sm md:text-lg uppercase tracking-widest">
                        {['VAKANSIYALAR', 'TƏCRÜBƏ PROQRAMLARI', 'FREELANCE', 'GÜNDƏLIK İŞLƏR'].map((text, i) => (
                            <span key={i} className="flex items-center mx-6 md:mx-8">
                                {text}
                                <div className="w-1.5 h-1.5 bg-white rounded-full ml-6 md:ml-8" />
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

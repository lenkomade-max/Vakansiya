'use client'

import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default function FooterCTA() {
    const router = useRouter()

    const handleJobSearch = () => {
        router.push('/vakansiyalar')
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
        <div className="bg-black text-white py-12 md:py-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Левая часть: Слоган */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            Gələcəyini <br />
                            <span className="text-gray-400">Bu Gün Qur</span>
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg">
                            Azərbaycanda №1 iş axtarış platforması. 10,000+ vakansiya, 5,000+ şirkət.
                        </p>
                    </div>

                    {/* Правая часть: CTA кнопки */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleJobSearch}
                            className="flex-1 px-6 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all text-center"
                        >
                            İş Axtar
                        </button>
                        <button
                            onClick={handlePostJob}
                            className="flex-1 px-6 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all text-center"
                        >
                            Elan Yerləşdir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

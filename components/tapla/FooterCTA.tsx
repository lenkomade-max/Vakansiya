'use client'

import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default function FooterCTA() {
    const router = useRouter()

    const handlePostJob = async () => {
        const user = await getCurrentUser()
        if (!user) {
            alert('Elan yerləşdirmək üçün daxil olmalısınız')
            return
        }
        router.push('/post-job')
    }

    return (
        <div className="py-12 md:py-16 px-4 md:px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="bg-black rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
                    {/* Декоративный фон */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Komandanı <br className="hidden md:block" />
                            Böyütmək İstəyirsən?
                        </h2>

                        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
                            Ən yaxşı mütəxəssisləri tapmaq üçün elan yerləşdirin.
                            İlk elan tamamilə pulsuzdur.
                        </p>

                        <button
                            onClick={handlePostJob}
                            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
                        >
                            ELAN YERLƏŞDİR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

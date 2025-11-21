'use client'

import { motion } from 'framer-motion'
import { Job } from '@/lib/api/jobs'
import { BriefcaseIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

type AnimatedJobFeedProps = {
    vakansiyalar: Job[]
    gundelik: Job[]
}

// Компактная карточка для анимации
const JobCardMini = ({ job, type }: { job: Job; type: 'vakansiya' | 'gundelik' }) => (
    <div className="mb-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 truncate leading-tight">
                    {job.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1 truncate">
                    {job.company || 'Şirkət'}
                </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 ml-2">
                {type === 'vakansiya' ? (
                    <BriefcaseIcon className="w-3 h-3" />
                ) : (
                    <ClockIcon className="w-3 h-3" />
                )}
            </div>
        </div>

        {job.salary && (
            <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full mt-1">
                {job.salary}
            </div>
        )}

        {job.location && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                <MapPinIcon className="w-3 h-3" />
                <span className="truncate">{job.location}</span>
            </div>
        )}
    </div>
)

export default function AnimatedJobFeed({ vakansiyalar, gundelik }: AnimatedJobFeedProps) {
    // Берем первые 6 вакансий и 6 gündəlik для анимации
    const vakansiyaCards = vakansiyalar.slice(0, 6)
    const gundelikCards = gundelik.slice(0, 6)

    // Дублируем для бесконечного цикла
    const vakansiyaLoop = [...vakansiyaCards, ...vakansiyaCards, ...vakansiyaCards]
    const gundelikLoop = [...gundelikCards, ...gundelikCards, ...gundelikCards]

    return (
        <div className="hidden lg:block relative h-[500px] w-full">
            {/* Fade masks */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 h-full justify-center overflow-hidden">
                {/* Колонка 1: Vakansiyalar (снизу вверх ↑) */}
                <motion.div
                    className="w-1/2"
                    animate={{ y: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                >
                    {vakansiyaLoop.map((job, i) => (
                        <JobCardMini key={`vak-${i}`} job={job} type="vakansiya" />
                    ))}
                </motion.div>

                {/* Колонка 2: Gündəlik (сверху вниз ↓) */}
                <motion.div
                    className="w-1/2 -mt-[250px]"
                    animate={{ y: [-250, 750] }}
                    transition={{
                        repeat: Infinity,
                        duration: 35,
                        ease: "linear"
                    }}
                >
                    {gundelikLoop.map((job, i) => (
                        <JobCardMini key={`gun-${i}`} job={job} type="gundelik" />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

import React from 'react';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  postedAt: string;
  logo?: string;
  category?: 'it' | 'marketing' | 'design' | 'sales' | 'management' | 'other';
  isRemote?: boolean;
  type?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  isVIP?: boolean;
  isUrgent?: boolean;
  onApply?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  salary,
  postedAt,
  logo,
  category = 'other',
  isRemote = false,
  type = 'full-time',
  isVIP = false,
  isUrgent = false,
  onApply,
}) => {
  // Цвета для категорий (фон логотипа)
  const categoryColors = {
    it: 'bg-blue-50',
    marketing: 'bg-red-50',
    design: 'bg-purple-50',
    sales: 'bg-green-50',
    management: 'bg-orange-50',
    other: 'bg-gray-50',
  };

  // Перевод типов работы на азербайджанский
  const typeLabels = {
    'full-time': 'Tam vaxt',
    'part-time': 'Qismən',
    'contract': 'Müqavilə',
    'freelance': 'Freelance',
  };

  const workTypeLabels = {
    office: '🏢 Ofis',
    remote: '💼 Distant',
    hybrid: '🤝 Hibrid',
  };

  return (
    <div
      onClick={onApply}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {/* Фото/Лого с badges НА нем */}
      <div className="relative aspect-square bg-gray-100">
        {/* Логотип */}
        <div className={`w-full h-full ${categoryColors[category]} flex items-center justify-center`}>
          {logo ? (
            <img
              src={logo}
              alt={company}
              className="w-20 h-20 object-contain"
            />
          ) : (
            <span className="text-5xl font-bold text-gray-400">
              {company.charAt(0)}
            </span>
          )}
        </div>

        {/* Badges СВЕРХУ - VIP + URGENT */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
          {/* VIP Badge */}
          {isVIP && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded shadow-md flex items-center gap-1">
              🔥 VIP
            </span>
          )}

          {/* Urgent Badge */}
          {isUrgent && (
            <span className="px-2 py-1 bg-red-500 text-white font-bold rounded shadow-md text-[10px] whitespace-nowrap">
              🔴 TƏCİLİ
            </span>
          )}
        </div>

        {/* Badge СНИЗУ фото - ТОЛЬКО ЗАРПЛАТА */}
        {salary && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center">
              <span className="px-1.5 py-0.5 bg-white/90 text-black font-semibold rounded text-[9px] whitespace-nowrap">
                💰 {salary}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Информация под фото */}
      <div className="p-3">
        {/* Название вакансии */}
        <h3 className="text-[15px] font-semibold text-black mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Компания + Тип работы В ОДНОЙ ЛИНИИ */}
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[13px] text-gray-600 truncate min-w-0 flex-1">
            {company}
          </p>
          {isRemote && (
            <span className="text-[11px] text-blue-600 font-medium flex-shrink-0 whitespace-nowrap">
              💼 Distant
            </span>
          )}
        </div>

        {/* Локация + Время В ОДНОЙ ЛИНИИ */}
        <div className="flex items-center text-[11px] text-gray-500">
          <span className="flex items-center gap-0.5">
            📍 {location}
          </span>
          <span className="mx-1.5">•</span>
          <span className="flex items-center gap-0.5">
            ⏰ {postedAt}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

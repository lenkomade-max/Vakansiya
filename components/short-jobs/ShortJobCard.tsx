import React from 'react';
import Link from 'next/link';
import { MapPinIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import { CategoryIcon, ShortJobCategory } from './CategoryIcons';

export interface ShortJob {
  id: string;
  title: string;
  category: ShortJobCategory;
  location: string;
  salary: string; // Обязательное поле! "80 AZN/gün"
  startDate: string; // "Bu gün", "Sabah", "15 Noyabr"
  duration?: string; // "1 gün", "3 gün", "1 həftə"
  isVIP?: boolean;
  isUrgent?: boolean;
}

export interface ShortJobCardProps extends ShortJob {
  onClick?: () => void;
}

export const ShortJobCard: React.FC<ShortJobCardProps> = ({
  id,
  title,
  category,
  location,
  salary,
  startDate,
  duration,
  isVIP = false,
  isUrgent = false,
  onClick,
}) => {
  const cardContent = (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      {/* Фото/Иконка категории с badges */}
      <div className="relative aspect-square bg-gray-50 rounded-t-xl overflow-hidden">
        {/* Иконка категории (центр) */}
        <div className="w-full h-full flex items-center justify-center">
          <CategoryIcon category={category} size="xl" showBackground={false} />
        </div>

        {/* Badges СВЕРХУ - VIP + URGENT */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
          {/* VIP Badge */}
          {isVIP && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded shadow-md flex items-center gap-1">
              <FireIcon className="w-3 h-3" />
              VIP
            </span>
          )}

          {/* Urgent Badge */}
          {isUrgent && (
            <span className="px-2 py-1 bg-red-500 text-white font-bold rounded shadow-md text-[10px] whitespace-nowrap flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              TƏCİLİ
            </span>
          )}
        </div>

        {/* Badge СНИЗУ фото - ЗАРПЛАТА (обязательно!) */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center">
            <span className="px-1.5 py-0.5 bg-white/90 text-black font-semibold rounded text-[9px] whitespace-nowrap flex items-center gap-1">
              <BanknotesIcon className="w-3 h-3" />
              {salary}
            </span>
          </div>
        </div>
      </div>

      {/* Информация под фото */}
      <div className="p-3">
        {/* Название работы */}
        <h3 className="text-[15px] font-semibold text-black mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Локация */}
        <p className="text-[13px] text-gray-600 mb-2 truncate">
          {location}
        </p>

        {/* Дата начала + Длительность В ОДНОЙ ЛИНИИ */}
        <div className="flex items-center text-[11px] text-gray-500">
          <span className="flex items-center gap-0.5">
            <MapPinIcon className="w-3 h-3" />
            {location.split(',')[0]}
          </span>
          <span className="mx-1.5">•</span>
          <span className="flex items-center gap-0.5">
            <ClockIcon className="w-3 h-3" />
            {startDate}
          </span>
          {duration && (
            <>
              <span className="mx-1.5">•</span>
              <span>{duration}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Если передан onClick - используем его, иначе - Link
  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return (
    <Link href={`/gundelik-isler/${id}`}>
      {cardContent}
    </Link>
  );
};

export default ShortJobCard;

import React from 'react';
import Button from '../ui/Button';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  postedAt: string;
  logo?: string;
  tags?: string[];
  category?: 'it' | 'marketing' | 'design' | 'sales' | 'management' | 'other';
  isRemote?: boolean;
  type?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  onApply?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  salary,
  postedAt,
  logo,
  tags = [],
  category = 'other',
  isRemote = false,
  type = 'full-time',
  onApply,
  onSave,
  isSaved = false,
}) => {
  // Цвета для категорий (светлые версии для фона логотипа)
  const categoryColors = {
    it: 'bg-blue-100',
    marketing: 'bg-red-100',
    design: 'bg-purple-100',
    sales: 'bg-green-100',
    management: 'bg-orange-100',
    other: 'bg-gray-100',
  };

  // Перевод типов работы на азербайджанский
  const typeLabels = {
    'full-time': 'Tam vaxt',
    'part-time': 'Qismən',
    'contract': 'Müqavilə',
    'freelance': 'Freelance',
  };

  return (
    <div className="card-base group">
      {/* Header: Logo + Company + Save Button */}
      <div className="flex items-start gap-4 mb-4">
        {/* Логотип компании */}
        <div className={`w-14 h-14 rounded-xl ${categoryColors[category]} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
          {logo ? (
            <img
              src={logo}
              alt={company}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <span className="text-2xl font-bold text-gray-700">
              {company.charAt(0)}
            </span>
          )}
        </div>

        {/* Информация о вакансии */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-black mb-1 group-hover:text-accent-primary transition-colors truncate">
            {title}
          </h3>
          <p className="text-base text-gray-700 truncate">
            {company}
          </p>
        </div>

        {/* Кнопка "Сохранить" */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
          className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
          aria-label={isSaved ? 'Yaddan çıxart' : 'Yadda saxla'}
        >
          <span className={`text-xl ${isSaved ? 'text-red-500' : 'text-gray-400'}`}>
            {isSaved ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      {/* Details: Location, Salary, Posted Time */}
      <div className="flex items-center gap-4 text-sm text-gray-700 mb-4 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="text-base">📍</span>
          {location}
        </span>

        {salary && (
          <span className="flex items-center gap-1">
            <span className="text-base">💰</span>
            {salary}
          </span>
        )}

        <span className="flex items-center gap-1">
          <span className="text-base">🕒</span>
          {postedAt}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Тип работы */}
        <span className="tag-type">
          {typeLabels[type]}
        </span>

        {/* Remote badge */}
        {isRemote && (
          <span className="tag-location">
            📡 Distant
          </span>
        )}

        {/* Дополнительные теги */}
        {tags.map((tag, index) => (
          <span key={index} className="tag-category">
            {tag}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onApply}
        className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 group-hover:bg-accent-primary"
      >
        Ətraflı bax →
      </button>
    </div>
  );
};

export default JobCard;

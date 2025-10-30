import React from 'react';

export interface JobCardFeaturedProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  logo?: string;
  tags?: string[];
  category: 'it' | 'marketing' | 'design' | 'sales' | 'management';
  isRemote?: boolean;
  type?: 'full-time' | 'part-time' | 'contract';
  onApply?: () => void;
  isPremium?: boolean;
}

export const JobCardFeatured: React.FC<JobCardFeaturedProps> = ({
  title,
  company,
  location,
  salary,
  logo,
  tags = [],
  category,
  isRemote = false,
  type = 'full-time',
  onApply,
  isPremium = true,
}) => {
  // Градиенты для категорий
  const categoryGradients = {
    it: 'gradient-it',
    marketing: 'gradient-marketing',
    design: 'gradient-design',
    sales: 'gradient-sales',
    management: 'gradient-management',
  };

  // Перевод типов работы
  const typeLabels = {
    'full-time': 'Tam vaxt',
    'part-time': 'Qismən',
    'contract': 'Müqavilə',
  };

  return (
    <div className={`card-featured ${categoryGradients[category]}`}>
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-xs font-bold shadow-lg">
            PREMIUM
          </span>
        </div>
      )}

      {/* Логотип компании */}
      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-4 shadow-lg">
        {logo ? (
          <img
            src={logo}
            alt={company}
            className="w-10 h-10 object-contain"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-900">
            {company.charAt(0)}
          </span>
        )}
      </div>

      {/* Название вакансии */}
      <h3 className="text-2xl font-bold mb-2 text-white">
        {title}
      </h3>

      {/* Компания и локация */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-white/90">
          {company}
        </p>
        <span className="text-white/70">·</span>
        <p className="text-white/90">
          {location}
        </p>
      </div>

      {/* Зарплата (крупно) */}
      {salary && (
        <p className="text-3xl font-bold mb-4 text-white">
          {salary}
        </p>
      )}

      {/* Теги (прозрачные с backdrop) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Тип работы */}
        <span className="backdrop-card px-3 py-1 rounded-full text-xs font-medium text-white">
          {typeLabels[type]}
        </span>

        {/* Remote */}
        {isRemote && (
          <span className="backdrop-card px-3 py-1 rounded-full text-xs font-medium text-white">
            📡 Distant
          </span>
        )}

        {/* Дополнительные теги */}
        {tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="backdrop-card px-3 py-1 rounded-full text-xs font-medium text-white">
            {tag}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onApply}
        className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Müraciət et →
      </button>

      {/* Декоративный элемент (размытый круг) */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default JobCardFeatured;

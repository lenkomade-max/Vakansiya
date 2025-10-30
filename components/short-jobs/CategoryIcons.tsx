import React from 'react';
import {
  FaCar,
  FaTruck,
  FaHardHat,
  FaBroom,
  FaTree,
  FaUtensils,
  FaBullhorn,
  FaBox,
  FaBriefcase,
  FaPaintBrush,
  FaWrench,
} from 'react-icons/fa';

export type ShortJobCategory =
  | 'transport'      // Транспорт (такси, курьеры)
  | 'construction'   // Строительство
  | 'cleaning'       // Уборка
  | 'garden'         // Садовые работы
  | 'restaurant'     // Ресторан
  | 'events'         // Ивенты
  | 'warehouse'      // Склад
  | 'office'         // Офис
  | 'creative'       // Творческие
  | 'services';      // Услуги

export interface CategoryConfig {
  id: ShortJobCategory;
  icon: React.ReactNode;
  name: string;
  nameAz: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'transport',
    icon: <FaCar className="w-full h-full" />,
    name: 'Транспорт',
    nameAz: 'Nəqliyyat',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'construction',
    icon: <FaHardHat className="w-full h-full" />,
    name: 'Строительство',
    nameAz: 'Tikinti',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    id: 'cleaning',
    icon: <FaBroom className="w-full h-full" />,
    name: 'Уборка',
    nameAz: 'Təmizlik',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'garden',
    icon: <FaTree className="w-full h-full" />,
    name: 'Садовые работы',
    nameAz: 'Bağçılıq',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    id: 'restaurant',
    icon: <FaUtensils className="w-full h-full" />,
    name: 'Ресторан',
    nameAz: 'Restoran',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    id: 'events',
    icon: <FaBullhorn className="w-full h-full" />,
    name: 'Ивенты и промо',
    nameAz: 'Tədbir və reklam',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    id: 'warehouse',
    icon: <FaBox className="w-full h-full" />,
    name: 'Склад',
    nameAz: 'Anbar',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'office',
    icon: <FaBriefcase className="w-full h-full" />,
    name: 'Офис',
    nameAz: 'Ofis',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'creative',
    icon: <FaPaintBrush className="w-full h-full" />,
    name: 'Творческие',
    nameAz: 'Yaradıcılıq',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
  },
  {
    id: 'services',
    icon: <FaWrench className="w-full h-full" />,
    name: 'Услуги',
    nameAz: 'Xidmətlər',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
];

interface CategoryIconProps {
  category: ShortJobCategory;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  showBackground = true,
  className = '',
}) => {
  const config = CATEGORIES.find((c) => c.id === category);

  if (!config) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${showBackground ? `${config.bgColor} rounded-xl` : ''}
        flex items-center justify-center
        ${className}
      `}
    >
      <div className={`${iconSizes[size]} ${config.color}`}>
        {config.icon}
      </div>
    </div>
  );
};

// Грид с категориями для главной страницы
interface CategoryGridProps {
  onCategoryClick?: (category: ShortJobCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryClick?.(cat.id)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className={`w-12 h-12 ${cat.bgColor} rounded-xl flex items-center justify-center`}>
            <div className={`w-6 h-6 ${cat.color}`}>
              {cat.icon}
            </div>
          </div>
          <span className="text-xs md:text-sm font-medium text-center">
            {cat.nameAz}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryIcon;

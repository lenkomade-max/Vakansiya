import React, { useState } from 'react';

export interface SearchBarProps {
  onSearch: (query: string, location: string, category: string) => void;
  placeholder?: string;
  locationPlaceholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Vəzifə, açar söz...',
  locationPlaceholder = 'Şəhər seçin',
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, category);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-3 md:p-4 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Поле поиска */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </div>
        </div>

        {/* Локация */}
        <div className="relative">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors appearance-none pr-10"
          >
            <option value="">{locationPlaceholder}</option>
            <option value="baku">Bakı</option>
            <option value="ganja">Gəncə</option>
            <option value="sumqayit">Sumqayıt</option>
            <option value="mingachevir">Mingəçevir</option>
            <option value="lankaran">Lənkəran</option>
            <option value="shaki">Şəki</option>
            <option value="nakhchivan">Naxçıvan</option>
            <option value="remote">Distant</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
            📍
          </div>
        </div>

        {/* Кнопка поиска */}
        <button
          type="submit"
          className="px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-all duration-200 active:scale-95"
        >
          Axtar →
        </button>
      </div>

      {/* Быстрые фильтры (чипсы) */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-600 mr-1">Sürətli filtr:</span>
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setLocation('');
            setCategory('full-time');
            onSearch('', '', 'full-time');
          }}
          className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
        >
          Tam iş günü
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setLocation('remote');
            setCategory('');
            onSearch('', 'remote', '');
          }}
          className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors cursor-pointer"
        >
          Distant iş
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery('yeni');
            setLocation('');
            setCategory('');
            onSearch('yeni', '', '');
          }}
          className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors cursor-pointer"
        >
          Yeni vakansiyalar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

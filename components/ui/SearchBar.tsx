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
      className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto animate-slide-up"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Поле поиска */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input-base pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>

        {/* Локация */}
        <div className="relative">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-base appearance-none pr-10"
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            📍
          </div>
        </div>

        {/* Кнопка поиска */}
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 shadow-button hover:shadow-button-hover active:scale-95"
        >
          Axtar →
        </button>
      </div>

      {/* Быстрые фильтры (чипсы) */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-700 mr-2">Sürətli filtr:</span>
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setLocation('');
            setCategory('full-time');
            onSearch('', '', 'full-time');
          }}
          className="tag-type hover:bg-purple-200 transition-colors cursor-pointer"
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
          className="tag-location hover:bg-green-200 transition-colors cursor-pointer"
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
          className="tag-status hover:bg-yellow-200 transition-colors cursor-pointer"
        >
          Yeni vakansiyalar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

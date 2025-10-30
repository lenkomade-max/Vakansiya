import React from 'react';
import Navigation from '../ui/Navigation';
import SearchBar from '../ui/SearchBar';
import JobCard from '../job/JobCard';
import JobCardFeatured from '../job/JobCardFeatured';

/**
 * Пример главной страницы Vakansiya.az
 * Демонстрирует использование всех компонентов с дизайн-системой V2
 */

export const HomePage: React.FC = () => {
  // Пример данных для обычных вакансий
  const regularJobs = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'ABC Tech',
      location: 'Bakı',
      salary: '1500-2000 AZN',
      postedAt: '2 saat əvvəl',
      category: 'it' as const,
      type: 'full-time' as const,
      isRemote: true,
      tags: ['React', 'TypeScript', 'Tailwind'],
      logo: 'https://via.placeholder.com/80?text=ABC',
    },
    {
      id: '2',
      title: 'Content Manager',
      company: 'MediaPro MMC',
      location: 'Bakı, Nərimanov',
      salary: '1200-1800 AZN',
      postedAt: '1 gün əvvəl',
      category: 'marketing' as const,
      type: 'full-time' as const,
      isRemote: false,
      tags: ['SMM', 'Copywriting'],
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'Distant',
      salary: '2000-3000 AZN',
      postedAt: '3 gün əvvəl',
      category: 'design' as const,
      type: 'full-time' as const,
      isRemote: true,
      tags: ['Figma', 'Photoshop', 'UI Design'],
    },
  ];

  // Пример данных для Featured (Premium) вакансий
  const featuredJobs = [
    {
      id: 'f1',
      title: 'Senior Backend Developer',
      company: 'Google Azerbaijan',
      location: 'Bakı',
      salary: '$4,000-6,000',
      category: 'it' as const,
      type: 'full-time' as const,
      isRemote: true,
      tags: ['Node.js', 'PostgreSQL', 'AWS'],
      isPremium: true,
    },
    {
      id: 'f2',
      title: 'Marketing Director',
      company: 'Coca-Cola Azerbaijan',
      location: 'Bakı, Nəsimi',
      salary: '5000-7000 AZN',
      category: 'marketing' as const,
      type: 'full-time' as const,
      isRemote: false,
      tags: ['Strategy', 'Leadership', 'Brand Management'],
      isPremium: true,
    },
  ];

  // Обработчики событий
  const handleSearch = (query: string, location: string, category: string) => {
    console.log('Поиск:', { query, location, category });
    // Здесь будет логика поиска
  };

  const handleLogin = () => {
    console.log('Вход в систему');
  };

  const handlePostJob = () => {
    console.log('Размещение вакансии');
  };

  const handleApply = (jobId: string) => {
    console.log('Отклик на вакансию:', jobId);
  };

  const handleSave = (jobId: string) => {
    console.log('Сохранение вакансии:', jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <Navigation
        onLogin={handleLogin}
        onPostJob={handlePostJob}
        isAuthenticated={false}
      />

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container-main">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-black mb-4">
              Azərbaycanda iş tap
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Minglərlə aktiv vakansiya arasından sizə uyğun işi tapın
            </p>
          </div>

          {/* Поиск */}
          <SearchBar onSearch={handleSearch} />

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="stat-card">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <div className="text-3xl font-bold text-black mb-1">14,523</div>
              <div className="text-sm text-gray-700">Aktiv vakansiya</div>
            </div>

            <div className="stat-card">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="text-3xl font-bold text-black mb-1">1,200+</div>
              <div className="text-sm text-gray-700">Şirkət</div>
            </div>

            <div className="stat-card">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-black mb-1">50,000+</div>
              <div className="text-sm text-gray-700">İstifadəçi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Vakansiyalar */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-black">Premium vakansiyalar</h2>
            <a href="/premium" className="text-accent-primary font-semibold hover:text-accent-primary-hover transition-colors">
              Hamısını gör →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCardFeatured
                key={job.id}
                {...job}
                onApply={() => handleApply(job.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Yeni Vakansiyalar */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-black">Yeni vakansiyalar</h2>
            <a href="/jobs" className="text-accent-primary font-semibold hover:text-accent-primary-hover transition-colors">
              Hamısını gör →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onApply={() => handleApply(job.id)}
                onSave={() => handleSave(job.id)}
                isSaved={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container-main text-center">
          <h2 className="text-4xl font-bold mb-4">
            İşəgötürənsiniz?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Vakansiyalarınızı yerləşdirin və minlərlə işaxtaran arasından uyğun namizədləri tapın
          </p>
          <button
            onClick={handlePostJob}
            className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Pulsuz vakansiya yerləşdir →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <span className="text-xl font-bold text-black">VAKANSIYA.AZ</span>
              </div>
              <p className="text-sm text-gray-700">
                Azərbaycanda №1 iş axtarış platforması
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-4">İşaxtaranlar</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="/jobs" className="hover:text-black transition-colors">Vakansiyalar</a></li>
                <li><a href="/companies" className="hover:text-black transition-colors">Şirkətlər</a></li>
                <li><a href="/cv-builder" className="hover:text-black transition-colors">CV yaradın</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-black mb-4">İşəgötürənlər</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="/post-job" className="hover:text-black transition-colors">Vakansiya yerləşdir</a></li>
                <li><a href="/pricing" className="hover:text-black transition-colors">Qiymətlər</a></li>
                <li><a href="/employer-guide" className="hover:text-black transition-colors">İşəgötürən bələdçisi</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-black mb-4">Haqqımızda</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="/about" className="hover:text-black transition-colors">Biz kimik</a></li>
                <li><a href="/contact" className="hover:text-black transition-colors">Əlaqə</a></li>
                <li><a href="/terms" className="hover:text-black transition-colors">Şərtlər</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-700">
            © 2025 Vakansiya.az. Bütün hüquqlar qorunur.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

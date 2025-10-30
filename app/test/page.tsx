'use client'

import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  BriefcaseIcon,
  HomeIcon,
  BuildingOfficeIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  BookmarkIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

import {
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
  BookmarkIcon as BookmarkSolid,
} from '@heroicons/react/24/solid'

import {
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBriefcase,
  FaBuilding,
  FaHeart,
  FaStar,
  FaFire,
  FaUserTie,
  FaGraduationCap,
  FaChartLine,
  FaPalette,
  FaCode,
  FaBullhorn,
  FaHandshake,
} from 'react-icons/fa'

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">🎨 UI Компоненты для Vakansiya.az</h1>

        {/* Heroicons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Heroicons (Outline)</h2>
          <div className="bg-white p-6 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-2">
              <MagnifyingGlassIcon className="w-8 h-8 text-black" />
              <span className="text-sm">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPinIcon className="w-8 h-8 text-red-500" />
              <span className="text-sm">Location</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ClockIcon className="w-8 h-8 text-blue-500" />
              <span className="text-sm">Clock</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BanknotesIcon className="w-8 h-8 text-green-500" />
              <span className="text-sm">Money</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BriefcaseIcon className="w-8 h-8 text-purple-500" />
              <span className="text-sm">Work</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BuildingOfficeIcon className="w-8 h-8 text-gray-500" />
              <span className="text-sm">Company</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <HeartIcon className="w-8 h-8 text-pink-500" />
              <span className="text-sm">Favorite</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StarIcon className="w-8 h-8 text-yellow-500" />
              <span className="text-sm">Star</span>
            </div>
          </div>
        </section>

        {/* React Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">React Icons (Font Awesome)</h2>
          <div className="bg-white p-6 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-2">
              <FaSearch className="w-8 h-8 text-black" />
              <span className="text-sm">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaMapMarkerAlt className="w-8 h-8 text-red-500" />
              <span className="text-sm">Location</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaClock className="w-8 h-8 text-blue-500" />
              <span className="text-sm">Clock</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaMoneyBillWave className="w-8 h-8 text-green-500" />
              <span className="text-sm">Money</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaBriefcase className="w-8 h-8 text-purple-500" />
              <span className="text-sm">Work</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaBuilding className="w-8 h-8 text-gray-500" />
              <span className="text-sm">Company</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaHeart className="w-8 h-8 text-pink-500" />
              <span className="text-sm">Favorite</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaFire className="w-8 h-8 text-orange-500" />
              <span className="text-sm">Fire/Hot</span>
            </div>
          </div>
        </section>

        {/* Наши кастомные кнопки */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Кастомные кнопки с иконками</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5" />
                Поиск
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Локация
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5" />
                Зарплата
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2">
                <HeartIcon className="w-5 h-5" />
                Избранное
              </button>
              <button className="px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                Вакансии
              </button>
            </div>
          </div>
        </section>

        {/* Badges / Бейджи */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Бейджи (Tags)</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">IT</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">Distant</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">Full-time</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">Premium</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">Urgent</span>
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full font-bold shadow-md">
                🔥 VIP
              </span>
            </div>
          </div>
        </section>

        {/* Forms / Формы */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Формы (Inputs & Selects)</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название вакансии
                </label>
                <input
                  type="text"
                  placeholder="Frontend Developer"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors">
                  <option>IT</option>
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Sales</option>
                </select>
              </div>

              {/* Input with Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зарплата
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1000-2000"
                    className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                  <BanknotesIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  rows={3}
                  placeholder="Опишите требования..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cards / Карточки */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Карточки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Simple Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Frontend Developer</h3>
              <p className="text-sm text-gray-600 mb-4">ABC Tech Company</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4" />
                <span>Bakı</span>
              </div>
            </div>

            {/* Card with Badge */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow relative">
              <span className="absolute top-4 right-4 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                Premium
              </span>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Marketing Manager</h3>
              <p className="text-sm text-gray-600 mb-4">MediaPro MMC</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BanknotesIcon className="w-4 h-4" />
                <span>2000-3000 AZN</span>
              </div>
            </div>

            {/* Card with Actions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HeartIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">UX/UI Designer</h3>
              <p className="text-sm text-gray-600 mb-4">DesignHub</p>
              <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium">
                Подать заявку
              </button>
            </div>
          </div>
        </section>

        {/* Tabs / Табы */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Табы (Navigation Tabs)</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="flex gap-2 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Все вакансии
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'recent'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Новые
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'saved'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Избранные
              </button>
            </div>
            <div className="text-gray-600">
              {activeTab === 'all' && 'Показаны все вакансии'}
              {activeTab === 'recent' && 'Показаны новые вакансии за последние 24 часа'}
              {activeTab === 'saved' && 'Показаны ваши избранные вакансии'}
            </div>
          </div>
        </section>

        {/* Alerts / Уведомления */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Алерты (Alerts)</h2>
          <div className="space-y-4">
            {/* Success */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Успешно!</h4>
                <p className="text-sm text-green-700">Ваша вакансия успешно опубликована</p>
              </div>
            </div>

            {/* Error */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Ошибка!</h4>
                <p className="text-sm text-red-700">Не удалось загрузить файл. Попробуйте снова.</p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <BellIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Информация</h4>
                <p className="text-sm text-blue-700">У вас есть 3 новых отклика на вакансию</p>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Модальное окно</h2>
          <div className="bg-white p-6 rounded-xl">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Открыть модалку
            </button>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">Создать вакансию</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XCircleIcon className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Название вакансии"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                    <textarea
                      rows={4}
                      placeholder="Описание"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Отмена
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                        Создать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Category Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Иконки категорий</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaCode className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium">IT</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaBullhorn className="w-8 h-8 text-red-600" />
                </div>
                <span className="text-sm font-medium">Marketing</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaPalette className="w-8 h-8 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Design</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaHandshake className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-sm font-medium">Sales</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FaUserTie className="w-8 h-8 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Management</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="w-8 h-8 text-indigo-600" />
                </div>
                <span className="text-sm font-medium">Education</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                  <FaChartLine className="w-8 h-8 text-teal-600" />
                </div>
                <span className="text-sm font-medium">Finance</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center">
                  <FaFire className="w-8 h-8 text-pink-600" />
                </div>
                <span className="text-sm font-medium">Hot Jobs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Кнопки действий</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-wrap gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Редактировать">
                <PencilIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Удалить">
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Просмотр">
                <EyeIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Поделиться">
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors" title="Избранное">
                <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
              <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors" title="Закладка">
                <BookmarkIcon className="w-5 h-5 text-gray-600 hover:text-yellow-500" />
              </button>
            </div>
          </div>
        </section>

        {/* Size Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Размеры иконок</h2>
          <div className="bg-white p-6 rounded-xl">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-black" />
                <span className="text-xs">w-4 h-4</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-black" />
                <span className="text-xs">w-5 h-5</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MagnifyingGlassIcon className="w-6 h-6 text-black" />
                <span className="text-xs">w-6 h-6</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MagnifyingGlassIcon className="w-8 h-8 text-black" />
                <span className="text-xs">w-8 h-8</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MagnifyingGlassIcon className="w-12 h-12 text-black" />
                <span className="text-xs">w-12 h-12</span>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-4">Полезные ссылки</h2>
          <div className="bg-white p-6 rounded-xl">
            <ul className="space-y-2">
              <li>
                <a href="https://heroicons.com/" target="_blank" className="text-blue-500 hover:underline">
                  → Heroicons - все иконки
                </a>
              </li>
              <li>
                <a href="https://react-icons.github.io/react-icons/" target="_blank" className="text-blue-500 hover:underline">
                  → React Icons - огромная коллекция
                </a>
              </li>
              <li>
                <a href="https://www.material-tailwind.com/docs/react/button" target="_blank" className="text-blue-500 hover:underline">
                  → Material Tailwind - компоненты
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

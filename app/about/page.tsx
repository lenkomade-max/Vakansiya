'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onLogin={() => console.log('Login')}
        onPostJob={() => router.push('/post-job')}
        isAuthenticated={false}
      />

      {/* Hero */}
      <section className="bg-white py-12 md:py-20 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">
            Azərbaycanda №1 iş axtarış platforması
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Vakansiya.az - işaxtaranlar və işəgötürənlər üçün ən rahat platforma
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Bizim missiyamız
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Vakansiya.az platforması Azərbaycanda iş axtarışını və işçi seçimini maksimum dərəcədə asanlaşdırmaq məqsədi ilə yaradılmışdır.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Biz işaxtaranlara keyfiyyətli vakansiyalar, işəgötürənlərə isə geniş namizəd bazası təqdim edirik. Platformamız sadə interfeysi və müasir texnologiyaları ilə seçilir.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
            Niyə Vakansiya.az?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <CheckCircleIcon className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">
                Pulsuz elanlar
              </h3>
              <p className="text-gray-700">
                Hər ay pulsuz vakansiya və gündəlik iş elanı yerləşdirə bilərsiniz
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <CheckCircleIcon className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">
                Geniş auditoriya
              </h3>
              <p className="text-gray-700">
                Minlərlə aktiv işaxtaran və işəgötürən platformamızdan istifadə edir
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <CheckCircleIcon className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-black mb-3">
                Gündəlik işlər
              </h3>
              <p className="text-gray-700">
                Qısa müddətli işlər və gündəlik qazanc üçün xüsusi bölmə
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">10,000+</div>
              <div className="text-gray-600">Vakansiya</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">5,000+</div>
              <div className="text-gray-600">Şirkət</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">50,000+</div>
              <div className="text-gray-600">İstifadəçi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">1,000+</div>
              <div className="text-gray-600">Gündəlik iş</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-black text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Bizimlə işə başlayın
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Vakansiya yerləşdirin və ya iş axtarışına başlayın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/post-job')}
              className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all"
            >
              Vakansiya yerləşdir
            </button>
            <button
              onClick={() => router.push('/vakansiyalar')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all"
            >
              İş axtar
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-base md:text-xl font-bold text-black">VAKANSIYA.AZ</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                Azərbaycanda №1 iş axtarış platforması
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşaxtaranlar</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/vakansiyalar">Vakansiyalar</a></li>
                <li><a href="/gundelik-isler">Gündəlik işlər</a></li>
                <li><a href="/companies">Şirkətlər</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">İşəgötürənlər</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/post-job">Elan yerləşdir</a></li>
                <li><a href="/pricing">Qiymətlər</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3 text-sm md:text-base">Haqqımızda</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="/about">Biz kimik</a></li>
                <li><a href="/contact">Əlaqə</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-600">
            © 2025 Vakansiya.az
          </div>
        </div>
      </footer>
    </div>
  )
}

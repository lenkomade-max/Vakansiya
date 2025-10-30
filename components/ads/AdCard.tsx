'use client'

import React from 'react'

export interface AdCardProps {
  /**
   * Google AdSense client ID (ca-pub-XXXXXXXXXXXXXXXX)
   */
  adClient?: string
  /**
   * Google AdSense ad slot ID
   */
  adSlot?: string
  /**
   * Визуально интегрируется в сетку вакансий
   */
  format?: 'auto' | 'rectangle' | 'vertical'
}

/**
 * AdCard - Нативная реклама Google AdSense
 * Визуально похожа на JobCard, без пометки "Reklam"
 * Вставляется в сетку на позициях 7, 15, 23 и т.д.
 */
export const AdCard: React.FC<AdCardProps> = ({
  adClient = 'ca-pub-0000000000000000', // Замените на реальный
  adSlot = '0000000000',
  format = 'auto',
}) => {
  React.useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200">
      {/* Контейнер для рекламы с теми же размерами что и JobCard */}
      <div className="relative aspect-square bg-gray-50">
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        ></ins>
      </div>

      {/* Нижняя часть как у JobCard */}
      <div className="p-3">
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: '80px',
          }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="fluid"
        ></ins>
      </div>
    </div>
  )
}

/**
 * Утилита для вставки рекламы в массив вакансий
 * Вставляет на позиции 7, 15, 23, 31, ...
 */
export function injectAds<T>(items: T[], adClient?: string, adSlot?: string): (T | React.ReactElement)[] {
  const result: (T | React.ReactElement)[] = []
  const adPositions = [7, 15, 23, 31, 39, 47, 55, 63] // Каждая 8-я позиция после 7-й

  items.forEach((item, index) => {
    result.push(item)

    // Вставляем рекламу на определенных позициях
    if (adPositions.includes(index + 1)) {
      result.push(
        <AdCard
          key={`ad-${index}`}
          adClient={adClient}
          adSlot={adSlot}
        />
      )
    }
  })

  return result
}

export default AdCard

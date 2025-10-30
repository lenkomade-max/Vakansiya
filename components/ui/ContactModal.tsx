'use client'

import React from 'react'
import { XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { FaWhatsapp } from 'react-icons/fa'

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  jobTitle?: string
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  jobTitle,
}) => {
  if (!isOpen) return null

  // Форматируем номер для отображения (например: +994 50 123 45 67)
  const formatPhoneDisplay = (phone: string) => {
    // Удаляем все нечисловые символы
    const cleaned = phone.replace(/\D/g, '')
    // Форматируем в азербайджанский формат
    if (cleaned.startsWith('994')) {
      return `+994 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`
    }
    return phone
  }

  // Подготавливаем номер для ссылок (только цифры с +)
  const cleanPhoneForLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.startsWith('994') ? `+${cleaned}` : `+994${cleaned}`
  }

  const telLink = `tel:${cleanPhoneForLink(phoneNumber)}`
  const whatsappLink = `https://wa.me/${cleanPhoneForLink(phoneNumber)}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md md:mx-4 p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black mb-1">
              Əlaqə məlumatları
            </h3>
            {jobTitle && (
              <p className="text-sm text-gray-600 line-clamp-1">
                {jobTitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Bağla"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Phone Number Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-sm text-gray-600 mb-1">Telefon nömrəsi</p>
          <p className="text-2xl font-bold text-black tracking-wide">
            {formatPhoneDisplay(phoneNumber)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Phone Call Button */}
          <a
            href={telLink}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95"
          >
            <PhoneIcon className="w-6 h-6" />
            <span>Zəng et</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all active:scale-95"
          >
            <FaWhatsapp className="w-6 h-6" />
            <span>WhatsApp mesaj</span>
          </a>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-3 px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
        >
          Ləğv et
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @media (min-width: 768px) {
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default ContactModal

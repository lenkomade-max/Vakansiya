/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Основные цвета (черно-белая база)
        white: '#FFFFFF',
        black: '#000000',

        // Серая палитра
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          700: '#404040',
          900: '#1A1A1A',
        },

        // Цветные акценты (умеренное использование - 10%)
        accent: {
          primary: '#3B82F6',        // Синий - кнопки, ссылки
          'primary-hover': '#2563EB',
          success: '#10B981',        // Зеленый - статусы
          warning: '#F59E0B',        // Оранжевый - Premium
          danger: '#EF4444',         // Красный - удаление
          info: '#8B5CF6',           // Фиолетовый - инфо
        },

        // Категории вакансий (для цветных карточек Premium)
        category: {
          it: {
            from: '#3B5BDB',
            to: '#2D4DB5',
          },
          marketing: {
            from: '#FF3B5E',
            to: '#D91043',
          },
          design: {
            from: '#8B5CF6',
            to: '#7C3AED',
          },
          sales: {
            from: '#10B981',
            to: '#059669',
          },
          management: {
            from: '#F59E0B',
            to: '#D97706',
          },
        },
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      fontSize: {
        // Заголовки
        '5xl': ['48px', { lineHeight: '1.1', fontWeight: '800' }],
        '4xl': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        '3xl': ['30px', { lineHeight: '1.3', fontWeight: '700' }],
        '2xl': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'xl': ['20px', { lineHeight: '1.5', fontWeight: '600' }],

        // Основной текст
        'lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'base': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },

      spacing: {
        // Система отступов по правилу 4px/8px
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },

      borderRadius: {
        'card': '16px',
        'card-lg': '24px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },

      boxShadow: {
        // Тени для карточек
        'card': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'card-featured': '0 20px 25px rgba(0, 0, 0, 0.15)',

        // Тени для кнопок
        'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'button-hover': '0 4px 6px rgba(0, 0, 0, 0.07)',
      },

      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

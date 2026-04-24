module.exports = {
  content: [
    './apps/web/index.html',
    './apps/web/src/**/*.{ts,tsx}',
    './packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ekya: {
          primary: '#0D9488',
          secondary: '#6366F1',
          accent: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          dark: '#1E293B',
          light: '#F8FAFC'
        },
        gradient: {
          hero: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          card: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          purple: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          ocean: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          sunset: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
          forest: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 40px rgba(99, 102, 241, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'inner-glow': 'inset 0 2px 4px rgba(255, 255, 255, 0.5)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
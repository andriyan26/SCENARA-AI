/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#06080D',
          900: '#0A0D14',
          850: '#0F131C',
          800: '#141A26',
          750: '#1B2232',
          700: '#232D42',
          600: '#34415E',
          500: '#4F628A',
          400: '#7E92B8',
          300: '#A9B9D6',
          200: '#CBD6E8',
          100: '#E7EEF8',
          50: '#F4F7FC',
        },
        cinematic: {
          cyan: '#00E5FF',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          rose: '#F43F5E',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        filmFlicker: {
          '0%, 100%': { opacity: '0.98' },
          '50%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'film-flicker': 'filmFlicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}

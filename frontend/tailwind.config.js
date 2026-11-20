/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        pine: {
          950: '#0a1412',
          900: '#0e1c19',
          850: '#132420',
          800: '#182d28',
          700: '#223d37',
          600: '#2f524a',
          500: '#3e6a60',
          400: '#548c7f',
          300: '#75b0a3',
          200: '#a2cfc5',
          100: '#d1ebe4',
        },
        warmAmber: {
          glow: '#fbbf24',
          accent: '#f59e0b',
          deep: '#d97706',
        }
      },
      boxShadow: {
        'cabin-glow': '0 0 60px -10px rgba(245, 158, 11, 0.25)',
        'glass-panel': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'pill-white': '0 4px 14px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

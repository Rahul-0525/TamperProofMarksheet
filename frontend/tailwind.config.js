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
          950: '#0f1f1a', // Lighter, cooler meadow-pine backdrop
          900: '#142923',
          850: '#19342c',
          800: '#204036',
          700: '#2b5448',
          600: '#386a5b',
          500: '#488472',
          400: '#5ea28d',
          300: '#7ec0ab',
          200: '#a8dccd',
          100: '#d7f2eb',
        },
        coolMeadow: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
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

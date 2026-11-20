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
        // Muted Forest Green Color Palette (Sampled directly from user reference)
        forest: {
          950: '#0a0f09', // Swatch 1: Deep Muted Forest Black/Pine
          900: '#141e16',
          850: '#1a271d',
          800: '#1f2f22', // Swatch 2: Deep Pine Spruce Green
          700: '#2a3e2e',
          600: '#354d39',
          500: '#3e5640', // Swatch 3: Muted Forest Moss / Evergreen
          400: '#647e66',
          300: '#7e9680',
          200: '#94a789', // Swatch 4: Soft Meadow Sage Green
          100: '#b8c7b0',
          50:  '#edf3ea',
        },
        slateFog: {
          700: '#4e626e',
          600: '#637b88',
          500: '#7a94a1', // Swatch 5: Misty Mountain Slate Fog / Blue-Grey
          400: '#9cb0bc',
          300: '#b8c7cf',
          200: '#ced9df', // Swatch 6: Ethereal Pale Cloud / Mist White
          100: '#e5ecf0',
          50:  '#f4f7f9',
        },
        // Direct pine alias mapped to muted forest for seamless backward compatibility
        pine: {
          950: '#0a0f09',
          900: '#141e16',
          850: '#1a271d',
          800: '#1f2f22',
          700: '#2a3e2e',
          600: '#354d39',
          500: '#3e5640',
          400: '#647e66',
          300: '#94a789',
          200: '#b8c7b0',
          100: '#ced9df',
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

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
        palette: {
          coral: '#EE4540',
          crimson: '#C72C41',
          ruby: '#801336',
          plum: '#510A32',
          eggplant: '#2D142C',
        },
        light: {
          bg: '#FAF6F8',
          card: 'rgba(255, 255, 255, 0.82)',
          surface: '#FFFFFF',
          border: 'rgba(81, 10, 50, 0.08)',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fluid-float-1': 'fluidBlob1 22s ease-in-out infinite alternate',
        'fluid-float-2': 'fluidBlob2 28s ease-in-out infinite alternate',
        'fluid-float-3': 'fluidBlob3 25s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fluidBlob1: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(80px, 50px) scale(1.15) rotate(15deg)' },
          '100%': { transform: 'translate(-40px, 80px) scale(0.95) rotate(-10deg)' },
        },
        fluidBlob2: {
          '0%': { transform: 'translate(0px, 0px) scale(1.1) rotate(0deg)' },
          '50%': { transform: 'translate(-70px, -60px) scale(0.9) rotate(-20deg)' },
          '100%': { transform: 'translate(50px, -30px) scale(1.05) rotate(15deg)' },
        },
        fluidBlob3: {
          '0%': { transform: 'translate(0px, 0px) scale(0.95)' },
          '50%': { transform: 'translate(60px, -40px) scale(1.1) rotate(10deg)' },
          '100%': { transform: 'translate(-50px, 40px) scale(1) rotate(-15deg)' },
        },
      }
    },
  },
  plugins: [],
}

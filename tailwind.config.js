/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        canvas: {
          dark: '#090b0e',
          panel: '#0f131a',
          surface: '#121720',
          border: '#1e2633',
        }
      },
      animation: {
        'pulse-flow': 'pulse-flow 1s linear infinite',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        'pulse-flow': {
          to: { strokeDashoffset: '-48' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};

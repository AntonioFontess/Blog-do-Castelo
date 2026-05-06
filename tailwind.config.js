/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta da spec do Castelo Hernani Vallim
        background: '#0a0e1a',
        surface: '#111827',
        'surface-hover': '#1f2937',
        outline: '#1e293b', // borders sutis (renomeado de "border" pra evitar choque com utilitário do Tailwind)
        primary: '#c9a227',
        'primary-hover': '#d4af37',
        secondary: '#1a3a8a',
        fg: '#f5f5f5', // text-primary da spec
        muted: '#a0a0a0', // text-secondary da spec
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in-slow': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-in-slow': 'fade-in-slow 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        cardiac: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        monitor: {
          dark: '#030712',
          screen: '#0b1329',
          border: '#1e293b',
          grid: 'rgba(34, 197, 94, 0.12)',
          green: '#22c55e',
          cyan: '#06b6d4',
          yellow: '#eab308',
          red: '#ef4444'
        }
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'shimmer-sweep': 'shimmerSweep 3s linear infinite',
        'path-flow': 'pathFlow 12s linear infinite',
        'vignette-pulse': 'vignettePulse 1.2s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        },
        shimmerSweep: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(250%)' },
        },
        pathFlow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        vignettePulse: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.85' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
        'glow-crisis': '0 0 35px 5px rgba(239, 68, 68, 0.45)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}

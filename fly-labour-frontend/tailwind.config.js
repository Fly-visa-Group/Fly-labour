/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#F5A623',
          orange: '#EA580C',
          gold:   '#D97706',
          dark:   '#0A0A0A',
          card:   '#141414',
          border: '#2A2A2A',
          muted:  '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"',    'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'slide-in':    'slideIn 0.5s ease forwards',
        'fade-up':     'fadeUp 0.6s ease forwards',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker':      'ticker 30s linear infinite',
        'float':       'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideIn:  { from: { opacity: 0, transform: 'translateX(-30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        fadeUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        ticker:   { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(-100%)' } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1a0f00 50%, #0A0A0A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F5A623 0%, #EA580C 100%)',
        'card-gradient': 'linear-gradient(180deg, #141414 0%, #0f0f0f 100%)',
      },
    },
  },
  plugins: [],
}

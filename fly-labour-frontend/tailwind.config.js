/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // ── Gold palette ──────────────────────────────
          yellow:  '#fdd52f',   // Primary CTA / accent
          gold:    '#e4a808',   // Dark gold — gradient / hover
          lime:    '#f2ee8c',   // Soft lime-gold
          cream:   '#ffea80',   // Cream yellow
          orange:  '#e4a808',   // alias
          // ── Dark Mode Neutrals ────────────────────────
          gray:    '#9ca3af',   // Mid gray
          muted:   '#9ca3af',   // Muted text — readable on dark
          // ── Dark Mode Surfaces ────────────────────────
          dark:    '#121212',   // Main background — charcoal black
          card:    '#1E1E1E',   // Card background — slightly lighter
          panel:   '#2A2A2A',   // Panel / Hover state
          border:  '#333333',   // Border — dark
          line:    '#404040',   // Divider line — dark
        },
      },
      fontFamily: {
        display: ['"Montserrat"', 'sans-serif'],
        body:    ['"Nunito Sans"', 'sans-serif'],
        mono:    ['"Courier New"', 'monospace'],
      },
      animation: {
        'slide-in':   'slideIn 0.5s ease forwards',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker':     'ticker 40s linear infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideIn: { from: { opacity: 0, transform: 'translateX(-30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        ticker:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #0C0C0C 0%, #181200 55%, #0C0C0C 100%)',
        'gold-gradient':   'linear-gradient(135deg, #e4a808 0%, #fdd52f 100%)',
        'gold-gradient-v': 'linear-gradient(180deg, #fdd52f 0%, #e4a808 100%)',
        'gold-soft':       'linear-gradient(135deg, #fdd52f 0%, #f2ee8c 100%)',
        'card-gradient':   'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
      },
      boxShadow: {
        'gold':    '0 4px 24px rgba(228,168,8,0.28)',
        'gold-sm': '0 2px 10px rgba(228,168,8,0.20)',
        'card':    '0 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        accent: ['var(--font-bebas)', 'ui-sans-serif'],
      },
      colors: {
        premium: {
          black: '#000000',
          gold: '#FFD700',
          ice: '#87CEEB',
        },
        adventure: {
          deep: '#0F1A2F',
          neon: '#FF6B35',
        },
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-6%) scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,107,53,0)' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        aurora: 'aurora 8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shake: 'shake 0.8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-out infinite',
        shine: 'shine 2.8s linear infinite',
      },
    },
  },
  plugins: [],
};


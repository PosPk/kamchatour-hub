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
    },
  },
  plugins: [],
};


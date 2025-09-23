/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B6CB0',
        primary600: '#4A90E2',
        muted: '#5C738A',
        chip: '#E7F0FB',
        border: '#e8eef5',
        bg: '#F4F7FB',
      },
      borderRadius: {
        xl: '16px',
      },
      boxShadow: {
        card: '0 2px 10px rgba(18, 38, 63, 0.06)',
      },
    },
  },
  plugins: [],
};


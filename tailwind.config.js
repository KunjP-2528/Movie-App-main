/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        dark: {
          DEFAULT: '#141414',
          100: '#1f1f1f',
          200: '#2d2d2d',
          300: '#3d3d3d',
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
};

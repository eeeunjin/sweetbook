/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NeoHyundai', 'Noto Sans KR', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          50: '#fff0ef',
          100: '#ffddd9',
          200: '#ffbab4',
          300: '#f99189',
          400: '#f47068',
          500: '#f06b63',
          600: '#e05248',
          700: '#c03e35',
          800: '#9a2e27',
          900: '#7a221d',
        },
        cafe: {
          50: '#fff5f4',
          100: '#ffe8e6',
          200: '#ffc8c4',
          300: '#f99991',
          400: '#f47068',
          500: '#e05248',
          600: '#c03e35',
          700: '#9a2e27',
          800: '#7a221d',
          900: '#5a1815',
        },
        espresso: {
          DEFAULT: '#f06b63',
          light: '#f99991',
        },
        cream: {
          DEFAULT: '#FFF5F4',
          dark: '#FFE8E6',
        },
      },
    },
  },
  plugins: [],
};

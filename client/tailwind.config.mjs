/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f3',
          100: '#dbf0e4',
          200: '#bae1cd',
          300: '#8dc8ab',
          400: '#5ca983',
          500: '#3d8e68',
          600: '#2d7253',
          700: '#255b44',
          800: '#1f4937',
          900: '#1a3d2f',
          950: '#0e221b',
        },
      },
    },
  },
  plugins: [],
}

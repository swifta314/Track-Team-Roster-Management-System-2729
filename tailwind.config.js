/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ballstate: {
          red: '#CC0000',
          white: '#FFFFFF',
          gray: '#666666'
        }
      },
    },
  },
  plugins: [],
}